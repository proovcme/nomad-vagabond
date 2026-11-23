#pragma once
// Clean C++17 native macOS re-implementation of Project Nomads' nnature.dll
// Based on RE specification (spec_nnature.json): 7 classes, 69 script commands.

#include <cmath>
#include <cstdint>
#include <string>
#include <vector>

namespace nnature {

struct Vec2 { float x = 0, y = 0; };
struct Vec3 {
    float x = 0, y = 0, z = 0;
    Vec3 operator+(const Vec3& o) const { return {x + o.x, y + o.y, z + o.z}; }
    Vec3 operator-(const Vec3& o) const { return {x - o.x, y - o.y, z - o.z}; }
    Vec3 operator*(float s) const { return {x * s, y * s, z * s}; }
};
struct Vec4 { float x = 1, y = 1, z = 1, w = 1; };

inline float dot3(const Vec3& a, const Vec3& b) { return a.x*b.x + a.y*b.y + a.z*b.z; }
inline float len3(const Vec3& v) { return std::sqrt(dot3(v, v)); }
inline Vec3 norm3(const Vec3& v) {
    float l = len3(v);
    return l > 1e-6f ? Vec3{v.x/l, v.y/l, v.z/l} : Vec3{0, 1, 0};
}

// ---------------------------------------------------------------------------
// 1. nCloudDescData & nCloudDesc (nnature.dll, sizeof=288, 24 script cmds)
// ---------------------------------------------------------------------------
struct nCloudDescData {
    float altitude       = -60.0f;
    Vec4  foggingColor   = {0.68f, 0.78f, 0.90f, 1.0f};
    float foggingMod     = 0.5f;
    Vec3  size           = {120.0f, 45.0f, 120.0f};
    Vec3  quadOffset     = {0.0f, 0.0f, 0.0f};
    Vec3  offset         = {0.0f, 0.0f, 0.0f};
    Vec3  offsetMod      = {35.0f, 12.0f, 35.0f};
    float offsetSpeed    = 0.15f;
    float opacityMod     = 0.75f;
    float fadeMod        = 1.0f;
    Vec2  gridPosition   = {0.0f, 0.0f};
    Vec2  wind           = {4.0f, 2.0f};
};

class nCloudDesc {
public:
    nCloudDescData data;

    void  SetAltitude(float a)               { data.altitude = a; }
    float GetAltitude() const                { return data.altitude; }
    void  SetFoggingColor(const Vec4& c)     { data.foggingColor = c; }
    Vec4  GetFoggingColor() const            { return data.foggingColor; }
    void  SetFoggingMod(float m)             { data.foggingMod = m; }
    float GetFoggingMod() const              { return data.foggingMod; }
    void  SetSize(const Vec3& s)             { data.size = s; }
    void  SetSizeX(float x)                  { data.size.x = x; }
    void  SetSizeY(float y)                  { data.size.y = y; }
    void  SetSizeZ(float z)                  { data.size.z = z; }
    Vec3  GetSize() const                    { return data.size; }
    void  SetQuadOffset(const Vec3& q)       { data.quadOffset = q; }
    Vec3  GetQuadOffset() const              { return data.quadOffset; }
    void  SetOffsetMod(const Vec3& o)        { data.offsetMod = o; }
    void  SetOffsetModX(float x)             { data.offsetMod.x = x; }
    void  SetOffsetModY(float y)             { data.offsetMod.y = y; }
    void  SetOffsetModZ(float z)             { data.offsetMod.z = z; }
    Vec3  GetOffsetMod() const               { return data.offsetMod; }
    void  SetOffsetSpeed(float s)            { data.offsetSpeed = s; }
    float GetOffsetSpeed() const             { return data.offsetSpeed; }
    void  SetOpacityMod(float o)             { data.opacityMod = o; }
    float GetOpacityMod() const              { return data.opacityMod; }
    void  SetWind(const Vec2& w)             { data.wind = w; }
    Vec2  GetWind() const                    { return data.wind; }
};

// ---------------------------------------------------------------------------
// 2. nClouds (nnature.dll, sizeof=340, 7 script cmds, 50 C++ exports)
// Generates a tiled 2D grid of animated 3D billboard clouds surrounding islands.
// ---------------------------------------------------------------------------
struct CloudVertex {
    float px, py, pz;
    float u, v;
    float r, g, b, a;
};

class nClouds {
public:
    int   layerDensity      = 0;
    float layerSpacing      = 100.0f;
    float layerExtent       = 0.0f;
    float layerNearFadeDist = 150.0f;
    Vec2  gridOrigin        = {0.0f, 0.0f};
    std::vector<nCloudDescData> grid;

    void BeginClouds(int density, float spacing) {
        layerDensity = density;
        layerSpacing = spacing;
        layerExtent  = static_cast<float>(density) * spacing;
        grid.assign(static_cast<size_t>(density * density), nCloudDescData{});
        for (int z = 0; z < density; ++z) {
            for (int x = 0; x < density; ++x) {
                auto& c = grid[z * density + x];
                // Deterministic pseudo-random variation per cloud cell
                uint32_t h = static_cast<uint32_t>(x * 73856093u ^ z * 19349663u);
                auto frand = [&h]() {
                    h = h * 1664525u + 1013904223u;
                    return static_cast<float>((h >> 8) & 0xFFFF) / 65535.0f;
                };
                c.gridPosition = {
                    (x - density * 0.5f) * spacing + (frand() - 0.5f) * spacing * 0.6f,
                    (z - density * 0.5f) * spacing + (frand() - 0.5f) * spacing * 0.6f
                };
                c.altitude   = -45.0f - frand() * 55.0f;
                float s      = 0.75f + frand() * 0.85f;
                c.size       = {130.0f * s, 52.0f * s, 130.0f * s};
                c.opacityMod = 0.35f + frand() * 0.35f;
                c.offset     = {frand() * 6.283f, frand() * 6.283f, frand() * 6.283f};
            }
        }
    }

    void EndClouds() {}

    void  SetLayerNearFadeDist(float d) { layerNearFadeDist = d; }
    int   GetLayerDensity() const       { return layerDensity; }
    float GetLayerSpacing() const       { return layerSpacing; }
    float GetLayerExtent() const        { return layerExtent; }
    float GetLayerNearFadeDist() const  { return layerNearFadeDist; }
    Vec2  GetGridOrigin() const         { return gridOrigin; }

    Vec3 GetCloudWorldPosAt(int x, int z, float timeSec) const {
        const auto& c = grid[z * layerDensity + x];
        float halfExt = layerExtent * 0.5f;
        float wx = c.gridPosition.x + c.wind.x * timeSec;
        float wz = c.gridPosition.y + c.wind.y * timeSec;
        if (layerExtent > 0.0f) {
            wx = std::fmod(wx + halfExt, layerExtent);
            if (wx < 0) wx += layerExtent;
            wx -= halfExt;
            wz = std::fmod(wz + halfExt, layerExtent);
            if (wz < 0) wz += layerExtent;
            wz -= halfExt;
        }
        float wy = c.altitude + std::sin(timeSec * c.offsetSpeed + c.offset.y) * 4.0f;
        return {wx + gridOrigin.x, wy, wz + gridOrigin.y};
    }

    // Builds camera-facing billboard quads for all clouds (ready for Metal/GL)
    void BuildBillboards(const Vec3& camPos, const Vec3& camRight, const Vec3& camUp,
                         float timeSec, std::vector<CloudVertex>& outVerts,
                         std::vector<uint32_t>& outIndices) const {
        outVerts.clear();
        outIndices.clear();
        if (layerDensity <= 0) return;
        outVerts.reserve(grid.size() * 4);
        outIndices.reserve(grid.size() * 6);

        float maxDist = layerExtent * 0.55f;
        for (int z = 0; z < layerDensity; ++z) {
            for (int x = 0; x < layerDensity; ++x) {
                const auto& c = grid[z * layerDensity + x];
                Vec3 pos = GetCloudWorldPosAt(x, z, timeSec);
                float dist = len3(pos - camPos);

                // Near & far radial fade matching nClouds::UpdateFade
                float fade = 1.0f;
                if (dist < layerNearFadeDist)
                    fade *= std::max(0.0f, dist / std::max(1.0f, layerNearFadeDist));
                if (dist > maxDist * 0.65f)
                    fade *= std::max(0.0f, 1.0f - (dist - maxDist * 0.65f) / std::max(1.0f, maxDist * 0.35f));

                float alpha = c.opacityMod * fade;
                if (alpha <= 0.01f) continue;

                float hw = c.size.x * 0.5f;
                float hh = c.size.y * 0.5f;
                Vec3 rx = camRight * hw;
                Vec3 uy = camUp * hh;

                Vec3 p0 = pos - rx - uy;
                Vec3 p1 = pos + rx - uy;
                Vec3 p2 = pos + rx + uy;
                Vec3 p3 = pos - rx + uy;

                uint32_t base = static_cast<uint32_t>(outVerts.size());
                float r = 0.92f, g = 0.95f, b = 1.0f;
                outVerts.push_back({p0.x, p0.y, p0.z, 0.0f, 1.0f, r, g, b, alpha});
                outVerts.push_back({p1.x, p1.y, p1.z, 1.0f, 1.0f, r, g, b, alpha});
                outVerts.push_back({p2.x, p2.y, p2.z, 1.0f, 0.0f, r, g, b, alpha});
                outVerts.push_back({p3.x, p3.y, p3.z, 0.0f, 0.0f, r, g, b, alpha});

                outIndices.push_back(base + 0);
                outIndices.push_back(base + 1);
                outIndices.push_back(base + 2);
                outIndices.push_back(base + 0);
                outIndices.push_back(base + 2);
                outIndices.push_back(base + 3);
            }
        }
    }
};

// ---------------------------------------------------------------------------
// 3. nCloudRender (nnature.dll, sizeof=1440, 14 script cmds)
// ---------------------------------------------------------------------------
class nCloudRender {
public:
    std::string meshNode;
    Vec4  diffuse  = {1, 1, 1, 1};
    Vec4  ambient  = {0.4f, 0.45f, 0.55f, 1};
    Vec4  emissive = {0, 0, 0, 1};
    Vec4  absorb   = {0.1f, 0.1f, 0.15f, 1};
    float radius   = 10.0f;
    float alpha    = 1.0f;

    void SetMeshNode(const std::string& s) { meshNode = s; }
    const std::string& GetMeshNode() const { return meshNode; }
    void SetDiffuse(const Vec4& v)  { diffuse = v; }
    Vec4 GetDiffuse() const         { return diffuse; }
    void SetAmbient(const Vec4& v)  { ambient = v; }
    Vec4 GetAmbient() const         { return ambient; }
    void SetEmissive(const Vec4& v) { emissive = v; }
    Vec4 GetEmissive() const        { return emissive; }
    void SetAbsorb(const Vec4& v)   { absorb = v; }
    Vec4 GetAbsorb() const          { return absorb; }
    void SetRadius(float r)         { radius = r; }
    float GetRadius() const         { return radius; }
    void SetAlpha(float a)          { alpha = a; }
    float GetAlpha() const          { return alpha; }
};

// ---------------------------------------------------------------------------
// 4. nGrassRender (nnature.dll, sizeof=376, 8 script cmds)
// ---------------------------------------------------------------------------
class nGrassRender {
public:
    std::string meshNode;
    float windStrength = 1.0f;
    float windDir      = 0.0f;
    float size         = 1.0f;

    void SetMeshNode(const std::string& s) { meshNode = s; }
    const std::string& GetMeshNode() const { return meshNode; }
    void SetWindStrength(float s)          { windStrength = s; }
    float GetWindStrength() const          { return windStrength; }
    void SetWindDir(float d)               { windDir = d; }
    float GetWindDir() const               { return windDir; }
    void SetSize(float s)                  { size = s; }
    float GetSize() const                  { return size; }
};

// ---------------------------------------------------------------------------
// 5. nLeafRender (nnature.dll, sizeof=372, 6 script cmds)
// ---------------------------------------------------------------------------
class nLeafRender {
public:
    float size         = 0.5f;
    float windStrength = 1.0f;
    float windDir      = 0.0f;

    void SetSize(float s)         { size = s; }
    float GetSize() const         { return size; }
    void SetWindStrength(float s) { windStrength = s; }
    float GetWindStrength() const { return windStrength; }
    void SetWindDir(float d)      { windDir = d; }
    float GetWindDir() const      { return windDir; }
};

// ---------------------------------------------------------------------------
// 6. nMeshSway (nnature.dll, sizeof=288, 10 script cmds)
// Applies wind-driven vertex sway to tree/foliage meshes.
// ---------------------------------------------------------------------------
class nMeshSway {
public:
    bool        readOnly     = false;
    std::string meshNode;
    float       windDir      = 0.0f;
    float       windStrength = 1.0f;
    float       flex         = 0.25f;

    void SetReadOnly(bool b)               { readOnly = b; }
    bool GetReadOnly() const               { return readOnly; }
    void SetMeshNode(const std::string& s) { meshNode = s; }
    const std::string& GetMeshNode() const { return meshNode; }
    void SetWindDir(float d)               { windDir = d; }
    float GetWindDir() const               { return windDir; }
    void SetWindStrength(float s)          { windStrength = s; }
    float GetWindStrength() const          { return windStrength; }
    void SetFlex(float f)                  { flex = f; }
    float GetFlex() const                  { return flex; }

    Vec3 DisplaceVertex(const Vec3& v, float heightFactor, float timeSec) const {
        float phase = timeSec * (1.5f + windStrength * 0.5f) + v.x * 0.3f + v.z * 0.3f;
        float amp = std::sin(phase) * windStrength * flex * heightFactor;
        return {v.x + std::cos(windDir) * amp, v.y, v.z + std::sin(windDir) * amp};
    }
};

// ---------------------------------------------------------------------------
// 7. nGroundPlane (nnature.dll, sizeof=204, 0 script cmds)
// Infinite horizon plane below the floating islands.
// ---------------------------------------------------------------------------
class nGroundPlane {
public:
    float altitude = -200.0f;
    float extent   = 4000.0f;
    Vec4  color    = {0.42f, 0.58f, 0.78f, 1.0f};
};

} // namespace nnature
