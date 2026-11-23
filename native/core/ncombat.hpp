#pragma once
// Module 4 (Decompiled from nnomads.dll & verified against spec_nnomads.json + loaddiefeinde.n):
//   - nFireMachineGun (sizeof=184, 18 AddCmd)
//   - nFireMissile    (sizeof=712, 15 AddCmd)
//   - nExplosion      (sizeof=212,  7 AddCmd)
//   - nAttack         (sizeof=120,  8 AddCmd)
//   - nCommandList    (sizeof=112)
//   - nCombatSystem: real projectiles, faction targeting, AI fighter steering, auto-turrets,
//     energy damage, explosion flashes, and real `destroyed` event dispatch to nEventHandler!

#include <algorithm>
#include <array>
#include <cmath>
#include <iostream>
#include <string>
#include <vector>

#include "nbook.hpp"
#include "nkernel.hpp"
#include "nworld.hpp"

namespace nebula {

// ---------------------------------------------------------------------------
// 1. Decompiled Combat Component Classes
// ---------------------------------------------------------------------------
class nFireMachineGun : public nRoot {
public:
    // Exact j_guntower01.n/_main.n defaults
    float mgRadius = 0.5f, mgEndRadius = 3.0f;
    float shotDistance = 0.1429f, mgSpeed = 700.0f;
    float damage = 12.0f, reach = 650.0f;
    std::string damageType = "bullet";
    std::vector<std::array<float, 3>> barrels;
};

class nFireMissile : public nRoot {
public:
    float shotDelay = 1.2f, startSpeed = 90.0f, spreadAngle = 0.0f;
    int numMissiles = 1;
    std::string weaponProto;
};

class nExplosion : public nRoot {
public:
    std::string damageType, baseDebris, energyClot;
};

class nAttack : public nRoot {
public:
    float shotDist = 200.0f, shotAngle = 25.0f, weaponRadius = 2.0f;
    bool attackAll = false;
};

class nCommandList : public nRoot {
public:
    std::vector<std::string> commands;
    std::string adjustType;
    std::string testCommand;
};

// ---------------------------------------------------------------------------
// 2. Live Projectiles & Explosions + AI Combat Tick
// ---------------------------------------------------------------------------
struct Projectile {
    float px, py, pz;
    float vx, vy, vz;
    float damage = 25.0f;
    float life   = 3.0f;
    int   faction = 0; // shooter faction
    nEntity* owner = nullptr;
};

struct ExplosionFX {
    float px, py, pz;
    float age = 0.0f;
    float maxAge = 0.85f;
    float maxRadius = 18.0f;
};

class nCombatSystem {
public:
    std::vector<Projectile>  projectiles;
    std::vector<ExplosionFX> explosions;

    std::function<void(const std::string&)> onPlaySound;

    void clear() {
        projectiles.clear();
        explosions.clear();
    }

    static int getEntityFaction(const nEntity* e) {
        if (!e) return 0;
        if (auto* cl = dynamic_cast<const nClan*>(e->parent)) return cl->faction;
        return 0;
    }

    static bool isFighterProto(const std::string& p) {
        std::string l = nKernelServer::toLower(p);
        return l.find("shark") != std::string::npos || l.find("scout") != std::string::npos ||
               l.find("flieger") != std::string::npos || l.find("bomber") != std::string::npos;
    }

    static bool isTurretProto(const std::string& p) {
        std::string l = nKernelServer::toLower(p);
        return l.find("guntower") != std::string::npos || l.find("flak") != std::string::npos;
    }

    void fireProjectile(float x, float y, float z, float dx, float dy, float dz,
                        float speed, float damage, int faction, nEntity* owner = nullptr) {
        float l = std::sqrt(dx*dx + dy*dy + dz*dz);
        if (l < 1e-5f) return;
        projectiles.push_back({x, y, z, (dx/l)*speed, (dy/l)*speed, (dz/l)*speed, damage, 3.2f, faction, owner});
    }

    void applyDamage(nEntity* target, float dmg, nEventHandler* eh, nRealWorld* rw) {
        if (!target || !target->visible || target->state == "destroyed") return;
        target->energy = std::max(0.0f, target->energy - dmg);
        if (target->energy <= 0.0f) {
            target->state = "destroyed";
            target->visible = false;
            explosions.push_back({target->px, target->py, target->pz, 0.0f, 0.9f, 22.0f});
            std::cout << "[nCombat] Destroyed " << target->protoName << " (" << target->name << ")\n";
            if (rw) rw->worldDirty = true;
            if (eh) {
                auto it = target->eventSlots.find("destroyed");
                if (it != target->eventSlots.end() && !it->second.empty()) {
                    eh->putEvent(it->second);
                }
            }
        }
    }

    void update(float dt, nRealWorld* rw) {
        if (!rw) return;
        auto* eh = rw->ks ? dynamic_cast<nEventHandler*>(rw->ks->lookup("/game/handler/event")) : nullptr;

        // 1. Update AI fighters (settask attack ...) and friendly auto-turrets
        for (auto* e : rw->entities) {
            if (!e || !e->visible || e->artefactMode || e->state == "destroyed" || e->cinePlaying) continue;
            int myFac = getEntityFaction(e);
            if (e->fireCooldown > 0.0f) e->fireCooldown -= dt;

            // AI Fighter steering + strafing
            if (isFighterProto(e->protoName) && !e->taskName.empty()) {
                nEntity* tgt = !e->taskTarget.empty() ? rw->findBySymbolicName(e->taskTarget) : nullptr;
                if (!tgt || !tgt->visible) {
                    // Fallback: find nearest opposing visible turret or non-island target
                    float bestD2 = 1e12f;
                    for (auto* cand : rw->entities) {
                        if (!cand || !cand->visible || cand->artefactMode || cand->state == "destroyed") continue;
                        if (getEntityFaction(cand) == myFac) continue;
                        if (!isTurretProto(cand->protoName) && !isFighterProto(cand->protoName)) continue;
                        float dx = cand->px - e->px, dy = cand->py - e->py, dz = cand->pz - e->pz;
                        float d2 = dx*dx + dy*dy + dz*dz;
                        if (d2 < bestD2) { bestD2 = d2; tgt = cand; }
                    }
                }
                if (tgt) {
                    float dx = tgt->px - e->px;
                    float dy = (tgt->py + 18.0f) - e->py;
                    float dz = tgt->pz - e->pz;
                    float dist = std::sqrt(dx*dx + dy*dy + dz*dz);
                    if (dist > 1.0f) {
                        float speed = 42.0f;
                        // Approach until 75m, then orbit-strafe around target
                        float vx, vy, vz;
                        if (dist > 75.0f) {
                            vx = (dx / dist) * speed;
                            vy = (dy / dist) * speed;
                            vz = (dz / dist) * speed;
                        } else {
                            vx = (-dz / dist) * speed;
                            vy = (dy / dist) * 12.0f;
                            vz = (dx / dist) * speed;
                        }
                        e->px += vx * dt;
                        e->py += vy * dt;
                        e->pz += vz * dt;
                        // Local forward is -Z (verified from nislanddrive.asm 0x1002fc71)
                        e->ry = std::atan2(-vx, -vz) * 180.0f / 3.14159265f;
                        e->hasQuat = false;
                        e->aiMoving = true;

                        // Fire at target when within 300m
                        if (dist < 300.0f && e->fireCooldown <= 0.0f) {
                            fireProjectile(e->px, e->py, e->pz, tgt->px - e->px, tgt->py - e->py, tgt->pz - e->pz,
                                           420.0f, 12.0f, myFac, e);
                            e->fireCooldown = 0.45f;
                        }
                    }
                }
            }
            // Auto-turrets (j_guntower01: SSTD=500m, SMGS=700m/s, SSDT=0.1429s, SDMG=12)
            else if (isTurretProto(e->protoName) && e->state != "sleep") {
                nEntity* best = nullptr;
                float bestD2 = 500.0f * 500.0f;
                for (auto* cand : rw->entities) {
                    if (!cand || !cand->visible || cand->state == "destroyed") continue;
                    if (!isFighterProto(cand->protoName)) continue;
                    if (getEntityFaction(cand) == myFac) continue;
                    float dx = cand->px - e->px, dy = cand->py - e->py, dz = cand->pz - e->pz;
                    float d2 = dx*dx + dy*dy + dz*dz;
                    if (d2 < bestD2) { bestD2 = d2; best = cand; }
                }
                if (best && e->fireCooldown <= 0.0f) {
                    fireProjectile(e->px, e->py + 6.0f, e->pz,
                                   best->px - e->px, best->py - (e->py + 6.0f), best->pz - e->pz,
                                   700.0f, 12.0f, myFac, e);
                    e->fireCooldown = 0.1429f;
                }
            }
        }

        // 2. Step projectiles & check hits
        for (size_t i = 0; i < projectiles.size();) {
            auto& p = projectiles[i];
            p.px += p.vx * dt;
            p.py += p.vy * dt;
            p.pz += p.vz * dt;
            p.life -= dt;

            bool hit = false;
            if (p.life > 0.0f) {
                for (auto* e : rw->entities) {
                    if (!e || !e->visible || e->artefactMode || e->state == "destroyed" || e == p.owner) continue;
                    if (getEntityFaction(e) == p.faction) continue;
                    if (!isFighterProto(e->protoName) && !isTurretProto(e->protoName)) continue;
                    float dx = p.px - e->px, dy = p.py - e->py, dz = p.pz - e->pz;
                    if (dx*dx + dy*dy + dz*dz <= 14.0f * 14.0f) {
                        applyDamage(e, p.damage, eh, rw);
                        hit = true;
                        break;
                    }
                }
            }
            if (hit || p.life <= 0.0f) {
                projectiles.erase(projectiles.begin() + static_cast<long>(i));
            } else {
                ++i;
            }
        }

        // 3. Step explosions
        for (size_t i = 0; i < explosions.size();) {
            explosions[i].age += dt;
            if (explosions[i].age >= explosions[i].maxAge) {
                explosions.erase(explosions.begin() + static_cast<long>(i));
            } else {
                ++i;
            }
        }
    }
};

// ---------------------------------------------------------------------------
// Register Module 4 classes & commands on nKernelServer
// ---------------------------------------------------------------------------
inline void registerCombatModule4(nKernelServer& ks) {
    auto* clMG = ks.registerClass("nfiremachinegun", "nfireweapon", []() { return std::make_unique<nFireMachineGun>(); });
    clMG->addCmdProto("v_setdamage_f", "SDMG", [](nRoot* o, nCmd& c) {
        if (auto* m = dynamic_cast<nFireMachineGun*>(o); m && !c.inArgs.empty()) m->damage = c.inArgs[0].fVal;
    });
    clMG->addCmdProto("f_getdamage_v", "GDMG", [](nRoot* o, nCmd& c) {
        auto* m = dynamic_cast<nFireMachineGun*>(o); c.outArgs.push_back(nArg::fromFloat(m ? m->damage : 12.0f));
    });
    clMG->addCmdProto("v_setshotdistance_f", "SSDT", [](nRoot* o, nCmd& c) {
        if (auto* m = dynamic_cast<nFireMachineGun*>(o); m && !c.inArgs.empty()) m->shotDistance = c.inArgs[0].fVal;
    });
    clMG->addCmdProto("v_setmgspeed_f", "SMGS", [](nRoot* o, nCmd& c) {
        if (auto* m = dynamic_cast<nFireMachineGun*>(o); m && !c.inArgs.empty()) m->mgSpeed = c.inArgs[0].fVal;
    });

    auto* clMis = ks.registerClass("nfiremissile", "nfireweapon", []() { return std::make_unique<nFireMissile>(); });
    clMis->addCmdProto("v_setshotdelay_f", "SSTD", [](nRoot* o, nCmd& c) {
        if (auto* m = dynamic_cast<nFireMissile*>(o); m && !c.inArgs.empty()) m->shotDelay = c.inArgs[0].fVal;
    });
    clMis->addCmdProto("v_setstartspeed_f", "SSSP", [](nRoot* o, nCmd& c) {
        if (auto* m = dynamic_cast<nFireMissile*>(o); m && !c.inArgs.empty()) m->startSpeed = c.inArgs[0].fVal;
    });
    clMis->addCmdProto("v_setweaponproto_s", "SWPP", [](nRoot* o, nCmd& c) {
        if (auto* m = dynamic_cast<nFireMissile*>(o); m && !c.inArgs.empty()) m->weaponProto = c.inArgs[0].sVal;
    });

    ks.registerClass("nexplosion", "nservice", []() { return std::make_unique<nExplosion>(); });
    ks.registerClass("nattack", "nservice", []() { return std::make_unique<nAttack>(); });

    auto* clCL = ks.registerClass("ncommandlist", "nroot", []() { return std::make_unique<nCommandList>(); });
    clCL->addCmdProto("v_addcommand_s", "ADCM", [](nRoot* o, nCmd& c) {
        if (auto* l = dynamic_cast<nCommandList*>(o); l && !c.inArgs.empty()) l->commands.push_back(c.inArgs[0].sVal);
    });
    clCL->addCmdProto("v_setadjusttype_s", "SADT", [](nRoot* o, nCmd& c) {
        if (auto* l = dynamic_cast<nCommandList*>(o); l && !c.inArgs.empty()) l->adjustType = c.inArgs[0].sVal;
    });
    clCL->addCmdProto("v_settestcommand_s", "STCM", [](nRoot* o, nCmd& c) {
        if (auto* l = dynamic_cast<nCommandList*>(o); l && !c.inArgs.empty()) l->testCommand = c.inArgs[0].sVal;
    });

    // Wire faction on nClan + settask on nContainer
    if (auto* clClan = ks.findClass("nclan")) {
        clClan->addCmdProto("v_setfaction_i", "SFAC", [](nRoot* o, nCmd& c) {
            if (auto* cl = dynamic_cast<nClan*>(o); cl && !c.inArgs.empty()) cl->faction = c.inArgs[0].iVal;
        });
        clClan->addCmdProto("i_getfaction_v", "GFAC", [](nRoot* o, nCmd& c) {
            auto* cl = dynamic_cast<nClan*>(o); c.outArgs.push_back(nArg::fromInt(cl ? cl->faction : 0));
        });
    }
    if (auto* clCont = ks.findClass("ncontainer")) {
        clCont->addCmdProto("v_settask_ss", "STSK", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && c.inArgs.size() >= 2) {
                e->taskName = c.inArgs[0].sVal;
                e->taskTarget = c.inArgs[1].sVal;
            }
        });
    }
}

} // namespace nebula
