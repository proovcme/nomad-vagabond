#pragma once
// Phase 2: Native C++17 Triangle Mesh Collision System (nOpcodeServer / nCollHandler2)
// Per-instance AABB broadphase + exact Moller-Trumbore raycast for island terrain walking & physics.

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <limits>
#include <vector>

#include "../viewer/nebula_assets.hpp"

namespace nebula {

struct Vec3c {
    float x = 0, y = 0, z = 0;
    Vec3c operator+(const Vec3c& o) const { return {x + o.x, y + o.y, z + o.z}; }
    Vec3c operator-(const Vec3c& o) const { return {x - o.x, y - o.y, z - o.z}; }
    Vec3c operator*(float s) const { return {x * s, y * s, z * s}; }
};

inline float dotc(const Vec3c& a, const Vec3c& b) { return a.x*b.x + a.y*b.y + a.z*b.z; }
inline Vec3c crossc(const Vec3c& a, const Vec3c& b) {
    return {a.y*b.z - a.z*b.y, a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x};
}
inline Vec3c normc(const Vec3c& v) {
    float l = std::sqrt(dotc(v, v));
    return l > 1e-6f ? Vec3c{v.x/l, v.y/l, v.z/l} : Vec3c{0, 1, 0};
}

struct CollTri {
    Vec3c v0, v1, v2;
    Vec3c normal;
};

struct CollBody {
    Vec3c bbMin = {1e9f, 1e9f, 1e9f};
    Vec3c bbMax = {-1e9f, -1e9f, -1e9f};
    std::vector<CollTri> tris;
};

class nOpcodeServer {
public:
    std::vector<CollBody> bodies;

    void clear() { bodies.clear(); }

    void addMesh(const MeshData& md, const Mat4& worldMat) {
        if (md.indices.size() < 3) return;
        CollBody body;
        body.tris.reserve(md.indices.size() / 3);

        auto xform = [&](const MeshVertex& v) -> Vec3c {
            const float* m = worldMat.m;
            return {
                m[0]*v.px + m[4]*v.py + m[8]*v.pz  + m[12],
                m[1]*v.px + m[5]*v.py + m[9]*v.pz  + m[13],
                m[2]*v.px + m[6]*v.py + m[10]*v.pz + m[14]
            };
        };

        for (size_t i = 0; i + 2 < md.indices.size(); i += 3) {
            uint16_t i0 = md.indices[i], i1 = md.indices[i+1], i2 = md.indices[i+2];
            if (i0 >= md.vertices.size() || i1 >= md.vertices.size() || i2 >= md.vertices.size()) continue;
            Vec3c a = xform(md.vertices[i0]);
            Vec3c b = xform(md.vertices[i1]);
            Vec3c c = xform(md.vertices[i2]);
            Vec3c n = normc(crossc(b - a, c - a));
            body.tris.push_back({a, b, c, n});
            for (const Vec3c& p : {a, b, c}) {
                body.bbMin.x = std::min(body.bbMin.x, p.x);
                body.bbMin.y = std::min(body.bbMin.y, p.y);
                body.bbMin.z = std::min(body.bbMin.z, p.z);
                body.bbMax.x = std::max(body.bbMax.x, p.x);
                body.bbMax.y = std::max(body.bbMax.y, p.y);
                body.bbMax.z = std::max(body.bbMax.z, p.z);
            }
        }
        if (!body.tris.empty()) bodies.push_back(std::move(body));
    }

    // Cast a vertical ray straight down from (x, startY, z) up to maxDist; returns highest hit surface Y
    bool raycastDown(float x, float startY, float z, float maxDist, float& outY, Vec3c& outNormal) const {
        bool hitAny = false;
        float bestY = startY - maxDist;
        const Vec3c orig{x, startY, z};
        const Vec3c dir{0.0f, -1.0f, 0.0f};

        for (const auto& body : bodies) {
            if (x < body.bbMin.x || x > body.bbMax.x || z < body.bbMin.z || z > body.bbMax.z) continue;
            if (body.bbMax.y < bestY || body.bbMin.y > startY) continue;

            for (const auto& tri : body.tris) {
                // Quick 2D XZ bounding check per triangle
                float minX = std::min({tri.v0.x, tri.v1.x, tri.v2.x});
                float maxX = std::max({tri.v0.x, tri.v1.x, tri.v2.x});
                if (x < minX || x > maxX) continue;
                float minZ = std::min({tri.v0.z, tri.v1.z, tri.v2.z});
                float maxZ = std::max({tri.v0.z, tri.v1.z, tri.v2.z});
                if (z < minZ || z > maxZ) continue;

                // Moller-Trumbore intersection
                Vec3c e1 = tri.v1 - tri.v0;
                Vec3c e2 = tri.v2 - tri.v0;
                Vec3c h = crossc(dir, e2);
                float a = dotc(e1, h);
                if (std::fabs(a) < 1e-6f) continue;
                float f = 1.0f / a;
                Vec3c s = orig - tri.v0;
                float u = f * dotc(s, h);
                if (u < 0.0f || u > 1.0f) continue;
                Vec3c q = crossc(s, e1);
                float v = f * dotc(dir, q);
                if (v < 0.0f || u + v > 1.0f) continue;
                float t = f * dotc(e2, q);
                if (t >= 0.0f && t <= maxDist) {
                    float hy = startY - t;
                    if (!hitAny || hy > bestY) {
                        hitAny = true;
                        bestY = hy;
                        outNormal = (tri.normal.y >= 0.0f) ? tri.normal : (tri.normal * -1.0f);
                    }
                }
            }
        }
        if (hitAny) outY = bestY;
        return hitAny;
    }

    size_t totalTriangles() const {
        size_t n = 0;
        for (const auto& b : bodies) n += b.tris.size();
        return n;
    }
};

} // namespace nebula
