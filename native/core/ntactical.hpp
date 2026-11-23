#pragma once
// Module 17: Tactical Combat, Turrets, Guided Missiles, Artefact Altar/Storage & Squadron AI
// Lifted directly from nnomads.dll:
//   - nflak (0x10026451..0x100270c1) & nflakengine2 (0x1004942f..0x10049ef1)
//   - nmissileengine2 (0x1004a019..0x1004aee7) & nmissileengine3 (0x1006b912..0x1006bdac)
//   - nartefacttransformer (0x10030843..0x10030dda) & nartefactstorage (0x10030048..0x10030673)
//   - nsquadronwatchtarget (0x10035067..0x100355ab), nwatchtarget, nsilo, nfireweapon, nfiremachinegun

#include <algorithm>
#include <cmath>
#include <string>
#include <vector>

#include "nkernel.hpp"
#include "nworld.hpp"

namespace nebula {

static constexpr float kTacticalDegToRad = 3.14159265358979323846f / 180.0f;
static constexpr float kTacticalRadToDeg = 180.0f / 3.14159265358979323846f;

// ---------------------------------------------------------------------------
// nFlak : public nEntity (nvehicle) — Anti-Air / Gun Turret
// Exact AddCmds from nflak.asm (0x10026e08..0x1002708b):
//   setbasevector/getbasevector, setmaxsideangle/getmaxsideangle,
//   setmaxupangle/getmaxupangle, setmaxdownangle/getmaxdownangle
// ---------------------------------------------------------------------------
class nFlak : public nEntity {
public:
    float baseVec[3]   = {0.0f, 0.0f, -1.0f};
    float maxSideAngle = 3.14159265f;         // radians (full 360° default)
    float maxUpAngle   = 75.0f * kTacticalDegToRad;
    float maxDownAngle = 15.0f * kTacticalDegToRad;
    float currentYaw   = 0.0f;                // radians
    float currentPitch = 0.0f;                // radians
    float slewRateYaw  = 90.0f * kTacticalDegToRad;
    float slewRatePitch= 60.0f * kTacticalDegToRad;

    // Smoothly slew turret toward world-space target point within arc limits
    bool aimAt(float tx, float ty, float tz, float dt) {
        float dx = tx - px;
        float dy = ty - py;
        float dz = tz - pz;
        float horiz = std::sqrt(dx * dx + dz * dz);
        if (horiz < 1e-4f) return false;

        // Forward is -Z in Nebula (proven in nworld.hpp / nislanddrive.asm)
        float desiredYaw   = std::atan2(-dx, -dz);
        float desiredPitch = std::atan2(dy, horiz);

        // Wrap yaw delta to [-pi, pi]
        float dyaw = desiredYaw - currentYaw;
        while (dyaw >  3.14159265f) dyaw -= 6.2831853f;
        while (dyaw < -3.14159265f) dyaw += 6.2831853f;

        float maxStepY = slewRateYaw * dt;
        float maxStepP = slewRatePitch * dt;
        currentYaw   += std::clamp(dyaw, -maxStepY, maxStepY);
        currentPitch += std::clamp(desiredPitch - currentPitch, -maxStepP, maxStepP);

        // Clamp to turret traverse & elevation arcs
        if (maxSideAngle < 3.14f) {
            currentYaw = std::clamp(currentYaw, -maxSideAngle, maxSideAngle);
        }
        currentPitch = std::clamp(currentPitch, -maxDownAngle, maxUpAngle);

        rx = currentPitch * kTacticalRadToDeg;
        ry = currentYaw * kTacticalRadToDeg;
        return std::fabs(dyaw) < (8.0f * kTacticalDegToRad) &&
               std::fabs(desiredPitch - currentPitch) < (8.0f * kTacticalDegToRad);
    }
};

// ---------------------------------------------------------------------------
// nFlakEngine2 : public nRoot (nengine2) — Turret Slew Controller
// Exact defaults from nflakengine2.asm (0x10049486): 30 deg, 0.5 s
// ---------------------------------------------------------------------------
class nFlakEngine2 : public nRoot {
public:
    float maxHoriRotation  = 30.0f * kTacticalDegToRad;
    float horiRotationTime = 0.5f;
    float maxVertRotation  = 30.0f * kTacticalDegToRad;
    float vertRotationTime = 0.5f;
};

// ---------------------------------------------------------------------------
// nMissileEngine2 : public nRoot (nengine2) — Cruise / Steered Missile Engine
// ---------------------------------------------------------------------------
class nMissileEngine2 : public nRoot {
public:
    float maxSpeed       = 180.0f;
    float maxSpeedTime   = 1.5f;
    float stopTime       = 0.5f;
    float turnRadius     = 40.0f;
    float turnRadiusTime = 0.5f;
};

// ---------------------------------------------------------------------------
// nMissileEngine3 : public nRoot (nservice) — Homing Rocket Engine
// Exact AddCmds from nmissileengine3.asm (0x1006bbbb):
//   ignitiondelay, agility, maxspeed, gravityfactor
// ---------------------------------------------------------------------------
class nMissileEngine3 : public nRoot {
public:
    float ignitionDelay = 0.25f;
    float agility       = 3.5f;
    float maxSpeed      = 220.0f;
    float gravityFactor = 0.35f;
    float elapsedTime   = 0.0f;

    // Step a homing missile entity toward (tx, ty, tz)
    void stepHoming(nEntity* missile, float& vx, float& vy, float& vz,
                    float tx, float ty, float tz, float dt) {
        if (!missile || dt <= 0.0f) return;
        elapsedTime += dt;
        if (elapsedTime < ignitionDelay) {
            vy -= 9.81f * gravityFactor * dt;
        } else {
            float dx = tx - missile->px;
            float dy = ty - missile->py;
            float dz = tz - missile->pz;
            float d = std::sqrt(dx * dx + dy * dy + dz * dz);
            if (d > 1e-3f) {
                float desVx = (dx / d) * maxSpeed;
                float desVy = (dy / d) * maxSpeed;
                float desVz = (dz / d) * maxSpeed;
                float blend = std::min(1.0f, agility * dt);
                vx += (desVx - vx) * blend;
                vy += (desVy - vy) * blend;
                vz += (desVz - vz) * blend;
            }
        }
        missile->px += vx * dt;
        missile->py += vy * dt;
        missile->pz += vz * dt;
        float horiz = std::sqrt(vx * vx + vz * vz);
        if (horiz > 1e-3f) {
            missile->ry = std::atan2(-vx, -vz) * kTacticalRadToDeg;
            missile->rx = std::atan2(vy, horiz) * kTacticalRadToDeg;
        }
    }
};

// ---------------------------------------------------------------------------
// nArtefactTransformer : public nEntity (nhouse) — Artefact Altar
// Exact AddCmds from nartefacttransformer.asm (0x10030bce..0x10030dad)
// ---------------------------------------------------------------------------
class nArtefactTransformer : public nEntity {
public:
    bool  downAnim    = false;
    float stackBase[3]= {0.0f, 0.0f, 0.0f};
    std::string successFx;
};

// ---------------------------------------------------------------------------
// nArtefactStorage : public nEntity (nhouse) — Artefact Depot
// Exact AddCmds from nartefactstorage.asm (0x1003042e..0x10030667)
// ---------------------------------------------------------------------------
class nArtefactStorage : public nEntity {
public:
    int   capacity    = 8;
    int   loadMode    = 0;
    float stackBase[3]= {0.0f, 0.0f, 0.0f};
    std::vector<std::string> storedArtefacts;

    bool insertArtefact(const std::string& proto) {
        if (static_cast<int>(storedArtefacts.size()) >= capacity) return false;
        storedArtefacts.push_back(proto);
        return true;
    }

    void emptyStorage() {
        storedArtefacts.clear();
    }
};

// ---------------------------------------------------------------------------
// nSquadronWatchTarget : public nRoot (nwatchtarget) — Squadron Target Watch
// Exact AddCmds from nsquadronwatchtarget.asm (0x100354ee..0x10035574)
// ---------------------------------------------------------------------------
class nSquadronWatchTarget : public nRoot {
public:
    float forgetTargetDistance = 1200.0f;
    float forgetTargetAngle    = 120.0f * kTacticalDegToRad;

    bool shouldForgetTarget(float dist, float angleRad) const {
        return (dist > forgetTargetDistance) || (std::fabs(angleRad) > forgetTargetAngle);
    }
};

// ---------------------------------------------------------------------------
// nSilo & nFireWeapon / nFireMachineGun Services
// ---------------------------------------------------------------------------
class nSiloService : public nRoot {
public:
    float energyStored = 0.0f;
};

class nFireWeaponService : public nRoot {
public:
    bool firing = false;
};

// ---------------------------------------------------------------------------
// Registration for Module 17
// ---------------------------------------------------------------------------
inline void registerTacticalModule17(nKernelServer& ks) {
    // 1. nFlak (turret vehicle)
    auto* clFlak = ks.registerClass("nflak", "nvehicle", []() { return std::make_unique<nFlak>(); });
    clFlak->addCmdProto("v_setbasevector_fff", "SBVC", [](nRoot* o, nCmd& c) {
        if (auto* f = dynamic_cast<nFlak*>(o); f && c.inArgs.size() >= 3) {
            f->baseVec[0] = c.inArgs[0].fVal;
            f->baseVec[1] = c.inArgs[1].fVal;
            f->baseVec[2] = c.inArgs[2].fVal;
        }
    });
    clFlak->addCmdProto("fff_getbasevector_v", "GBVC", [](nRoot* o, nCmd& c) {
        auto* f = dynamic_cast<nFlak*>(o);
        c.outArgs.push_back(nArg::fromFloat(f ? f->baseVec[0] : 0.0f));
        c.outArgs.push_back(nArg::fromFloat(f ? f->baseVec[1] : 0.0f));
        c.outArgs.push_back(nArg::fromFloat(f ? f->baseVec[2] : -1.0f));
    });
    clFlak->addCmdProto("v_setmaxsideangle_f", "SMSA", [](nRoot* o, nCmd& c) {
        if (auto* f = dynamic_cast<nFlak*>(o); f && !c.inArgs.empty())
            f->maxSideAngle = c.inArgs[0].fVal * kTacticalDegToRad;
    });
    clFlak->addCmdProto("f_getmaxsideangle_v", "GMSA", [](nRoot* o, nCmd& c) {
        auto* f = dynamic_cast<nFlak*>(o);
        c.outArgs.push_back(nArg::fromFloat(f ? f->maxSideAngle * kTacticalRadToDeg : 180.0f));
    });
    clFlak->addCmdProto("v_setmaxupangle_f", "SMUA", [](nRoot* o, nCmd& c) {
        if (auto* f = dynamic_cast<nFlak*>(o); f && !c.inArgs.empty())
            f->maxUpAngle = c.inArgs[0].fVal * kTacticalDegToRad;
    });
    clFlak->addCmdProto("f_getmaxupangle_v", "GMUA", [](nRoot* o, nCmd& c) {
        auto* f = dynamic_cast<nFlak*>(o);
        c.outArgs.push_back(nArg::fromFloat(f ? f->maxUpAngle * kTacticalRadToDeg : 75.0f));
    });
    clFlak->addCmdProto("v_setmaxdownangle_f", "SMDA", [](nRoot* o, nCmd& c) {
        if (auto* f = dynamic_cast<nFlak*>(o); f && !c.inArgs.empty())
            f->maxDownAngle = c.inArgs[0].fVal * kTacticalDegToRad;
    });
    clFlak->addCmdProto("f_getmaxdownangle_v", "GMDA", [](nRoot* o, nCmd& c) {
        auto* f = dynamic_cast<nFlak*>(o);
        c.outArgs.push_back(nArg::fromFloat(f ? f->maxDownAngle * kTacticalRadToDeg : 15.0f));
    });

    // 2. nFlakEngine2
    auto* clFE = ks.registerClass("nflakengine2", "nengine2", []() { return std::make_unique<nFlakEngine2>(); });
    clFE->addCmdProto("v_setmaxhorirotation_f", "SMHR", [](nRoot* o, nCmd& c) {
        if (auto* e = dynamic_cast<nFlakEngine2*>(o); e && !c.inArgs.empty())
            e->maxHoriRotation = c.inArgs[0].fVal * kTacticalDegToRad;
    });
    clFE->addCmdProto("f_getmaxhorirotation_v", "GMHR", [](nRoot* o, nCmd& c) {
        auto* e = dynamic_cast<nFlakEngine2*>(o);
        c.outArgs.push_back(nArg::fromFloat(e ? e->maxHoriRotation * kTacticalRadToDeg : 30.0f));
    });
    clFE->addCmdProto("v_sethorirotationtime_f", "SHRT", [](nRoot* o, nCmd& c) {
        if (auto* e = dynamic_cast<nFlakEngine2*>(o); e && !c.inArgs.empty())
            e->horiRotationTime = c.inArgs[0].fVal;
    });
    clFE->addCmdProto("f_gethorirotationtime_v", "GHRT", [](nRoot* o, nCmd& c) {
        auto* e = dynamic_cast<nFlakEngine2*>(o);
        c.outArgs.push_back(nArg::fromFloat(e ? e->horiRotationTime : 0.5f));
    });
    clFE->addCmdProto("v_setmaxvertrotation_f", "SMVR", [](nRoot* o, nCmd& c) {
        if (auto* e = dynamic_cast<nFlakEngine2*>(o); e && !c.inArgs.empty())
            e->maxVertRotation = c.inArgs[0].fVal * kTacticalDegToRad;
    });
    clFE->addCmdProto("f_getmaxvertrotation_v", "GMVR", [](nRoot* o, nCmd& c) {
        auto* e = dynamic_cast<nFlakEngine2*>(o);
        c.outArgs.push_back(nArg::fromFloat(e ? e->maxVertRotation * kTacticalRadToDeg : 30.0f));
    });
    clFE->addCmdProto("v_setvertrotationtime_f", "SVRT", [](nRoot* o, nCmd& c) {
        if (auto* e = dynamic_cast<nFlakEngine2*>(o); e && !c.inArgs.empty())
            e->vertRotationTime = c.inArgs[0].fVal;
    });
    clFE->addCmdProto("f_getvertrotationtime_v", "GVRT", [](nRoot* o, nCmd& c) {
        auto* e = dynamic_cast<nFlakEngine2*>(o);
        c.outArgs.push_back(nArg::fromFloat(e ? e->vertRotationTime : 0.5f));
    });

    // 3. nMissileEngine2
    auto* clM2 = ks.registerClass("nmissileengine2", "nengine2", []() { return std::make_unique<nMissileEngine2>(); });
    clM2->addCmdProto("v_setmaxspeed_f", "SMSP", [](nRoot* o, nCmd& c) {
        if (auto* m = dynamic_cast<nMissileEngine2*>(o); m && !c.inArgs.empty()) m->maxSpeed = c.inArgs[0].fVal;
    });
    clM2->addCmdProto("f_getmaxspeed_v", "GMSP", [](nRoot* o, nCmd& c) {
        auto* m = dynamic_cast<nMissileEngine2*>(o);
        c.outArgs.push_back(nArg::fromFloat(m ? m->maxSpeed : 180.0f));
    });
    clM2->addCmdProto("v_setmaxspeedtime_f", "SMST", [](nRoot* o, nCmd& c) {
        if (auto* m = dynamic_cast<nMissileEngine2*>(o); m && !c.inArgs.empty()) m->maxSpeedTime = c.inArgs[0].fVal;
    });
    clM2->addCmdProto("f_getmaxspeedtime_v", "GMST", [](nRoot* o, nCmd& c) {
        auto* m = dynamic_cast<nMissileEngine2*>(o);
        c.outArgs.push_back(nArg::fromFloat(m ? m->maxSpeedTime : 1.5f));
    });
    clM2->addCmdProto("v_setstoptime_f", "SSTP", [](nRoot* o, nCmd& c) {
        if (auto* m = dynamic_cast<nMissileEngine2*>(o); m && !c.inArgs.empty()) m->stopTime = c.inArgs[0].fVal;
    });
    clM2->addCmdProto("f_getstoptime_v", "GSTP", [](nRoot* o, nCmd& c) {
        auto* m = dynamic_cast<nMissileEngine2*>(o);
        c.outArgs.push_back(nArg::fromFloat(m ? m->stopTime : 0.5f));
    });
    clM2->addCmdProto("v_setturnradius_f", "STRD", [](nRoot* o, nCmd& c) {
        if (auto* m = dynamic_cast<nMissileEngine2*>(o); m && !c.inArgs.empty()) m->turnRadius = c.inArgs[0].fVal;
    });
    clM2->addCmdProto("f_getturnradius_v", "GTRD", [](nRoot* o, nCmd& c) {
        auto* m = dynamic_cast<nMissileEngine2*>(o);
        c.outArgs.push_back(nArg::fromFloat(m ? m->turnRadius : 40.0f));
    });
    clM2->addCmdProto("v_setturnradiustime_f", "STRT", [](nRoot* o, nCmd& c) {
        if (auto* m = dynamic_cast<nMissileEngine2*>(o); m && !c.inArgs.empty()) m->turnRadiusTime = c.inArgs[0].fVal;
    });
    clM2->addCmdProto("f_getturnradiustime_v", "GTRT", [](nRoot* o, nCmd& c) {
        auto* m = dynamic_cast<nMissileEngine2*>(o);
        c.outArgs.push_back(nArg::fromFloat(m ? m->turnRadiusTime : 0.5f));
    });

    // 4. nMissileEngine3
    auto* clM3 = ks.registerClass("nmissileengine3", "nservice", []() { return std::make_unique<nMissileEngine3>(); });
    clM3->addCmdProto("v_setignitiondelay_f", "SIGD", [](nRoot* o, nCmd& c) {
        if (auto* m = dynamic_cast<nMissileEngine3*>(o); m && !c.inArgs.empty()) m->ignitionDelay = c.inArgs[0].fVal;
    });
    clM3->addCmdProto("f_getignitiondelay_v", "GIGD", [](nRoot* o, nCmd& c) {
        auto* m = dynamic_cast<nMissileEngine3*>(o);
        c.outArgs.push_back(nArg::fromFloat(m ? m->ignitionDelay : 0.25f));
    });
    clM3->addCmdProto("v_setagility_f", "SAGL", [](nRoot* o, nCmd& c) {
        if (auto* m = dynamic_cast<nMissileEngine3*>(o); m && !c.inArgs.empty()) m->agility = c.inArgs[0].fVal;
    });
    clM3->addCmdProto("f_getagility_v", "GAGL", [](nRoot* o, nCmd& c) {
        auto* m = dynamic_cast<nMissileEngine3*>(o);
        c.outArgs.push_back(nArg::fromFloat(m ? m->agility : 3.5f));
    });
    clM3->addCmdProto("v_setmaxspeed_f", "SMSP", [](nRoot* o, nCmd& c) {
        if (auto* m = dynamic_cast<nMissileEngine3*>(o); m && !c.inArgs.empty()) m->maxSpeed = c.inArgs[0].fVal;
    });
    clM3->addCmdProto("f_getmaxspeed_v", "GMSP", [](nRoot* o, nCmd& c) {
        auto* m = dynamic_cast<nMissileEngine3*>(o);
        c.outArgs.push_back(nArg::fromFloat(m ? m->maxSpeed : 220.0f));
    });
    clM3->addCmdProto("v_setgravityfactor_f", "SGRF", [](nRoot* o, nCmd& c) {
        if (auto* m = dynamic_cast<nMissileEngine3*>(o); m && !c.inArgs.empty()) m->gravityFactor = c.inArgs[0].fVal;
    });
    clM3->addCmdProto("f_getgravityfactor_v", "GGRF", [](nRoot* o, nCmd& c) {
        auto* m = dynamic_cast<nMissileEngine3*>(o);
        c.outArgs.push_back(nArg::fromFloat(m ? m->gravityFactor : 0.35f));
    });

    // 5. nArtefactTransformer
    auto* clAT = ks.registerClass("nartefacttransformer", "nhouse", []() { return std::make_unique<nArtefactTransformer>(); });
    clAT->addCmdProto("v_setdownanim_b", "SDAN", [](nRoot* o, nCmd& c) {
        if (auto* a = dynamic_cast<nArtefactTransformer*>(o); a && !c.inArgs.empty()) a->downAnim = c.inArgs[0].bVal;
    });
    clAT->addCmdProto("b_isdownanim_v", "IDAN", [](nRoot* o, nCmd& c) {
        auto* a = dynamic_cast<nArtefactTransformer*>(o);
        c.outArgs.push_back(nArg::fromBool(a ? a->downAnim : false));
    });
    clAT->addCmdProto("v_setstackbase_fff", "SSBS", [](nRoot* o, nCmd& c) {
        if (auto* a = dynamic_cast<nArtefactTransformer*>(o); a && c.inArgs.size() >= 3) {
            a->stackBase[0] = c.inArgs[0].fVal;
            a->stackBase[1] = c.inArgs[1].fVal;
            a->stackBase[2] = c.inArgs[2].fVal;
        }
    });
    clAT->addCmdProto("fff_getstackbase_v", "GSBS", [](nRoot* o, nCmd& c) {
        auto* a = dynamic_cast<nArtefactTransformer*>(o);
        c.outArgs.push_back(nArg::fromFloat(a ? a->stackBase[0] : 0.0f));
        c.outArgs.push_back(nArg::fromFloat(a ? a->stackBase[1] : 0.0f));
        c.outArgs.push_back(nArg::fromFloat(a ? a->stackBase[2] : 0.0f));
    });
    clAT->addCmdProto("v_setsuccessfx_s", "SSFX", [](nRoot* o, nCmd& c) {
        if (auto* a = dynamic_cast<nArtefactTransformer*>(o); a && !c.inArgs.empty()) a->successFx = c.inArgs[0].sVal;
    });
    clAT->addCmdProto("s_getsuccessfx_v", "GSFX", [](nRoot* o, nCmd& c) {
        auto* a = dynamic_cast<nArtefactTransformer*>(o);
        c.outArgs.push_back(nArg::fromString(a ? a->successFx : ""));
    });

    // 6. nArtefactStorage
    auto* clAS = ks.registerClass("nartefactstorage", "nhouse", []() { return std::make_unique<nArtefactStorage>(); });
    clAS->addCmdProto("v_setcapacity_i", "SCAP", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nArtefactStorage*>(o); s && !c.inArgs.empty()) s->capacity = c.inArgs[0].iVal;
    });
    clAS->addCmdProto("i_getcapacity_v", "GCAP", [](nRoot* o, nCmd& c) {
        auto* s = dynamic_cast<nArtefactStorage*>(o);
        c.outArgs.push_back(nArg::fromInt(s ? s->capacity : 8));
    });
    clAS->addCmdProto("b_insertartefact_s", "IART", [](nRoot* o, nCmd& c) {
        bool ok = false;
        if (auto* s = dynamic_cast<nArtefactStorage*>(o); s && !c.inArgs.empty())
            ok = s->insertArtefact(c.inArgs[0].sVal);
        c.outArgs.push_back(nArg::fromBool(ok));
    });
    clAS->addCmdProto("v_setstackbase_fff", "SSBS", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nArtefactStorage*>(o); s && c.inArgs.size() >= 3) {
            s->stackBase[0] = c.inArgs[0].fVal;
            s->stackBase[1] = c.inArgs[1].fVal;
            s->stackBase[2] = c.inArgs[2].fVal;
        }
    });
    clAS->addCmdProto("fff_getstackbase_v", "GSBS", [](nRoot* o, nCmd& c) {
        auto* s = dynamic_cast<nArtefactStorage*>(o);
        c.outArgs.push_back(nArg::fromFloat(s ? s->stackBase[0] : 0.0f));
        c.outArgs.push_back(nArg::fromFloat(s ? s->stackBase[1] : 0.0f));
        c.outArgs.push_back(nArg::fromFloat(s ? s->stackBase[2] : 0.0f));
    });
    clAS->addCmdProto("v_setloadmode_i", "SLMD", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nArtefactStorage*>(o); s && !c.inArgs.empty()) s->loadMode = c.inArgs[0].iVal;
    });
    clAS->addCmdProto("i_getloadmode_v", "GLMD", [](nRoot* o, nCmd& c) {
        auto* s = dynamic_cast<nArtefactStorage*>(o);
        c.outArgs.push_back(nArg::fromInt(s ? s->loadMode : 0));
    });
    clAS->addCmdProto("v_emptystorage_v", "EMST", [](nRoot* o, nCmd&) {
        if (auto* s = dynamic_cast<nArtefactStorage*>(o)) s->emptyStorage();
    });

    // 7. nSquadronWatchTarget & nWatchTarget
    ks.registerClass("nwatchtarget", "nservice", []() { return std::make_unique<nRoot>(); });
    auto* clSW = ks.registerClass("nsquadronwatchtarget", "nwatchtarget", []() { return std::make_unique<nSquadronWatchTarget>(); });
    clSW->addCmdProto("v_setforgettargetdistance_f", "SFTD", [](nRoot* o, nCmd& c) {
        if (auto* w = dynamic_cast<nSquadronWatchTarget*>(o); w && !c.inArgs.empty())
            w->forgetTargetDistance = c.inArgs[0].fVal;
    });
    clSW->addCmdProto("f_getforgettargetdistance_v", "GFTD", [](nRoot* o, nCmd& c) {
        auto* w = dynamic_cast<nSquadronWatchTarget*>(o);
        c.outArgs.push_back(nArg::fromFloat(w ? w->forgetTargetDistance : 1200.0f));
    });
    clSW->addCmdProto("v_setforgettargetangle_f", "SFTA", [](nRoot* o, nCmd& c) {
        if (auto* w = dynamic_cast<nSquadronWatchTarget*>(o); w && !c.inArgs.empty())
            w->forgetTargetAngle = c.inArgs[0].fVal * kTacticalDegToRad;
    });
    clSW->addCmdProto("f_getforgettargetangle_v", "GFTA", [](nRoot* o, nCmd& c) {
        auto* w = dynamic_cast<nSquadronWatchTarget*>(o);
        c.outArgs.push_back(nArg::fromFloat(w ? w->forgetTargetAngle * kTacticalRadToDeg : 120.0f));
    });

    // 8. nSilo, nFireWeapon, nFireMachineGun, nFlakMoving, nBuildFlak
    ks.registerClass("nsilo", "nservice", []() { return std::make_unique<nSiloService>(); });
    ks.registerClass("nfireweapon", "nservice", []() { return std::make_unique<nFireWeaponService>(); });
    ks.registerClass("nfiremachinegun", "nfireweapon", []() { return std::make_unique<nFireWeaponService>(); });
    ks.registerClass("nflakmoving", "nservice", []() { return std::make_unique<nRoot>(); });
    ks.registerClass("nbuildflak", "nservice", []() { return std::make_unique<nRoot>(); });
}

} // namespace nebula
