// Native macOS arm64 Metal 3D Island & Asset Viewer for Project Nomads
// Uses native NPK0/NVX1/NTX1/NOB0 parsers + re-implemented nnature::nClouds

#import <Cocoa/Cocoa.h>
#import <Metal/Metal.h>
#import <MetalKit/MetalKit.h>
#import <QuartzCore/QuartzCore.h>
#include <simd/simd.h>

#include <algorithm>
#include <chrono>
#include <cmath>
#include <iostream>
#include <memory>
#include <string>
#include <unordered_map>
#include <vector>

#include "../nnature/nnature.hpp"
#include "nebula_assets.hpp"

// ---------------------------------------------------------------------------
// Metal Shader Source (compiled natively on Apple Silicon GPU at startup)
// ---------------------------------------------------------------------------
static const char* kMetalShaders = R"(
#include <metal_stdlib>
using namespace metal;

struct MeshUniforms {
    float4x4 mvp;
    float4x4 model;
    float4   lightDir;
    float4   flags; // x = hasTexture
};

struct MeshVertIn {
    float3 pos  [[attribute(0)]];
    float3 norm [[attribute(1)]];
    float2 uv   [[attribute(2)]];
};

struct MeshVertOut {
    float4 pos [[position]];
    float3 worldNorm;
    float2 uv;
};

vertex MeshVertOut mesh_vs(MeshVertIn in [[stage_in]],
                           constant MeshUniforms& u [[buffer(1)]]) {
    MeshVertOut out;
    out.pos = u.mvp * float4(in.pos, 1.0);
    out.worldNorm = normalize((u.model * float4(in.norm, 0.0)).xyz);
    out.uv = in.uv;
    return out;
}

fragment float4 mesh_fs(MeshVertOut in [[stage_in]],
                        constant MeshUniforms& u [[buffer(1)]],
                        texture2d<float> tex [[texture(0)]],
                        sampler samp [[sampler(0)]]) {
    float4 baseCol = float4(0.75, 0.72, 0.68, 1.0);
    if (u.flags.x > 0.5) {
        baseCol = tex.sample(samp, in.uv);
        if (baseCol.a < 0.25) discard_fragment();
    }
    float3 N = normalize(in.worldNorm);
    float3 L = normalize(u.lightDir.xyz);
    float ndl = max(dot(N, L), 0.0);
    // Warm sunlight + cool sky hemisphere ambient
    float hemi = N.y * 0.5 + 0.5;
    float3 ambient = mix(float3(0.24, 0.28, 0.36), float3(0.42, 0.48, 0.58), hemi);
    float3 sun = float3(1.0, 0.94, 0.84) * ndl * 0.85;
    float3 rgb = baseCol.rgb * (ambient + sun);
    return float4(rgb, baseCol.a);
}

struct CloudVertIn {
    float3 pos [[attribute(0)]];
    float2 uv  [[attribute(1)]];
    float4 col [[attribute(2)]];
};

struct CloudVertOut {
    float4 pos [[position]];
    float2 uv;
    float4 col;
};

struct CloudUniforms {
    float4x4 vp;
};

vertex CloudVertOut cloud_vs(CloudVertIn in [[stage_in]],
                             constant CloudUniforms& u [[buffer(1)]]) {
    CloudVertOut out;
    out.pos = u.vp * float4(in.pos, 1.0);
    out.uv = in.uv;
    out.col = in.col;
    return out;
}

fragment float4 cloud_fs(CloudVertOut in [[stage_in]]) {
    float2 d = in.uv * 2.0 - 1.0;
    float r2 = dot(d, d);
    if (r2 > 1.0) discard_fragment();
    // Soft puffy cloud falloff
    float puff = pow(1.0 - r2, 1.8);
    float shade = mix(0.82, 1.0, 1.0 - in.uv.y);
    return float4(in.col.rgb * shade, in.col.a * puff);
}
)";

// ---------------------------------------------------------------------------
// Math helpers (column-major simd_float4x4)
// ---------------------------------------------------------------------------
static simd_float4x4 mat4FromNebula(const nebula::Mat4& n) {
    simd_float4x4 r;
    std::memcpy(&r, n.m, 64);
    return r;
}

static simd_float4x4 makePerspective(float fovYRad, float aspect, float nearZ, float farZ) {
    float y = 1.0f / std::tan(fovYRad * 0.5f);
    float x = y / aspect;
    float z = farZ / (nearZ - farZ);
    simd_float4x4 m = {
        simd_make_float4(x, 0, 0, 0),
        simd_make_float4(0, y, 0, 0),
        simd_make_float4(0, 0, z, -1),
        simd_make_float4(0, 0, z * nearZ, 0)
    };
    return m;
}

static simd_float4x4 makeLookAt(simd_float3 eye, simd_float3 target, simd_float3 up) {
    simd_float3 z = simd_normalize(eye - target);
    simd_float3 x = simd_normalize(simd_cross(up, z));
    simd_float3 y = simd_cross(z, x);
    simd_float4x4 m = {
        simd_make_float4(x.x, y.x, z.x, 0),
        simd_make_float4(x.y, y.y, z.y, 0),
        simd_make_float4(x.z, y.z, z.z, 0),
        simd_make_float4(-simd_dot(x, eye), -simd_dot(y, eye), -simd_dot(z, eye), 1)
    };
    return m;
}

struct GpuSubMesh {
    id<MTLBuffer>  vb;
    id<MTLBuffer>  ib;
    NSUInteger     indexCount;
    id<MTLTexture> tex;
    simd_float4x4  model;
    bool           hasTex;
};

struct MeshUniformsCPU {
    simd_float4x4 mvp;
    simd_float4x4 model;
    simd_float4   lightDir;
    simd_float4   flags;
};

// ---------------------------------------------------------------------------
// Metal Renderer + Interactive View
// ---------------------------------------------------------------------------
@interface NomadsView : MTKView <MTKViewDelegate>
@property (nonatomic, assign) NSWindow* hostWindow;
- (instancetype)initWithFrame:(NSRect)frame device:(id<MTLDevice>)device npkPath:(const std::string&)npkPath;
- (void)loadSceneAtIndex:(int)idx;
@end

@implementation NomadsView {
    id<MTLCommandQueue>        _queue;
    id<MTLRenderPipelineState> _meshPSO;
    id<MTLRenderPipelineState> _cloudPSO;
    id<MTLDepthStencilState>   _depthState;
    id<MTLDepthStencilState>   _cloudDepthState;
    id<MTLSamplerState>        _sampler;
    id<MTLTexture>             _whiteTex;

    nebula::NpkArchive         _npk;
    std::vector<GpuSubMesh>    _subMeshes;
    nnature::nClouds           _clouds;
    id<MTLBuffer>              _cloudVB;
    id<MTLBuffer>              _cloudIB;
    NSUInteger                 _cloudIdxCount;

    bool   _islandsOnly;
    int    _sceneIdx;
    bool   _wireframe;
    bool   _showClouds;
    bool   _autoRotate;
    size_t _totalTriangles;

    // Orbit camera
    simd_float3 _target;
    float _yaw;
    float _pitch;
    float _distance;
    float _sceneRadius;
    NSPoint _lastMouse;
    std::chrono::steady_clock::time_point _startTime;
}

- (instancetype)initWithFrame:(NSRect)frame device:(id<MTLDevice>)device npkPath:(const std::string&)npkPath {
    self = [super initWithFrame:frame device:device];
    if (!self) return nil;

    self.colorPixelFormat = MTLPixelFormatBGRA8Unorm;
    self.depthStencilPixelFormat = MTLPixelFormatDepth32Float;
    self.clearColor = MTLClearColorMake(0.43, 0.62, 0.85, 1.0);
    self.preferredFramesPerSecond = 60;
    self.delegate = self;

    _queue = [device newCommandQueue];
    _islandsOnly = true;
    _wireframe = false;
    _showClouds = true;
    _autoRotate = true;
    _startTime = std::chrono::steady_clock::now();

    if (!_npk.open(npkPath)) {
        NSLog(@"Failed to open NPK: %s", npkPath.c_str());
        return nil;
    }

    // Initialize nnature::nClouds cloud sea
    _clouds.BeginClouds(16, 130.0f);
    _clouds.SetLayerNearFadeDist(120.0f);

    [self setupPipelines];

    // Find first_island.n as initial scene
    int startIdx = 0;
    const auto& list = [self activeSceneList];
    for (size_t i = 0; i < list.size(); ++i) {
        if (list[i] == "first_island.n") { startIdx = static_cast<int>(i); break; }
    }
    [self loadSceneAtIndex:startIdx];
    return self;
}

- (const std::vector<std::string>&)activeSceneList {
    return _islandsOnly ? _npk.islandDirs : _npk.sceneDirs;
}

- (void)setupPipelines {
    NSError* err = nil;
    NSString* src = [NSString stringWithUTF8String:kMetalShaders];
    id<MTLLibrary> lib = [self.device newLibraryWithSource:src options:nil error:&err];
    if (!lib) {
        NSLog(@"Metal shader compile error: %@", err);
        return;
    }

    // Mesh pipeline
    MTLVertexDescriptor* mv = [[MTLVertexDescriptor alloc] init];
    mv.attributes[0].format = MTLVertexFormatFloat3; mv.attributes[0].offset = 0;  mv.attributes[0].bufferIndex = 0;
    mv.attributes[1].format = MTLVertexFormatFloat3; mv.attributes[1].offset = 12; mv.attributes[1].bufferIndex = 0;
    mv.attributes[2].format = MTLVertexFormatFloat2; mv.attributes[2].offset = 24; mv.attributes[2].bufferIndex = 0;
    mv.layouts[0].stride = sizeof(nebula::MeshVertex);

    MTLRenderPipelineDescriptor* md = [[MTLRenderPipelineDescriptor alloc] init];
    md.vertexFunction = [lib newFunctionWithName:@"mesh_vs"];
    md.fragmentFunction = [lib newFunctionWithName:@"mesh_fs"];
    md.vertexDescriptor = mv;
    md.colorAttachments[0].pixelFormat = self.colorPixelFormat;
    md.colorAttachments[0].blendingEnabled = YES;
    md.colorAttachments[0].sourceRGBBlendFactor = MTLBlendFactorSourceAlpha;
    md.colorAttachments[0].destinationRGBBlendFactor = MTLBlendFactorOneMinusSourceAlpha;
    md.depthAttachmentPixelFormat = self.depthStencilPixelFormat;
    _meshPSO = [self.device newRenderPipelineStateWithDescriptor:md error:&err];

    // Cloud pipeline (nnature::nClouds)
    MTLVertexDescriptor* cv = [[MTLVertexDescriptor alloc] init];
    cv.attributes[0].format = MTLVertexFormatFloat3; cv.attributes[0].offset = 0;  cv.attributes[0].bufferIndex = 0;
    cv.attributes[1].format = MTLVertexFormatFloat2; cv.attributes[1].offset = 12; cv.attributes[1].bufferIndex = 0;
    cv.attributes[2].format = MTLVertexFormatFloat4; cv.attributes[2].offset = 20; cv.attributes[2].bufferIndex = 0;
    cv.layouts[0].stride = sizeof(nnature::CloudVertex);

    MTLRenderPipelineDescriptor* cd = [[MTLRenderPipelineDescriptor alloc] init];
    cd.vertexFunction = [lib newFunctionWithName:@"cloud_vs"];
    cd.fragmentFunction = [lib newFunctionWithName:@"cloud_fs"];
    cd.vertexDescriptor = cv;
    cd.colorAttachments[0].pixelFormat = self.colorPixelFormat;
    cd.colorAttachments[0].blendingEnabled = YES;
    cd.colorAttachments[0].sourceRGBBlendFactor = MTLBlendFactorSourceAlpha;
    cd.colorAttachments[0].destinationRGBBlendFactor = MTLBlendFactorOneMinusSourceAlpha;
    cd.depthAttachmentPixelFormat = self.depthStencilPixelFormat;
    _cloudPSO = [self.device newRenderPipelineStateWithDescriptor:cd error:&err];

    MTLDepthStencilDescriptor* ds = [[MTLDepthStencilDescriptor alloc] init];
    ds.depthCompareFunction = MTLCompareFunctionLess;
    ds.depthWriteEnabled = YES;
    _depthState = [self.device newDepthStencilStateWithDescriptor:ds];

    MTLDepthStencilDescriptor* cds = [[MTLDepthStencilDescriptor alloc] init];
    cds.depthCompareFunction = MTLCompareFunctionLess;
    cds.depthWriteEnabled = NO;
    _cloudDepthState = [self.device newDepthStencilStateWithDescriptor:cds];

    MTLSamplerDescriptor* sd = [[MTLSamplerDescriptor alloc] init];
    sd.minFilter = MTLSamplerMinMagFilterLinear;
    sd.magFilter = MTLSamplerMinMagFilterLinear;
    sd.sAddressMode = MTLSamplerAddressModeRepeat;
    sd.tAddressMode = MTLSamplerAddressModeRepeat;
    _sampler = [self.device newSamplerStateWithDescriptor:sd];

    // 1x1 white fallback texture
    MTLTextureDescriptor* td = [MTLTextureDescriptor texture2DDescriptorWithPixelFormat:MTLPixelFormatRGBA8Unorm width:1 height:1 mipmapped:NO];
    _whiteTex = [self.device newTextureWithDescriptor:td];
    uint8_t white[4] = {255, 255, 255, 255};
    [_whiteTex replaceRegion:MTLRegionMake2D(0, 0, 1, 1) mipmapLevel:0 withBytes:white bytesPerRow:4];
}

- (id<MTLTexture>)loadTexture:(const std::string&)texPath cache:(std::unordered_map<std::string, id<MTLTexture>>&)cache {
    if (texPath.empty()) return nil;
    std::string key = nebula::NpkArchive::normalizePath(texPath);
    auto it = cache.find(key);
    if (it != cache.end()) return it->second;

    std::vector<uint8_t> raw;
    nebula::TextureData td;
    if (!_npk.readFile(key, raw) || !nebula::parseNtx(raw, td)) {
        cache[key] = nil;
        return nil;
    }
    MTLTextureDescriptor* desc = [MTLTextureDescriptor texture2DDescriptorWithPixelFormat:MTLPixelFormatRGBA8Unorm
                                                                                    width:td.width
                                                                                   height:td.height
                                                                                mipmapped:NO];
    id<MTLTexture> tex = [self.device newTextureWithDescriptor:desc];
    [tex replaceRegion:MTLRegionMake2D(0, 0, td.width, td.height)
           mipmapLevel:0
             withBytes:td.rgba.data()
           bytesPerRow:td.width * 4];
    cache[key] = tex;
    return tex;
}

- (void)loadSceneAtIndex:(int)idx {
    const auto& list = [self activeSceneList];
    if (list.empty()) return;
    int n = static_cast<int>(list.size());
    _sceneIdx = ((idx % n) + n) % n;
    const std::string& dir = list[_sceneIdx];

    _subMeshes.clear();
    _totalTriangles = 0;

    std::vector<uint8_t> nobRaw;
    std::vector<nebula::SceneDrawItem> items;
    if (_npk.readFile("data.n/" + dir + "/_main.n", nobRaw)) {
        nebula::parseNobScene(nobRaw, items);
    }

    // Fallback: if _main.n had no visible mesh nodes, load all .nvx in that folder
    if (items.empty()) {
        std::string prefix = nebula::NpkArchive::toLower("data.n/" + dir + "/");
        for (const auto& kv : _npk.entries) {
            if (kv.first.rfind(prefix, 0) == 0 && kv.first.size() > 4 &&
                kv.first.substr(kv.first.size() - 4) == ".nvx" &&
                kv.first.find("collide") == std::string::npos) {
                items.push_back({kv.first, "", nebula::Mat4::identity()});
            }
        }
    }

    std::unordered_map<std::string, id<MTLTexture>> texCache;
    simd_float3 bbMin = simd_make_float3(1e9f, 1e9f, 1e9f);
    simd_float3 bbMax = simd_make_float3(-1e9f, -1e9f, -1e9f);

    for (const auto& item : items) {
        std::vector<uint8_t> nvxRaw;
        nebula::MeshData md;
        if (!_npk.readFile(item.meshPath, nvxRaw) || !nebula::parseNvx(nvxRaw, md)) continue;

        simd_float4x4 M = mat4FromNebula(item.worldMatrix);
        for (const auto& v : md.vertices) {
            simd_float4 wp = simd_mul(M, simd_make_float4(v.px, v.py, v.pz, 1.0f));
            bbMin = simd_min(bbMin, wp.xyz);
            bbMax = simd_max(bbMax, wp.xyz);
        }

        id<MTLBuffer> vb = [self.device newBufferWithBytes:md.vertices.data()
                                                    length:md.vertices.size() * sizeof(nebula::MeshVertex)
                                                   options:MTLResourceStorageModeShared];
        id<MTLBuffer> ib = [self.device newBufferWithBytes:md.indices.data()
                                                    length:md.indices.size() * sizeof(uint16_t)
                                                   options:MTLResourceStorageModeShared];
        id<MTLTexture> tex = [self loadTexture:item.texPath cache:texCache];
        _subMeshes.push_back({vb, ib, md.indices.size(), tex ? tex : _whiteTex, M, tex != nil});
        _totalTriangles += md.indices.size() / 3;
    }

    if (!_subMeshes.empty()) {
        _target = (bbMin + bbMax) * 0.5f;
        _sceneRadius = std::max(2.0f, simd_length(bbMax - bbMin) * 0.5f);
    } else {
        _target = simd_make_float3(0, 0, 0);
        _sceneRadius = 50.0f;
    }
    [self resetCamera];
    [self updateWindowTitle];
}

- (void)resetCamera {
    _yaw = 0.65f;
    _pitch = 0.35f;
    _distance = _sceneRadius * 2.2f;
}

- (void)updateWindowTitle {
    if (!self.hostWindow) return;
    const auto& list = [self activeSceneList];
    NSString* title = [NSString stringWithFormat:
        @"Project Nomads Native Metal — %s (%d/%zu, %zu tris) | ←/→: Next | I: %@ | W: Wire | C: Clouds | Space: Spin",
        list[_sceneIdx].c_str(), _sceneIdx + 1, list.size(), _totalTriangles,
        _islandsOnly ? @"Islands" : @"All"];
    [self.hostWindow setTitle:title];
}

// ---------------------------------------------------------------------------
// Input handling
// ---------------------------------------------------------------------------
- (BOOL)acceptsFirstResponder { return YES; }

- (void)mouseDown:(NSEvent*)event {
    _lastMouse = [self convertPoint:event.locationInWindow fromView:nil];
    _autoRotate = false;
}

- (void)rightMouseDown:(NSEvent*)event {
    _lastMouse = [self convertPoint:event.locationInWindow fromView:nil];
}

- (void)mouseDragged:(NSEvent*)event {
    NSPoint p = [self convertPoint:event.locationInWindow fromView:nil];
    float dx = p.x - _lastMouse.x;
    float dy = p.y - _lastMouse.y;
    _lastMouse = p;
    if (event.modifierFlags & NSEventModifierFlagShift) {
        [self panByDX:dx dY:dy];
    } else {
        _yaw -= dx * 0.008f;
        _pitch = std::clamp(_pitch - dy * 0.008f, -1.45f, 1.45f);
    }
}

- (void)rightMouseDragged:(NSEvent*)event {
    NSPoint p = [self convertPoint:event.locationInWindow fromView:nil];
    float dx = p.x - _lastMouse.x;
    float dy = p.y - _lastMouse.y;
    _lastMouse = p;
    [self panByDX:dx dY:dy];
}

- (void)panByDX:(float)dx dY:(float)dy {
    simd_float3 right = simd_make_float3(std::cos(_yaw), 0, -std::sin(_yaw));
    simd_float3 up    = simd_make_float3(0, 1, 0);
    float s = _distance * 0.0018f;
    _target = _target - right * (dx * s) - up * (dy * s);
}

- (void)scrollWheel:(NSEvent*)event {
    _distance *= (1.0f - static_cast<float>(event.scrollingDeltaY) * 0.03f);
    _distance = std::clamp(_distance, _sceneRadius * 0.15f, _sceneRadius * 12.0f);
}

- (void)keyDown:(NSEvent*)event {
    uint16_t kc = event.keyCode;
    NSString* chars = [event.charactersIgnoringModifiers lowercaseString];
    if (kc == 124 || [chars isEqualToString:@"]"]) { [self loadSceneAtIndex:_sceneIdx + 1]; }
    else if (kc == 123 || [chars isEqualToString:@"["]) { [self loadSceneAtIndex:_sceneIdx - 1]; }
    else if ([chars isEqualToString:@"i"]) { _islandsOnly = !_islandsOnly; [self loadSceneAtIndex:0]; }
    else if ([chars isEqualToString:@"w"]) { _wireframe = !_wireframe; }
    else if ([chars isEqualToString:@"c"]) { _showClouds = !_showClouds; }
    else if ([chars isEqualToString:@"r"]) { [self resetCamera]; }
    else if ([chars isEqualToString:@" "]) { _autoRotate = !_autoRotate; }
    else if ([chars isEqualToString:@"+"] || [chars isEqualToString:@"="]) { _distance *= 0.85f; }
    else if ([chars isEqualToString:@"-"]) { _distance *= 1.18f; }
    else if (kc == 53) { [NSApp terminate:nil]; }
}

// ---------------------------------------------------------------------------
// MTKViewDelegate Render Loop
// ---------------------------------------------------------------------------
- (void)mtkView:(MTKView*)view drawableSizeWillChange:(CGSize)size {}

- (void)drawInMTKView:(MTKView*)view {
    id<CAMetalDrawable> drawable = view.currentDrawable;
    MTLRenderPassDescriptor* rp = view.currentRenderPassDescriptor;
    if (!drawable || !rp) return;

    float t = std::chrono::duration<float>(std::chrono::steady_clock::now() - _startTime).count();
    if (_autoRotate) _yaw += 0.004f;

    float aspect = static_cast<float>(view.drawableSize.width / std::max(1.0, view.drawableSize.height));
    simd_float3 eye = _target + simd_make_float3(
        _distance * std::cos(_pitch) * std::sin(_yaw),
        _distance * std::sin(_pitch),
        _distance * std::cos(_pitch) * std::cos(_yaw)
    );
    simd_float4x4 V = makeLookAt(eye, _target, simd_make_float3(0, 1, 0));
    simd_float4x4 P = makePerspective(50.0f * 3.14159265f / 180.0f, aspect,
                                      std::max(0.1f, _sceneRadius * 0.01f),
                                      std::max(3000.0f, _sceneRadius * 40.0f));
    simd_float4x4 VP = simd_mul(P, V);

    id<MTLCommandBuffer> cb = [_queue commandBuffer];
    id<MTLRenderCommandEncoder> enc = [cb renderCommandEncoderWithDescriptor:rp];

    // 1. Draw scene meshes
    [enc setRenderPipelineState:_meshPSO];
    [enc setDepthStencilState:_depthState];
    [enc setTriangleFillMode:_wireframe ? MTLTriangleFillModeLines : MTLTriangleFillModeFill];
    [enc setFragmentSamplerState:_sampler atIndex:0];

    simd_float4 sunDir = simd_make_float4(0.55f, 0.75f, 0.35f, 0.0f);
    for (const auto& sm : _subMeshes) {
        MeshUniformsCPU u;
        u.model = sm.model;
        u.mvp = simd_mul(VP, sm.model);
        u.lightDir = sunDir;
        u.flags = simd_make_float4(sm.hasTex ? 1.0f : 0.0f, 0, 0, 0);

        [enc setVertexBuffer:sm.vb offset:0 atIndex:0];
        [enc setVertexBytes:&u length:sizeof(u) atIndex:1];
        [enc setFragmentBytes:&u length:sizeof(u) atIndex:1];
        [enc setFragmentTexture:sm.tex atIndex:0];
        [enc drawIndexedPrimitives:MTLPrimitiveTypeTriangle
                        indexCount:sm.indexCount
                         indexType:MTLIndexTypeUInt16
                       indexBuffer:sm.ib
                 indexBufferOffset:0];
    }

    // 2. Draw nnature::nClouds sea below the island
    if (_showClouds) {
        simd_float3 camRight = simd_make_float3(V.columns[0].x, V.columns[1].x, V.columns[2].x);
        simd_float3 camUp    = simd_make_float3(V.columns[0].y, V.columns[1].y, V.columns[2].y);
        std::vector<nnature::CloudVertex> cv;
        std::vector<uint32_t> ci;
        _clouds.gridOrigin = {_target.x, _target.z};
        _clouds.BuildBillboards({eye.x, eye.y, eye.z},
                                {camRight.x, camRight.y, camRight.z},
                                {camUp.x, camUp.y, camUp.z}, t, cv, ci);
        if (!cv.empty()) {
            id<MTLBuffer> cvb = [self.device newBufferWithBytes:cv.data()
                                                         length:cv.size() * sizeof(nnature::CloudVertex)
                                                        options:MTLResourceStorageModeShared];
            id<MTLBuffer> cib = [self.device newBufferWithBytes:ci.data()
                                                         length:ci.size() * sizeof(uint32_t)
                                                        options:MTLResourceStorageModeShared];
            [enc setRenderPipelineState:_cloudPSO];
            [enc setDepthStencilState:_cloudDepthState];
            [enc setTriangleFillMode:MTLTriangleFillModeFill];
            [enc setVertexBuffer:cvb offset:0 atIndex:0];
            [enc setVertexBytes:&VP length:sizeof(VP) atIndex:1];
            [enc drawIndexedPrimitives:MTLPrimitiveTypeTriangle
                            indexCount:ci.size()
                             indexType:MTLIndexTypeUInt32
                           indexBuffer:cib
                     indexBufferOffset:0];
        }
    }

    [enc endEncoding];
    [cb presentDrawable:drawable];
    [cb commit];
}

@end

// ---------------------------------------------------------------------------
// macOS Application Entry Point
// ---------------------------------------------------------------------------
@interface AppDelegate : NSObject <NSApplicationDelegate>
@property (nonatomic, strong) NSWindow* window;
@property (nonatomic, assign) std::string npkPath;
@end

@implementation AppDelegate
- (void)applicationDidFinishLaunching:(NSNotification*)note {
    id<MTLDevice> device = MTLCreateSystemDefaultDevice();
    if (!device) {
        NSLog(@"Metal is not supported on this Mac.");
        [NSApp terminate:nil];
        return;
    }

    NSRect frame = NSMakeRect(120, 120, 1280, 800);
    self.window = [[NSWindow alloc] initWithContentRect:frame
                                              styleMask:(NSWindowStyleMaskTitled |
                                                         NSWindowStyleMaskClosable |
                                                         NSWindowStyleMaskResizable |
                                                         NSWindowStyleMaskMiniaturizable)
                                                backing:NSBackingStoreBuffered
                                                  defer:NO];
    NomadsView* view = [[NomadsView alloc] initWithFrame:frame device:device npkPath:self.npkPath];
    view.hostWindow = self.window;
    [view updateWindowTitle];

    [self.window setContentView:view];
    [self.window makeKeyAndOrderFront:nil];
    [self.window makeFirstResponder:view];
    [NSApp activateIgnoringOtherApps:YES];
}
- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication*)sender { return YES; }
@end

int main(int argc, const char** argv) {
    @autoreleasepool {
        std::string npk = "/Users/ovc/Downloads/Проект «Бродяги»/extracted/Run/data.npk";
        if (argc > 1) npk = argv[1];

        NSApplication* app = [NSApplication sharedApplication];
        [app setActivationPolicy:NSApplicationActivationPolicyRegular];
        AppDelegate* del = [[AppDelegate alloc] init];
        del.npkPath = npk;
        [app setDelegate:del];
        [app run];
    }
    return 0;
}
