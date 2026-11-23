#pragma once
// Module 7: Native C++17 3D Particle System (nParticle / nSpriteRender)
// Drives jetpack flame & smoke, aircraft engine exhaust trails, and crashed-cruiser smoke plumes.

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <vector>

#include "../nnature/nnature.hpp"

namespace nebula {

struct Particle3D {
    float px, py, pz;
    float vx, vy, vz;
    float age = 0.0f;
    float maxAge = 1.0f;
    float startSize = 1.0f;
    float endSize = 3.0f;
    float r = 1.0f, g = 0.8f, b = 0.4f, a = 0.9f;
};

class nParticleSystem {
public:
    std::vector<Particle3D> particles;
    uint32_t rng = 0x12345678u;

    float frand() {
        rng = rng * 1664525u + 1013904223u;
        return static_cast<float>((rng >> 8) & 0xFFFF) / 65535.0f;
    }

    void clear() { particles.clear(); }

    void emitJetpackFlame(float x, float y, float z, float boost) {
        if (particles.size() > 600) return;
        float spread = 0.6f;
        particles.push_back({
            x + (frand() - 0.5f) * 0.25f, y, z + (frand() - 0.5f) * 0.25f,
            (frand() - 0.5f) * spread, -4.5f - boost * 3.0f, (frand() - 0.5f) * spread,
            0.0f, 0.35f + frand() * 0.25f,
            0.35f, 1.4f,
            1.0f, 0.68f + boost * 0.2f, 0.18f, 0.92f
        });
    }

    void emitEngineTrail(float x, float y, float z) {
        if (particles.size() > 600) return;
        particles.push_back({
            x, y, z,
            (frand() - 0.5f) * 1.5f, 0.5f + frand() * 1.0f, (frand() - 0.5f) * 1.5f,
            0.0f, 0.9f + frand() * 0.5f,
            0.9f, 3.8f,
            0.85f, 0.88f, 0.94f, 0.55f
        });
    }

    void emitWreckSmoke(float x, float y, float z) {
        if (particles.size() > 600) return;
        particles.push_back({
            x + (frand() - 0.5f) * 4.0f, y, z + (frand() - 0.5f) * 4.0f,
            1.2f + (frand() - 0.5f) * 1.2f, 5.5f + frand() * 2.5f, (frand() - 0.5f) * 1.2f,
            0.0f, 3.2f + frand() * 1.5f,
            2.2f, 9.5f,
            0.22f, 0.22f, 0.24f, 0.55f
        });
    }

    void update(float dt) {
        for (size_t i = 0; i < particles.size();) {
            auto& p = particles[i];
            p.age += dt;
            if (p.age >= p.maxAge) {
                particles.erase(particles.begin() + static_cast<long>(i));
                continue;
            }
            p.px += p.vx * dt;
            p.py += p.vy * dt;
            p.pz += p.vz * dt;
            ++i;
        }
    }

    void appendBillboards(const nnature::Vec3& camRight, const nnature::Vec3& camUp,
                          std::vector<nnature::CloudVertex>& outVerts,
                          std::vector<uint32_t>& outIdx) const {
        for (const auto& p : particles) {
            float f = std::clamp(p.age / std::max(0.01f, p.maxAge), 0.0f, 1.0f);
            float sz = p.startSize + (p.endSize - p.startSize) * f;
            float alpha = p.a * (1.0f - f);
            if (alpha <= 0.01f) continue;

            uint32_t base = static_cast<uint32_t>(outVerts.size());
            nnature::Vec3 pos{p.px, p.py, p.pz};
            nnature::Vec3 rx = camRight * sz;
            nnature::Vec3 uy = camUp * sz;
            nnature::Vec3 p0 = pos - rx - uy;
            nnature::Vec3 p1 = pos + rx - uy;
            nnature::Vec3 p2 = pos + rx + uy;
            nnature::Vec3 p3 = pos - rx + uy;

            outVerts.push_back({p0.x, p0.y, p0.z, 0, 1, p.r, p.g, p.b, alpha});
            outVerts.push_back({p1.x, p1.y, p1.z, 1, 1, p.r, p.g, p.b, alpha});
            outVerts.push_back({p2.x, p2.y, p2.z, 1, 0, p.r, p.g, p.b, alpha});
            outVerts.push_back({p3.x, p3.y, p3.z, 0, 0, p.r, p.g, p.b, alpha});
            outIdx.insert(outIdx.end(), {base, base+1, base+2, base, base+2, base+3});
        }
    }
};

} // namespace nebula
