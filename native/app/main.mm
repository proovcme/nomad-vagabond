// Project Nomads — Unified Native macOS arm64 Engine
// Nebula Device 1 Core + Tcl + Metal 3D + nnature + Live Russian GUI + Campaign Mission Loader + Audio

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
#include <set>
#include <string>
#include <unordered_map>
#include <vector>

#include "../core/nanim.hpp"
#include "../core/naudio.hpp"
#include "../core/ncollide.hpp"
#include "../core/ncombat.hpp"
#include "../core/neconomy.hpp"
#include "../core/nfileserver.hpp"
#include "../core/nflight.hpp"
#include "../core/ngameplay.hpp"
#include "../core/ngen_classes.hpp"
#include "../core/ngui.hpp"
#include "../core/nisland.hpp"
#include "../core/nkernel.hpp"
#include "../core/nnetwork.hpp"
#include "../core/nparticles.hpp"
#include "../core/nplayer.hpp"
#include "../core/nproduction.hpp"
#include "../core/nstory.hpp"
#include "../core/nsystem.hpp"
#include "../core/ntclserver.hpp"
#include "../core/nworld.hpp"
#include "../nnature/nnature.hpp"
#include "../viewer/nebula_assets.hpp"

// ---------------------------------------------------------------------------
// Metal Shaders: 3D Lit Meshes + nnature::nClouds + 2D Menu GUI Overlay
// ---------------------------------------------------------------------------
static const char* kShaders = R"(
#include <metal_stdlib>
using namespace metal;

struct MeshUniforms {
    float4x4 mvp;
    float4x4 model;
    float4x4 vp;
    float4   lightDir;
    float4   flags;       // x=hasTex, y=hasDetail, z=alphaRef, w=fogEnable
    float4   matDiffuse;  // rgb=SDIF, w=lightEnable
    float4   matEmissive; // rgb=SEMV
    float4   sunColor;    // rgb=licht1_color from weather_normal.n
    float4   ambColor;    // rgb=amb_color from weather_normal.n
    float4   fogColor;    // rgb=fog_color, w=fogEnd from weather_normal.n
    float4   camRight;    // xyz=camera right, w=time*2.2
    float4   camUp;       // xyz=camera up
    float4   windParams;  // x=windDirX, y=windDirZ, z=swayAmp, w=isBillboard
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
    float  viewDist;
};

vertex MeshVertOut mesh_vs(MeshVertIn in [[stage_in]],
                           constant MeshUniforms& u [[buffer(1)]]) {
    MeshVertOut out;
    if (u.windParams.w > 0.5) {
        // True GPU camera-facing billboard (nCloudRender wolke10 & nLeafRender foliage)
        float3 center = (u.model * float4(in.pos, 1.0)).xyz;
        if (u.windParams.z > 0.001) {
            float sway = max(0.0, in.pos.y) * u.windParams.z * sin(u.camRight.w + center.x * 0.05);
            center.x += u.windParams.x * sway;
            center.z += u.windParams.y * sway;
        }
        float r = in.norm.z;
        float3 wpos = center + u.camRight.xyz * (in.norm.x * r) + u.camUp.xyz * (in.norm.y * r);
        out.pos = u.vp * float4(wpos, 1.0);
        out.worldNorm = float3(0.0, 1.0, 0.0);
    } else {
        float3 lpos = in.pos;
        if (u.windParams.z > 0.001 && lpos.y > 0.2) {
            // nMeshSway harmonic wind bending
            float sway = lpos.y * u.windParams.z * sin(u.camRight.w + lpos.y * 0.25);
            lpos.x += u.windParams.x * sway;
            lpos.z += u.windParams.y * sway;
        }
        out.pos = u.mvp * float4(lpos, 1.0);
        out.worldNorm = normalize((u.model * float4(in.norm, 0.0)).xyz);
    }
    out.uv = in.uv;
    out.viewDist = out.pos.w;
    return out;
}

fragment float4 mesh_fs(MeshVertOut in [[stage_in]],
                        constant MeshUniforms& u [[buffer(1)]],
                        texture2d<float> tex [[texture(0)]],
                        texture2d<float> detailTex [[texture(1)]],
                        sampler samp [[sampler(0)]]) {
    float4 baseCol = float4(0.75, 0.72, 0.68, 1.0);
    if (u.flags.x > 0.5) {
        baseCol = tex.sample(samp, in.uv);
        if (u.flags.z > 0.001 && baseCol.a < u.flags.z) discard_fragment();
    }
    if (u.flags.y > 0.5) {
        float3 det = detailTex.sample(samp, in.uv * 16.0).rgb;
        baseCol.rgb *= det * 2.0; // Direct3D8 D3DTOP_MODULATE2X (island2 detailmap shader)
    }
    float3 lit;
    if (u.matDiffuse.w > 0.5) {
        float3 N = normalize(in.worldNorm);
        float3 L = normalize(u.lightDir.xyz);
        float ndl = max(dot(N, L), 0.0);
        float hemi = N.y * 0.5 + 0.5;
        float3 ambient = u.ambColor.rgb * mix(0.75, 1.25, hemi);
        float3 sun = u.sunColor.rgb * ndl;
        lit = baseCol.rgb * (u.matDiffuse.rgb * (ambient + sun) + u.matEmissive.rgb);
    } else {
        lit = baseCol.rgb * max(u.matDiffuse.rgb, u.matEmissive.rgb);
    }

    if (u.flags.w > 0.5) {
        float fogEnd = max(2500.0, u.fogColor.w);
        float fogStart = fogEnd * 0.25;
        float fog = clamp((in.viewDist - fogStart) / (fogEnd - fogStart), 0.0, 0.88);
        lit = mix(lit, u.fogColor.rgb, fog);
    }
    return float4(lit, baseCol.a);
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

vertex CloudVertOut cloud_vs(CloudVertIn in [[stage_in]],
                             constant float4x4& vp [[buffer(1)]]) {
    CloudVertOut out;
    out.pos = vp * float4(in.pos, 1.0);
    out.uv = in.uv;
    out.col = in.col;
    return out;
}

fragment float4 cloud_fs(CloudVertOut in [[stage_in]]) {
    float2 d = in.uv * 2.0 - 1.0;
    float r2 = dot(d, d);
    if (r2 > 1.0) discard_fragment();
    float puff = pow(1.0 - r2, 1.8);
    float shade = mix(0.82, 1.0, 1.0 - in.uv.y);
    return float4(in.col.rgb * shade, in.col.a * puff);
}

struct GuiVertIn {
    float2 pos [[attribute(0)]];
    float2 uv  [[attribute(1)]];
};

struct GuiVertOut {
    float4 pos [[position]];
    float2 uv;
};

vertex GuiVertOut gui_vs(GuiVertIn in [[stage_in]]) {
    GuiVertOut out;
    out.pos = float4(in.pos, 0.0, 1.0);
    out.uv = in.uv;
    return out;
}

fragment float4 gui_fs(GuiVertOut in [[stage_in]],
                       constant float4& tint [[buffer(1)]],
                       texture2d<float> tex [[texture(0)]],
                       sampler samp [[sampler(0)]]) {
    float4 c = tex.sample(samp, in.uv) * tint;
    if (c.a < 0.02) discard_fragment();
    return c;
}
)";

static simd_float4x4 mat4FromNebula(const nebula::Mat4& n) {
    simd_float4x4 r;
    std::memcpy(&r, n.m, 64);
    return r;
}

static simd_float4x4 makePerspective(float fovYRad, float aspect, float nearZ, float farZ) {
    float y = 1.0f / std::tan(fovYRad * 0.5f);
    float x = y / aspect;
    float z = farZ / (nearZ - farZ);
    return (simd_float4x4){
        simd_make_float4(x, 0, 0, 0),
        simd_make_float4(0, y, 0, 0),
        simd_make_float4(0, 0, z, -1),
        simd_make_float4(0, 0, z * nearZ, 0)
    };
}

static simd_float4x4 makeLookAt(simd_float3 eye, simd_float3 target, simd_float3 up) {
    simd_float3 z = simd_normalize(eye - target);
    simd_float3 x = simd_normalize(simd_cross(up, z));
    simd_float3 y = simd_cross(z, x);
    return (simd_float4x4){
        simd_make_float4(x.x, y.x, z.x, 0),
        simd_make_float4(x.y, y.y, z.y, 0),
        simd_make_float4(x.z, y.z, z.z, 0),
        simd_make_float4(-simd_dot(x, eye), -simd_dot(y, eye), -simd_dot(z, eye), 1)
    };
}

struct GpuSubMesh {
    id<MTLBuffer>    vb;
    id<MTLBuffer>    ib;
    NSUInteger       indexCount;
    id<MTLTexture>   tex;
    id<MTLTexture>   detailTex;
    simd_float4x4    localModel;
    bool             hasTex;
    bool             hasDetailTex = false;
    bool             isSkinned = false;
    bool             isCloud = false;
    bool             isBillboard = false;
    bool             isSway = false;
    int              spinAxis = 0;
    float            spinDegPerSec = 0.0f;
    nebula::ShaderDesc shader;
    nebula::MeshData bindMesh;
};

struct GpuPrototype {
    std::vector<GpuSubMesh>   subMeshes;
    nebula::CharacterSkeleton skeleton;
    nebula::MeshData          collMesh;
    bool                      hasSkeleton = false;
    bool                      hasCollMesh = false;
    bool                      loaded = false;
};

struct WorldInstance {
    std::string      protoKey;
    nebula::nEntity* entity = nullptr;
    simd_float4x4    worldMat;
};

struct MeshUniformsCPU {
    simd_float4x4 mvp;
    simd_float4x4 model;
    simd_float4x4 vp          = matrix_identity_float4x4;
    simd_float4   lightDir;
    simd_float4   flags;
    simd_float4   matDiffuse  = simd_make_float4(1.0f, 1.0f, 1.0f, 1.0f);
    simd_float4   matEmissive = simd_make_float4(0.0f, 0.0f, 0.0f, 0.0f);
    simd_float4   sunColor    = simd_make_float4(1.0f, 0.94f, 0.84f, 1.0f);
    simd_float4   ambColor    = simd_make_float4(0.42f, 0.48f, 0.58f, 1.0f);
    simd_float4   fogColor    = simd_make_float4(0.44f, 0.61f, 0.82f, 6500.0f);
    simd_float4   camRight    = simd_make_float4(1.0f, 0.0f, 0.0f, 0.0f);
    simd_float4   camUp       = simd_make_float4(0.0f, 1.0f, 0.0f, 0.0f);
    simd_float4   windParams  = simd_make_float4(0.0f, 0.0f, 0.0f, 0.0f);
};

struct GuiVert { float x, y, u, v; };

@class NomadsGameView;

struct NomadsRuntime {
    nebula::nKernelServer ks;
    nebula::nTclServer*   tcl = nullptr;
    nebula::EngineHooks   guiHooks;
    nebula::WorldHooks    worldHooks;
    nebula::nArtefactBelt       belt;
    nebula::nCombatSystem       combat;
    nebula::nIslandFlightSystem islands;
    nebula::nParticleSystem     particles;
    std::string           runDir;
    std::string           localeDir;
    NSSound*              musicSound = nil;
    bool                  muted = false;
    __weak NomadsGameView* view = nil;

    nebula::nFileServer* getFS() {
        auto* fs = dynamic_cast<nebula::nFileServer*>(ks.lookup("/sys/servers/file2"));
        if (!fs) fs = dynamic_cast<nebula::nFileServer*>(ks.lookup("/sys/servers/file"));
        return fs;
    }
};

static NomadsRuntime* gRuntime = nullptr;

static void playWav(const std::string& rawPath, bool loop) {
    if (!gRuntime || gRuntime->muted) return;
    auto* fs = gRuntime->getFS();
    std::string full = fs ? fs->manglePath(rawPath) : rawPath;
    NSString* nsPath = [NSString stringWithUTF8String:full.c_str()];
    if (![[NSFileManager defaultManager] fileExistsAtPath:nsPath]) return;
    NSSound* snd = [[NSSound alloc] initWithContentsOfFile:nsPath byReference:YES];
    if (!snd) return;
    if (loop) {
        if (gRuntime->musicSound) [gRuntime->musicSound stop];
        snd.loops = YES;
        snd.volume = 0.40f;
        gRuntime->musicSound = snd;
        [snd play];
    } else {
        snd.volume = 0.70f;
        [snd play];
    }
}

// ---------------------------------------------------------------------------
// Unified Metal Game View
// ---------------------------------------------------------------------------
@interface NomadsGameView : MTKView <MTKViewDelegate>
@property (nonatomic, assign) NSWindow* hostWindow;
- (instancetype)initWithFrame:(NSRect)frame device:(id<MTLDevice>)device;
- (void)rebuildWorldInstances;
- (void)showSubtitleBmp:(const std::string&)rawPath;
- (void)hideSubtitle;
- (void)updateTitle;
@end

@implementation NomadsGameView {
    id<MTLCommandQueue>        _queue;
    id<MTLRenderPipelineState> _meshPSO;
    id<MTLRenderPipelineState> _meshAddPSO;
    id<MTLRenderPipelineState> _cloudPSO;
    id<MTLRenderPipelineState> _guiPSO;
    id<MTLDepthStencilState>   _depthState;
    id<MTLDepthStencilState>   _noDepthWriteState;
    id<MTLDepthStencilState>   _cloudDepthState;
    id<MTLSamplerState>        _sampler;
    id<MTLSamplerState>        _guiSampler;
    id<MTLTexture>             _whiteTex;

    std::unordered_map<std::string, GpuPrototype>   _protoCache;
    std::unordered_map<std::string, id<MTLTexture>> _ntxCache;
    nebula::ShaderLibrary                           _shaders;
    nebula::WeatherCurves                           _weather;
    std::unordered_map<std::string, id<MTLTexture>> _guiTexCache;
    std::vector<WorldInstance>                      _instances;
    GpuSubMesh                                      _skyboxMesh;
    bool                                            _hasSkybox;
    nnature::nClouds                                _clouds;

    // Phase 2 & 3: World collision + 3rd-person hero + Story/Subtitles
    nebula::nOpcodeServer                           _collision;
    nebula::nPlayerController                       _player;
    nebula::nHouseMenuState                         _houseMenu;
    nebula::nVehicleFlightController                _flight;
    nebula::nStoryEngine                            _story;
    bool                                            _playerActive;
    bool                                            _jumpPressed;
    bool                                            _showObjective;
    id<MTLTexture>                                  _objectiveTex;
    id<MTLTexture>                                  _subtitleTex;
    id<MTLTexture>                                  _hudEnergyL, _hudEnergyM, _hudEnergyR;
    id<MTLTexture>                                  _hudClanL, _hudClanM, _hudClanR;
    id<MTLTexture>                                  _hudSlot, _hudCrosshair;
    nebula::nEntity*                                _possessedEntity;
    float                                           _planeSpeed;

    // Camera: orbit mode (menu) vs 3rd-person hero vs free-flight mode (Tab)
    bool        _freeFly;
    simd_float3 _camPos;
    simd_float3 _target;
    float       _yaw, _pitch, _distance;
    NSPoint     _lastMouse;
    bool        _dragging;
    std::set<uint16_t> _keysDown;

    nebula::nGuiMenuEntry* _hoveredEntry;
    std::chrono::steady_clock::time_point _startTime;
    std::chrono::steady_clock::time_point _lastFrameTime;
}

- (instancetype)initWithFrame:(NSRect)frame device:(id<MTLDevice>)device {
    self = [super initWithFrame:frame device:device];
    if (!self) return nil;

    self.colorPixelFormat = MTLPixelFormatBGRA8Unorm;
    self.depthStencilPixelFormat = MTLPixelFormatDepth32Float;
    self.sampleCount = 4; // 4x MSAA anti-aliasing!
    self.clearColor = MTLClearColorMake(0.0, 0.0, 0.0, 1.0); // Strict original: black background until mission loads!
    self.preferredFramesPerSecond = 60;
    self.delegate = self;

    _queue = [device newCommandQueue];
    _hoveredEntry = nullptr;
    _dragging = false;
    _freeFly = false;
    _playerActive = false;
    _jumpPressed = false;
    _showObjective = true;
    _hasSkybox = false;
    _objectiveTex = nil;
    _subtitleTex = nil;
    _possessedEntity = nullptr;
    _planeSpeed = 35.0f;
    _startTime = std::chrono::steady_clock::now();
    _lastFrameTime = _startTime;

    _clouds.BeginClouds(16, 150.0f);
    _clouds.SetLayerNearFadeDist(120.0f);

    [self setupPipelines];

    // Load original HUD textures from data.npk (if_ebar.n, if_emptyslot.n, if_menu.n)
    _hudEnergyL   = [self loadNtxTexture:"data.n/if_ebar.n/energy_leftenergy_left_alpha.ntx"];
    _hudEnergyM   = [self loadNtxTexture:"data.n/if_ebar.n/energy_middleenergy_middle_alpha.ntx"];
    _hudEnergyR   = [self loadNtxTexture:"data.n/if_ebar.n/energy_rightenergy_right_alpha.ntx"];
    _hudClanL     = [self loadNtxTexture:"data.n/if_ebar.n/clan_energy_leftclan_energy_left_alpha.ntx"];
    _hudClanM     = [self loadNtxTexture:"data.n/if_ebar.n/clan_energy_middleclan_energy_middle_alpha.ntx"];
    _hudClanR     = [self loadNtxTexture:"data.n/if_ebar.n/clan_energy_rightclan_energy_right_alpha.ntx"];
    _hudSlot      = [self loadNtxTexture:"data.n/if_emptyslot.n/slotslot_alpha.ntx"];
    _hudCrosshair = [self loadNtxTexture:"data.n/if_menu.n/crosscross_alpha.ntx"];

    // Load all 226 real nShaderNode definitions from data.n/shaders.n/_main.n
    if (auto* fs = gRuntime ? gRuntime->getFS() : nullptr) {
        std::vector<uint8_t> shRaw;
        if (fs->readFile("data.n/shaders.n/_main.n", shRaw)) {
            size_t nsh = nebula::parseShaderLibrary(shRaw, _shaders);
            std::cout << "[nShaderNode] Loaded " << nsh << " real shaders from data.n/shaders.n/_main.n\n";
        }
        std::vector<uint8_t> wRaw;
        if (fs->readFile("data.n/weather_normal.n/_main.n", wRaw) && nebula::parseWeatherCurves(wRaw, _weather)) {
            std::cout << "[nWeather] Loaded daytime curves (sun=" << _weather.sunColor.keys.size()
                      << ", amb=" << _weather.ambColor.keys.size()
                      << ", fog=" << _weather.fogColor.keys.size() << " keys)\n";
        }
        std::vector<uint8_t> raw;
        nebula::MeshData md;
        if (fs->readFile("data.n/skybox01.n/model.nvx", raw) && nebula::parseNvx(raw, md)) {
            id<MTLBuffer> vb = [self.device newBufferWithBytes:md.vertices.data() length:md.vertices.size()*sizeof(nebula::MeshVertex) options:MTLResourceStorageModeShared];
            id<MTLBuffer> ib = [self.device newBufferWithBytes:md.indices.data() length:md.indices.size()*sizeof(uint16_t) options:MTLResourceStorageModeShared];
            id<MTLTexture> tex = [self loadNtxTexture:"data.n/skybox01.n/texture2wow3.ntx"];
            nebula::ShaderDesc skySh; skySh.lightEnable = false; skySh.fogEnable = false; skySh.zWriteEnable = false;
            _skyboxMesh = {vb, ib, md.indices.size(), tex ? tex : _whiteTex, _whiteTex, matrix_identity_float4x4, tex != nil, false, false, false, false, false, 0, 0.0f, skySh, {}};
            _hasSkybox = true;
        }
    }

    // Wire Phase 3 Story Engine callbacks (Russian voiceover + alpha-keyed subtitle BMPs)
    __weak NomadsGameView* weakSelf = self;
    _story.onPlayVoice = [](const std::string& p) { playWav(p, false); };
    _story.onHideSubtitle = [weakSelf]() {
        NomadsGameView* s = weakSelf;
        if (s) s->_subtitleTex = nil;
    };
    _story.onShowSubtitleBmp = [weakSelf](const std::string& relBmp) {
        NomadsGameView* s = weakSelf;
        if (!s || !gRuntime) return;
        nebula::BmpImage img;
        if (nebula::loadBmpFile(gRuntime->runDir + relBmp, img)) {
            for (size_t i = 0; i < static_cast<size_t>(img.width) * img.height; ++i) {
                uint8_t r = img.rgba[i*4+0], g = img.rgba[i*4+1], b = img.rgba[i*4+2];
                uint8_t mx = std::max({r, g, b});
                img.rgba[i*4+3] = (mx < 18) ? 0 : static_cast<uint8_t>(std::min(255, mx * 2));
            }
            MTLTextureDescriptor* d = [MTLTextureDescriptor texture2DDescriptorWithPixelFormat:MTLPixelFormatRGBA8Unorm
                                                                                         width:img.width height:img.height mipmapped:NO];
            id<MTLTexture> tex = [s.device newTextureWithDescriptor:d];
            [tex replaceRegion:MTLRegionMake2D(0, 0, img.width, img.height) mipmapLevel:0 withBytes:img.rgba.data() bytesPerRow:img.width*4];
            s->_subtitleTex = tex;
        }
    };

    // Strict original: world is empty (black background) until a mission is loaded!
    [self getOrLoadPrototype:"backpack"];
    _target = simd_make_float3(0, 0, 0);
    _yaw = 0.0f; _pitch = 0.0f; _distance = 10.0f;

    NSTrackingArea* ta = [[NSTrackingArea alloc] initWithRect:self.bounds
                                                      options:(NSTrackingMouseMoved | NSTrackingActiveAlways | NSTrackingInVisibleRect)
                                                        owner:self
                                                     userInfo:nil];
    [self addTrackingArea:ta];
    return self;
}

- (void)setupPipelines {
    NSError* err = nil;
    id<MTLLibrary> lib = [self.device newLibraryWithSource:[NSString stringWithUTF8String:kShaders] options:nil error:&err];
    if (!lib) { NSLog(@"Shader error: %@", err); return; }

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
    md.rasterSampleCount = self.sampleCount;
    _meshPSO = [self.device newRenderPipelineStateWithDescriptor:md error:&err];

    // Additive blending pipeline for `additive*` nShaderNodes (glows, shields, flares)
    md.colorAttachments[0].sourceRGBBlendFactor = MTLBlendFactorOne;
    md.colorAttachments[0].destinationRGBBlendFactor = MTLBlendFactorOne;
    _meshAddPSO = [self.device newRenderPipelineStateWithDescriptor:md error:&err];

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
    cd.rasterSampleCount = self.sampleCount;
    _cloudPSO = [self.device newRenderPipelineStateWithDescriptor:cd error:&err];

    MTLVertexDescriptor* gv = [[MTLVertexDescriptor alloc] init];
    gv.attributes[0].format = MTLVertexFormatFloat2; gv.attributes[0].offset = 0; gv.attributes[0].bufferIndex = 0;
    gv.attributes[1].format = MTLVertexFormatFloat2; gv.attributes[1].offset = 8; gv.attributes[1].bufferIndex = 0;
    gv.layouts[0].stride = sizeof(GuiVert);

    MTLRenderPipelineDescriptor* gd = [[MTLRenderPipelineDescriptor alloc] init];
    gd.vertexFunction = [lib newFunctionWithName:@"gui_vs"];
    gd.fragmentFunction = [lib newFunctionWithName:@"gui_fs"];
    gd.vertexDescriptor = gv;
    gd.colorAttachments[0].pixelFormat = self.colorPixelFormat;
    gd.colorAttachments[0].blendingEnabled = YES;
    gd.colorAttachments[0].sourceRGBBlendFactor = MTLBlendFactorSourceAlpha;
    gd.colorAttachments[0].destinationRGBBlendFactor = MTLBlendFactorOneMinusSourceAlpha;
    gd.depthAttachmentPixelFormat = self.depthStencilPixelFormat;
    gd.rasterSampleCount = self.sampleCount;
    _guiPSO = [self.device newRenderPipelineStateWithDescriptor:gd error:&err];

    MTLDepthStencilDescriptor* ds = [[MTLDepthStencilDescriptor alloc] init];
    ds.depthCompareFunction = MTLCompareFunctionLess;
    ds.depthWriteEnabled = YES;
    _depthState = [self.device newDepthStencilStateWithDescriptor:ds];

    MTLDepthStencilDescriptor* nds = [[MTLDepthStencilDescriptor alloc] init];
    nds.depthCompareFunction = MTLCompareFunctionAlways;
    nds.depthWriteEnabled = NO;
    _noDepthWriteState = [self.device newDepthStencilStateWithDescriptor:nds];

    MTLDepthStencilDescriptor* cds = [[MTLDepthStencilDescriptor alloc] init];
    cds.depthCompareFunction = MTLCompareFunctionLess;
    cds.depthWriteEnabled = NO;
    _cloudDepthState = [self.device newDepthStencilStateWithDescriptor:cds];

    MTLSamplerDescriptor* sd = [[MTLSamplerDescriptor alloc] init];
    sd.minFilter = MTLSamplerMinMagFilterLinear;
    sd.magFilter = MTLSamplerMinMagFilterLinear;
    sd.mipFilter = MTLSamplerMipFilterLinear;
    sd.maxAnisotropy = 16;
    sd.sAddressMode = MTLSamplerAddressModeRepeat;
    sd.tAddressMode = MTLSamplerAddressModeRepeat;
    _sampler = [self.device newSamplerStateWithDescriptor:sd];

    MTLSamplerDescriptor* gsd = [[MTLSamplerDescriptor alloc] init];
    gsd.minFilter = MTLSamplerMinMagFilterLinear; gsd.magFilter = MTLSamplerMinMagFilterLinear;
    gsd.sAddressMode = MTLSamplerAddressModeClampToEdge; gsd.tAddressMode = MTLSamplerAddressModeClampToEdge;
    _guiSampler = [self.device newSamplerStateWithDescriptor:gsd];

    MTLTextureDescriptor* td = [MTLTextureDescriptor texture2DDescriptorWithPixelFormat:MTLPixelFormatRGBA8Unorm width:1 height:1 mipmapped:NO];
    _whiteTex = [self.device newTextureWithDescriptor:td];
    uint8_t white[4] = {255, 255, 255, 255};
    [_whiteTex replaceRegion:MTLRegionMake2D(0, 0, 1, 1) mipmapLevel:0 withBytes:white bytesPerRow:4];
}

- (id<MTLTexture>)loadNtxTexture:(const std::string&)texPath {
    auto* fs = gRuntime ? gRuntime->getFS() : nullptr;
    if (texPath.empty() || !fs) return nil;
    std::string key = nebula::NpkArchive::normalizePath(texPath);
    auto it = _ntxCache.find(key);
    if (it != _ntxCache.end()) return it->second;

    std::vector<uint8_t> raw;
    nebula::TextureData td;
    id<MTLTexture> tex = nil;
    if (fs->readFile(key, raw) && nebula::parseNtx(raw, td)) {
        MTLTextureDescriptor* d = [MTLTextureDescriptor texture2DDescriptorWithPixelFormat:MTLPixelFormatRGBA8Unorm
                                                                                     width:td.width
                                                                                    height:td.height
                                                                                 mipmapped:YES];
        d.usage = MTLTextureUsageShaderRead;
        tex = [self.device newTextureWithDescriptor:d];
        [tex replaceRegion:MTLRegionMake2D(0, 0, td.width, td.height) mipmapLevel:0 withBytes:td.rgba.data() bytesPerRow:td.width*4];
        id<MTLCommandBuffer> mcb = [_queue commandBuffer];
        id<MTLBlitCommandEncoder> blit = [mcb blitCommandEncoder];
        [blit generateMipmapsForTexture:tex];
        [blit endEncoding];
        [mcb commit];
    }
    _ntxCache[key] = tex;
    return tex;
}

- (GpuPrototype*)getOrLoadPrototype:(const std::string&)protoName {
    std::string key = nebula::NpkArchive::toLower(protoName);
    if (gRuntime) {
        if (auto* rw = dynamic_cast<nebula::nRealWorld*>(gRuntime->ks.lookup("/world"))) {
            key = rw->resolveAlias(key);
        }
    }
    auto it = _protoCache.find(key);
    if (it != _protoCache.end()) return &it->second;

    GpuPrototype proto;
    proto.loaded = true;
    if (auto* fs = gRuntime ? gRuntime->getFS() : nullptr) {
        // Skip non-visual helper prototypes
        if (key.rfind("weather", 0) != 0 && key.rfind("t_", 0) != 0 &&
            key != "subtitle" && key != "camera" && key != "cinedummy" &&
            key != "navpoint" && key != "sky" && key != "skybox01" && key != "x_object") {
            std::vector<uint8_t> nobRaw;
            std::vector<nebula::SceneDrawItem> items;
            nebula::ParsedCharacterRig rig;
            std::string dir = key;
            if (!fs->readFile("data.n/" + dir + ".n/_main.n", nobRaw)) {
                // Cinematic alias fallback (e.g. p_shark_cin -> p_shark01)
                if (dir == "p_shark_cin") dir = "p_shark01";
                else if (dir == "meta_guntower01") dir = "j_guntower01";
                else if (dir == "meta_navigationtower") dir = "j_navigationtower01";
                fs->readFile("data.n/" + dir + ".n/_main.n", nobRaw);
            }
            if (!nobRaw.empty() && nebula::parseNobScene(nobRaw, items, &rig)) {
                // Build skeleton & load NAX0 animation file if this prototype is a rigged character!
                if (!rig.joints.empty()) {
                    proto.skeleton.animFile = rig.animFile;
                    proto.skeleton.joints.resize(rig.joints.size());
                    for (const auto& pj : rig.joints) {
                        if (pj.index >= 0 && static_cast<size_t>(pj.index) < proto.skeleton.joints.size()) {
                            auto& dst = proto.skeleton.joints[pj.index];
                            dst.name = pj.name;
                            dst.parentIndex = pj.parentIndex;
                            dst.tx = pj.tx; dst.ty = pj.ty; dst.tz = pj.tz;
                            dst.qx = pj.qx; dst.qy = pj.qy; dst.qz = pj.qz; dst.qw = pj.qw;
                        }
                    }
                    proto.skeleton.computeBindPose();
                    if (!rig.animFile.empty()) {
                        std::vector<uint8_t> naxRaw;
                        if (fs->readFile(nebula::NpkArchive::normalizePath(rig.animFile), naxRaw)) {
                            proto.skeleton.naxLoaded = proto.skeleton.nax.parse(naxRaw);
                            std::cout << "[nAnim] Loaded skeleton (" << proto.skeleton.joints.size()
                                      << " joints) + NAX (" << proto.skeleton.nax.curves.size()
                                      << " curves) for " << key << "\n";
                        }
                    }
                    proto.hasSkeleton = true;
                }

                for (const auto& item : items) {
                    std::vector<uint8_t> nvxRaw;
                    nebula::MeshData md;
                    if (!fs->readFile(item.meshPath, nvxRaw) || !nebula::parseNvx(nvxRaw, md, item.isCloud ? 55.0f : 2.2f)) continue;
                    id<MTLBuffer> vb = [self.device newBufferWithBytes:md.vertices.data() length:md.vertices.size()*sizeof(nebula::MeshVertex) options:MTLResourceStorageModeShared];
                    id<MTLBuffer> ib = [self.device newBufferWithBytes:md.indices.data() length:md.indices.size()*sizeof(uint16_t) options:MTLResourceStorageModeShared];
                    id<MTLTexture> tex = [self loadNtxTexture:item.texPath];
                    id<MTLTexture> det = [self loadNtxTexture:item.detailTexPath];
                    nebula::ShaderDesc shDesc;
                    if (!item.shaderName.empty()) {
                        auto sit = _shaders.find(item.shaderName);
                        if (sit != _shaders.end()) shDesc = sit->second;
                    }
                    if (item.isCloud) { shDesc.zWriteEnable = false; shDesc.alphaEnable = true; shDesc.lightEnable = false; }
                    GpuSubMesh sm{vb, ib, md.indices.size(), tex ? tex : _whiteTex, det ? det : _whiteTex,
                                  mat4FromNebula(item.worldMatrix), tex != nil, det != nil, false, item.isCloud,
                                  md.isBillboard, item.isSway, item.spinAxis, item.spinDegPerSec, shDesc, {}};
                    if (!proto.hasCollMesh && !proto.hasSkeleton &&
                        (key.find("island") != std::string::npos || key.find("ruin") != std::string::npos ||
                         key.find("dd") != std::string::npos || key.find("tower") != std::string::npos)) {
                        // Prefer dedicated collide.nvx if available, otherwise use terrain mesh!
                        std::vector<uint8_t> cRaw;
                        if (fs->readFile("data.n/" + dir + ".n/collide.nvx", cRaw) && nebula::parseNvx(cRaw, proto.collMesh)) {
                            proto.hasCollMesh = true;
                        } else {
                            proto.collMesh = md;
                            proto.hasCollMesh = true;
                        }
                    }
                    if (!md.skinWeights.empty() && proto.hasSkeleton) {
                        sm.isSkinned = true;
                        sm.bindMesh = std::move(md);
                    }
                    proto.subMeshes.push_back(std::move(sm));
                }
            }
        }
    }
    auto [ins, _] = _protoCache.emplace(key, std::move(proto));
    return &ins->second;
}

- (void)rebuildWorldInstances {
    if (!gRuntime) return;
    auto* rw = dynamic_cast<nebula::nRealWorld*>(gRuntime->ks.lookup("/world"));
    if (!rw || rw->entities.empty()) return;

    _instances.clear();
    _collision.clear();
    size_t loadedCount = 0;
    for (auto* ent : rw->entities) {
        if (!ent) continue;
        GpuPrototype* gp = [self getOrLoadPrototype:ent->protoName];
        if (!gp || gp->subMeshes.empty()) continue;

        nebula::Mat4 M = ent->computeWorldMatrix(0.0f);
        std::string low = rw->resolveAlias(ent->protoName);
        _instances.push_back({low, ent, mat4FromNebula(M)});
        if (gp->hasCollMesh && ent->visible) {
            _collision.addMesh(gp->collMesh, M);
        }
        loadedCount++;
    }

    // Read chosen hero from Tcl ($character_proto) & spawn ONLY on initial mission load (not mid-mission loadencounter!)
    if (!_playerActive) {
        std::string chosenHero = "char_john";
        if (gRuntime->tcl && gRuntime->tcl->interp) {
            const char* v = Tcl_GetVar(gRuntime->tcl->interp, "character_proto", TCL_GLOBAL_ONLY);
            if (v && v[0]) chosenHero = v;
        }
        _player.protoName = chosenHero;
        [self getOrLoadPrototype:chosenHero];
        _player.spawnAt(rw->spawnX, rw->spawnY, rw->spawnZ, _collision);
        _player.camYaw = 1.6f;
        _player.camPitch = 0.25f;
        _player.camDist = 11.5f;
        _playerActive = true;
        _freeFly = false;
        self.clearColor = MTLClearColorMake(0.44, 0.61, 0.82, 1.0);

        // Load real Russian Mission objective from nCookieHandler (__objective)
        std::string objFile = "obj_c00p01_01.bmp";
        if (auto* ch = dynamic_cast<nebula::nCookieHandler*>(gRuntime->ks.lookup("/game/handler/cookie"))) {
            std::string cobj = ch->getCookie("__objective");
            if (!cobj.empty()) objFile = cobj;
        }
        nebula::BmpImage objImg;
        std::string objPath = gRuntime->runDir + "book/chapter00/part01/objective/" + objFile;
        if (nebula::loadBmpFile(objPath, objImg)) {
            for (size_t i = 0; i < static_cast<size_t>(objImg.width) * objImg.height; ++i) {
                uint8_t r = objImg.rgba[i*4+0], g = objImg.rgba[i*4+1], b = objImg.rgba[i*4+2];
                uint8_t mx = std::max({r, g, b});
                objImg.rgba[i*4+3] = (mx < 20) ? 0 : static_cast<uint8_t>(std::min(255, mx * 2));
            }
            MTLTextureDescriptor* d = [MTLTextureDescriptor texture2DDescriptorWithPixelFormat:MTLPixelFormatRGBA8Unorm
                                                                                         width:objImg.width height:objImg.height mipmapped:NO];
            _objectiveTex = [self.device newTextureWithDescriptor:d];
            [_objectiveTex replaceRegion:MTLRegionMake2D(0, 0, objImg.width, objImg.height)
                             mipmapLevel:0 withBytes:objImg.rgba.data() bytesPerRow:objImg.width * 4];
        }
    }

    std::cout << "[Metal] World synced: " << loadedCount << " visible 3D instances, "
              << _collision.totalTriangles() << " collision triangles. Hero at ("
              << _player.pos.x << ", " << _player.pos.y << ", " << _player.pos.z
              << ") grounded=" << (_player.grounded ? "YES" : "NO") << "\n";
    [self updateTitle];
}

- (void)showSubtitleBmp:(const std::string&)rawPath {
    if (!gRuntime) return;
    auto* fs = gRuntime->getFS();
    std::string full = fs ? fs->manglePath(rawPath) : rawPath;
    nebula::BmpImage img;
    if (nebula::loadBmpFile(full, img)) {
        for (size_t i = 0; i < static_cast<size_t>(img.width) * img.height; ++i) {
            uint8_t r = img.rgba[i*4+0], g = img.rgba[i*4+1], b = img.rgba[i*4+2];
            uint8_t mx = std::max({r, g, b});
            img.rgba[i*4+3] = (mx < 18) ? 0 : static_cast<uint8_t>(std::min(255, mx * 2));
        }
        MTLTextureDescriptor* d = [MTLTextureDescriptor texture2DDescriptorWithPixelFormat:MTLPixelFormatRGBA8Unorm
                                                                                     width:img.width height:img.height mipmapped:NO];
        id<MTLTexture> tex = [self.device newTextureWithDescriptor:d];
        [tex replaceRegion:MTLRegionMake2D(0, 0, img.width, img.height) mipmapLevel:0 withBytes:img.rgba.data() bytesPerRow:img.width*4];
        _subtitleTex = tex;
    }
}

- (void)hideSubtitle {
    _subtitleTex = nil;
}

- (id<MTLTexture>)guiTextureForKey:(const std::string&)key {
    if (key.empty() || !gRuntime) return nil;
    auto it = _guiTexCache.find(key);
    if (it != _guiTexCache.end()) return it->second;

    nebula::BmpImage img;
    id<MTLTexture> tex = nil;
    if (nebula::loadLocaleMenuTexture(gRuntime->localeDir, key, img)) {
        MTLTextureDescriptor* d = [MTLTextureDescriptor texture2DDescriptorWithPixelFormat:MTLPixelFormatRGBA8Unorm width:img.width height:img.height mipmapped:NO];
        tex = [self.device newTextureWithDescriptor:d];
        [tex replaceRegion:MTLRegionMake2D(0, 0, img.width, img.height) mipmapLevel:0 withBytes:img.rgba.data() bytesPerRow:img.width*4];
    }
    _guiTexCache[key] = tex;
    return tex;
}

- (nebula::nGuiMenuHandler*)menuHandler {
    if (!gRuntime) return nullptr;
    return dynamic_cast<nebula::nGuiMenuHandler*>(gRuntime->ks.lookup("/sys/servers/menuhandler"));
}

- (simd_float2)eventToNDC:(NSEvent*)event {
    NSPoint p = [self convertPoint:event.locationInWindow fromView:nil];
    return simd_make_float2(
        static_cast<float>((p.x / std::max(1.0, self.bounds.size.width)) * 2.0 - 1.0),
        static_cast<float>((p.y / std::max(1.0, self.bounds.size.height)) * 2.0 - 1.0)
    );
}

// ---------------------------------------------------------------------------
// Input: Menu Hover/Click + WASD Free-Flight + Mouse Look
// ---------------------------------------------------------------------------
- (BOOL)acceptsFirstResponder { return YES; }

- (void)mouseMoved:(NSEvent*)event {
    auto* mh = [self menuHandler];
    auto* menu = mh ? mh->getActiveMenu() : nullptr;
    if (!menu) { _hoveredEntry = nullptr; return; }

    simd_float2 ndc = [self eventToNDC:event];
    std::vector<nebula::nGuiMenuEntry*> entries;
    menu->collectEntries(entries);
    nebula::nGuiMenuEntry* hit = nullptr;
    for (auto* e : entries) {
        if (e->rect.contains(ndc.x, ndc.y)) { hit = e; break; }
    }
    if (hit != _hoveredEntry) {
        _hoveredEntry = hit;
        if (hit) playWav("book:feedback/menueover.wav", false);
    }
}

- (void)mouseDown:(NSEvent*)event {
    auto* mh = [self menuHandler];
    auto* menu = mh ? mh->getActiveMenu() : nullptr;
    if (menu) {
        simd_float2 ndc = [self eventToNDC:event];
        std::vector<nebula::nGuiMenuEntry*> entries;
        menu->collectEntries(entries);
        for (auto* e : entries) {
            if (e->rect.contains(ndc.x, ndc.y)) {
                if (!e->command.empty() && gRuntime && gRuntime->tcl) {
                    std::cout << "[Menu Click] " << e->name << " -> Tcl: " << e->command << "\n";
                    playWav("book:feedback/use_ok.wav", false);
                    gRuntime->tcl->evalString(e->command);
                    _hoveredEntry = nullptr;
                    [self updateTitle];
                }
                return;
            }
        }
    }
    _dragging = true;
    _lastMouse = [self convertPoint:event.locationInWindow fromView:nil];
}

- (void)mouseUp:(NSEvent*)event { _dragging = false; }

- (void)mouseDragged:(NSEvent*)event {
    if (!_dragging) return;
    NSPoint p = [self convertPoint:event.locationInWindow fromView:nil];
    float dx = static_cast<float>(p.x - _lastMouse.x) * 0.006f;
    float dy = static_cast<float>(p.y - _lastMouse.y) * 0.006f;
    if (_playerActive && !_freeFly) {
        _player.camYaw -= dx;
        _player.camPitch = std::clamp(_player.camPitch - dy, -0.35f, 1.35f);
    } else {
        _yaw -= dx;
        _pitch = std::clamp(_pitch + dy, -1.45f, 1.45f);
    }
    _lastMouse = p;
}

- (void)scrollWheel:(NSEvent*)event {
    // MacBook Trackpad: two-finger swipe smoothly orbits 3rd-person camera or free-flight look!
    float dx = static_cast<float>(event.scrollingDeltaX);
    float dy = static_cast<float>(event.scrollingDeltaY);
    float sens = event.hasPreciseScrollingDeltas ? 0.0055f : 0.035f;
    if (_playerActive && !_freeFly) {
        _player.camYaw -= dx * sens;
        _player.camPitch = std::clamp(_player.camPitch + dy * sens, -0.35f, 1.35f);
    } else if (_freeFly) {
        _yaw -= dx * sens;
        _pitch = std::clamp(_pitch + dy * sens, -1.45f, 1.45f);
    } else {
        _yaw -= dx * sens;
        _pitch = std::clamp(_pitch + dy * sens, -1.35f, 1.35f);
    }
}

- (void)magnifyWithEvent:(NSEvent*)event {
    // MacBook Trackpad: pinch-to-zoom adjusts 3rd-person camera distance or flies forward/back!
    float mag = static_cast<float>(event.magnification);
    if (_playerActive && !_freeFly) {
        _player.camDist = std::clamp(_player.camDist * (1.0f - mag * 1.1f), 4.0f, 45.0f);
    } else if (_freeFly) {
        simd_float3 fwd = simd_normalize(simd_make_float3(
            std::cos(_pitch) * std::sin(_yaw),
            std::sin(_pitch),
            -std::cos(_pitch) * std::cos(_yaw)
        ));
        _camPos = _camPos + fwd * (mag * 320.0f);
    } else {
        _distance = std::clamp(_distance * (1.0f - mag * 1.2f), 30.0f, 1500.0f);
    }
}

- (void)rotateWithEvent:(NSEvent*)event {
    float rot = static_cast<float>(event.rotation) * 0.025f;
    if (_playerActive && !_freeFly) _player.camYaw += rot;
    else _yaw += rot;
}

- (void)keyDown:(NSEvent*)event {
    uint16_t kc = event.keyCode;
    if (kc == 49 && !_keysDown.count(49)) _jumpPressed = true; // Space
    _keysDown.insert(kc);
    NSString* ch = [event.charactersIgnoringModifiers lowercaseString];
    if (kc == 53) { // ESC
        if (auto* mh = [self menuHandler]) {
            if (mh->isMenuOpen()) mh->handleEscape();
            else mh->openMenu(_playerActive ? "ingame_singleplayer" : "main");
            [self updateTitle];
        }
    } else if (kc == 48 && _playerActive) { // Tab: toggle 3rd-person Hero vs Free-Fly
        _freeFly = !_freeFly;
        if (_freeFly) {
            _camPos = simd_make_float3(_player.pos.x, _player.pos.y + 20.0f, _player.pos.z + 30.0f);
            _yaw = _player.camYaw;
            _pitch = -0.2f;
        }
        [self updateTitle];
    } else if (_houseMenu.open && (kc == 123 || kc == 124 || kc == 125 || kc == 126)) {
        int n = static_cast<int>(_houseMenu.items.size());
        if (n > 0) {
            int delta = (kc == 124 || kc == 125) ? 1 : -1;
            _houseMenu.selectedIndex = (_houseMenu.selectedIndex + delta + n) % n;
            playWav("book:feedback/use_ok.wav", false);
            [self updateTitle];
        }
    } else if ([ch isEqualToString:@"e"] && _playerActive && gRuntime) {
        // nHouseMenu (verified from nhousemenu.asm): open/cycle/confirm radial building menu
        auto* rw = dynamic_cast<nebula::nRealWorld*>(gRuntime->ks.lookup("/world"));
        if (rw) {
            if (_houseMenu.open) {
                nebula::nEntity* tb = _houseMenu.targetBuilding;
                std::string act = _houseMenu.executeSelected(rw, &gRuntime->belt);
                if (act == "menuitem_default" && tb) {
                    _possessedEntity = tb;
                    _flight.engage(tb);
                }
                playWav("book:feedback/use_ok.wav", false);
                [self updateTitle];
            } else {
                nebula::nEntity* nearest = nullptr;
                float bestD2 = 625.0f; // 25m
                for (auto* e : rw->entities) {
                    if (!e || !e->visible || e->artefactMode) continue;
                    std::string lo = nebula::NpkArchive::toLower(e->protoName);
                    if (lo.find("island") != std::string::npos || lo.find("tree") != std::string::npos ||
                        lo.find("ruin") != std::string::npos) continue;
                    float dx = e->px - _player.pos.x, dy = e->py - _player.pos.y, dz = e->pz - _player.pos.z;
                    float d2 = dx*dx + dy*dy + dz*dz;
                    if (d2 < bestD2) { bestD2 = d2; nearest = e; }
                }
                if (nearest) {
                    _houseMenu.openFor(nearest);
                    playWav("book:feedback/use_ok.wav", false);
                    [self updateTitle];
                }
            }
        }
    } else if ([ch isEqualToString:@"o"]) {
        _showObjective = !_showObjective;
    } else if ([ch isEqualToString:@"f"] && _playerActive && gRuntime) {
        // Collect nearest artefact within 12m into player belt (nCollectArtefact)
        auto* rw = dynamic_cast<nebula::nRealWorld*>(gRuntime->ks.lookup("/world"));
        auto* eh = dynamic_cast<nebula::nEventHandler*>(gRuntime->ks.lookup("/game/handler/event"));
        if (rw) {
            for (auto* e : rw->entities) {
                if (e && e->artefactMode && e->visible) {
                    float dx = e->px - _player.pos.x, dy = e->py - _player.pos.y, dz = e->pz - _player.pos.z;
                    if (dx*dx + dy*dy + dz*dz <= 144.0f) {
                        if (gRuntime->belt.collect(e, eh)) {
                            playWav("book:feedback/use_ok.wav", false);
                            rw->worldDirty = true;
                            [self updateTitle];
                            break;
                        }
                    }
                }
            }
        }
    } else if ([ch isEqualToString:@"b"] && _playerActive && gRuntime) {
        // Place / build selected artefact from belt 8m in front of player (nPlaceHouse)
        auto* rw = dynamic_cast<nebula::nRealWorld*>(gRuntime->ks.lookup("/world"));
        auto* eh = dynamic_cast<nebula::nEventHandler*>(gRuntime->ks.lookup("/game/handler/event"));
        if (rw && !gRuntime->belt.artefacts.empty()) {
            float bx = _player.pos.x - std::sin(_player.facingYaw) * 8.0f;
            float bz = _player.pos.z - std::cos(_player.facingYaw) * 8.0f;
            float by = _player.pos.y;
            nebula::Vec3c nrm{0, 1, 0};
            _collision.raycastDown(bx, _player.pos.y + 15.0f, bz, 40.0f, by, nrm);
            float yawDeg = _player.facingYaw * 180.0f / 3.14159265f;
            if (gRuntime->belt.placeSelected(bx, by, bz, yawDeg, eh)) {
                playWav("book:feedback/taken_control.wav", false);
                rw->worldDirty = true;
                [self updateTitle];
            }
        }
    } else if ([ch isEqualToString:@"p"] && _playerActive && gRuntime) {
        // Possess / exit nearest friendly aircraft, gun tower, or island drive (nAirplane3 / nFlak / nIslandDrive)
        if (_possessedEntity) {
            std::cout << "[Possess] Exited " << _possessedEntity->protoName << "\n";
            _player.pos = {_possessedEntity->px, _possessedEntity->py + 2.5f, _possessedEntity->pz};
            _flight.disengage();
            _possessedEntity = nullptr;
            playWav("book:feedback/taken_control.wav", false);
            [self updateTitle];
        } else if (auto* rw = dynamic_cast<nebula::nRealWorld*>(gRuntime->ks.lookup("/world"))) {
            nebula::nEntity* best = nullptr;
            float bestD2 = 40.0f * 40.0f;
            for (auto* e : rw->entities) {
                if (!e || !e->visible || e->artefactMode || e->state == "destroyed") continue;
                std::string lo = nebula::NpkArchive::toLower(e->protoName);
                bool isDrive = (lo.find("navigation") != std::string::npos || lo.find("lighthouse") != std::string::npos);
                if (!nebula::nCombatSystem::isFighterProto(e->protoName) &&
                    !nebula::nCombatSystem::isTurretProto(e->protoName) && !isDrive) continue;
                float dx = e->px - _player.pos.x, dy = e->py - _player.pos.y, dz = e->pz - _player.pos.z;
                float d2 = dx*dx + dy*dy + dz*dz;
                if (d2 < bestD2) { bestD2 = d2; best = e; }
            }
            if (best) {
                _possessedEntity = best;
                _possessedEntity->cinePlaying = false;
                _flight.engage(best);
                playWav("book:feedback/taken_control.wav", false);
                [self updateTitle];
            }
        }
    } else if ([ch isEqualToString:@"x"] && _playerActive && gRuntime) {
        // Fire player / possessed vehicle weapon toward camera aim (Module 4 + 6)
        float dx = std::cos(_player.camPitch) * std::sin(_player.camYaw);
        float dy = -std::sin(_player.camPitch);
        float dz = -std::cos(_player.camPitch) * std::cos(_player.camYaw);
        float ox = _possessedEntity ? _possessedEntity->px : _player.pos.x;
        float oy = _possessedEntity ? (_possessedEntity->py + 3.0f) : (_player.pos.y + 1.6f);
        float oz = _possessedEntity ? _possessedEntity->pz : _player.pos.z;
        gRuntime->combat.fireProjectile(ox, oy, oz, dx, dy, dz, 280.0f, 35.0f, 0, _possessedEntity);
    } else if (kc == 96 && _playerActive && gRuntime) { // F5: Quicksave
        if (auto* rw = dynamic_cast<nebula::nRealWorld*>(gRuntime->ks.lookup("/world"))) {
            nebula::saveGameToFile(rw, "home:save/quicksave.n");
            playWav("book:feedback/use_ok.wav", false);
        }
    } else if (kc == 101 && gRuntime) { // F9: Quickload
        if (auto* rw = dynamic_cast<nebula::nRealWorld*>(gRuntime->ks.lookup("/world"))) {
            if (nebula::loadGameFromFile(rw, "home:save/quicksave.n")) {
                playWav("book:feedback/taken_control.wav", false);
            }
        }
    } else if (kc == 97 && gRuntime) { // F6: Advance to next campaign part!
        if (auto* bh = dynamic_cast<nebula::nBookHandler*>(gRuntime->ks.lookup("/game/handler/book"))) {
            if (auto* rw = dynamic_cast<nebula::nRealWorld*>(gRuntime->ks.lookup("/world"))) {
                rw->clearEntities();
                rw->ensureUserClan();
                _playerActive = false;
                _possessedEntity = nullptr;
                gRuntime->particles.clear();
                bh->activateNextPart();
                if (rw->worldDirty) { rw->worldDirty = false; [self rebuildWorldInstances]; }
            }
        }
    } else if ([ch isEqualToString:@"n"]) {
        if (gRuntime) {
            if (auto* rw = dynamic_cast<nebula::nRealWorld*>(gRuntime->ks.lookup("/world"))) {
                rw->skipActiveCinematics();
            }
        }
    } else if ([ch isEqualToString:@"m"]) {
        if (gRuntime) {
            gRuntime->muted = !gRuntime->muted;
            if (gRuntime->muted && gRuntime->musicSound) [gRuntime->musicSound pause];
            else if (!gRuntime->muted && gRuntime->musicSound) [gRuntime->musicSound resume];
            [self updateTitle];
        }
    }
}

- (void)keyUp:(NSEvent*)event {
    _keysDown.erase(event.keyCode);
}

- (void)updateTitle {
    if (!self.hostWindow) return;
    auto* mh = [self menuHandler];
    auto* m = mh ? mh->getActiveMenu() : nullptr;
    NSString* state = m
        ? [NSString stringWithFormat:@"Меню: %s", m->name.c_str()]
        : [NSString stringWithFormat:@"Миссия 1 (%zu объектов) — WASD/QE полёт, ЛКМ обзор, Esc меню", _instances.size()];
    [self.hostWindow setTitle:[NSString stringWithFormat:@"Проект «Бродяги» (Native macOS arm64 / Metal) — %@ | M: %@",
                               state, (gRuntime && gRuntime->muted) ? @"Muted" : @"Audio"]];
}

// ---------------------------------------------------------------------------
// 60 FPS Render Loop
// ---------------------------------------------------------------------------
- (void)mtkView:(MTKView*)view drawableSizeWillChange:(CGSize)size {}

- (void)drawQuad:(id<MTLRenderCommandEncoder>)enc rect:(const nebula::GuiRect&)r tex:(id<MTLTexture>)tex tint:(simd_float4)tint {
    if (!tex) return;
    float x0 = r.minX(), x1 = r.maxX(), y0 = r.minY(), y1 = r.maxY();
    GuiVert verts[6] = {
        {x0, y0, 0, 1}, {x1, y0, 1, 1}, {x1, y1, 1, 0},
        {x0, y0, 0, 1}, {x1, y1, 1, 0}, {x0, y1, 0, 0},
    };
    [enc setVertexBytes:verts length:sizeof(verts) atIndex:0];
    [enc setFragmentBytes:&tint length:sizeof(tint) atIndex:1];
    [enc setFragmentTexture:tex atIndex:0];
    [enc drawPrimitives:MTLPrimitiveTypeTriangle vertexStart:0 vertexCount:6];
}

- (void)drawInMTKView:(MTKView*)view {
    id<CAMetalDrawable> drawable = view.currentDrawable;
    MTLRenderPassDescriptor* rp = view.currentRenderPassDescriptor;
    if (!drawable || !rp) return;

    auto now = std::chrono::steady_clock::now();
    float t = std::chrono::duration<float>(now - _startTime).count();
    float dt = std::chrono::duration<float>(now - _lastFrameTime).count();
    _lastFrameTime = now;
    float aspect = static_cast<float>(view.drawableSize.width / std::max(1.0, view.drawableSize.height));

    auto* mh = [self menuHandler];
    auto* menu = mh ? mh->getActiveMenu() : nullptr;

    simd_float3 eye, lookTarget;
    nebula::nRealWorld* activeRW = gRuntime ? dynamic_cast<nebula::nRealWorld*>(gRuntime->ks.lookup("/world")) : nullptr;
    if (_playerActive && !_freeFly) {
        if (!menu) {
            if (activeRW) {
                activeRW->tick(dt, _player.pos.x, _player.pos.y, _player.pos.z);
                if (gRuntime) {
                    gRuntime->combat.update(dt, activeRW);
                    gRuntime->islands.update(dt, activeRW);
                    // Emit 3D particles (Module 7): jetpack flame, flying aircraft trails, wreck smoke
                    if (_player.jetpacking && !_possessedEntity) {
                        gRuntime->particles.emitJetpackFlame(_player.pos.x, _player.pos.y + 1.0f, _player.pos.z,
                                                             (_keysDown.count(56) || _keysDown.count(60)) ? 1.0f : 0.0f);
                    }
                    for (auto* e : activeRW->entities) {
                        if (!e || !e->visible) continue;
                        if ((e->cinePlaying || e->aiMoving) && nebula::nCombatSystem::isFighterProto(e->protoName)) {
                            if (gRuntime->particles.frand() < 0.35f) gRuntime->particles.emitEngineTrail(e->px, e->py, e->pz);
                        } else if (e->protoName == "dd_destroyed") {
                            if (gRuntime->particles.frand() < 0.12f) gRuntime->particles.emitWreckSmoke(e->px, e->py + 4.0f, e->pz);
                        }
                    }
                    gRuntime->particles.update(dt);
                }
            }
            if (!activeRW || !activeRW->activeCineCamera) {
                if (_possessedEntity) {
                    // Module 10: binary-verified nAirplane3 / nIslandDrive / nTurret flight controller
                    float fwd = (_keysDown.count(13) || _keysDown.count(126) ? 1.0f : 0.0f) -
                                (_keysDown.count(1)  || _keysDown.count(125) ? 1.0f : 0.0f);
                    float rgt = (_keysDown.count(2)  || _keysDown.count(124) ? 1.0f : 0.0f) -
                                (_keysDown.count(0)  || _keysDown.count(123) ? 1.0f : 0.0f);
                    float vrt = (_keysDown.count(49) ? 1.0f : 0.0f) - (_keysDown.count(12) ? 1.0f : 0.0f); // Space up, Q down
                    bool boost = (_keysDown.count(56) || _keysDown.count(60));
                    if (_flight.controlled) {
                        _flight.update(dt, fwd, rgt, vrt, boost);
                        _player.camYaw = -_flight.yawDeg * 0.0174532925f;
                        _player.pos = {_flight.controlled->px, _flight.controlled->py, _flight.controlled->pz};
                    } else {
                        _player.pos = {_possessedEntity->px, _possessedEntity->py, _possessedEntity->pz};
                    }
                } else {
                    nebula::PlayerInput pi;
                    if (_keysDown.count(13) || _keysDown.count(126)) pi.moveForward += 1.0f;
                    if (_keysDown.count(1)  || _keysDown.count(125)) pi.moveForward -= 1.0f;
                    if (_keysDown.count(2)  || _keysDown.count(124)) pi.moveRight   += 1.0f;
                    if (_keysDown.count(0)  || _keysDown.count(123)) pi.moveRight   -= 1.0f;
                    pi.jumpHeld = (_keysDown.count(49) > 0);
                    pi.jumpPressed = _jumpPressed;
                    _jumpPressed = false;
                    pi.sprintHeld = (_keysDown.count(56) > 0 || _keysDown.count(60) > 0);
                    _player.update(dt, pi, _collision);
                }
            }
        }
        if (activeRW && activeRW->activeCineCamera) {
            auto* cc = activeRW->activeCineCamera;
            eye = simd_make_float3(cc->px, cc->py, cc->pz);
            nebula::Mat4 qm = nebula::Mat4::fromQuat(-cc->qx, -cc->qy, -cc->qz, cc->qw);
            // Forward vector of camera is -Z column of rotation matrix
            simd_float3 fwd = simd_make_float3(-qm.m[8], -qm.m[9], -qm.m[10]);
            lookTarget = eye + fwd * 10.0f;
        } else {
            nebula::Vec3c ce, ct;
            _player.getChaseCamera(ce, ct);
            eye = simd_make_float3(ce.x, ce.y, ce.z);
            lookTarget = simd_make_float3(ct.x, ct.y, ct.z);
        }
    } else if (_freeFly) {
        // WASD (13, 0, 1, 2) + Arrows + Q/E (12, 14) free flight
        simd_float3 fwd = simd_normalize(simd_make_float3(
            std::cos(_pitch) * std::sin(_yaw),
            std::sin(_pitch),
            -std::cos(_pitch) * std::cos(_yaw)
        ));
        simd_float3 right = simd_normalize(simd_cross(fwd, simd_make_float3(0, 1, 0)));
        float speed = (_keysDown.count(56) || _keysDown.count(60)) ? 16.0f : 5.0f;
        if (_keysDown.count(13) || _keysDown.count(126)) _camPos = _camPos + fwd * speed;   // W / Up
        if (_keysDown.count(1)  || _keysDown.count(125)) _camPos = _camPos - fwd * speed;   // S / Down
        if (_keysDown.count(2)  || _keysDown.count(124)) _camPos = _camPos + right * speed; // D / Right
        if (_keysDown.count(0)  || _keysDown.count(123)) _camPos = _camPos - right * speed; // A / Left
        if (_keysDown.count(14)) _camPos.y += speed;                                        // E
        if (_keysDown.count(12)) _camPos.y -= speed;                                        // Q
        eye = _camPos;
        lookTarget = _camPos + fwd;
    } else {
        if (!_dragging) _yaw += 0.0025f;
        eye = _target + simd_make_float3(
            _distance * std::cos(_pitch) * std::sin(_yaw),
            _distance * std::sin(_pitch),
            _distance * std::cos(_pitch) * std::cos(_yaw)
        );
        lookTarget = _target;
    }

    simd_float4x4 V = makeLookAt(eye, lookTarget, simd_make_float3(0, 1, 0));
    simd_float4x4 P = makePerspective(55.0f * 3.14159265f / 180.0f, aspect, 1.5f, 18000.0f);
    simd_float4x4 VP = simd_mul(P, V);

    id<MTLCommandBuffer> cb = [_queue commandBuffer];
    id<MTLRenderCommandEncoder> enc = [cb renderCommandEncoderWithDescriptor:rp];

    // 0. Original Painted Skybox (skybox01.n) — only when a mission is loaded (empty menu is pure black!)
    if (_playerActive && _hasSkybox) {
        [enc setRenderPipelineState:_meshPSO];
        [enc setDepthStencilState:_noDepthWriteState];
        [enc setFragmentSamplerState:_sampler atIndex:0];
        nebula::Mat4 smat = nebula::Mat4::translate(eye.x, eye.y - 80.0f, eye.z)
                          * nebula::Mat4::scale(180.0f, 320.0f, 180.0f);
        simd_float4x4 M = mat4FromNebula(smat);
        MeshUniformsCPU u{simd_mul(VP, M), M, VP, simd_make_float4(0.0f, 1.0f, 0.0f, 0.0f), simd_make_float4(1.0f, 0, 0, 0), simd_make_float4(1.0f, 1.0f, 1.0f, 0.0f), simd_make_float4(1.0f, 1.0f, 1.0f, 1.0f)};
        [enc setVertexBuffer:_skyboxMesh.vb offset:0 atIndex:0];
        [enc setVertexBytes:&u length:sizeof(u) atIndex:1];
        [enc setFragmentBytes:&u length:sizeof(u) atIndex:1];
        [enc setFragmentTexture:_skyboxMesh.tex atIndex:0];
        [enc setFragmentTexture:_whiteTex atIndex:1];
        [enc drawIndexedPrimitives:MTLPrimitiveTypeTriangle indexCount:_skyboxMesh.indexCount indexType:MTLIndexTypeUInt16 indexBuffer:_skyboxMesh.ib indexBufferOffset:0];
    }

    // 1. Draw all 3D World Instances (live sun direction & sky tint from nRealWorld::timeOfDay)
    [enc setRenderPipelineState:_meshPSO];
    [enc setDepthStencilState:_depthState];
    [enc setFragmentSamplerState:_sampler atIndex:0];
    simd_float4 sunDir   = simd_make_float4(0.55f, 0.75f, 0.35f, 0.0f);
    simd_float4 sunCol   = simd_make_float4(1.0f, 0.94f, 0.84f, 1.0f);
    simd_float4 ambCol   = simd_make_float4(0.42f, 0.48f, 0.58f, 1.0f);
    simd_float4 fogCol   = simd_make_float4(0.44f, 0.61f, 0.82f, 6500.0f);
    if (gRuntime) {
        if (auto* rw = dynamic_cast<nebula::nRealWorld*>(gRuntime->ks.lookup("/world"))) {
            // 0..86400s: sunrise 21600s (6h), noon 43200s (12h), sunset 64800s (18h)
            float dayAngle = static_cast<float>((rw->timeOfDay - 21600.0) / 86400.0 * 6.28318530718);
            float sx = std::cos(dayAngle);
            float sy = std::max(0.18f, std::sin(dayAngle));
            float sz = 0.35f;
            float invL = 1.0f / std::sqrt(sx*sx + sy*sy + sz*sz);
            sunDir = simd_make_float4(sx * invL, sy * invL, sz * invL, 0.0f);

            if (_weather.loaded) {
                float tod = static_cast<float>(rw->timeOfDay);
                float sc[4], ac[4], fc[4], fr[4];
                if (_weather.sunColor.sample(tod, sc)) sunCol = simd_make_float4(sc[0], sc[1], sc[2], 1.0f);
                if (_weather.ambColor.sample(tod, ac)) ambCol = simd_make_float4(std::max(0.22f, ac[0]), std::max(0.24f, ac[1]), std::max(0.28f, ac[2]), 1.0f);
                if (_weather.fogColor.sample(tod, fc)) {
                    float fEnd = 6500.0f;
                    if (_weather.fogRange.sample(tod, fr) && fr[1] > 500.0f) fEnd = fr[1] * 2.0f;
                    fogCol = simd_make_float4(fc[0], fc[1], fc[2], fEnd);
                    if (_playerActive) self.clearColor = MTLClearColorMake(fc[0], fc[1], fc[2], 1.0);
                }
            }
        }
    }

    // Update dynamic instance transforms once per frame
    for (auto& inst : _instances) {
        if (inst.entity && inst.entity->visible && inst.entity->isDynamicTransform()) {
            inst.worldMat = mat4FromNebula(inst.entity->computeWorldMatrix(t));
        }
    }

    // Extract camera Right & Up from view matrix V for GPU billboards (nCloudRender & nLeafRender)
    simd_float4 camRightVec = simd_make_float4(V.columns[0].x, V.columns[1].x, V.columns[2].x, t * 2.2f);
    simd_float4 camUpVec    = simd_make_float4(V.columns[0].y, V.columns[1].y, V.columns[2].y, 0.0f);
    float windStr = 0.12f, windDirDeg = 33.0f;
    if (gRuntime) {
        if (auto* ch = dynamic_cast<nebula::nChannelServerNode*>(gRuntime->ks.lookup("/sys/servers/channel"))) {
            windStr = ch->get1f("windstrength", 0.12f);
            windDirDeg = ch->get1f("winddir", 33.0f);
        }
    }
    float windRad = windDirDeg * 0.0174532925f;
    float windX = std::cos(windRad), windZ = std::sin(windRad);

    // Pass 1: Opaque & Alpha-Tested geometry (zWriteEnable && !additive && !isCloud)
    // Pass 2: Transparent, Additive Glows & Clouds (no depth write)
    for (int pass = 0; pass < 2; ++pass) {
        for (auto& inst : _instances) {
            if (inst.entity && !inst.entity->visible) continue;
            auto it = _protoCache.find(inst.protoKey);
            if (it == _protoCache.end()) continue;
            for (const auto& sm : it->second.subMeshes) {
                bool isTrans = sm.isCloud || sm.shader.additive || !sm.shader.zWriteEnable;
                if ((pass == 0 && isTrans) || (pass == 1 && !isTrans)) continue;

                [enc setRenderPipelineState:sm.shader.additive ? _meshAddPSO : _meshPSO];
                [enc setDepthStencilState:isTrans ? _cloudDepthState : _depthState];
                simd_float4x4 localM = sm.localModel;
                if (sm.spinAxis != 0 && sm.spinDegPerSec != 0.0f) {
                    float ang = std::fmod(t * sm.spinDegPerSec, 360.0f);
                    nebula::Mat4 rot = (sm.spinAxis == 1) ? nebula::Mat4::rotateX(ang)
                                     : (sm.spinAxis == 2) ? nebula::Mat4::rotateY(ang)
                                                          : nebula::Mat4::rotateZ(ang);
                    localM = simd_mul(localM, mat4FromNebula(rot));
                }
                simd_float4x4 M = simd_mul(inst.worldMat, localM);
                float alphaCut = sm.shader.alphaTest ? sm.shader.alphaRef : (sm.isCloud ? 0.03f : 0.25f);
                if (sm.shader.additive) alphaCut = 0.0f;
                MeshUniformsCPU u{
                    simd_mul(VP, M), M, VP, sunDir,
                    simd_make_float4(sm.hasTex ? 1.0f : 0.0f, sm.hasDetailTex ? 1.0f : 0.0f, alphaCut, sm.shader.fogEnable ? 1.0f : 0.0f),
                    simd_make_float4(sm.shader.diffuse[0], sm.shader.diffuse[1], sm.shader.diffuse[2], sm.shader.lightEnable ? 1.0f : 0.0f),
                    simd_make_float4(sm.shader.emissive[0], sm.shader.emissive[1], sm.shader.emissive[2], 1.0f),
                    sunCol, ambCol, fogCol, camRightVec, camUpVec,
                    simd_make_float4(windX, windZ, sm.isSway ? (windStr * 0.25f) : 0.0f, sm.isBillboard ? 1.0f : 0.0f)
                };
                [enc setVertexBuffer:sm.vb offset:0 atIndex:0];
                [enc setVertexBytes:&u length:sizeof(u) atIndex:1];
                [enc setFragmentBytes:&u length:sizeof(u) atIndex:1];
                [enc setFragmentTexture:sm.tex atIndex:0];
                [enc setFragmentTexture:sm.detailTex atIndex:1];
                [enc drawIndexedPrimitives:MTLPrimitiveTypeTriangle indexCount:sm.indexCount indexType:MTLIndexTypeUInt16 indexBuffer:sm.ib indexBufferOffset:0];
            }
        }
    }
    [enc setRenderPipelineState:_meshPSO];
    [enc setDepthStencilState:_depthState];

    // 1b. Draw live animated 3D Player Hero + Jetpack (hidden when inside a possessed vehicle/turret)
    if (_playerActive && !_possessedEntity) {
        GpuPrototype* hp = [self getOrLoadPrototype:_player.protoName];
        if (hp) {
            std::vector<nebula::Mat4> skinMats;
            std::vector<nebula::Mat4> worldPose;
            if (hp->hasSkeleton && hp->skeleton.naxLoaded) {
                hp->skeleton.evaluate(_player.currentAnim, t, skinMats, &worldPose);
            }
            float yawDeg = _player.facingYaw * 180.0f / 3.14159265f;
            nebula::Mat4 pm = nebula::Mat4::translate(_player.pos.x, _player.pos.y + 1.0f, _player.pos.z)
                            * nebula::Mat4::rotateY(yawDeg);
            simd_float4x4 PMat = mat4FromNebula(pm);
            for (auto& sm : hp->subMeshes) {
                if (sm.isSkinned && !skinMats.empty()) {
                    std::vector<nebula::MeshVertex> skinned;
                    nebula::skinMeshVertices(sm.bindMesh, skinMats, skinned);
                    std::memcpy(sm.vb.contents, skinned.data(), skinned.size() * sizeof(nebula::MeshVertex));
                }
                simd_float4x4 M = simd_mul(PMat, sm.localModel);
                MeshUniformsCPU u{simd_mul(VP, M), M, VP, sunDir, simd_make_float4(sm.hasTex ? 1.0f : 0.0f, 0, 0.25f, 1.0f)};
                [enc setVertexBuffer:sm.vb offset:0 atIndex:0];
                [enc setVertexBytes:&u length:sizeof(u) atIndex:1];
                [enc setFragmentBytes:&u length:sizeof(u) atIndex:1];
                [enc setFragmentTexture:sm.tex atIndex:0];
                [enc setFragmentTexture:sm.detailTex atIndex:1];
                [enc drawIndexedPrimitives:MTLPrimitiveTypeTriangle indexCount:sm.indexCount indexType:MTLIndexTypeUInt16 indexBuffer:sm.ib indexBufferOffset:0];
            }

            // Attach backpack.n to bone #2 (backbone2_2 / rucksack hardpoint; hero faces -Z, so back is +Z!)
            GpuPrototype* bp = [self getOrLoadPrototype:"backpack"];
            if (bp && worldPose.size() > 2) {
                nebula::Mat4 bpMat = pm * nebula::Mat4::translate(0.0f, -1.0f, 0.0f)
                                   * worldPose[2]
                                   * nebula::Mat4::translate(0.0f, 0.05f, 0.22f);
                simd_float4x4 BMat = mat4FromNebula(bpMat);
                for (const auto& sm : bp->subMeshes) {
                    simd_float4x4 M = simd_mul(BMat, sm.localModel);
                    MeshUniformsCPU u{simd_mul(VP, M), M, VP, sunDir, simd_make_float4(sm.hasTex ? 1.0f : 0.0f, 0, 0.25f, 1.0f)};
                    [enc setVertexBuffer:sm.vb offset:0 atIndex:0];
                    [enc setVertexBytes:&u length:sizeof(u) atIndex:1];
                    [enc setFragmentBytes:&u length:sizeof(u) atIndex:1];
                    [enc setFragmentTexture:sm.tex atIndex:0];
                [enc setFragmentTexture:sm.detailTex atIndex:1];
                    [enc drawIndexedPrimitives:MTLPrimitiveTypeTriangle indexCount:sm.indexCount indexType:MTLIndexTypeUInt16 indexBuffer:sm.ib indexBufferOffset:0];
                }
            }
        }
    }

    // 2. nnature::nClouds sea — only when a mission is loaded
    if (_playerActive) {
        simd_float3 camRight = simd_make_float3(V.columns[0].x, V.columns[1].x, V.columns[2].x);
        simd_float3 camUp    = simd_make_float3(V.columns[0].y, V.columns[1].y, V.columns[2].y);
        std::vector<nnature::CloudVertex> cv;
        std::vector<uint32_t> ci;
        _clouds.gridOrigin = {eye.x, eye.z};
        _clouds.BuildBillboards({eye.x, eye.y, eye.z}, {camRight.x, camRight.y, camRight.z}, {camUp.x, camUp.y, camUp.z}, t, cv, ci);

        // Append glowing combat projectiles & explosions (Module 4)
        if (gRuntime) {
            auto pushGlow = [&](float x, float y, float z, float rad, float r, float g, float b, float a) {
                uint32_t base = static_cast<uint32_t>(cv.size());
                simd_float3 p = simd_make_float3(x, y, z);
                simd_float3 rx = camRight * rad, uy = camUp * rad;
                simd_float3 p0 = p - rx - uy, p1 = p + rx - uy, p2 = p + rx + uy, p3 = p - rx + uy;
                cv.push_back({p0.x, p0.y, p0.z, 0, 1, r, g, b, a});
                cv.push_back({p1.x, p1.y, p1.z, 1, 1, r, g, b, a});
                cv.push_back({p2.x, p2.y, p2.z, 1, 0, r, g, b, a});
                cv.push_back({p3.x, p3.y, p3.z, 0, 0, r, g, b, a});
                ci.insert(ci.end(), {base, base+1, base+2, base, base+2, base+3});
            };
            for (const auto& pr : gRuntime->combat.projectiles) {
                if (pr.faction == 0) pushGlow(pr.px, pr.py, pr.pz, 1.4f, 0.35f, 0.90f, 1.0f, 0.95f);
                else                 pushGlow(pr.px, pr.py, pr.pz, 1.6f, 1.0f, 0.45f, 0.15f, 0.95f);
            }
            for (const auto& ex : gRuntime->combat.explosions) {
                float f = ex.age / std::max(0.01f, ex.maxAge);
                pushGlow(ex.px, ex.py, ex.pz, ex.maxRadius * (0.3f + f * 0.9f), 1.0f, 0.65f * (1.0f - f), 0.15f, 1.0f - f);
            }
            gRuntime->particles.appendBillboards({camRight.x, camRight.y, camRight.z}, {camUp.x, camUp.y, camUp.z}, cv, ci);
        }
        if (!cv.empty()) {
            id<MTLBuffer> cvb = [self.device newBufferWithBytes:cv.data() length:cv.size()*sizeof(nnature::CloudVertex) options:MTLResourceStorageModeShared];
            id<MTLBuffer> cib = [self.device newBufferWithBytes:ci.data() length:ci.size()*sizeof(uint32_t) options:MTLResourceStorageModeShared];
            [enc setRenderPipelineState:_cloudPSO];
            [enc setDepthStencilState:_noDepthWriteState];
            [enc setVertexBuffer:cvb offset:0 atIndex:0];
            [enc setVertexBytes:&VP length:sizeof(VP) atIndex:1];
            [enc drawIndexedPrimitives:MTLPrimitiveTypeTriangle indexCount:ci.size() indexType:MTLIndexTypeUInt32 indexBuffer:cib indexBufferOffset:0];
        }
    }

    // 3. Live Original HUD (if_ebar.n energy bars, if_emptyslot.n belt, crosshair, objective, subtitles)
    if (!menu && _playerActive) {
        [enc setRenderPipelineState:_guiPSO];
        [enc setDepthStencilState:_noDepthWriteState];
        [enc setFragmentSamplerState:_guiSampler atIndex:0];

        // Top-left: Player Energy Bar (if_ebar.n) & Clan Energy Bar
        float eRatio = 1.0f;
        float cRatio = 1.0f;
        if (activeRW && activeRW->userMaennel && activeRW->userMaennel->maxEnergy > 0.0f) {
            eRatio = std::clamp(activeRW->userMaennel->energy / activeRW->userMaennel->maxEnergy, 0.0f, 1.0f);
        }
        if (activeRW && activeRW->userClan && activeRW->userClan->baseMaximum > 0.0f) {
            cRatio = std::clamp(activeRW->userClan->currentEnergy / activeRW->userClan->baseMaximum, 0.0f, 1.0f);
        }
        if (_hudEnergyL && _hudEnergyM && _hudEnergyR) {
            float x0 = -0.96f, y0 = 0.94f, y1 = 0.87f, mw = 0.28f * eRatio;
            [self drawQuad:enc rect:{x0, x0 + 0.04f, y0, y1} tex:_hudEnergyL tint:simd_make_float4(1, 1, 1, 0.92f)];
            [self drawQuad:enc rect:{x0 + 0.04f, x0 + 0.04f + mw, y0, y1} tex:_hudEnergyM tint:simd_make_float4(1, 1, 1, 0.92f)];
            [self drawQuad:enc rect:{x0 + 0.04f + mw, x0 + 0.07f + mw, y0, y1} tex:_hudEnergyR tint:simd_make_float4(1, 1, 1, 0.92f)];
        }
        if (_hudClanL && _hudClanM && _hudClanR) {
            float x0 = -0.96f, y0 = 0.85f, y1 = 0.78f, mw = 0.28f * cRatio;
            [self drawQuad:enc rect:{x0, x0 + 0.04f, y0, y1} tex:_hudClanL tint:simd_make_float4(1, 1, 1, 0.92f)];
            [self drawQuad:enc rect:{x0 + 0.04f, x0 + 0.04f + mw, y0, y1} tex:_hudClanM tint:simd_make_float4(1, 1, 1, 0.92f)];
            [self drawQuad:enc rect:{x0 + 0.04f + mw, x0 + 0.07f + mw, y0, y1} tex:_hudClanR tint:simd_make_float4(1, 1, 1, 0.92f)];
        }

        // Bottom-left: Artifact Belt Quickslots (if_emptyslot.n)
        if (_hudSlot && gRuntime) {
            int filled = static_cast<int>(gRuntime->belt.artefacts.size());
            for (int s = 0; s < 8; ++s) {
                float sx = -0.96f + s * 0.075f;
                simd_float4 tint = (s < filled) ? simd_make_float4(1.3f, 1.05f, 0.4f, 0.95f)
                                                : simd_make_float4(0.75f, 0.80f, 0.88f, 0.65f);
                [self drawQuad:enc rect:{sx, sx + 0.065f, -0.84f, -0.95f} tex:_hudSlot tint:tint];
            }
        }

        // Center: Radial Building Wheel (nHouseMenu, opened with E near any building)
        if (_houseMenu.open && _hudSlot && !_houseMenu.items.empty()) {
            int n = static_cast<int>(_houseMenu.items.size());
            float radX = 0.22f, radY = radX * aspect;
            float sw = 0.055f, sh = sw * aspect;
            for (int i = 0; i < n; ++i) {
                float ang = 1.5707963f - (6.2831853f * i / n);
                float cx = std::cos(ang) * radX;
                float cy = std::sin(ang) * radY;
                bool sel = (i == _houseMenu.selectedIndex);
                simd_float4 tint = sel ? simd_make_float4(1.45f, 1.15f, 0.35f, 0.98f)
                                       : simd_make_float4(0.60f, 0.78f, 0.92f, 0.75f);
                float scale = sel ? 1.25f : 1.0f;
                [self drawQuad:enc rect:{cx - sw*scale, cx + sw*scale, cy + sh*scale, cy - sh*scale} tex:_hudSlot tint:tint];
            }
        }

        // Center: Aiming Crosshair (if_menu.n/crosscross_alpha.ntx)
        if (_hudCrosshair && (!activeRW || !activeRW->activeCineCamera)) {
            float cw = 0.032f, ch = cw * aspect;
            [self drawQuad:enc rect:{-cw, cw, ch, -ch} tex:_hudCrosshair tint:simd_make_float4(1.0f, 0.95f, 0.75f, 0.85f)];
        }

        if (_showObjective && _objectiveTex) {
            nebula::GuiRect objRect{0.35f, 0.98f, 0.96f, 0.72f};
            [self drawQuad:enc rect:objRect tex:_objectiveTex tint:simd_make_float4(1.0f, 1.0f, 1.0f, 0.92f)];
        }
        if (_subtitleTex) {
            nebula::GuiRect subRect{-0.75f, 0.75f, -0.68f, -0.95f};
            [self drawQuad:enc rect:subRect tex:_subtitleTex tint:simd_make_float4(1.0f, 0.96f, 0.86f, 0.96f)];
        }
    }
    if (menu) {
        // Render any 3D nguicharacterentry children using their EXACT .setposition / .setorientation from newmenu.tcl!
        std::vector<nebula::nGuiMenuEntry*> menuEntries;
        menu->collectEntries(menuEntries);
        bool drewAnyChar = false;
        simd_float4x4 charP = makePerspective(60.0f * 3.14159265f / 180.0f, aspect, 0.1f, 50.0f);
        for (auto* ce : menuEntries) {
            if (!ce->isHitboxOnly) continue;
            std::string proto = "char_" + ce->name;
            GpuPrototype* hp = [self getOrLoadPrototype:proto];
            if (!hp || hp->subMeshes.empty()) continue;
            if (!drewAnyChar) {
                [enc setRenderPipelineState:_meshPSO];
                [enc setDepthStencilState:_depthState];
                [enc setFragmentSamplerState:_sampler atIndex:0];
                drewAnyChar = true;
            }
            bool hovered = (_hoveredEntry && _hoveredEntry->name == ce->name);
            std::vector<nebula::Mat4> skinMats;
            if (hp->hasSkeleton && hp->skeleton.naxLoaded) {
                hp->skeleton.evaluate(hovered ? "boden_run" : "boden_stehen", t, skinMats);
            }
            // Exact .setposition & .setorientation from newmenu.tcl (nGuiCharacterEntry 0x1005e47b)
            nebula::Mat4 hm = nebula::Mat4::translate(ce->posX, ce->posY, ce->posZ)
                            * nebula::Mat4::rotateZ(ce->oriZ)
                            * nebula::Mat4::rotateY(ce->oriY)
                            * nebula::Mat4::rotateX(ce->oriX);
            simd_float4x4 H = mat4FromNebula(hm);
            for (auto& sm : hp->subMeshes) {
                if (sm.isSkinned && !skinMats.empty()) {
                    std::vector<nebula::MeshVertex> skinned;
                    nebula::skinMeshVertices(sm.bindMesh, skinMats, skinned);
                    std::memcpy(sm.vb.contents, skinned.data(), skinned.size() * sizeof(nebula::MeshVertex));
                }
                simd_float4x4 M = simd_mul(H, sm.localModel);
                MeshUniformsCPU u{simd_mul(charP, M), M, charP, simd_make_float4(0.3f, 0.6f, 0.8f, 0.0f), simd_make_float4(sm.hasTex ? 1.0f : 0.0f, 0, 0.25f, 0.0f)};
                [enc setVertexBuffer:sm.vb offset:0 atIndex:0];
                [enc setVertexBytes:&u length:sizeof(u) atIndex:1];
                [enc setFragmentBytes:&u length:sizeof(u) atIndex:1];
                [enc setFragmentTexture:sm.tex atIndex:0];
                [enc setFragmentTexture:sm.detailTex atIndex:1];
                [enc drawIndexedPrimitives:MTLPrimitiveTypeTriangle indexCount:sm.indexCount indexType:MTLIndexTypeUInt16 indexBuffer:sm.ib indexBufferOffset:0];
            }
        }

        [enc setRenderPipelineState:_guiPSO];
        [enc setDepthStencilState:_noDepthWriteState];
        [enc setFragmentSamplerState:_guiSampler atIndex:0];

        if (!menu->title.empty()) {
            id<MTLTexture> ttex = [self guiTextureForKey:menu->title];
            [self drawQuad:enc rect:menu->titleRect tex:ttex tint:simd_make_float4(1.0f, 0.96f, 0.85f, 1.0f)];
        }
        std::vector<nebula::nGuiMenuEntry*> entries;
        menu->collectEntries(entries);
        for (auto* e : entries) {
            if (e->isHitboxOnly) continue; // 3D click hitbox only; label is drawn by child nguistandardmenuentry
            id<MTLTexture> etex = [self guiTextureForKey:e->getImageKey()];
            bool hov = (e == _hoveredEntry);
            simd_float4 tint = hov ? simd_make_float4(1.30f, 1.12f, 0.62f, 1.0f)
                                   : simd_make_float4(0.90f, 0.92f, 0.96f, 0.95f);
            nebula::GuiRect r = e->rect;
            if (hov) {
                float dx = (r.maxX() - r.minX()) * 0.03f;
                float dy = (r.maxY() - r.minY()) * 0.03f;
                r = {r.minX() - dx, r.maxX() + dx, r.maxY() + dy, r.minY() - dy};
            }
            [self drawQuad:enc rect:r tex:etex tint:tint];
        }
    }

    [enc endEncoding];
    [cb presentDrawable:drawable];
    [cb commit];
}

@end

// ---------------------------------------------------------------------------
// AppDelegate & Main
// ---------------------------------------------------------------------------
@interface NomadsAppDelegate : NSObject <NSApplicationDelegate>
@property (nonatomic, strong) NSWindow* window;
@end

@implementation NomadsAppDelegate
- (void)applicationDidFinishLaunching:(NSNotification*)note {
    id<MTLDevice> device = MTLCreateSystemDefaultDevice();
    NSRect frame = NSMakeRect(100, 100, 1280, 800);
    self.window = [[NSWindow alloc] initWithContentRect:frame
                                              styleMask:(NSWindowStyleMaskTitled | NSWindowStyleMaskClosable |
                                                         NSWindowStyleMaskResizable | NSWindowStyleMaskMiniaturizable)
                                                backing:NSBackingStoreBuffered
                                                  defer:NO];
    self.window.acceptsMouseMovedEvents = YES;

    NomadsGameView* view = [[NomadsGameView alloc] initWithFrame:frame device:device];
    view.hostWindow = self.window;
    if (gRuntime) gRuntime->view = view;
    [view updateTitle];

    [self.window setContentView:view];
    [self.window makeKeyAndOrderFront:nil];
    [self.window makeFirstResponder:view];
    [NSApp activateIgnoringOtherApps:YES];
}
- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication*)sender { return YES; }
@end

int main(int argc, const char** argv) {
    @autoreleasepool {
        NomadsRuntime rt;
        gRuntime = &rt;
        rt.runDir = "/Users/ovc/Downloads/Проект «Бродяги»/extracted/Run/";
        if (argc > 1) rt.runDir = argv[1];
        if (!rt.runDir.empty() && rt.runDir.back() != '/') rt.runDir += '/';
        rt.localeDir = rt.runDir + "locale/";

        // 1. Register generated 252 classes
        registerAllGeneratedClasses(rt.ks);
        // 2. Override with our real native C++ implementations
        nebula::registerFileServers(rt.ks);
        rt.ks.registerClass("ntclserver", "nroot", []() { return std::make_unique<nebula::nTclServer>(); });
        nebula::registerBookAndEvents(rt.ks);
        nebula::registerCinematics(rt.ks);

        rt.worldHooks.onPlaySound = [](const std::string& p) { playWav(p, p.find("music") != std::string::npos); };
        rt.worldHooks.onWorldLoaded = [&rt]() {
            if (rt.view) [rt.view rebuildWorldInstances];
        };
        rt.worldHooks.onShowSubtitle = [&rt](const std::string& p) {
            if (rt.view) [rt.view showSubtitleBmp:p];
        };
        rt.worldHooks.onHideSubtitle = [&rt]() {
            if (rt.view) [rt.view hideSubtitle];
        };
        nebula::registerWorldSystem(rt.ks, &rt.worldHooks);
        nebula::registerGameplayModule3(rt.ks, &rt.belt);
        nebula::registerCombatModule4(rt.ks);
        nebula::registerIslandAndSaveModule5(rt.ks);
        nebula::registerEconomyAndLightingModule9(rt.ks);
        nebula::registerFlightModule10(rt.ks);
        nebula::registerAudioModule12(rt.ks);
        nebula::registerProductionModule14(rt.ks);
        nebula::registerNetworkModule15(rt.ks);

        rt.guiHooks.onPlaySound = rt.worldHooks.onPlaySound;
        rt.guiHooks.onShowTextMessage = rt.worldHooks.onShowSubtitle;
        rt.guiHooks.onStopGame = []() { [NSApp terminate:nil]; };
        rt.guiHooks.onStartGame = [&rt]() {
            if (rt.tcl) rt.tcl->evalString("nm_mainmenu");
            NSApplication* app = [NSApplication sharedApplication];
            [app setActivationPolicy:NSApplicationActivationPolicyRegular];
            NomadsAppDelegate* del = [[NomadsAppDelegate alloc] init];
            [app setDelegate:del];
            [app run];
        };
        nebula::registerGuiAndWorld(rt.ks, &rt.guiHooks);
        nebula::registerSystemModule16(rt.ks);
        rt.ks.resolveSuperClasses();

        // 3. Create core servers & mount data.npk
        rt.ks.setAssign("home", rt.runDir);
        rt.ks.setAssign("bin", rt.runDir + "bin/win32/");
        rt.ks.newObj("nfileserver", "/sys/servers/file");
        auto* initFs = dynamic_cast<nebula::nFileServer*>(rt.ks.newObj("nnpkfileserver", "/sys/servers/file2"));
        rt.tcl = dynamic_cast<nebula::nTclServer*>(rt.ks.newObj("ntclserver", "/sys/servers/script"));
        rt.ks.newObj("nroot", "/sys/share/arguments");

        if (initFs) {
            initFs->mountNpk(rt.runDir + "data.npk");
            initFs->mountNpk(rt.runDir + "data1.npk");
        }

        // 4. Boot the REAL game!
        std::cout << "=== Booting Project Nomads (Native macOS arm64) ===\n";
        rt.tcl->runScriptFile(rt.runDir + "scripts/demo.tcl");
    }
    return 0;
}
