#pragma once
// Module 7: Native C++17 3D Particle System (nParticle / nSpriteRender)
// Drives jetpack flame & smoke, aircraft engine exhaust trails, and crashed-cruiser smoke plumes.

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <string>
#include <vector>

#include "nkernel.hpp"
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

// ===========================================================================
// Module 18: Full nparticle.dll Class Hierarchy
// Lifted from re/src/nparticle/*.hpp:
//   nParticleServer, nPEmitter, nPServEmitter, nPointEmitter,
//   nMeshEmitter, nStaticMeshEmitter, nPRender, nSpriteRender, nTrailRender
// ===========================================================================

static constexpr float kParticleDegToRad = 3.14159265358979323846f / 180.0f;
static constexpr float kParticleRadToDeg = 180.0f / 3.14159265358979323846f;

class nParticleServerNode : public nRoot {
public:
    double currentTime = 0.0;
    void trigger(double t) { currentTime = t; }
};

class nPEmitterNode : public nRoot {
public:
    float tStart    = 0.0f;
    float tStop     = 0.0f;
    float tRepeat   = 0.0f;
    float lifetime  = 1.0f;
    float freq      = 10.0f;
    float speed     = 1.0f;
    float accel[3]  = {0.0f, 0.0f, 0.0f};
    float innerCone = 0.0f; // radians
    float outerCone = 0.0f; // radians
    std::string meshNode;
};

struct ParticleRenderKey {
    float size   = 1.0f;
    float bounce = 0.0f;
    float r = 1.0f, g = 1.0f, b = 1.0f, a = 1.0f;
};

class nPRenderNode : public nRoot {
public:
    bool  stretch   = false;
    float spin      = 0.0f; // radians/s
    float spinAccel = 0.0f; // radians/s^2
    std::string emitterPath;
    std::vector<ParticleRenderKey> keys;

    ParticleRenderKey sampleKey(float normAge) const {
        if (keys.empty()) return {};
        if (keys.size() == 1) return keys[0];
        float f = std::clamp(normAge, 0.0f, 1.0f) * static_cast<float>(keys.size() - 1);
        size_t i0 = static_cast<size_t>(f);
        size_t i1 = std::min(i0 + 1, keys.size() - 1);
        float t = f - static_cast<float>(i0);
        const auto& k0 = keys[i0];
        const auto& k1 = keys[i1];
        return {
            k0.size   + (k1.size   - k0.size)   * t,
            k0.bounce + (k1.bounce - k0.bounce) * t,
            k0.r      + (k1.r      - k0.r)      * t,
            k0.g      + (k1.g      - k0.g)      * t,
            k0.b      + (k1.b      - k0.b)      * t,
            k0.a      + (k1.a      - k0.a)      * t
        };
    }
};

inline void registerParticleModule18(nKernelServer& ks) {
    // 1. nParticleServer
    ks.registerClass("nparticleserver", "nroot", []() { return std::make_unique<nParticleServerNode>(); });

    // 2. nPEmitter (14 AddCmds from npemitter.asm 0x1000233e..0x100027ba)
    auto* clPE = ks.registerClass("npemitter", "nanimnode", []() { return std::make_unique<nPEmitterNode>(); });
    clPE->addCmdProto("v_settimes_fff", "STMS", [](nRoot* o, nCmd& c) {
        if (auto* e = dynamic_cast<nPEmitterNode*>(o); e && c.inArgs.size() >= 3) {
            e->tStart = c.inArgs[0].fVal; e->tStop = c.inArgs[1].fVal; e->tRepeat = c.inArgs[2].fVal;
        }
    });
    clPE->addCmdProto("fff_gettimes_v", "GTMS", [](nRoot* o, nCmd& c) {
        auto* e = dynamic_cast<nPEmitterNode*>(o);
        c.outArgs.push_back(nArg::fromFloat(e ? e->tStart : 0.0f));
        c.outArgs.push_back(nArg::fromFloat(e ? e->tStop : 0.0f));
        c.outArgs.push_back(nArg::fromFloat(e ? e->tRepeat : 0.0f));
    });
    clPE->addCmdProto("v_setlifetime_f", "SLFT", [](nRoot* o, nCmd& c) {
        if (auto* e = dynamic_cast<nPEmitterNode*>(o); e && !c.inArgs.empty()) e->lifetime = c.inArgs[0].fVal;
    });
    clPE->addCmdProto("f_getlifetime_v", "GLFT", [](nRoot* o, nCmd& c) {
        auto* e = dynamic_cast<nPEmitterNode*>(o);
        c.outArgs.push_back(nArg::fromFloat(e ? e->lifetime : 1.0f));
    });
    clPE->addCmdProto("v_setfreq_f", "SFRQ", [](nRoot* o, nCmd& c) {
        if (auto* e = dynamic_cast<nPEmitterNode*>(o); e && !c.inArgs.empty()) e->freq = c.inArgs[0].fVal;
    });
    clPE->addCmdProto("f_getfreq_v", "GFRQ", [](nRoot* o, nCmd& c) {
        auto* e = dynamic_cast<nPEmitterNode*>(o);
        c.outArgs.push_back(nArg::fromFloat(e ? e->freq : 10.0f));
    });
    clPE->addCmdProto("v_setspeed_f", "SSPD", [](nRoot* o, nCmd& c) {
        if (auto* e = dynamic_cast<nPEmitterNode*>(o); e && !c.inArgs.empty()) e->speed = c.inArgs[0].fVal;
    });
    clPE->addCmdProto("f_getspeed_v", "GSPD", [](nRoot* o, nCmd& c) {
        auto* e = dynamic_cast<nPEmitterNode*>(o);
        c.outArgs.push_back(nArg::fromFloat(e ? e->speed : 1.0f));
    });
    clPE->addCmdProto("v_setaccel_fff", "SACC", [](nRoot* o, nCmd& c) {
        if (auto* e = dynamic_cast<nPEmitterNode*>(o); e && c.inArgs.size() >= 3) {
            e->accel[0] = c.inArgs[0].fVal; e->accel[1] = c.inArgs[1].fVal; e->accel[2] = c.inArgs[2].fVal;
        }
    });
    clPE->addCmdProto("fff_getaccel_v", "GACC", [](nRoot* o, nCmd& c) {
        auto* e = dynamic_cast<nPEmitterNode*>(o);
        c.outArgs.push_back(nArg::fromFloat(e ? e->accel[0] : 0.0f));
        c.outArgs.push_back(nArg::fromFloat(e ? e->accel[1] : 0.0f));
        c.outArgs.push_back(nArg::fromFloat(e ? e->accel[2] : 0.0f));
    });
    clPE->addCmdProto("v_setinnercone_f", "SICN", [](nRoot* o, nCmd& c) {
        if (auto* e = dynamic_cast<nPEmitterNode*>(o); e && !c.inArgs.empty())
            e->innerCone = c.inArgs[0].fVal * kParticleDegToRad;
    });
    clPE->addCmdProto("f_getinnercone_v", "GICN", [](nRoot* o, nCmd& c) {
        auto* e = dynamic_cast<nPEmitterNode*>(o);
        c.outArgs.push_back(nArg::fromFloat(e ? e->innerCone * kParticleRadToDeg : 0.0f));
    });
    clPE->addCmdProto("v_setoutercone_f", "SOCN", [](nRoot* o, nCmd& c) {
        if (auto* e = dynamic_cast<nPEmitterNode*>(o); e && !c.inArgs.empty())
            e->outerCone = c.inArgs[0].fVal * kParticleDegToRad;
    });
    clPE->addCmdProto("f_getoutercone_v", "GOCN", [](nRoot* o, nCmd& c) {
        auto* e = dynamic_cast<nPEmitterNode*>(o);
        c.outArgs.push_back(nArg::fromFloat(e ? e->outerCone * kParticleRadToDeg : 0.0f));
    });

    // 3. Emitter subclasses
    ks.registerClass("npservemitter", "npemitter", []() { return std::make_unique<nPEmitterNode>(); });
    ks.registerClass("npointemitter", "npservemitter", []() { return std::make_unique<nPEmitterNode>(); });
    auto regMeshEmitter = [&](const std::string& name, const std::string& sup) {
        auto* cl = ks.registerClass(name, sup, []() { return std::make_unique<nPEmitterNode>(); });
        cl->addCmdProto("v_setmeshnode_s", "SMSN", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nPEmitterNode*>(o); e && !c.inArgs.empty()) e->meshNode = c.inArgs[0].sVal;
        });
        cl->addCmdProto("s_getmeshnode_v", "GMSN", [](nRoot* o, nCmd& c) {
            auto* e = dynamic_cast<nPEmitterNode*>(o);
            c.outArgs.push_back(nArg::fromString(e ? e->meshNode : ""));
        });
    };
    regMeshEmitter("nmeshemitter", "npservemitter");
    regMeshEmitter("nstaticmeshemitter", "npemitter");

    // 4. nPRender (12 AddCmds from nprender.asm 0x10006bf8..0x10006e23)
    auto* clPR = ks.registerClass("nprender", "nanimnode", []() { return std::make_unique<nPRenderNode>(); });
    clPR->addCmdProto("v_setstretch_b", "SSTR", [](nRoot* o, nCmd& c) {
        if (auto* r = dynamic_cast<nPRenderNode*>(o); r && !c.inArgs.empty()) r->stretch = c.inArgs[0].bVal;
    });
    clPR->addCmdProto("b_getstretch_v", "GSTR", [](nRoot* o, nCmd& c) {
        auto* r = dynamic_cast<nPRenderNode*>(o);
        c.outArgs.push_back(nArg::fromBool(r ? r->stretch : false));
    });
    clPR->addCmdProto("v_setspin_f", "SSPN", [](nRoot* o, nCmd& c) {
        if (auto* r = dynamic_cast<nPRenderNode*>(o); r && !c.inArgs.empty())
            r->spin = c.inArgs[0].fVal * kParticleDegToRad;
    });
    clPR->addCmdProto("f_getspin_v", "GSPN", [](nRoot* o, nCmd& c) {
        auto* r = dynamic_cast<nPRenderNode*>(o);
        c.outArgs.push_back(nArg::fromFloat(r ? r->spin * kParticleRadToDeg : 0.0f));
    });
    clPR->addCmdProto("v_setspinaccel_f", "SSPA", [](nRoot* o, nCmd& c) {
        if (auto* r = dynamic_cast<nPRenderNode*>(o); r && !c.inArgs.empty())
            r->spinAccel = c.inArgs[0].fVal * kParticleDegToRad;
    });
    clPR->addCmdProto("f_getspinaccel_v", "GSPA", [](nRoot* o, nCmd& c) {
        auto* r = dynamic_cast<nPRenderNode*>(o);
        c.outArgs.push_back(nArg::fromFloat(r ? r->spinAccel * kParticleRadToDeg : 0.0f));
    });
    clPR->addCmdProto("v_setemitter_s", "SEMT", [](nRoot* o, nCmd& c) {
        if (auto* r = dynamic_cast<nPRenderNode*>(o); r && !c.inArgs.empty()) r->emitterPath = c.inArgs[0].sVal;
    });
    clPR->addCmdProto("s_getemitter_v", "GEMT", [](nRoot* o, nCmd& c) {
        auto* r = dynamic_cast<nPRenderNode*>(o);
        c.outArgs.push_back(nArg::fromString(r ? r->emitterPath : ""));
    });
    clPR->addCmdProto("v_beginkeys_i", "BGKY", [](nRoot* o, nCmd& c) {
        if (auto* r = dynamic_cast<nPRenderNode*>(o); r && !c.inArgs.empty())
            r->keys.resize(std::max(0, c.inArgs[0].iVal));
    });
    clPR->addCmdProto("v_setkey_iffffff", "SKEY", [](nRoot* o, nCmd& c) {
        if (auto* r = dynamic_cast<nPRenderNode*>(o); r && c.inArgs.size() >= 7) {
            int idx = c.inArgs[0].iVal;
            if (idx >= 0 && static_cast<size_t>(idx) < r->keys.size()) {
                r->keys[idx] = {c.inArgs[1].fVal, c.inArgs[2].fVal,
                                c.inArgs[3].fVal, c.inArgs[4].fVal,
                                c.inArgs[5].fVal, c.inArgs[6].fVal};
            }
        }
    });
    clPR->addCmdProto("v_endkeys_v", "EDKY", [](nRoot*, nCmd&) {});
    clPR->addCmdProto("i_getnumkeys_v", "GNKY", [](nRoot* o, nCmd& c) {
        auto* r = dynamic_cast<nPRenderNode*>(o);
        c.outArgs.push_back(nArg::fromInt(r ? static_cast<int>(r->keys.size()) : 0));
    });

    // 5. Renderer subclasses
    ks.registerClass("nspriterender", "nprender", []() { return std::make_unique<nPRenderNode>(); });
    ks.registerClass("ntrailrender", "nprender", []() { return std::make_unique<nPRenderNode>(); });
}

} // namespace nebula
