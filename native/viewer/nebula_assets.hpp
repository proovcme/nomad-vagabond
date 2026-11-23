#pragma once
// Native C++17 parsers for Project Nomads / Nebula Device 1 binary formats:
//   - NPK0 (data.npk archive)
//   - NVX1 (.nvx vertex/index meshes)
//   - NTX1 (.ntx R5G6B5 & A4R4G4B4 textures)
//   - NOB0 (_main.n binary scene graphs)

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <cstring>
#include <fstream>
#include <iostream>
#include <map>
#include <memory>
#include <string>
#include <unordered_map>
#include <vector>

namespace nebula {

struct Mat4 {
    float m[16]; // column-major

    static Mat4 identity() {
        Mat4 r{};
        r.m[0] = r.m[5] = r.m[10] = r.m[15] = 1.0f;
        return r;
    }

    static Mat4 translate(float x, float y, float z) {
        Mat4 r = identity();
        r.m[12] = x; r.m[13] = y; r.m[14] = z;
        return r;
    }

    static Mat4 scale(float x, float y, float z) {
        Mat4 r{};
        r.m[0] = x; r.m[5] = y; r.m[10] = z; r.m[15] = 1.0f;
        return r;
    }

    static Mat4 rotateX(float deg) {
        float rad = deg * 3.1415926535f / 180.0f;
        float c = std::cos(rad), s = std::sin(rad);
        Mat4 r = identity();
        r.m[5] = c; r.m[6] = s; r.m[9] = -s; r.m[10] = c;
        return r;
    }

    static Mat4 rotateY(float deg) {
        float rad = deg * 3.1415926535f / 180.0f;
        float c = std::cos(rad), s = std::sin(rad);
        Mat4 r = identity();
        r.m[0] = c; r.m[2] = -s; r.m[8] = s; r.m[10] = c;
        return r;
    }

    static Mat4 rotateZ(float deg) {
        float rad = deg * 3.1415926535f / 180.0f;
        float c = std::cos(rad), s = std::sin(rad);
        Mat4 r = identity();
        r.m[0] = c; r.m[1] = s; r.m[4] = -s; r.m[5] = c;
        return r;
    }

    static Mat4 fromQuat(float x, float y, float z, float w) {
        float xx = x*x, yy = y*y, zz = z*z;
        float xy = x*y, xz = x*z, yz = y*z;
        float wx = w*x, wy = w*y, wz = w*z;
        Mat4 r = identity();
        r.m[0]  = 1 - 2*(yy + zz); r.m[1]  = 2*(xy + wz);     r.m[2]  = 2*(xz - wy);
        r.m[4]  = 2*(xy - wz);     r.m[5]  = 1 - 2*(xx + zz); r.m[6]  = 2*(yz + wx);
        r.m[8]  = 2*(xz + wy);     r.m[9]  = 2*(yz - wx);     r.m[10] = 1 - 2*(xx + yy);
        return r;
    }

    Mat4 operator*(const Mat4& b) const {
        Mat4 r{};
        for (int col = 0; col < 4; ++col) {
            for (int row = 0; row < 4; ++row) {
                float sum = 0.0f;
                for (int k = 0; k < 4; ++k)
                    sum += m[k*4 + row] * b.m[col*4 + k];
                r.m[col*4 + row] = sum;
            }
        }
        return r;
    }
};

// ---------------------------------------------------------------------------
// NPK0 Archive Reader
// ---------------------------------------------------------------------------
class NpkArchive {
public:
    struct Entry {
        uint64_t offset;
        uint32_t size;
    };

    std::string path;
    std::unordered_map<std::string, Entry> entries;
    std::vector<std::string> sceneDirs;   // e.g. "first_island.n"
    std::vector<std::string> islandDirs;  // subset containing "island"

    bool open(const std::string& npkPath) {
        path = npkPath;
        std::ifstream f(npkPath, std::ios::binary);
        if (!f) return false;

        char magic[4];
        uint32_t blockLen = 0, dataStart = 0;
        f.read(magic, 4);
        f.read(reinterpret_cast<char*>(&blockLen), 4);
        f.read(reinterpret_cast<char*>(&dataStart), 4);
        if (std::memcmp(magic, "0KPN", 4) != 0) return false;

        std::vector<std::string> stack;
        std::map<std::string, bool> scenesSet;
        while (static_cast<uint64_t>(f.tellg()) < dataStart + 8) {
            char tag[4];
            uint32_t len = 0;
            if (!f.read(tag, 4) || !f.read(reinterpret_cast<char*>(&len), 4)) break;
            if (std::memcmp(tag, "_RID", 4) == 0) {
                uint16_t nlen = 0;
                f.read(reinterpret_cast<char*>(&nlen), 2);
                std::string name(nlen, '\0');
                f.read(&name[0], nlen);
                stack.push_back(name);
            } else if (std::memcmp(tag, "DNED", 4) == 0) {
                if (!stack.empty()) stack.pop_back();
            } else if (std::memcmp(tag, "ELIF", 4) == 0) {
                uint32_t foff = 0, flen = 0;
                uint16_t nlen = 0;
                f.read(reinterpret_cast<char*>(&foff), 4);
                f.read(reinterpret_cast<char*>(&flen), 4);
                f.read(reinterpret_cast<char*>(&nlen), 2);
                std::string name(nlen, '\0');
                f.read(&name[0], nlen);

                std::string full;
                for (const auto& s : stack) full += s + "/";
                full += name;
                std::string low = toLower(full);
                entries[low] = {static_cast<uint64_t>(dataStart) + 8 + foff, flen};

                if (name == "_main.n" && stack.size() >= 2 && stack[0] == "data.n") {
                    scenesSet[stack[1]] = true;
                }
            } else if (std::memcmp(tag, "ATAD", 4) == 0) {
                break;
            } else {
                break;
            }
        }

        for (const auto& kv : scenesSet) {
            sceneDirs.push_back(kv.first);
            if (toLower(kv.first).find("island") != std::string::npos ||
                toLower(kv.first).find("wolkentor") != std::string::npos) {
                islandDirs.push_back(kv.first);
            }
        }
        return !entries.empty();
    }

    bool readFile(const std::string& virtualPath, std::vector<uint8_t>& out) const {
        std::string key = normalizePath(virtualPath);
        auto it = entries.find(key);
        if (it == entries.end()) return false;
        std::ifstream f(path, std::ios::binary);
        if (!f) return false;
        f.seekg(static_cast<std::streamoff>(it->second.offset));
        out.resize(it->second.size);
        f.read(reinterpret_cast<char*>(out.data()), it->second.size);
        return true;
    }

    static std::string toLower(std::string s) {
        std::transform(s.begin(), s.end(), s.begin(), [](unsigned char c) { return std::tolower(c); });
        return s;
    }

    static std::string normalizePath(std::string p) {
        p = toLower(p);
        std::replace(p.begin(), p.end(), '\\', '/');
        if (p.rfind("data:", 0) == 0) {
            p = "data.n/" + p.substr(5);
        } else if (p.rfind("lib:", 0) == 0) {
            p = "data.n/lib/" + p.substr(4);
        }
        return p;
    }
};

// ---------------------------------------------------------------------------
// NVX1 Mesh Loader
// ---------------------------------------------------------------------------
struct MeshVertex {
    float px, py, pz;
    float nx, ny, nz;
    float u, v;
};

struct SkinWeight {
    uint16_t joints[4]  = {65535, 65535, 65535, 65535};
    float    weights[4] = {0, 0, 0, 0};
};

struct MeshData {
    std::vector<MeshVertex> vertices;
    std::vector<SkinWeight> skinWeights; // populated when NVX1 vfmt & 0x80
    std::vector<uint16_t>   indices;
    bool                    isBillboard = false; // true when expanded from numIndices==0 point-sprites
};

inline bool parseNvx(const std::vector<uint8_t>& buf, MeshData& out, float spriteRadius = 2.2f) {
    if (buf.size() < 28 || std::memcmp(buf.data(), "1XVN", 4) != 0) return false;
    uint32_t hdr[6];
    std::memcpy(hdr, buf.data() + 4, 24);
    uint32_t numVerts = hdr[0];
    uint32_t numIndices = hdr[1];
    uint32_t numWinged = hdr[2];
    uint32_t vfmt = hdr[3];
    uint32_t dataStart = hdr[4];
    uint32_t dataSize = hdr[5];

    if (numVerts == 0) return false;
    if (dataStart + dataSize > buf.size()) return false;

    uint32_t stride = 0;
    if (vfmt & 0x01) stride += 12; // coord
    if (vfmt & 0x02) stride += 12; // norm
    if (vfmt & 0x04) stride += 4;  // rgba
    if (vfmt & 0x08) stride += 8;  // uv0
    if (vfmt & 0x10) stride += 8;  // uv1
    if (vfmt & 0x20) stride += 8;  // uv2
    if (vfmt & 0x40) stride += 8;  // uv3
    if (vfmt & 0x80) stride += 24; // 4x u16 joint indices + 4x float weights

    uint64_t vertsBytes = static_cast<uint64_t>(numVerts) * stride;
    uint64_t wingedBytes = static_cast<uint64_t>(numWinged) * 8;
    uint64_t idxBytes = static_cast<uint64_t>(numIndices) * 2;
    if (vertsBytes + wingedBytes + idxBytes > dataSize) return false;

    const uint8_t* ptr = buf.data() + dataStart;
    out.vertices.resize(numVerts);
    if (vfmt & 0x80) out.skinWeights.resize(numVerts);
    for (uint32_t i = 0; i < numVerts; ++i) {
        const uint8_t* vp = ptr + i * stride;
        MeshVertex v{0, 0, 0, 0, 1, 0, 0, 0};
        if (vfmt & 0x01) { std::memcpy(&v.px, vp, 12); vp += 12; }
        if (vfmt & 0x02) { std::memcpy(&v.nx, vp, 12); vp += 12; }
        if (vfmt & 0x04) { vp += 4; }
        if (vfmt & 0x08) { std::memcpy(&v.u, vp, 8); vp += 8; }
        if (vfmt & 0x10) { vp += 8; }
        if (vfmt & 0x20) { vp += 8; }
        if (vfmt & 0x40) { vp += 8; }
        if (vfmt & 0x80) {
            std::memcpy(out.skinWeights[i].joints, vp, 8);
            std::memcpy(out.skinWeights[i].weights, vp + 8, 16);
        }
        out.vertices[i] = v;
    }

    // Point-sprite NVX1 (nLeafRender foliage & nCloudRender wolke10 have numIndices == 0!)
    // Emit 1 GPU camera-facing billboard quad per sprite:
    //   pos  = sprite center in local space
    //   norm = (cornerX, cornerY, radius) expanded in mesh_vs along camRight / camUp!
    if (numIndices == 0) {
        std::vector<MeshVertex> centers = std::move(out.vertices);
        out.vertices.clear();
        out.indices.clear();
        out.isBillboard = true;
        size_t maxSprites = std::min<size_t>(centers.size(), 8000);
        out.vertices.reserve(maxSprites * 4);
        out.indices.reserve(maxSprites * 6);
        const float r = spriteRadius;
        for (size_t i = 0; i < maxSprites; ++i) {
            const auto& c = centers[i];
            uint16_t base = static_cast<uint16_t>(out.vertices.size());
            if (base + 4 >= 65530) break;
            out.vertices.push_back({c.px, c.py, c.pz, -1.0f, -1.0f, r, 0.0f, 1.0f});
            out.vertices.push_back({c.px, c.py, c.pz,  1.0f, -1.0f, r, 1.0f, 1.0f});
            out.vertices.push_back({c.px, c.py, c.pz,  1.0f,  1.0f, r, 1.0f, 0.0f});
            out.vertices.push_back({c.px, c.py, c.pz, -1.0f,  1.0f, r, 0.0f, 0.0f});
            out.indices.insert(out.indices.end(), {base, uint16_t(base+1), uint16_t(base+2), base, uint16_t(base+2), uint16_t(base+3)});
        }
        return !out.indices.empty();
    }

    const uint8_t* iptr = ptr + vertsBytes + wingedBytes;
    out.indices.resize(numIndices);
    std::memcpy(out.indices.data(), iptr, idxBytes);

    // Compute flat/smooth normals if mesh had no normals
    if (!(vfmt & 0x02)) {
        for (auto& v : out.vertices) { v.nx = v.ny = v.nz = 0; }
        for (size_t i = 0; i + 2 < out.indices.size(); i += 3) {
            auto& a = out.vertices[out.indices[i]];
            auto& b = out.vertices[out.indices[i+1]];
            auto& c = out.vertices[out.indices[i+2]];
            float ux = b.px - a.px, uy = b.py - a.py, uz = b.pz - a.pz;
            float vx = c.px - a.px, vy = c.py - a.py, vz = c.pz - a.pz;
            float nx = uy*vz - uz*vy, ny = uz*vx - ux*vz, nz = ux*vy - uy*vx;
            a.nx += nx; a.ny += ny; a.nz += nz;
            b.nx += nx; b.ny += ny; b.nz += nz;
            c.nx += nx; c.ny += ny; c.nz += nz;
        }
        for (auto& v : out.vertices) {
            float l = std::sqrt(v.nx*v.nx + v.ny*v.ny + v.nz*v.nz);
            if (l > 1e-6f) { v.nx /= l; v.ny /= l; v.nz /= l; }
            else { v.ny = 1.0f; }
        }
    }
    return true;
}

// ---------------------------------------------------------------------------
// NTX1 Texture Decoder (R5G6B5 & A4R4G4B4 -> RGBA8)
// ---------------------------------------------------------------------------
struct TextureData {
    uint32_t width = 0;
    uint32_t height = 0;
    bool hasAlpha = false;
    std::vector<uint8_t> rgba;
};

inline bool parseNtx(const std::vector<uint8_t>& buf, TextureData& out) {
    if (buf.size() < 40 || std::memcmp(buf.data(), "1XTN", 4) != 0) return false;
    uint32_t numBlocks = 0;
    std::memcpy(&numBlocks, buf.data() + 4, 4);
    if (numBlocks == 0) return false;

    uint32_t blk[8];
    std::memcpy(blk, buf.data() + 8, 32);
    uint32_t fmt = blk[0];
    uint32_t w = blk[2], h = blk[3];
    uint32_t dataOff = blk[6], dataSz = blk[7];
    if (w == 0 || h == 0 || dataOff + dataSz > buf.size()) return false;

    out.width = w;
    out.height = h;
    out.rgba.resize(static_cast<size_t>(w) * h * 4);
    const uint8_t* src = buf.data() + dataOff;

    if (fmt == 3) { // R5G6B5
        out.hasAlpha = false;
        for (uint32_t i = 0; i < w * h; ++i) {
            uint16_t p = static_cast<uint16_t>(src[i*2] | (src[i*2+1] << 8));
            uint8_t r = static_cast<uint8_t>(((p >> 11) & 0x1F) * 255 / 31);
            uint8_t g = static_cast<uint8_t>(((p >> 5)  & 0x3F) * 255 / 63);
            uint8_t b = static_cast<uint8_t>((p & 0x1F) * 255 / 31);
            out.rgba[i*4 + 0] = r;
            out.rgba[i*4 + 1] = g;
            out.rgba[i*4 + 2] = b;
            out.rgba[i*4 + 3] = 255;
        }
        return true;
    } else if (fmt == 4) { // A4R4G4B4
        out.hasAlpha = true;
        for (uint32_t i = 0; i < w * h; ++i) {
            uint16_t p = static_cast<uint16_t>(src[i*2] | (src[i*2+1] << 8));
            uint8_t a = static_cast<uint8_t>(((p >> 12) & 0x0F) * 17);
            uint8_t r = static_cast<uint8_t>(((p >> 8)  & 0x0F) * 17);
            uint8_t g = static_cast<uint8_t>(((p >> 4)  & 0x0F) * 17);
            uint8_t b = static_cast<uint8_t>((p & 0x0F) * 17);
            out.rgba[i*4 + 0] = r;
            out.rgba[i*4 + 1] = g;
            out.rgba[i*4 + 2] = b;
            out.rgba[i*4 + 3] = a;
        }
        return true;
    }
    return false;
}

// ---------------------------------------------------------------------------
// Real nShaderNode Library Parser (data.n/shaders.n/_main.n — all 226 shaders!)
// Exact FourCCs verified from nnebula/nshadernode.asm & shaders.n/_main.n:
//   SDIF (diffuse), SEMV (emissive), SAMB (ambient), SLEN (lightEnable),
//   SAEN (alphaEnable), SZEN (zWriteEnable), SFEN (fogEnable),
//   SABL (alphaBlend src/dst), SCMD (cullMode), SATE (alphaTest), SARF (alphaRef)
// ---------------------------------------------------------------------------
struct ShaderDesc {
    std::string name;
    float diffuse[4]  = {1.0f, 1.0f, 1.0f, 1.0f};
    float emissive[4] = {0.0f, 0.0f, 0.0f, 0.0f};
    float ambient[4]  = {1.0f, 1.0f, 1.0f, 1.0f};
    bool  lightEnable = true;
    bool  alphaEnable = false;
    bool  zWriteEnable = true;
    bool  fogEnable   = true;
    bool  alphaTest   = false;
    float alphaRef    = 0.25f;
    bool  additive    = false; // SABL dst == "one"
    bool  twoSided    = false; // SCMD == "none"
};

using ShaderLibrary = std::unordered_map<std::string, ShaderDesc>;

inline size_t parseShaderLibrary(const std::vector<uint8_t>& buf, ShaderLibrary& outLib) {
    if (buf.size() < 8 || std::memcmp(buf.data(), "0BON", 4) != 0) return 0;
    size_t pos = 4;
    uint16_t hlen = 0;
    std::memcpy(&hlen, buf.data() + pos, 2);
    pos += 2 + hlen;

    auto readStr = [&](std::string& s) -> bool {
        if (pos + 2 > buf.size()) return false;
        uint16_t l = 0; std::memcpy(&l, buf.data() + pos, 2); pos += 2;
        if (pos + l > buf.size()) return false;
        s.assign(reinterpret_cast<const char*>(buf.data() + pos), l);
        pos += l;
        return true;
    };

    size_t count = 0;
    ShaderDesc* cur = nullptr;
    int depth = 0, shaderDepth = -1;

    while (pos + 4 <= buf.size()) {
        char fcc[5] = {0};
        std::memcpy(fcc, buf.data() + pos, 4);
        pos += 4;
        if (std::memcmp(fcc, "wen_", 4) == 0) {
            std::string cls, name;
            if (!readStr(cls) || !readStr(name)) break;
            depth++;
            if (NpkArchive::toLower(cls) == "nshadernode") {
                std::string key = NpkArchive::toLower(name);
                ShaderDesc sd;
                sd.name = key;
                auto [it, _] = outLib.emplace(key, std::move(sd));
                cur = &it->second;
                shaderDepth = depth;
                count++;
            }
        } else if (std::memcmp(fcc, "les_", 4) == 0) {
            std::string path;
            if (!readStr(path)) break;
            if (depth == shaderDepth) { cur = nullptr; shaderDepth = -1; }
            if (depth > 0) depth--;
        } else {
            if (pos + 2 > buf.size()) break;
            uint16_t plen = 0; std::memcpy(&plen, buf.data() + pos, 2); pos += 2;
            if (pos + plen > buf.size()) break;
            if (cur && depth == shaderDepth) {
                const uint8_t* p = buf.data() + pos;
                if (std::memcmp(fcc, "FIDS", 4) == 0 && plen >= 16) std::memcpy(cur->diffuse, p, 16);
                else if (std::memcmp(fcc, "VMES", 4) == 0 && plen >= 16) std::memcpy(cur->emissive, p, 16);
                else if (std::memcmp(fcc, "BMAS", 4) == 0 && plen >= 16) std::memcpy(cur->ambient, p, 16);
                else if (std::memcmp(fcc, "NELS", 4) == 0 && plen >= 1) cur->lightEnable = (p[0] != 0);
                else if (std::memcmp(fcc, "NEAS", 4) == 0 && plen >= 1) cur->alphaEnable = (p[0] != 0);
                else if (std::memcmp(fcc, "NEZS", 4) == 0 && plen >= 1) cur->zWriteEnable = (p[0] != 0);
                else if (std::memcmp(fcc, "NEFS", 4) == 0 && plen >= 1) cur->fogEnable = (p[0] != 0);
                else if (std::memcmp(fcc, "ETAS", 4) == 0 && plen >= 1) cur->alphaTest = (p[0] != 0);
                else if (std::memcmp(fcc, "FRAS", 4) == 0 && plen >= 4) std::memcpy(&cur->alphaRef, p, 4);
                else if (std::memcmp(fcc, "LBAS", 4) == 0 && plen >= 4) {
                    // Two length-prefixed strings: src, dst
                    uint16_t l1 = 0; std::memcpy(&l1, p, 2);
                    if (2 + l1 + 2 <= plen) {
                        uint16_t l2 = 0; std::memcpy(&l2, p + 2 + l1, 2);
                        if (4 + l1 + l2 <= plen) {
                            std::string dst(reinterpret_cast<const char*>(p + 4 + l1), l2);
                            if (NpkArchive::toLower(dst) == "one") cur->additive = true;
                        }
                    }
                } else if (std::memcmp(fcc, "DMCS", 4) == 0 && plen >= 2) {
                    uint16_t l1 = 0; std::memcpy(&l1, p, 2);
                    if (2 + l1 <= plen) {
                        std::string cm(reinterpret_cast<const char*>(p + 2), l1);
                        if (NpkArchive::toLower(cm) == "none") cur->twoSided = true;
                    }
                }
            }
            pos += plen;
        }
    }
    return count;
}

// ---------------------------------------------------------------------------
// Real nIpol Curve & Weather Curves Parser (data.n/weather_normal.n/_main.n)
// Verified against nnebula/nipol.asm & weather_normal.n/_main.n:
//   SK1F (i, t, x), SK2F (i, t, x, y), SK3F (i, t, x, y, z), SK4F (i, t, r, g, b, a)
// ---------------------------------------------------------------------------
struct IpolKey {
    float t = 0.0f;
    float v[4] = {0, 0, 0, 0};
};

struct IpolCurve {
    std::vector<IpolKey> keys;
    bool loop = true;

    bool sample(float timeSec, float out[4]) const {
        if (keys.empty()) return false;
        if (keys.size() == 1) {
            for (int i = 0; i < 4; ++i) out[i] = keys[0].v[i];
            return true;
        }
        float dur = keys.back().t;
        float t = timeSec;
        if (loop && dur > 1e-4f) {
            t = std::fmod(t, dur);
            if (t < 0.0f) t += dur;
        }
        if (t <= keys.front().t) {
            for (int i = 0; i < 4; ++i) out[i] = keys.front().v[i];
            return true;
        }
        if (t >= dur) {
            for (int i = 0; i < 4; ++i) out[i] = keys.back().v[i];
            return true;
        }
        for (size_t i = 0; i + 1 < keys.size(); ++i) {
            if (t >= keys[i].t && t <= keys[i + 1].t) {
                float span = keys[i + 1].t - keys[i].t;
                float u = (span > 1e-5f) ? ((t - keys[i].t) / span) : 0.0f;
                for (int c = 0; c < 4; ++c) {
                    out[c] = keys[i].v[c] + (keys[i + 1].v[c] - keys[i].v[c]) * u;
                }
                return true;
            }
        }
        return false;
    }
};

struct WeatherCurves {
    IpolCurve sunColor;   // licht1_color
    IpolCurve ambColor;   // amb_color
    IpolCurve fogColor;   // fog_color
    IpolCurve fogRange;   // fog_rangeani (start, end)
    bool loaded = false;
};

inline bool parseWeatherCurves(const std::vector<uint8_t>& buf, WeatherCurves& out) {
    if (buf.size() < 8 || std::memcmp(buf.data(), "0BON", 4) != 0) return false;
    size_t pos = 4;
    uint16_t hlen = 0; std::memcpy(&hlen, buf.data() + pos, 2); pos += 2 + hlen;

    auto readStr = [&](std::string& s) -> bool {
        if (pos + 2 > buf.size()) return false;
        uint16_t l = 0; std::memcpy(&l, buf.data() + pos, 2); pos += 2;
        if (pos + l > buf.size()) return false;
        s.assign(reinterpret_cast<const char*>(buf.data() + pos), l);
        pos += l;
        return true;
    };

    IpolCurve* cur = nullptr;
    int depth = 0, ipolDepth = -1;
    while (pos + 4 <= buf.size()) {
        char fcc[5] = {0}; std::memcpy(fcc, buf.data() + pos, 4); pos += 4;
        if (std::memcmp(fcc, "wen_", 4) == 0) {
            std::string cls, name;
            if (!readStr(cls) || !readStr(name)) break;
            depth++;
            if (NpkArchive::toLower(cls) == "nipol") {
                std::string nl = NpkArchive::toLower(name);
                if (nl == "licht1_color") { cur = &out.sunColor; ipolDepth = depth; }
                else if (nl == "amb_color") { cur = &out.ambColor; ipolDepth = depth; }
                else if (nl == "fog_color") { cur = &out.fogColor; ipolDepth = depth; }
                else if (nl == "fog_rangeani") { cur = &out.fogRange; ipolDepth = depth; }
            }
        } else if (std::memcmp(fcc, "les_", 4) == 0) {
            std::string path; if (!readStr(path)) break;
            if (depth == ipolDepth) { cur = nullptr; ipolDepth = -1; }
            if (depth > 0) depth--;
        } else {
            if (pos + 2 > buf.size()) break;
            uint16_t plen = 0; std::memcpy(&plen, buf.data() + pos, 2); pos += 2;
            if (pos + plen > buf.size()) break;
            if (cur && depth == ipolDepth) {
                const uint8_t* p = buf.data() + pos;
                if (std::memcmp(fcc, "F4KS", 4) == 0 && plen >= 24) {
                    IpolKey k;
                    std::memcpy(&k.t, p + 4, 4);
                    std::memcpy(k.v, p + 8, 16);
                    cur->keys.push_back(k);
                } else if (std::memcmp(fcc, "F2KS", 4) == 0 && plen >= 16) {
                    IpolKey k;
                    std::memcpy(&k.t, p + 4, 4);
                    std::memcpy(k.v, p + 8, 8);
                    cur->keys.push_back(k);
                }
            }
            pos += plen;
        }
    }
    out.loaded = !out.sunColor.keys.empty() || !out.fogColor.keys.empty();
    return out.loaded;
}

// ---------------------------------------------------------------------------
// NOB0 Binary Scene Graph Parser (_main.n)
// ---------------------------------------------------------------------------
struct SceneDrawItem {
    std::string meshPath;
    std::string texPath;
    std::string detailTexPath;
    std::string shaderName;
    Mat4 worldMatrix = Mat4::identity();
    bool isCloud = false;
    bool isSway  = false;
    int   spinAxis = 0;       // 0=none, 1=X, 2=Y, 3=Z (from nIpol rot* children)
    float spinDegPerSec = 0.0f;
};

struct ParsedJoint {
    int index = 0;
    std::string name;
    int parentIndex = -1;
    float tx = 0, ty = 0, tz = 0;
    float qx = 0, qy = 0, qz = 0, qw = 1;
};

struct ParsedCharacterRig {
    std::string animFile;
    std::vector<ParsedJoint> joints;
};

struct NobNode {
    std::string cls;
    std::string name;
    NobNode* parent = nullptr;
    std::vector<std::unique_ptr<NobNode>> children;

    float tx = 0, ty = 0, tz = 0;
    float rx = 0, ry = 0, rz = 0;
    float sx = 1, sy = 1, sz = 1;
    bool  hasQuat = false;
    float qx = 0, qy = 0, qz = 0, qw = 1;

    std::string meshFile;
    std::string texFile;
    std::string detailTexFile;
    std::string linkTarget;
    std::string ipolConnect;
    float ipolKey0T = 0.0f, ipolKey0V = 0.0f;
    float ipolKey1T = 0.0f, ipolKey1V = 0.0f;
    int   ipolKeyCount = 0;
    bool readOnly = false;
};

inline bool parseNobScene(const std::vector<uint8_t>& buf, std::vector<SceneDrawItem>& outItems,
                          ParsedCharacterRig* outRig = nullptr) {
    if (buf.size() < 8 || std::memcmp(buf.data(), "0BON", 4) != 0) return false;
    size_t pos = 4;
    uint16_t hlen = 0;
    std::memcpy(&hlen, buf.data() + pos, 2);
    pos += 2 + hlen;

    auto root = std::make_unique<NobNode>();
    root->cls = "nroot";
    root->name = "root";
    NobNode* cur = root.get();

    auto readStr = [&](std::string& s) -> bool {
        if (pos + 2 > buf.size()) return false;
        uint16_t l = 0;
        std::memcpy(&l, buf.data() + pos, 2);
        pos += 2;
        if (pos + l > buf.size()) return false;
        s.assign(reinterpret_cast<const char*>(buf.data() + pos), l);
        pos += l;
        return true;
    };

    while (pos + 4 <= buf.size()) {
        char fcc[5] = {
            static_cast<char>(buf[pos+3]),
            static_cast<char>(buf[pos+2]),
            static_cast<char>(buf[pos+1]),
            static_cast<char>(buf[pos+0]),
            '\0'
        };
        pos += 4;
        std::string tag(fcc);

        if (tag == "_new") {
            std::string cls, name;
            if (!readStr(cls) || !readStr(name)) break;
            auto child = std::make_unique<NobNode>();
            child->cls = cls;
            child->name = name;
            child->parent = cur;
            cur->children.push_back(std::move(child));
            cur = cur->children.back().get();
        } else if (tag == "_sel") {
            std::string path;
            if (!readStr(path)) break;
            if (path == ".." && cur->parent) {
                cur = cur->parent;
            }
        } else {
            if (pos + 2 > buf.size()) break;
            uint16_t plen = 0;
            std::memcpy(&plen, buf.data() + pos, 2);
            pos += 2;
            if (pos + plen > buf.size()) break;
            const uint8_t* pl = buf.data() + pos;

            if (tag == "TXYZ" && plen >= 12) {
                std::memcpy(&cur->tx, pl, 4);
                std::memcpy(&cur->ty, pl + 4, 4);
                std::memcpy(&cur->tz, pl + 8, 4);
            } else if (tag == "RXYZ" && plen >= 12) {
                std::memcpy(&cur->rx, pl, 4);
                std::memcpy(&cur->ry, pl + 4, 4);
                std::memcpy(&cur->rz, pl + 8, 4);
            } else if (tag == "SXYZ" && plen >= 12) {
                std::memcpy(&cur->sx, pl, 4);
                std::memcpy(&cur->sy, pl + 4, 4);
                std::memcpy(&cur->sz, pl + 8, 4);
            } else if (tag == "QXYZW" && plen >= 16) {
                cur->hasQuat = true;
                std::memcpy(&cur->qx, pl, 4);
                std::memcpy(&cur->qy, pl + 4, 4);
                std::memcpy(&cur->qz, pl + 8, 4);
                std::memcpy(&cur->qw, pl + 12, 4);
            } else if (tag == "SFLN" && plen >= 2) {
                uint16_t sl = 0;
                std::memcpy(&sl, pl, 2);
                if (2 + sl <= plen) cur->meshFile.assign(reinterpret_cast<const char*>(pl + 2), sl);
            } else if (tag == "STXT" && plen >= 6) {
                uint32_t stage = 0;
                uint16_t sl = 0;
                std::memcpy(&stage, pl, 4);
                std::memcpy(&sl, pl + 4, 2);
                if (6 + sl <= plen) {
                    std::string tf(reinterpret_cast<const char*>(pl + 6), sl);
                    if (stage == 0) cur->texFile = std::move(tf);
                    else if (stage == 1) cur->detailTexFile = std::move(tf);
                }
            } else if (tag == "SRDO" && plen >= 1) {
                cur->readOnly = (pl[0] != 0);
            } else if (tag == "STGT" && plen >= 2) {
                uint16_t sl = 0;
                std::memcpy(&sl, pl, 2);
                if (2 + sl <= plen) cur->linkTarget.assign(reinterpret_cast<const char*>(pl + 2), sl);
            } else if (tag == "CNCT" && plen >= 2) {
                uint16_t sl = 0;
                std::memcpy(&sl, pl, 2);
                if (2 + sl <= plen) cur->ipolConnect.assign(reinterpret_cast<const char*>(pl + 2), sl);
            } else if (tag == "SK1F" && plen >= 12) {
                float kt = 0.0f, kv = 0.0f;
                std::memcpy(&kt, pl + 4, 4);
                std::memcpy(&kv, pl + 8, 4);
                if (cur->ipolKeyCount == 0) { cur->ipolKey0T = kt; cur->ipolKey0V = kv; }
                else { cur->ipolKey1T = kt; cur->ipolKey1V = kv; }
                cur->ipolKeyCount++;
            } else if (outRig && tag == "SANF" && plen >= 2) {
                uint16_t sl = 0;
                std::memcpy(&sl, pl, 2);
                if (2 + sl <= plen) outRig->animFile.assign(reinterpret_cast<const char*>(pl + 2), sl);
            } else if (outRig && tag == "ADJN" && plen >= 38) {
                ParsedJoint pj;
                std::memcpy(&pj.index, pl, 4);
                uint16_t sl = 0;
                std::memcpy(&sl, pl + 4, 2);
                if (6 + sl + 32 <= plen) {
                    pj.name.assign(reinterpret_cast<const char*>(pl + 6), sl);
                    const uint8_t* jp = pl + 6 + sl;
                    std::memcpy(&pj.parentIndex, jp, 4);
                    std::memcpy(&pj.tx, jp + 4, 4);
                    std::memcpy(&pj.ty, jp + 8, 4);
                    std::memcpy(&pj.tz, jp + 12, 4);
                    std::memcpy(&pj.qx, jp + 16, 4);
                    std::memcpy(&pj.qy, jp + 20, 4);
                    std::memcpy(&pj.qz, jp + 24, 4);
                    std::memcpy(&pj.qw, jp + 28, 4);
                    outRig->joints.push_back(std::move(pj));
                }
            }
            pos += plen;
        }
    }

    // Traverse tree and collect visible meshes with inherited texture + detailMap + shader + spin & transform
    auto walk = [&](auto&& self, const NobNode* node, const Mat4& parentM,
                    const std::string& inheritedTex, const std::string& inheritedDetail,
                    const std::string& inheritedShader,
                    bool allowReadOnly, bool inCloud, int spinAxis, float spinRate) -> void {
        std::string nlow = NpkArchive::toLower(node->name);
        std::string clow = NpkArchive::toLower(node->cls);
        if (nlow == "collide" || nlow == "shadow" || nlow == "explode" ||
            nlow == "invis" || nlow == "artefact" || nlow == "destroyed" ||
            nlow == "lod1" || nlow == "lod2" ||
            nlow == "lod_1" || nlow == "lod_2" || nlow == "lod_3" ||
            nlow.rfind("fade_out", 0) == 0 || nlow.rfind("muzzle", 0) == 0 ||
            nlow.rfind("debris", 0) == 0 || nlow.rfind("damage", 0) == 0 ||
            nlow.rfind("wreck", 0) == 0 || nlow.rfind("smoke", 0) == 0 ||
            nlow.rfind("fire", 0) == 0 || nlow.rfind("missy", 0) == 0) return;
        // Skip non-visual subtrees (vhcl, audio, viewer cameras)
        if (nlow == "vhcl" || nlow == "audio" || nlow == "viewer") return;

        bool nowAllowRO = allowReadOnly ||
                          (clow == "ncharacternode") ||
                          (clow == "nmeshsway") ||
                          (clow == "nleafrender") ||
                          (clow == "ncloudrender");
        bool nowInCloud = inCloud || (clow == "ncloudrender");
        bool nowInSway  = (clow == "nmeshsway") || (clow == "nleafrender");

        Mat4 local = Mat4::translate(node->tx, node->ty, node->tz);
        if (node->hasQuat) {
            // Verified from nnebula.dll 0x1001ecd1 (matrix44(quaternion)): row-major -> conjugate in column-major
            local = local * Mat4::fromQuat(-node->qx, -node->qy, -node->qz, node->qw);
        } else {
            // Verified from nnebula.dll 0x1001e9bc (n3DNode::updateMatrix): row-major Rx*Ry*Rz -> col-major Rz*Ry*Rx
            local = local * Mat4::rotateZ(node->rz) * Mat4::rotateY(node->ry) * Mat4::rotateX(node->rx);
        }
        local = local * Mat4::scale(node->sx, node->sy, node->sz);
        Mat4 world = parentM * local;

        // Check if this node defines a texture array, shader link, or spinning nIpol child
        std::string curTex = inheritedTex;
        std::string curDetail = inheritedDetail;
        std::string curShader = inheritedShader;
        int curSpinAxis = spinAxis;
        float curSpinRate = spinRate;
        for (const auto& c : node->children) {
            if (c->cls == "ntexarraynode") {
                if (!c->texFile.empty() && c->texFile != "none") curTex = c->texFile;
                if (!c->detailTexFile.empty() && c->detailTexFile != "none") curDetail = c->detailTexFile;
            } else if (c->cls == "nlinknode" && !c->linkTarget.empty()) {
                std::string lt = NpkArchive::toLower(c->linkTarget);
                if (lt.find("shader") != std::string::npos) {
                    auto sl = lt.rfind('/');
                    curShader = (sl != std::string::npos) ? lt.substr(sl + 1) : lt;
                }
            } else if (c->cls == "nipol" && c->ipolKeyCount >= 2 && curSpinAxis == 0) {
                float dt = c->ipolKey1T - c->ipolKey0T;
                float dv = c->ipolKey1V - c->ipolKey0V;
                if (dt > 1e-3f && std::fabs(dv) >= 180.0f) {
                    std::string cn = NpkArchive::toLower(c->name);
                    std::string cc = NpkArchive::toLower(c->ipolConnect);
                    if (cc == "rx" || cn.find("rotx") != std::string::npos) { curSpinAxis = 1; curSpinRate = dv / dt; }
                    else if (cc == "ry" || cn.find("roty") != std::string::npos) { curSpinAxis = 2; curSpinRate = dv / dt; }
                    else if (cc == "rz" || cn.find("rotz") != std::string::npos) { curSpinAxis = 3; curSpinRate = dv / dt; }
                }
            }
        }

        // If this node itself is a visible nmeshnode, emit it!
        // Note: skin, swaying tree trunks/leaves, and clouds are marked readOnly (SRDO=1).
        if (clow == "nmeshnode" && !node->meshFile.empty() && (!node->readOnly || nowAllowRO)) {
            std::string mlow = NpkArchive::toLower(node->meshFile);
            if (mlow.find("collide") == std::string::npos &&
                mlow.find("missy") == std::string::npos &&
                mlow.find("lod1") == std::string::npos &&
                mlow.find("lod2") == std::string::npos &&
                mlow.find("lod01") == std::string::npos &&
                mlow.find("lod02") == std::string::npos &&
                mlow.find("lod03") == std::string::npos) {
                outItems.push_back({node->meshFile, curTex, curDetail, curShader, world, nowInCloud, nowInSway || (allowReadOnly && !nowInCloud), curSpinAxis, curSpinRate});
            }
            return;
        }

        // For visual/ root that contains sibling state branches (normal, destroyed, artefact, invis),
        // pick only the active "normal" state branch so states don't overlap!
        if (nlow == "visual") {
            const NobNode* normalBranch = nullptr;
            for (const auto& c : node->children) {
                if (NpkArchive::toLower(c->name) == "normal") { normalBranch = c.get(); break; }
            }
            if (normalBranch) {
                self(self, normalBranch, world, curTex, curDetail, curShader, nowAllowRO, nowInCloud, curSpinAxis, curSpinRate);
                return;
            }
        }

        // For nflipflop (LOD / quality switcher), pick only ONE best child so we don't draw duplicate LODs
        if (clow == "nflipflop" && !node->children.empty()) {
            const NobNode* best = node->children.front().get();
            for (const auto& c : node->children) {
                std::string cn = NpkArchive::toLower(c->name);
                if (cn == "lod_0" || cn == "mesh2" || cn == "sr2") { best = c.get(); break; }
            }
            self(self, best, world, curTex, curDetail, curShader, nowAllowRO, nowInCloud, curSpinAxis, curSpinRate);
            return;
        }

        for (const auto& c : node->children) {
            self(self, c.get(), world, curTex, curDetail, curShader, nowAllowRO, nowInCloud, curSpinAxis, curSpinRate);
        }
    };
    walk(walk, root.get(), Mat4::identity(), "", "", "", false, false, 0, 0.0f);
    return !outItems.empty();
}

} // namespace nebula
