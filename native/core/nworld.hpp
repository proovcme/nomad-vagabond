#pragma once
// Native C++17 World & Entity System (nRealWorld, nClan, nContainer)
// Integrated with Module 1 (nBookHandler, nEventHandler, nCookieHandler):
// Executes real campaign book/story.tcl, loadencounter, t_timer, and t_walkover entities!

#include <cmath>
#include <functional>
#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>

#include "nbook.hpp"
#include "ncinematics.hpp"
#include "nfileserver.hpp"
#include "nkernel.hpp"
#include "ntclserver.hpp"
#include "../viewer/nebula_assets.hpp"

namespace nebula {

class nEntity : public nRoot {
public:
    std::string protoName;
    std::string symbolicName;
    std::string state = "normal";
    float px = 0, py = 0, pz = 0;
    float rx = 0, ry = 0, rz = 0; // degrees (setdirection)
    bool  hasQuat = false;
    float qx = 0, qy = 0, qz = 0, qw = 1;
    bool  visible = true;
    bool  artefactMode = false;
    bool  inBelt = false;
    float energy = 100.0f;
    float maxEnergy = 100.0f;
    int   charges = 0;

    // Parent-island alignment & hierarchy (alignvehicle / addchildvehicle)
    nEntity* parentVehicle = nullptr;
    std::vector<nEntity*> childVehicles;
    bool  hasParentAlign = false;
    float relPx = 0, relPy = 0, relPz = 0;
    float relRx = 0, relRy = 0, relRz = 0; // degrees

    // Harmonic island/object bobbing (nSwingEngine: amp, period, phase)
    float swingX[3] = {0, 0, 0};
    float swingY[3] = {0, 0, 0};
    float swingZ[3] = {0, 0, 0};

    bool isSwinging() const {
        return (swingX[0] != 0.0f && swingX[1] > 1e-4f) ||
               (swingY[0] != 0.0f && swingY[1] > 1e-4f) ||
               (swingZ[0] != 0.0f && swingZ[1] > 1e-4f);
    }

    bool isDynamicTransform(int depth = 0) const {
        if (cinePlaying || aiMoving || isSwinging()) return true;
        if (parentVehicle && depth < 8) return parentVehicle->isDynamicTransform(depth + 1);
        return false;
    }

    static float swingOffset(const float s[3], float t) {
        if (s[0] == 0.0f || s[1] <= 1e-4f) return 0.0f;
        return s[0] * std::sin(6.28318530718f * (t + s[2]) / s[1]);
    }

    Mat4 computeWorldMatrix(float t = 0.0f, int depth = 0) const {
        if (parentVehicle && hasParentAlign && depth < 8) {
            Mat4 mp = parentVehicle->computeWorldMatrix(t, depth + 1);
            // Exact Nebula order verified from nContainer::AlignVehicle (0x10018a91):
            // Row-major Rx*Ry*Rz -> Column-major Rz*Ry*Rx
            Mat4 ml = Mat4::translate(relPx, relPy, relPz)
                    * Mat4::rotateZ(relRz)
                    * Mat4::rotateY(relRy)
                    * Mat4::rotateX(relRx);
            return mp * ml;
        }
        float tx = px + swingOffset(swingX, t);
        float ty = py + swingOffset(swingY, t);
        float tz = pz + swingOffset(swingZ, t);
        Mat4 M = Mat4::translate(tx, ty, tz);
        if (hasQuat) {
            M = M * Mat4::fromQuat(-qx, -qy, -qz, qw);
        } else {
            // Exact Nebula order verified from nMatrix3D::SetEuler (0x10012aae) + transpose (0x10013eb9):
            // Column-major Rz(rz) * Ry(ry) * Rx(rx)
            M = M * Mat4::rotateZ(rz) * Mat4::rotateY(ry) * Mat4::rotateX(rx);
        }
        return M;
    }

    void syncWorldPosFromParent(float t = 0.0f) {
        if (!parentVehicle || !hasParentAlign) return;
        Mat4 M = computeWorldMatrix(t);
        px = M.m[12];
        py = M.m[13];
        pz = M.m[14];
    }

    // Combat & AI task state (Module 4)
    std::string taskName;
    std::string taskTarget;
    float fireCooldown = 0.0f;
    bool  aiMoving = false;

    // Island navigation & lock state (Module 5)
    bool  islandLocked = true;
    bool  navEnabled   = false;
    std::string navTargetSym;

    // Cinematic playback (nCinematicPlayer / nSubtitlePlayer)
    std::string cinematicSeqPath;
    nAnimSequence* cineSeq = nullptr;
    float cineTime = -0.001f;
    bool  cinePlaying = false;

    // Trigger & Timer properties (for t_walkover, t_timer, etc.)
    bool throwEvents = false;
    float triggerRadius = 0.0f;
    float cycleTime = 0.0f;
    float timerAccum = 0.0f;
    int numCycles = 0;
    int cyclesDone = 0;
    std::unordered_map<std::string, std::string> eventSlots;
};

class nRealWorld;

class nClan : public nRoot {
public:
    nRealWorld* world = nullptr;
    std::string realName;
    bool isUser = false;
    bool isEnvironment = false;
    int entityCounter = 0;
    int faction = 0;
    float currentEnergy = 1000.0f;
    float baseMaximum   = 1000.0f;
    float clanColor[3]  = {1.0f, 1.0f, 1.0f};
    bool  noticeEnergy  = true;
};

class nCollServerNode : public nRoot {
public:
    std::vector<std::string> collClasses;
    std::unordered_map<std::string, std::string> collPairs; // "a|b" -> "contact"/"quick"/"ignore"

    void addClass(const std::string& cls) {
        collClasses.push_back(cls);
    }
    void addType(const std::string& a, const std::string& b, const std::string& mode) {
        collPairs[a + "|" + b] = mode;
        collPairs[b + "|" + a] = mode;
    }
    std::string queryType(const std::string& a, const std::string& b) const {
        auto it = collPairs.find(a + "|" + b);
        return (it != collPairs.end()) ? it->second : "ignore";
    }
};

class nRealWorld : public nRoot {
public:
    std::vector<nEntity*> entities;
    std::unordered_map<std::string, std::string> protoAliases;
    nClan* activeClan = nullptr;
    nClan* envClan = nullptr;
    nClan* userClan = nullptr;
    nEntity* userMaennel = nullptr;
    int clanCounter = 0;

    std::string resolveAlias(const std::string& proto) const {
        std::string cur = NpkArchive::toLower(proto);
        for (int i = 0; i < 8; ++i) {
            auto it = protoAliases.find(cur);
            if (it == protoAliases.end() || it->second == cur) break;
            cur = it->second;
        }
        return cur;
    }

    float spawnX = -7715.0f, spawnY = -124.0f, spawnZ = -5939.0f;
    bool hasMissionLoaded = false;
    bool worldDirty = false;
    nEntity* activeCineCamera = nullptr;

    // Exact Time-of-Day clock (verified from nRealWorld.asm 0x100741d3..0x10074259)
    double globalTime     = 0.0;
    double dayPeriod      = 1200.0;           // real seconds per 24h game day (+0x3e0)
    double timeScale      = 86400.0 / 1200.0; // (+0x3e8)
    double timeOfDay      = 50000.0;          // [0..86400] seconds (+0x3f0)
    double timeOfDayStart = -50000.0 / (86400.0 / 1200.0); // (+0x3f8)

    void setTimeOfDay(double sec) {
        timeOfDayStart = globalTime - (sec / timeScale);
        timeOfDay = std::fmod(sec, 86400.0);
        if (timeOfDay < 0.0) timeOfDay += 86400.0;
    }
    void setDayPeriod(double periodSec) {
        dayPeriod = std::max(1.0, periodSec);
        timeScale = 86400.0 / dayPeriod;
        setTimeOfDay(timeOfDay);
    }
    void updateTimeOfDay() {
        timeOfDay = std::fmod((globalTime - timeOfDayStart) * timeScale, 86400.0);
        if (timeOfDay < 0.0) timeOfDay += 86400.0;
    }

    std::function<void()> onWorldLoaded;
    std::function<void(const std::string&)> onPlaySound;
    std::function<void(const std::string&)> onShowSubtitle;
    std::function<void()> onHideSubtitle;

    nAnimSequence* resolveCinematic(const std::string& seqPath) {
        if (seqPath.empty() || !ks) return nullptr;
        if (auto* existing = dynamic_cast<nAnimSequence*>(ks->lookup(seqPath))) return existing;

        // Derive filename from `/game/cinematics/<name>` -> `<curPartDir>/cinematics/<name>.n`
        auto sl = seqPath.rfind('/');
        std::string seqName = (sl != std::string::npos) ? seqPath.substr(sl + 1) : seqPath;
        auto* bh = dynamic_cast<nBookHandler*>(ks->lookup("/game/handler/book"));
        auto* tcl = dynamic_cast<nTclServer*>(ks->lookup("/sys/servers/script"));
        if (!bh || !tcl) return nullptr;

        std::string partDir = bh->getCurrentPartDir();
        if (partDir.empty()) return nullptr;
        std::string fullPath = partDir + "/cinematics/" + seqName + ".n";
        std::ifstream ftest(fullPath);
        if (!ftest.good()) return nullptr;
        ftest.close();

        auto* seq = dynamic_cast<nAnimSequence*>(ks->newObj("nanimsequence", seqPath));
        if (!seq) return nullptr;
        ks->pushCwd(seq);
        tcl->runScriptFile(fullPath);
        ks->popCwd();
        std::cout << "[nCinematic] Loaded " << seqName << " (dur=" << seq->duration()
                  << "s, pos=" << seq->translates.size() << ", vis=" << seq->visuals.size()
                  << ", aud=" << seq->audios.size() << ")\n";
        return seq;
    }

    void skipActiveCinematics() {
        for (auto* e : entities) {
            if (e && e->cinePlaying) {
                e->cinePlaying = false;
            }
        }
        activeCineCamera = nullptr;
        if (onHideSubtitle) onHideSubtitle();
    }

    nFileServer* getFS() const {
        if (!ks) return nullptr;
        auto* fs = dynamic_cast<nFileServer*>(ks->lookup("/sys/servers/file2"));
        if (!fs) fs = dynamic_cast<nFileServer*>(ks->lookup("/sys/servers/file"));
        return fs;
    }

    void clearEntities() {
        entities.clear();
        activeClan = nullptr;
        envClan = nullptr;
        if (auto* clansNode = findChild("clans")) {
            clansNode->children.clear();
        }
        userClan = nullptr;
        userMaennel = nullptr;
    }

    nClan* createAndSelClan() {
        std::string cname = "clan" + std::to_string(++clanCounter);
        // Clans live 2 levels under /world (/world/clans/clanN) so `sel ../..` in encounter files returns to /world!
        auto* cl = dynamic_cast<nClan*>(ks->newObj("nclan", getFullName() + "/clans/" + cname));
        if (cl) {
            cl->world = this;
            activeClan = cl;
            ks->setCwd(cl);
        }
        return cl;
    }

    nEntity* createVehicle(nClan* clan, const std::string& proto, const std::string& entName, bool select) {
        if (!clan) clan = activeClan ? activeClan : createAndSelClan();
        std::string nm = entName.empty() ? (proto + std::to_string(++clan->entityCounter)) : entName;
        auto* ent = dynamic_cast<nEntity*>(ks->newObj("ncontainer", clan->getFullName() + "/" + nm));
        if (ent) {
            ent->protoName = proto;
            entities.push_back(ent);
            worldDirty = true;
            if (select) ks->setCwd(ent);
        }
        return ent;
    }

    void ensureUserClan() {
        if (!userClan) {
            userClan = dynamic_cast<nClan*>(ks->newObj("nclan", getFullName() + "/clans/userclan"));
            if (userClan) {
                userClan->world = this;
                userClan->isUser = true;
            }
        }
        if (!userMaennel && userClan) {
            userMaennel = dynamic_cast<nEntity*>(ks->newObj("nmaennel", userClan->getFullName() + "/maennel"));
            if (userMaennel) {
                userMaennel->protoName = "char_john";
                userMaennel->px = spawnX;
                userMaennel->py = spawnY;
                userMaennel->pz = spawnZ;
            }
        }
    }

    nClan* getEnvironmentClan() {
        if (envClan) return envClan;
        for (auto* e : entities) {
            if (auto* cl = dynamic_cast<nClan*>(e->parent); cl && cl->isEnvironment) {
                envClan = cl;
                return cl;
            }
        }
        if (!envClan) {
            envClan = createAndSelClan();
            if (envClan) envClan->isEnvironment = true;
        }
        return envClan;
    }

    nEntity* findBySymbolicName(const std::string& sym) const {
        for (auto* e : entities) {
            if (e && e->symbolicName == sym) return e;
        }
        return nullptr;
    }

    // Real /world.loadencounter <path> called by scriptlib.tcl `loadencounter`!
    nClan* loadEncounter(const std::string& rawPath) {
        auto* fs = getFS();
        auto* tcl = dynamic_cast<nTclServer*>(ks->lookup("/sys/servers/script"));
        if (!fs || !tcl) return nullptr;

        std::string full = fs->manglePath(rawPath);
        size_t before = entities.size();
        std::cout << "[nRealWorld] loadencounter: " << full << "\n";

        ks->pushCwd(this);
        tcl->runScriptFile(full);
        ks->popCwd();

        hasMissionLoaded = true;
        worldDirty = true;
        std::cout << "[nRealWorld]   -> +" << (entities.size() - before)
                  << " entities (total " << entities.size() << ")\n";
        return activeClan;
    }

    // Real /world.loadbook2 <bookPath> -> delegates directly to /game/handler/book.loadbook!
    bool loadBook2(const std::string& bookPath) {
        clearEntities();
        ensureUserClan();
        auto* bh = dynamic_cast<nBookHandler*>(ks->lookup("/game/handler/book"));
        if (!bh) return false;
        bool ok = bh->loadBook(bookPath, false);
        if (worldDirty && onWorldLoaded) {
            worldDirty = false;
            onWorldLoaded();
        }
        return ok;
    }

    // Frame tick: evaluates real cinematics, subtitles, t_timer & t_walkover entities + nEventHandler queue!
    void tick(float dt, float playerX, float playerY, float playerZ) {
        globalTime += static_cast<double>(dt);
        updateTimeOfDay();
        auto* eh = dynamic_cast<nEventHandler*>(ks->lookup("/game/handler/event"));
        activeCineCamera = nullptr;

        size_t count = entities.size();
        for (size_t i = 0; i < count; ++i) {
            nEntity* e = entities[i];
            if (!e) continue;

            // 0. Cinematic / Subtitle playback (nCinematicPlayer & nSubtitlePlayer)
            if (e->state == "cinematic" && !e->cinematicSeqPath.empty()) {
                if (!e->cineSeq) {
                    e->cineSeq = resolveCinematic(e->cinematicSeqPath);
                    if (e->cineSeq) {
                        e->cineTime = -0.001f;
                        e->cinePlaying = true;
                    }
                }
                if (e->cineSeq && e->cinePlaying) {
                    float prevT = e->cineTime;
                    float curT = (prevT < 0.0f) ? 0.0f : (prevT + dt);
                    e->cineTime = curT;

                    e->cineSeq->sampleTranslate(curT, e->px, e->py, e->pz);
                    Quat q;
                    if (e->cineSeq->sampleQuaternion(curT, q)) {
                        e->hasQuat = true;
                        e->qx = q.x; e->qy = q.y; e->qz = q.z; e->qw = q.w;
                    }

                    std::vector<std::string> visCues, audCues;
                    e->cineSeq->collectVisualCues(prevT, curT, visCues);
                    e->cineSeq->collectAudioCues(prevT, curT, audCues);

                    if (e->protoName == "subtitle") {
                        for (const auto& vc : visCues) {
                            if (vc.find("nix.bmp") != std::string::npos) {
                                if (onHideSubtitle) onHideSubtitle();
                            } else if (vc.find(".bmp") != std::string::npos) {
                                if (onShowSubtitle) onShowSubtitle(vc);
                            }
                        }
                    } else if (e->protoName == "camera") {
                        activeCineCamera = e;
                    } else {
                        for (const auto& vc : visCues) {
                            if (vc.find("invis") != std::string::npos) {
                                e->visible = false;
                            } else if (!vc.empty()) {
                                e->visible = true;
                            }
                        }
                    }
                    for (const auto& ac : audCues) {
                        auto hash = ac.find('#');
                        std::string apath = (hash != std::string::npos) ? ac.substr(hash + 1) : ac;
                        if (apath.find("nix.wav") == std::string::npos && apath.find(".wav") != std::string::npos) {
                            if (onPlaySound) onPlaySound(apath);
                        }
                    }

                    if (curT >= e->cineSeq->duration() + 0.2f) {
                        e->cinePlaying = false;
                        if (activeCineCamera == e) activeCineCamera = nullptr;
                        if (e->protoName == "subtitle" && onHideSubtitle) onHideSubtitle();
                    }
                }
            }

            if (!eh || !e->throwEvents) continue;

            // 1. t_timer entities (created by oneshottimer / timer / looptimer in story.tcl!)
            if (e->protoName == "t_timer" && e->cycleTime > 0.0f) {
                if (e->numCycles <= 0 || e->cyclesDone < e->numCycles) {
                    e->timerAccum += dt;
                    if (e->timerAccum >= e->cycleTime) {
                        e->timerAccum -= e->cycleTime;
                        e->cyclesDone++;
                        auto it = e->eventSlots.find("timer");
                        if (it != e->eventSlots.end() && !it->second.empty()) {
                            eh->putEvent(it->second);
                        }
                    }
                }
            }

            // 2. t_walkover entities (spawned from intro.n & other encounters!)
            if (e->protoName == "t_walkover" && e->triggerRadius > 0.0f) {
                if (e->numCycles <= 0 || e->cyclesDone < e->numCycles) {
                    float dx = playerX - e->px;
                    float dy = playerY - e->py;
                    float dz = playerZ - e->pz;
                    if (dx*dx + dy*dy + dz*dz <= e->triggerRadius * e->triggerRadius) {
                        e->cyclesDone++;
                        auto it = e->eventSlots.find("walkover");
                        if (it != e->eventSlots.end() && !it->second.empty()) {
                            eh->putEvent(it->second);
                        }
                    }
                }
            }
        }
        if (eh) eh->trigger();

        // If any story event called `loadencounter`, rebuild Metal instances automatically!
        if (worldDirty && onWorldLoaded) {
            worldDirty = false;
            onWorldLoaded();
        }
    }
};

struct WorldHooks {
    std::function<void()> onWorldLoaded;
    std::function<void(const std::string&)> onPlaySound;
    std::function<void(const std::string&)> onShowSubtitle;
    std::function<void()> onHideSubtitle;
};

inline void registerWorldSystem(nKernelServer& ks, WorldHooks* whooks) {
    auto regEnt = [&](const std::string& clsName, const std::string& sup) {
        auto* cl = ks.registerClass(clsName, sup, []() { return std::make_unique<nEntity>(); });
        cl->addCmdProto("v_setposition_fff", "SPOS", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && c.inArgs.size() >= 3) {
                e->px = c.inArgs[0].fVal; e->py = c.inArgs[1].fVal; e->pz = c.inArgs[2].fVal;
            }
        });
        cl->addCmdProto("v_setdirection_fff", "SDIR", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && c.inArgs.size() >= 3) {
                e->rx = c.inArgs[0].fVal; e->ry = c.inArgs[1].fVal; e->rz = c.inArgs[2].fVal;
            }
        });
        cl->addCmdProto("v_setvisible_b", "SVIS", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) e->visible = c.inArgs[0].bVal;
        });
        cl->addCmdProto("v_setsymbolicname_s", "SSYM", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) e->symbolicName = c.inArgs[0].sVal;
        });
        cl->addCmdProto("v_announcestate_s", "ANST", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) e->state = c.inArgs[0].sVal;
        });
        cl->addCmdProto("v_setcinematicsequence_s", "SCNS", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) {
                e->cinematicSeqPath = c.inArgs[0].sVal;
                e->cineSeq = nullptr;
            }
        });
        cl->addCmdProto("v_setthrowevents_b", "STHE", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) e->throwEvents = c.inArgs[0].bVal;
        });
        cl->addCmdProto("v_settriggerradius_f", "STRD", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) e->triggerRadius = c.inArgs[0].fVal;
        });
        cl->addCmdProto("v_setcycletime_f", "SCTM", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) e->cycleTime = c.inArgs[0].fVal;
        });
        cl->addCmdProto("v_setnumcycles_i", "SNMC", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) e->numCycles = c.inArgs[0].iVal;
        });
        cl->addCmdProto("v_seteventslot_ss", "SEVS", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && c.inArgs.size() >= 2)
                e->eventSlots[c.inArgs[0].sVal] = c.inArgs[1].sVal;
        });
        cl->addCmdProto("v_createandselvehiclewithname_ss", "CSVN", [](nRoot* o, nCmd& c) {
            if (auto* clParent = dynamic_cast<nClan*>(o->parent); clParent && clParent->world && c.inArgs.size() >= 2)
                clParent->world->createVehicle(clParent, c.inArgs[0].sVal, c.inArgs[1].sVal, true);
        });
        cl->addCmdProto("v_setcharges_i", "SCRG", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) e->charges = c.inArgs[0].iVal;
        });
        cl->addCmdProto("v_alignvehicle_offffff", "ALIV", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && c.inArgs.size() >= 7) {
                if (auto* p = dynamic_cast<nEntity*>(c.inArgs[0].oVal)) {
                    e->parentVehicle = p;
                    e->hasParentAlign = true;
                    e->relPx = c.inArgs[1].fVal; e->relPy = c.inArgs[2].fVal; e->relPz = c.inArgs[3].fVal;
                    e->relRx = c.inArgs[4].fVal; e->relRy = c.inArgs[5].fVal; e->relRz = c.inArgs[6].fVal;
                    e->syncWorldPosFromParent(0.0f);
                }
            }
        });
        cl->addCmdProto("v_addchildvehicle_s", "ACHV", [](nRoot* o, nCmd& c) {
            auto* parentEnt = dynamic_cast<nEntity*>(o);
            if (!parentEnt || c.inArgs.empty()) return;
            const std::string& childName = c.inArgs[0].sVal;
            nRoot* found = nullptr;
            if (parentEnt->parent) found = parentEnt->parent->findChild(childName);
            if (!found && parentEnt->ks) found = parentEnt->ks->lookup(childName);
            if (auto* childEnt = dynamic_cast<nEntity*>(found); childEnt && childEnt != parentEnt) {
                if (!childEnt->parentVehicle) childEnt->parentVehicle = parentEnt;
                if (std::find(parentEnt->childVehicles.begin(), parentEnt->childVehicles.end(), childEnt) == parentEnt->childVehicles.end()) {
                    parentEnt->childVehicles.push_back(childEnt);
                }
            }
        });
        cl->addCmdProto("v_setswingparamsx_fff", "SSPX", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && c.inArgs.size() >= 3) {
                e->swingX[0] = c.inArgs[0].fVal; e->swingX[1] = c.inArgs[1].fVal; e->swingX[2] = c.inArgs[2].fVal;
            }
        });
        cl->addCmdProto("v_setswingparamsy_fff", "SSPY", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && c.inArgs.size() >= 3) {
                e->swingY[0] = c.inArgs[0].fVal; e->swingY[1] = c.inArgs[1].fVal; e->swingY[2] = c.inArgs[2].fVal;
            }
        });
        cl->addCmdProto("v_setswingparamsz_fff", "SSPZ", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && c.inArgs.size() >= 3) {
                e->swingZ[0] = c.inArgs[0].fVal; e->swingZ[1] = c.inArgs[1].fVal; e->swingZ[2] = c.inArgs[2].fVal;
            }
        });
        cl->addCmdProto("v_setaction_s", "SACT", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) e->taskName = c.inArgs[0].sVal;
        });
        cl->addCmdProto("v_setvisualization_s", "SVIZ", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) {
                const std::string& v = c.inArgs[0].sVal;
                e->visible = (v.find("invis") == std::string::npos);
            }
        });
    };
    regEnt("ncontainer", "nstatenode");
    regEnt("nmaennel", "nvehicle");

    // nClan
    auto* clClan = ks.registerClass("nclan", "nstatenode", []() { return std::make_unique<nClan>(); });
    clClan->addCmdProto("v_createandselvehiclewithname_ss", "CSVN", [](nRoot* o, nCmd& c) {
        if (auto* cl = dynamic_cast<nClan*>(o); cl && cl->world && c.inArgs.size() >= 2)
            cl->world->createVehicle(cl, c.inArgs[0].sVal, c.inArgs[1].sVal, true);
    });
    clClan->addCmdProto("o_createvehicle_s", "CRVH", [](nRoot* o, nCmd& c) {
        nEntity* ent = nullptr;
        if (auto* cl = dynamic_cast<nClan*>(o); cl && cl->world && !c.inArgs.empty())
            ent = cl->world->createVehicle(cl, c.inArgs[0].sVal, "", false);
        c.outArgs.push_back(nArg::fromObject(ent));
    });
    clClan->addCmdProto("v_createandselclan_v", "CSCL", [](nRoot* o, nCmd&) {
        if (auto* cl = dynamic_cast<nClan*>(o); cl && cl->world) cl->world->createAndSelClan();
    });
    clClan->addCmdProto("o_getmaennel_v", "GMNL", [](nRoot* o, nCmd& c) {
        if (auto* cl = dynamic_cast<nClan*>(o); cl && cl->world) {
            cl->world->ensureUserClan();
            c.outArgs.push_back(nArg::fromObject(cl->world->userMaennel));
        } else {
            c.outArgs.push_back(nArg::fromObject(nullptr));
        }
    });
    clClan->addCmdProto("v_setrealname_s", "SRNM", [](nRoot* o, nCmd& c) {
        if (auto* cl = dynamic_cast<nClan*>(o); cl && !c.inArgs.empty()) cl->realName = c.inArgs[0].sVal;
    });
    clClan->addCmdProto("v_setasuser_b", "SAUS", [](nRoot* o, nCmd& c) {
        if (auto* cl = dynamic_cast<nClan*>(o); cl && !c.inArgs.empty()) cl->isUser = c.inArgs[0].bVal;
    });
    clClan->addCmdProto("v_setenvironment_b", "SENV", [](nRoot* o, nCmd& c) {
        if (auto* cl = dynamic_cast<nClan*>(o); cl && !c.inArgs.empty()) {
            cl->isEnvironment = c.inArgs[0].bVal;
            if (cl->isEnvironment && cl->world) cl->world->envClan = cl;
        }
    });
    clClan->addCmdProto("v_setclancolor_fff", "SCCO", [](nRoot* o, nCmd& c) {
        if (auto* cl = dynamic_cast<nClan*>(o); cl && c.inArgs.size() >= 3) {
            cl->clanColor[0] = c.inArgs[0].fVal;
            cl->clanColor[1] = c.inArgs[1].fVal;
            cl->clanColor[2] = c.inArgs[2].fVal;
        }
    });
    clClan->addCmdProto("v_setnoticeenergy_b", "SNTE", [](nRoot* o, nCmd& c) {
        if (auto* cl = dynamic_cast<nClan*>(o); cl && !c.inArgs.empty()) cl->noticeEnergy = c.inArgs[0].bVal;
    });

    // nRealWorld
    auto* clRW = ks.registerClass("nrealworld", "nroot", [whooks]() {
        auto rw = std::make_unique<nRealWorld>();
        if (whooks) {
            rw->onWorldLoaded = whooks->onWorldLoaded;
            rw->onPlaySound = whooks->onPlaySound;
            rw->onShowSubtitle = whooks->onShowSubtitle;
            rw->onHideSubtitle = whooks->onHideSubtitle;
        }
        return rw;
    });
    clRW->addCmdProto("v_createandselclan_v", "CSCL", [](nRoot* o, nCmd&) {
        if (auto* rw = dynamic_cast<nRealWorld*>(o)) rw->createAndSelClan();
    });
    clRW->addCmdProto("o_getuserclan_v", "GUCL", [](nRoot* o, nCmd& c) {
        if (auto* rw = dynamic_cast<nRealWorld*>(o)) {
            rw->ensureUserClan();
            c.outArgs.push_back(nArg::fromObject(rw->userClan));
        } else {
            c.outArgs.push_back(nArg::fromObject(nullptr));
        }
    });
    clRW->addCmdProto("o_getenvironmentclan_v", "GECL", [](nRoot* o, nCmd& c) {
        auto* rw = dynamic_cast<nRealWorld*>(o);
        c.outArgs.push_back(nArg::fromObject(rw ? rw->getEnvironmentClan() : nullptr));
    });
    clRW->addCmdProto("o_loadencounter_s", "LDEN", [](nRoot* o, nCmd& c) {
        auto* rw = dynamic_cast<nRealWorld*>(o);
        nClan* cl = (rw && !c.inArgs.empty()) ? rw->loadEncounter(c.inArgs[0].sVal) : nullptr;
        c.outArgs.push_back(nArg::fromObject(cl));
    });
    clRW->addCmdProto("o_findobjectbysymbolicname_s", "FOBS", [](nRoot* o, nCmd& c) {
        auto* rw = dynamic_cast<nRealWorld*>(o);
        nEntity* ent = (rw && !c.inArgs.empty()) ? rw->findBySymbolicName(c.inArgs[0].sVal) : nullptr;
        c.outArgs.push_back(nArg::fromObject(ent));
    });
    clRW->addCmdProto("b_loadbook2_s", "LDB2", [](nRoot* o, nCmd& c) {
        auto* rw = dynamic_cast<nRealWorld*>(o);
        bool ok = (rw && !c.inArgs.empty() && rw->loadBook2(c.inArgs[0].sVal));
        c.outArgs.push_back(nArg::fromBool(ok));
    });
    clRW->addCmdProto("v_setalias_ss", "SALS", [](nRoot* o, nCmd& c) {
        if (auto* rw = dynamic_cast<nRealWorld*>(o); rw && c.inArgs.size() >= 2) {
            rw->protoAliases[NpkArchive::toLower(c.inArgs[0].sVal)] =
                NpkArchive::toLower(c.inArgs[1].sVal);
        }
    });
    clRW->addCmdProto("v_settimeofday_f", "STOD", [](nRoot* o, nCmd& c) {
        if (auto* rw = dynamic_cast<nRealWorld*>(o); rw && !c.inArgs.empty())
            rw->setTimeOfDay(static_cast<double>(c.inArgs[0].fVal));
    });
    clRW->addCmdProto("f_gettimeofday_v", "GTOD", [](nRoot* o, nCmd& c) {
        auto* rw = dynamic_cast<nRealWorld*>(o);
        c.outArgs.push_back(nArg::fromFloat(rw ? static_cast<float>(rw->timeOfDay) : 50000.0f));
    });
    clRW->addCmdProto("v_setdayperiod_f", "SDPD", [](nRoot* o, nCmd& c) {
        if (auto* rw = dynamic_cast<nRealWorld*>(o); rw && !c.inArgs.empty())
            rw->setDayPeriod(static_cast<double>(c.inArgs[0].fVal));
    });
    clRW->addCmdProto("f_getdayperiod_v", "GDPD", [](nRoot* o, nCmd& c) {
        auto* rw = dynamic_cast<nRealWorld*>(o);
        c.outArgs.push_back(nArg::fromFloat(rw ? static_cast<float>(rw->dayPeriod) : 1200.0f));
    });

    // nOpcodeServer (collision class & type matrix from envinit.tcl)
    auto* clColl = ks.registerClass("nopcodeserver", "nroot", []() { return std::make_unique<nCollServerNode>(); });
    clColl->addCmdProto("v_addcollclass_s", "ADCC", [](nRoot* o, nCmd& c) {
        if (auto* cs = dynamic_cast<nCollServerNode*>(o); cs && !c.inArgs.empty()) {
            cs->addClass(c.inArgs[0].sVal);
        }
    });
    clColl->addCmdProto("v_addcolltype_sss", "ADCT", [](nRoot* o, nCmd& c) {
        if (auto* cs = dynamic_cast<nCollServerNode*>(o); cs && c.inArgs.size() >= 3) {
            cs->addType(c.inArgs[0].sVal, c.inArgs[1].sVal, c.inArgs[2].sVal);
        }
    });

    // n3DNode (verified from nnebula/n3DNode.asm)
    if (auto* cl3d = ks.findClass("n3dnode")) {
        cl3d->addCmdProto("v_txyz_fff", "TXYZ", [](nRoot* o, nCmd& c) {
            if (o && c.inArgs.size() >= 3) o->stubProps["txyz"] = c.inArgs;
        });
        cl3d->addCmdProto("v_rxyz_fff", "RXYZ", [](nRoot* o, nCmd& c) {
            if (o && c.inArgs.size() >= 3) o->stubProps["rxyz"] = c.inArgs;
        });
        cl3d->addCmdProto("v_sxyz_fff", "SXYZ", [](nRoot* o, nCmd& c) {
            if (o && c.inArgs.size() >= 3) o->stubProps["sxyz"] = c.inArgs;
        });
        cl3d->addCmdProto("v_rx_f", "RX__", [](nRoot* o, nCmd& c) {
            if (o && !c.inArgs.empty()) o->stubProps["rx"] = c.inArgs;
        });
        cl3d->addCmdProto("v_ry_f", "RY__", [](nRoot* o, nCmd& c) {
            if (o && !c.inArgs.empty()) o->stubProps["ry"] = c.inArgs;
        });
        cl3d->addCmdProto("v_rz_f", "RZ__", [](nRoot* o, nCmd& c) {
            if (o && !c.inArgs.empty()) o->stubProps["rz"] = c.inArgs;
        });
    }
    if (auto* clDH = ks.findClass("ndatahandler")) {
        clDH->addCmdProto("o_loadpermanent_s", "LOAP", [](nRoot* o, nCmd& c) {
            nRoot* res = (o && o->ks && !c.inArgs.empty()) ? o->ks->newObj("nroot", "/data/" + c.inArgs[0].sVal) : nullptr;
            c.outArgs.push_back(nArg::fromObject(res));
        });
    }
    if (auto* clSG = ks.findClass("nscenegraph2")) {
        clSG->addCmdProto("v_setmiplod_if", "SMPL", [](nRoot* o, nCmd& c) {
            if (o && c.inArgs.size() >= 2) o->stubProps["miplod"] = c.inArgs;
        });
    }
    if (auto* clTex = ks.findClass("ntexarraynode")) {
        clTex->addCmdProto("v_settexture_iss", "STXT", [](nRoot* o, nCmd& c) {
            if (o && c.inArgs.size() >= 2) o->stubProps["texture"] = c.inArgs;
        });
    }
    if (auto* clMesh = ks.findClass("nmeshnode")) {
        clMesh->addCmdProto("v_setfilename_s", "SFLN", [](nRoot* o, nCmd& c) {
            if (o && !c.inArgs.empty()) o->stubProps["filename"] = c.inArgs;
        });
    }
    if (auto* clLnk = ks.findClass("nlinknode")) {
        clLnk->addCmdProto("v_settarget_s", "STGT", [](nRoot* o, nCmd& c) {
            if (o && !c.inArgs.empty()) o->stubProps["target"] = c.inArgs;
        });
    }
}

} // namespace nebula
