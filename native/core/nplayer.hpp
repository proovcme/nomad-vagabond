#pragma once
// Phase 2: Native C++17 Hero Physics & 3rd-Person Camera Controller
// Re-implements nMaennelWalk2 + nJumpEngine + jetpack + nChaseViewer.

#include <algorithm>
#include <cmath>
#include <string>

#include "ncollide.hpp"

namespace nebula {

struct PlayerInput {
    float moveForward = 0.0f; // +1 W/Up, -1 S/Down
    float moveRight   = 0.0f; // +1 D/Right, -1 A/Left
    bool  jumpHeld    = false;
    bool  jumpPressed = false;
    bool  sprintHeld  = false;
};

struct nPlayerController {
    std::string protoName = "char_john";
    Vec3c spawnPos = {-7715.0f, -124.0f, -5939.0f};
    Vec3c pos      = {-7715.0f, -124.0f, -5939.0f};
    Vec3c vel      = {0, 0, 0};

    float facingYaw = 0.0f;   // radians
    bool  grounded  = false;
    bool  jetpacking = false;
    bool  skidding  = false;
    float airTime   = 0.0f;
    float jumpCooldown = 0.0f; // Verified from njumpengine.asm (0x100458e7): 0.5s cooldown

    // Exact char_john.n/_main.n + nmaennelwalk2.asm parameters
    float maxWalkSpeed     = 8.0f;   // SMXS = 8.0 m/s
    float maxSprintSpeed   = 14.0f;  // turbo walk
    float maxJetpackSpeed  = 30.0f;  // nairplane3 SXSP = 30.0 m/s
    float skidSpeed        = 10.0f;  // SSKS = 10.0 m/s
    float maxWalkableCos   = 0.6428f; // cos(50 deg), SMWA = 50 (nmaennelwalk2 0x10044d1c)
    float maxYawRateRad    = 3.14159265f; // SXYR = 180 deg/s

    // nChaseViewer 3rd-person orbit camera (verified from nchaseviewer.asm)
    float camYaw   = 0.0f;
    float camPitch = 0.30f;
    float camDist  = 11.5f;
    Vec3c smoothTarget = {-7715.0f, -122.2f, -5939.0f};
    bool  camInit  = false;

    std::string currentAnim = "boden_stehen";

    void spawnAt(float x, float y, float z, const nOpcodeServer& coll) {
        spawnPos = {x, y, z};
        float hitY = y;
        Vec3c nrm{0, 1, 0};
        if (coll.raycastDown(x, y + 120.0f, z, 300.0f, hitY, nrm)) {
            pos = {x, hitY + 0.1f, z};
            grounded = true;
        } else {
            pos = {x, y + 5.0f, z};
            grounded = false;
        }
        vel = {0, 0, 0};
        airTime = 0.0f;
        jumpCooldown = 0.0f;
        jetpacking = false;
        skidding = false;
        smoothTarget = {pos.x, pos.y + 1.8f, pos.z};
        camInit = true;
        currentAnim = "boden_stehen";
    }

    void update(float dt, const PlayerInput& in, const nOpcodeServer& coll) {
        dt = std::clamp(dt, 0.001f, 0.05f);
        if (jumpCooldown > 0.0f) jumpCooldown = std::max(0.0f, jumpCooldown - dt);

        // Compute horizontal forward & right from camera yaw
        float fx = std::sin(camYaw);
        float fz = -std::cos(camYaw);
        float rx = std::cos(camYaw);
        float rz = std::sin(camYaw);

        float mx = fx * in.moveForward + rx * in.moveRight;
        float mz = fz * in.moveForward + rz * in.moveRight;
        float mlen = std::sqrt(mx*mx + mz*mz);
        if (mlen > 1.0f) { mx /= mlen; mz /= mlen; mlen = 1.0f; }

        // Turn hero toward movement direction (hero local forward is -Z!)
        // Respects nairplane3 SXYR=180 deg/s in flight and crisp turning on foot
        if (mlen > 0.05f) {
            float targetYaw = std::atan2(-mx, -mz);
            float diff = targetYaw - facingYaw;
            while (diff >  3.14159265f) diff -= 6.2831853f;
            while (diff < -3.14159265f) diff += 6.2831853f;
            float maxStep = jetpacking ? (maxYawRateRad * dt) : (dt * 12.0f * std::fabs(diff));
            if (jetpacking) {
                facingYaw += std::clamp(diff, -maxStep, maxStep);
            } else {
                facingYaw += diff * std::min(1.0f, dt * 12.0f);
            }
        }

        // Jump & Jetpack (verified njumpengine 0.5s cooldown + nairplane3 30 m/s flight)
        if (grounded) {
            airTime = 0.0f;
            jetpacking = false;
            if (in.jumpPressed && jumpCooldown <= 0.0f) {
                vel.y = 12.0f;
                grounded = false;
                skidding = false;
                jumpCooldown = 0.5f;
            }
        } else {
            airTime += dt;
            // Hold Space in mid-air -> Jetpack (nairplane3: minspeed=0, maxspeed=30, acceltime=1s)
            if (in.jumpHeld && airTime > 0.15f) {
                jetpacking = true;
                float thrust = in.sprintHeld ? 36.0f : 27.0f;
                vel.y += thrust * dt;
                vel.y = std::min(vel.y, in.sprintHeld ? 20.0f : 12.0f);
            } else {
                jetpacking = false;
            }
        }

        // Horizontal speed (char_john.n: walk=8 m/s, jetpack=30 m/s, acceltime=1s)
        float maxSpeed = jetpacking ? (in.sprintHeld ? maxJetpackSpeed : maxJetpackSpeed * 0.65f)
                                    : (in.sprintHeld ? maxSprintSpeed : maxWalkSpeed);
        float accel = grounded ? 12.0f : (jetpacking ? 3.5f : 4.0f);
        if (!skidding) {
            vel.x += (mx * maxSpeed - vel.x) * std::min(1.0f, dt * accel);
            vel.z += (mz * maxSpeed - vel.z) * std::min(1.0f, dt * accel);
        }

        // Gravity (SGRF = 1.0)
        if (!grounded) {
            vel.y -= 22.0f * dt;
            vel.y = std::max(vel.y, -45.0f);
        }

        // Integrate position
        Vec3c nextPos = pos + vel * dt;

        // Ground collision raycast (nwalkcollhandle2 SMSH=0.5m, +margin for coarse meshes)
        float groundY = 0.0f;
        Vec3c groundNrm{0, 1, 0};
        bool hasGround = coll.raycastDown(nextPos.x, nextPos.y + 1.8f, nextPos.z, 6.0f, groundY, groundNrm);

        if (hasGround && vel.y <= 0.5f && nextPos.y <= groundY + 0.35f) {
            nextPos.y = groundY;
            vel.y = 0.0f;
            grounded = true;
            jetpacking = false;
            // nMaennelWalk2 steep slope skid check (SMWA = 50 deg, SSKS = 10 m/s)
            if (groundNrm.y > 0.05f && groundNrm.y < maxWalkableCos) {
                skidding = true;
                float sx = groundNrm.x, sz = groundNrm.z;
                float slen = std::sqrt(sx*sx + sz*sz);
                if (slen > 1e-4f) {
                    vel.x += ((sx / slen) * skidSpeed - vel.x) * std::min(1.0f, dt * 6.0f);
                    vel.z += ((sz / slen) * skidSpeed - vel.z) * std::min(1.0f, dt * 6.0f);
                }
            } else {
                skidding = false;
            }
        } else {
            if (grounded && hasGround && (pos.y - groundY) < 1.0f) {
                nextPos.y = groundY;
                vel.y = 0.0f;
                skidding = false;
            } else {
                grounded = false;
                skidding = false;
            }
        }

        pos = nextPos;

        // Smooth nChaseViewer target lag (nchaseviewer.asm follow rate ~5.0)
        Vec3c desiredTarget{pos.x, pos.y + 1.8f, pos.z};
        if (!camInit) {
            smoothTarget = desiredTarget;
            camInit = true;
        } else {
            float k = std::min(1.0f, dt * 10.0f);
            smoothTarget = smoothTarget + (desiredTarget - smoothTarget) * k;
        }

        // Safety respawn if hero falls deep into the clouds
        if (pos.y < spawnPos.y - 350.0f) {
            spawnAt(spawnPos.x, spawnPos.y, spawnPos.z, coll);
        }

        // Choose live NAX0 skeletal animation state
        float horizSpeed = std::sqrt(vel.x*vel.x + vel.z*vel.z);
        if (!grounded) {
            currentAnim = (jetpacking && in.sprintHeld) ? "fliegen_highspeed" : "fliegen_medium";
        } else if (horizSpeed > 0.8f) {
            currentAnim = "boden_run";
        } else {
            currentAnim = "boden_stehen";
        }
    }

    // Compute nChaseViewer camera eye & look target
    void getChaseCamera(Vec3c& outEye, Vec3c& outTarget) const {
        outTarget = camInit ? smoothTarget : Vec3c{pos.x, pos.y + 1.8f, pos.z};
        float cp = std::cos(camPitch);
        float sp = std::sin(camPitch);
        outEye = {
            outTarget.x - camDist * cp * std::sin(camYaw),
            outTarget.y + camDist * sp,
            outTarget.z + camDist * cp * std::cos(camYaw)
        };
    }
};

} // namespace nebula
