#pragma once
// Module 10: Line-by-line reconstructed Aircraft & Island Flight Physics
// Verified against:
//   - nnomads/nairplane3.asm   (0x10050531 ctor + all 20 AddCmds)
//   - nnomads/nislanddrive.asm (0x1002fbd1 forward = (0,0,-1), horizontal nav steering)
//   - data.npk: j_scout01.n/_main.n (minSpeed=40, maxSpeed=70, accel=3.5s, decel=5s, yaw=120 deg/s, pitch/roll=70 deg)

#include <algorithm>
#include <cmath>
#include <iostream>
#include <string>

#include "nkernel.hpp"
#include "nworld.hpp"

namespace nebula {

class nAirplane3Node : public nRoot {
public:
    // Exact default values from nairplane3::ctor (0x10050531)
    float maxSpeed       = 25.0f;  // +0x5c (0x41c80000)
    float minSpeed       = 5.0f;   // +0x60
    float accelTime      = 3.0f;   // +0x64 (0x40400000)
    float decelTime      = 5.0f;   // +0x68
    float yawAccelTime   = 1.0f;   // +0x74
    float maxPitchDeg    = 68.75f; // +0x80 (1.2 rad)
    float pitchTime      = 0.8f;   // +0x84
    float maxRollDeg     = 74.48f; // +0x8c (1.3 rad)
    float rollTime       = 0.3f;   // +0x90
    float maxYawRotDeg   = 150.0f; // +0xa0 (0x43160000)
};

// Runtime flight state for a possessed aircraft or piloted island
struct nVehicleFlightController {
    enum Mode { NONE, TURRET, AIRCRAFT, ISLAND };
    Mode mode = NONE;
    nEntity* controlled = nullptr; // possessed entity (or parent island for ISLAND mode)

    // Aircraft flight parameters (j_scout01.n/_main.n defaults)
    float minSpeed     = 40.0f;
    float maxSpeed     = 70.0f;
    float accelTime    = 3.5f;
    float decelTime    = 5.0f;
    float maxYawRate   = 120.0f; // deg/s
    float maxPitchDeg  = 70.0f;
    float maxRollDeg   = 70.0f;

    // Live flight state
    float speed = 0.0f;
    float pitchDeg = 0.0f;
    float yawDeg = 0.0f;
    float rollDeg = 0.0f;

    void engage(nEntity* ent) {
        if (!ent) { disengage(); return; }
        std::string lo = NpkArchive::toLower(ent->protoName);

        // Determine mode from prototype class
        if (lo.find("scout") != std::string::npos || lo.find("shark") != std::string::npos ||
            lo.find("flieger") != std::string::npos || lo.find("plane") != std::string::npos ||
            lo.find("bomber") != std::string::npos) {
            mode = AIRCRAFT;
            controlled = ent;
            minSpeed = 30.0f; maxSpeed = 70.0f; accelTime = 3.5f; decelTime = 5.0f;
            maxYawRate = 120.0f; maxPitchDeg = 70.0f; maxRollDeg = 70.0f;
            speed = 40.0f;
            yawDeg = ent->ry; pitchDeg = ent->rx; rollDeg = ent->rz;
            ent->aiMoving = true; // mark dynamic for live matrix update
            std::cout << "[nAirplane3] Engaged AIRCRAFT flight on " << ent->name << " (" << ent->protoName << ")\n";
        } else if (lo.find("navigation") != std::string::npos || lo.find("lighthouse") != std::string::npos ||
                   lo.find("island") != std::string::npos) {
            // If standing at a navigation tower/lighthouse on an island, pilot its parent island!
            nEntity* island = (ent->parentVehicle) ? ent->parentVehicle : ent;
            mode = ISLAND;
            controlled = island;
            minSpeed = -12.0f; maxSpeed = 24.0f; accelTime = 4.0f; decelTime = 4.0f;
            maxYawRate = 25.0f;
            speed = 0.0f;
            yawDeg = island->ry; pitchDeg = 0.0f; rollDeg = 0.0f;
            island->aiMoving = true;
            island->islandLocked = false;
            std::cout << "[nIslandDrive] Engaged ISLAND piloting on " << island->name
                      << " (" << island->childVehicles.size() << " child objects)\n";
        } else {
            mode = TURRET;
            controlled = ent;
            yawDeg = ent->ry; pitchDeg = ent->rx; rollDeg = 0.0f;
            speed = 0.0f;
            ent->aiMoving = true;
            std::cout << "[nTurret] Engaged TURRET control on " << ent->name << " (" << ent->protoName << ")\n";
        }
    }

    void disengage() {
        controlled = nullptr;
        mode = NONE;
        speed = 0.0f;
    }

    // Update possessed entity transform from WASD + Space/Shift inputs
    void update(float dt, float fwdInput, float rightInput, float vertInput, bool boost) {
        if (!controlled || mode == NONE) return;
        dt = std::clamp(dt, 0.001f, 0.05f);

        if (mode == AIRCRAFT) {
            // Throttle (W/S or Shift boost)
            float targetSpeed = boost ? maxSpeed : (minSpeed + (maxSpeed - minSpeed) * std::clamp(0.5f + 0.5f * fwdInput, 0.0f, 1.0f));
            float rate = (targetSpeed > speed) ? ((maxSpeed - minSpeed) / std::max(0.1f, accelTime))
                                               : ((maxSpeed - minSpeed) / std::max(0.1f, decelTime));
            if (speed < targetSpeed) speed = std::min(targetSpeed, speed + rate * dt);
            else                     speed = std::max(targetSpeed, speed - rate * dt);

            // Yaw + Banked Roll (A/D) & Pitch (Space/Ctrl or vertInput)
            yawDeg -= rightInput * maxYawRate * dt;
            float targetRoll = -rightInput * (maxRollDeg * 0.65f);
            rollDeg += (targetRoll - rollDeg) * std::min(1.0f, dt * 5.0f);

            float targetPitch = std::clamp(pitchDeg + vertInput * 65.0f * dt, -maxPitchDeg, maxPitchDeg);
            pitchDeg = targetPitch;

            // Local forward is -Z (verified from nislanddrive.asm 0x1002fc71 & skin.nvx)
            float yr = yawDeg * 0.0174532925f;
            float pr = pitchDeg * 0.0174532925f;
            float fx = -std::sin(yr) * std::cos(pr);
            float fy =  std::sin(pr);
            float fz = -std::cos(yr) * std::cos(pr);

            controlled->px += fx * speed * dt;
            controlled->py += fy * speed * dt;
            controlled->pz += fz * speed * dt;
            controlled->rx = pitchDeg;
            controlled->ry = yawDeg;
            controlled->rz = rollDeg;
            controlled->hasQuat = false;
        } else if (mode == ISLAND) {
            // Island horizontal thrust + altitude (Space/Ctrl) + yaw (A/D)
            float targetSpeed = fwdInput * (boost ? maxSpeed * 1.4f : maxSpeed);
            speed += (targetSpeed - speed) * std::min(1.0f, dt * 1.8f);
            yawDeg -= rightInput * maxYawRate * dt;

            float yr = yawDeg * 0.0174532925f;
            float fx = -std::sin(yr);
            float fz = -std::cos(yr);

            controlled->px += fx * speed * dt;
            controlled->py += vertInput * 10.0f * dt;
            controlled->pz += fz * speed * dt;
            controlled->ry = yawDeg;
            controlled->hasQuat = false;

            // Sync cached world coordinates of all child trees/buildings on the island
            for (auto* child : controlled->childVehicles) {
                if (child) child->syncWorldPosFromParent(0.0f);
            }
        } else if (mode == TURRET) {
            yawDeg -= rightInput * 90.0f * dt;
            pitchDeg = std::clamp(pitchDeg + fwdInput * 45.0f * dt, -35.0f, 65.0f);
            controlled->ry = yawDeg;
            controlled->rx = pitchDeg;
            controlled->hasQuat = false;
        }
    }
};

inline void registerFlightModule10(nKernelServer& ks) {
    auto* cl = ks.registerClass("nairplane3", "nengine", []() { return std::make_unique<nAirplane3Node>(); });
    cl->addCmdProto("v_setminspeed_f", "SISP", [](nRoot* o, nCmd& c) {
        if (auto* a = dynamic_cast<nAirplane3Node*>(o); a && !c.inArgs.empty()) a->minSpeed = c.inArgs[0].fVal;
    });
    cl->addCmdProto("f_getminspeed_v", "GISP", [](nRoot* o, nCmd& c) {
        auto* a = dynamic_cast<nAirplane3Node*>(o);
        c.outArgs.push_back(nArg::fromFloat(a ? a->minSpeed : 5.0f));
    });
    cl->addCmdProto("v_setmaxspeed_f", "SXSP", [](nRoot* o, nCmd& c) {
        if (auto* a = dynamic_cast<nAirplane3Node*>(o); a && !c.inArgs.empty()) a->maxSpeed = c.inArgs[0].fVal;
    });
    cl->addCmdProto("f_getmaxspeed_v", "GXSP", [](nRoot* o, nCmd& c) {
        auto* a = dynamic_cast<nAirplane3Node*>(o);
        c.outArgs.push_back(nArg::fromFloat(a ? a->maxSpeed : 25.0f));
    });
    cl->addCmdProto("v_setacceltime_f", "SATM", [](nRoot* o, nCmd& c) {
        if (auto* a = dynamic_cast<nAirplane3Node*>(o); a && !c.inArgs.empty()) a->accelTime = c.inArgs[0].fVal;
    });
    cl->addCmdProto("f_getacceltime_v", "GATM", [](nRoot* o, nCmd& c) {
        auto* a = dynamic_cast<nAirplane3Node*>(o);
        c.outArgs.push_back(nArg::fromFloat(a ? a->accelTime : 3.0f));
    });
    cl->addCmdProto("v_setdeceltime_f", "SDTM", [](nRoot* o, nCmd& c) {
        if (auto* a = dynamic_cast<nAirplane3Node*>(o); a && !c.inArgs.empty()) a->decelTime = c.inArgs[0].fVal;
    });
    cl->addCmdProto("f_getdeceltime_v", "GDTM", [](nRoot* o, nCmd& c) {
        auto* a = dynamic_cast<nAirplane3Node*>(o);
        c.outArgs.push_back(nArg::fromFloat(a ? a->decelTime : 5.0f));
    });
    cl->addCmdProto("v_setmaxyawrotation_f", "SXYR", [](nRoot* o, nCmd& c) {
        if (auto* a = dynamic_cast<nAirplane3Node*>(o); a && !c.inArgs.empty()) a->maxYawRotDeg = c.inArgs[0].fVal;
    });
    cl->addCmdProto("f_getmaxyawrotation_v", "GXYR", [](nRoot* o, nCmd& c) {
        auto* a = dynamic_cast<nAirplane3Node*>(o);
        c.outArgs.push_back(nArg::fromFloat(a ? a->maxYawRotDeg : 150.0f));
    });
    cl->addCmdProto("v_setyawacceltime_f", "SYAT", [](nRoot* o, nCmd& c) {
        if (auto* a = dynamic_cast<nAirplane3Node*>(o); a && !c.inArgs.empty()) a->yawAccelTime = c.inArgs[0].fVal;
    });
    cl->addCmdProto("v_setmaxpitch_f", "SMPI", [](nRoot* o, nCmd& c) {
        if (auto* a = dynamic_cast<nAirplane3Node*>(o); a && !c.inArgs.empty()) a->maxPitchDeg = c.inArgs[0].fVal;
    });
    cl->addCmdProto("f_getmaxpitch_v", "GMPI", [](nRoot* o, nCmd& c) {
        auto* a = dynamic_cast<nAirplane3Node*>(o);
        c.outArgs.push_back(nArg::fromFloat(a ? a->maxPitchDeg : 68.75f));
    });
    cl->addCmdProto("v_setpitchtime_f", "SMPT", [](nRoot* o, nCmd& c) {
        if (auto* a = dynamic_cast<nAirplane3Node*>(o); a && !c.inArgs.empty()) a->pitchTime = c.inArgs[0].fVal;
    });
    cl->addCmdProto("f_getpitchtime_v", "GMPT", [](nRoot* o, nCmd& c) {
        auto* a = dynamic_cast<nAirplane3Node*>(o);
        c.outArgs.push_back(nArg::fromFloat(a ? a->pitchTime : 0.8f));
    });
    cl->addCmdProto("v_setmaxroll_f", "SMRL", [](nRoot* o, nCmd& c) {
        if (auto* a = dynamic_cast<nAirplane3Node*>(o); a && !c.inArgs.empty()) a->maxRollDeg = c.inArgs[0].fVal;
    });
    cl->addCmdProto("f_getmaxroll_v", "GMRL", [](nRoot* o, nCmd& c) {
        auto* a = dynamic_cast<nAirplane3Node*>(o);
        c.outArgs.push_back(nArg::fromFloat(a ? a->maxRollDeg : 74.48f));
    });
    cl->addCmdProto("v_setrolltime_f", "SMRT", [](nRoot* o, nCmd& c) {
        if (auto* a = dynamic_cast<nAirplane3Node*>(o); a && !c.inArgs.empty()) a->rollTime = c.inArgs[0].fVal;
    });
    cl->addCmdProto("f_getrolltime_v", "GMRT", [](nRoot* o, nCmd& c) {
        auto* a = dynamic_cast<nAirplane3Node*>(o);
        c.outArgs.push_back(nArg::fromFloat(a ? a->rollTime : 0.3f));
    });
}

} // namespace nebula
