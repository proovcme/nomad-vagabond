#pragma once
// Phase 1: Native C++17 Nebula Device 1 Skeletal Animation System
//   - NAX0 (.nax) binary curve array parser (CHDR, CDTV float4, CDTP packed uint16 quats)
//   - nCharacterNode / nJoint2 skeleton bind-pose & inverse-bind-pose computation
//   - Smooth linear + shortest-path quaternion interpolation & 4-bone vertex skinning

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <cstring>
#include <string>
#include <unordered_map>
#include <vector>

#include "../viewer/nebula_assets.hpp"

namespace nebula {

struct Quat {
    float x = 0, y = 0, z = 0, w = 1;

    static Quat normalize(const Quat& q) {
        float l = std::sqrt(q.x*q.x + q.y*q.y + q.z*q.z + q.w*q.w);
        return l > 1e-6f ? Quat{q.x/l, q.y/l, q.z/l, q.w/l} : Quat{0, 0, 0, 1};
    }

    static Quat nlerp(const Quat& a, Quat b, float t) {
        float d = a.x*b.x + a.y*b.y + a.z*b.z + a.w*b.w;
        if (d < 0.0f) { b.x = -b.x; b.y = -b.y; b.z = -b.z; b.w = -b.w; }
        return normalize({
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t,
            a.z + (b.z - a.z) * t,
            a.w + (b.w - a.w) * t
        });
    }
};

struct Vec4f {
    float x = 0, y = 0, z = 0, w = 1;
};

struct NaxCurve {
    std::string name;
    uint32_t startKey = 0;
    uint32_t numKeys = 0;
    float keysPerSec = 12.5f;
    uint8_t ipolType = 1; // 0=step, 1=linear, 2=quat
    uint8_t repType = 0;  // 0=loop, 1=oneshot
    std::vector<Vec4f> keys;

    Vec4f sample(float timeSec) const {
        if (keys.empty()) return {0, 0, 0, 1};
        if (keys.size() == 1 || keysPerSec <= 0.0f) return keys[0];

        float maxKey = static_cast<float>(keys.size() - 1);
        float k = timeSec * keysPerSec;
        if (repType == 0) {
            k = std::fmod(k, maxKey);
            if (k < 0.0f) k += maxKey;
        } else {
            k = std::clamp(k, 0.0f, maxKey);
        }

        size_t i0 = static_cast<size_t>(std::floor(k));
        size_t i1 = std::min(i0 + 1, keys.size() - 1);
        float frac = k - static_cast<float>(i0);

        const Vec4f& a = keys[i0];
        const Vec4f& b = keys[i1];
        if (ipolType == 0) return a;
        if (ipolType == 2) {
            Quat q = Quat::nlerp({a.x, a.y, a.z, a.w}, {b.x, b.y, b.z, b.w}, frac);
            return {q.x, q.y, q.z, q.w};
        }
        return {
            a.x + (b.x - a.x) * frac,
            a.y + (b.y - a.y) * frac,
            a.z + (b.z - a.z) * frac,
            a.w + (b.w - a.w) * frac
        };
    }
};

struct NaxAnimation {
    std::unordered_map<std::string, NaxCurve> curves;

    bool parse(const std::vector<uint8_t>& buf) {
        if (buf.size() < 12 || std::memcmp(buf.data(), "0XAN", 4) != 0) return false;
        size_t pos = 12;
        while (pos + 8 <= buf.size()) {
            char tag[4];
            uint32_t blen = 0;
            std::memcpy(tag, buf.data() + pos, 4);
            std::memcpy(&blen, buf.data() + pos + 4, 4);
            if (pos + 8 + blen > buf.size()) break;

            if (std::memcmp(tag, "RDHC", 4) == 0 && blen >= 18) {
                NaxCurve c;
                std::memcpy(&c.startKey, buf.data() + pos + 8, 4);
                std::memcpy(&c.numKeys, buf.data() + pos + 12, 4);
                std::memcpy(&c.keysPerSec, buf.data() + pos + 16, 4);
                c.ipolType = buf[pos + 20];
                c.repType = buf[pos + 21];
                uint16_t nlen = 0;
                std::memcpy(&nlen, buf.data() + pos + 24, 2);
                if (26 + nlen <= 8 + blen) {
                    c.name.assign(reinterpret_cast<const char*>(buf.data() + pos + 26), nlen);
                }
                pos += 8 + blen;

                // Next chunk must be VTDC (float4) or PTDC (uint16x4 packed quat)
                if (pos + 8 <= buf.size()) {
                    char dtag[4];
                    uint32_t dblen = 0;
                    std::memcpy(dtag, buf.data() + pos, 4);
                    std::memcpy(&dblen, buf.data() + pos + 4, 4);
                    if (pos + 8 + dblen <= buf.size()) {
                        const uint8_t* dp = buf.data() + pos + 8;
                        if (std::memcmp(dtag, "VTDC", 4) == 0) {
                            size_t n = std::min<size_t>(c.numKeys, dblen / 16);
                            c.keys.resize(n);
                            for (size_t i = 0; i < n; ++i) {
                                std::memcpy(&c.keys[i], dp + i * 16, 16);
                            }
                        } else if (std::memcmp(dtag, "PTDC", 4) == 0) {
                            size_t n = std::min<size_t>(c.numKeys, dblen / 8);
                            c.keys.resize(n);
                            for (size_t i = 0; i < n; ++i) {
                                uint16_t u[4];
                                std::memcpy(u, dp + i * 8, 8);
                                c.keys[i] = {
                                    static_cast<float>(u[0]) / 32767.5f - 1.0f,
                                    static_cast<float>(u[1]) / 32767.5f - 1.0f,
                                    static_cast<float>(u[2]) / 32767.5f - 1.0f,
                                    static_cast<float>(u[3]) / 32767.5f - 1.0f
                                };
                            }
                        }
                        pos += 8 + dblen;
                    }
                }
                if (!c.name.empty()) {
                    curves[c.name] = std::move(c);
                }
            } else {
                pos += 8 + blen;
            }
        }
        return !curves.empty();
    }
};

// Rigid transform inverse for column-major affine matrix (R | t)
inline Mat4 invertRigid(const Mat4& a) {
    Mat4 r = Mat4::identity();
    // Transpose 3x3 rotation
    r.m[0] = a.m[0]; r.m[1] = a.m[4]; r.m[2]  = a.m[8];
    r.m[4] = a.m[1]; r.m[5] = a.m[5]; r.m[6]  = a.m[9];
    r.m[8] = a.m[2]; r.m[9] = a.m[6]; r.m[10] = a.m[10];
    // -R^T * t
    float tx = a.m[12], ty = a.m[13], tz = a.m[14];
    r.m[12] = -(r.m[0]*tx + r.m[4]*ty + r.m[8]*tz);
    r.m[13] = -(r.m[1]*tx + r.m[5]*ty + r.m[9]*tz);
    r.m[14] = -(r.m[2]*tx + r.m[6]*ty + r.m[10]*tz);
    return r;
}

struct SkeletonJoint {
    std::string name;
    int parentIndex = -1;
    float tx = 0, ty = 0, tz = 0;
    float qx = 0, qy = 0, qz = 0, qw = 1;
    Mat4 invBindPose = Mat4::identity();
};

struct CharacterSkeleton {
    std::string animFile;
    std::vector<SkeletonJoint> joints;
    NaxAnimation nax;
    bool naxLoaded = false;

    void computeBindPose() {
        std::vector<Mat4> worldBind(joints.size(), Mat4::identity());
        for (size_t i = 0; i < joints.size(); ++i) {
            const auto& j = joints[i];
            // Nebula Device 1 uses row-major quaternion convention -> conjugate (-qx, -qy, -qz, qw) for column-major Mat4!
            Mat4 local = Mat4::translate(j.tx, j.ty, j.tz) * Mat4::fromQuat(-j.qx, -j.qy, -j.qz, j.qw);
            if (j.parentIndex >= 0 && static_cast<size_t>(j.parentIndex) < i) {
                worldBind[i] = worldBind[j.parentIndex] * local;
            } else {
                worldBind[i] = local;
            }
            joints[i].invBindPose = invertRigid(worldBind[i]);
        }
    }

    void evaluate(const std::string& animPrefix, float timeSec, std::vector<Mat4>& outSkinMats,
                  std::vector<Mat4>* outWorldPose = nullptr) const {
        size_t n = joints.size();
        outSkinMats.resize(n);
        std::vector<Mat4> worldPose(n, Mat4::identity());
        for (size_t i = 0; i < n; ++i) {
            const auto& j = joints[i];
            float tx = j.tx, ty = j.ty, tz = j.tz;
            float qx = j.qx, qy = j.qy, qz = j.qz, qw = j.qw;

            if (naxLoaded && !animPrefix.empty()) {
                auto itT = nax.curves.find(animPrefix + "_trans_" + j.name);
                if (itT != nax.curves.end()) {
                    Vec4f v = itT->second.sample(timeSec);
                    tx = v.x; ty = v.y; tz = v.z;
                }
                auto itR = nax.curves.find(animPrefix + "_rot_" + j.name);
                if (itR != nax.curves.end()) {
                    Vec4f v = itR->second.sample(timeSec);
                    qx = v.x; qy = v.y; qz = v.z; qw = v.w;
                }
            }

            Mat4 local = Mat4::translate(tx, ty, tz) * Mat4::fromQuat(-qx, -qy, -qz, qw);
            if (j.parentIndex >= 0 && static_cast<size_t>(j.parentIndex) < i) {
                worldPose[i] = worldPose[j.parentIndex] * local;
            } else {
                worldPose[i] = local;
            }
            outSkinMats[i] = worldPose[i] * j.invBindPose;
        }
        if (outWorldPose) *outWorldPose = std::move(worldPose);
    }
};

// 4-bone linear blend skinning (matches NVX1 0x8b vertex format)
inline void skinMeshVertices(const MeshData& bindMesh, const std::vector<Mat4>& skinMats,
                             std::vector<MeshVertex>& outVerts) {
    size_t nv = bindMesh.vertices.size();
    outVerts.resize(nv);
    if (bindMesh.skinWeights.size() != nv || skinMats.empty()) {
        outVerts = bindMesh.vertices;
        return;
    }
    for (size_t i = 0; i < nv; ++i) {
        const auto& v = bindMesh.vertices[i];
        const auto& sw = bindMesh.skinWeights[i];
        float px = 0, py = 0, pz = 0;
        float nx = 0, ny = 0, nz = 0;
        float wSum = 0;

        for (int k = 0; k < 4; ++k) {
            float w = sw.weights[k];
            uint16_t ji = sw.joints[k];
            if (w <= 0.0f || ji >= skinMats.size()) continue;
            const float* m = skinMats[ji].m;
            px += w * (m[0]*v.px + m[4]*v.py + m[8]*v.pz  + m[12]);
            py += w * (m[1]*v.px + m[5]*v.py + m[9]*v.pz  + m[13]);
            pz += w * (m[2]*v.px + m[6]*v.py + m[10]*v.pz + m[14]);

            nx += w * (m[0]*v.nx + m[4]*v.ny + m[8]*v.nz);
            ny += w * (m[1]*v.nx + m[5]*v.ny + m[9]*v.nz);
            nz += w * (m[2]*v.nx + m[6]*v.ny + m[10]*v.nz);
            wSum += w;
        }

        if (wSum > 1e-4f) {
            float nl = std::sqrt(nx*nx + ny*ny + nz*nz);
            if (nl > 1e-5f) { nx /= nl; ny /= nl; nz /= nl; }
            outVerts[i] = {px, py, pz, nx, ny, nz, v.u, v.v};
        } else {
            outVerts[i] = v;
        }
    }
}

} // namespace nebula
