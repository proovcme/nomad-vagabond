#pragma once
// Module 5 (Decompiled from nnomads.dll & verified against spec_nnomads.json):
//   - nNavPoint    (sizeof=3800, 5 AddCmd): navigation beacons for floating islands
//   - nStation     (sizeof=3984, 3 AddCmd): floating island lock/unlock & flight steering
//   - nIslandDrive (sizeof=3912, 1 AddCmd): island engine control
//   - nRealWorld savegame / loadgame / announcesavepoint / announceloadsavepoint!

#include <cmath>
#include <fstream>
#include <iostream>
#include <string>

#include "nbook.hpp"
#include "ngameplay.hpp"
#include "nkernel.hpp"
#include "nworld.hpp"

namespace nebula {

class nNavPoint : public nEntity {
public:
    bool enabled = false;
    std::string visualization;
};

class nStation : public nEntity {
public:
    bool locked = true;
    nEntity* targetNav = nullptr;
    float flySpeed = 18.0f;
};

class nIslandDrive : public nHouse {
public:
    bool engineOn = false;
};

// Steps unlocked islands flying toward enabled navpoints & fires `reached` events
class nIslandFlightSystem {
public:
    void update(float dt, nRealWorld* rw) {
        if (!rw) return;
        auto* eh = rw->ks ? dynamic_cast<nEventHandler*>(rw->ks->lookup("/game/handler/event")) : nullptr;

        for (auto* e : rw->entities) {
            if (!e || !e->visible || e->state == "destroyed") continue;
            if (e->navTargetSym.empty() || e->islandLocked) continue;

            nEntity* nav = rw->findBySymbolicName(e->navTargetSym);
            if (!nav) continue;

            float dx = nav->px - e->px;
            float dy = nav->py - e->py;
            float dz = nav->pz - e->pz;
            float dist = std::sqrt(dx*dx + dy*dy + dz*dz);
            if (dist <= 12.0f) {
                e->px = nav->px; e->py = nav->py; e->pz = nav->pz;
                e->navTargetSym.clear();
                e->aiMoving = false;
                std::cout << "[nStation] Island " << e->name << " reached navpoint " << nav->symbolicName << "\n";
                if (eh) {
                    auto it = nav->eventSlots.find("reached");
                    if (it != nav->eventSlots.end() && !it->second.empty()) eh->putEvent(it->second);
                    auto it2 = e->eventSlots.find("navpoint_reached");
                    if (it2 != e->eventSlots.end() && !it2->second.empty()) eh->putEvent(it2->second);
                }
            } else {
                float step = std::min(dist, 22.0f * dt);
                e->px += (dx / dist) * step;
                e->py += (dy / dist) * step;
                e->pz += (dz / dist) * step;
                e->aiMoving = true;
            }
        }
    }
};

// Serialize / Restore full game state to standard Nebula Tcl savegame (.n)
inline bool saveGameToFile(nRealWorld* rw, const std::string& rawPath) {
    if (!rw || !rw->ks) return false;
    auto* fs = rw->getFS();
    auto* bh = dynamic_cast<nBookHandler*>(rw->ks->lookup("/game/handler/book"));
    auto* ch = dynamic_cast<nCookieHandler*>(rw->ks->lookup("/game/handler/cookie"));
    std::string full = fs ? fs->manglePath(rawPath) : rawPath;

    std::ofstream out(full);
    if (!out) return false;

    out << "# Project Nomads Native Savegame\n";
    if (bh && !bh->currentBook.empty()) {
        out << "/game/handler/book.loadbookquiet \"" << bh->currentBook << "\"\n";
        if (!bh->getCurrentPartName().empty()) {
            out << "/game/handler/book.activatepartquiet \"" << bh->getCurrentPartName() << "\"\n";
        }
    }
    if (ch) {
        for (const auto& kv : ch->cookies) {
            if (ch->temporaryKeys.count(kv.first)) continue;
            out << "/game/handler/cookie.setcookie \"" << kv.first << "\" \"" << kv.second << "\"\n";
        }
    }
    out << "sel /world\n";
    out << ".createandselclan\n";
    for (auto* e : rw->entities) {
        if (!e || e->state == "destroyed") continue;
        out << ".createandselvehiclewithname \"" << e->protoName << "\" \"" << e->name << "\"\n";
        out << ".setposition " << e->px << " " << e->py << " " << e->pz << "\n";
        out << ".setdirection " << e->rx << " " << e->ry << " " << e->rz << "\n";
        out << ".setenergy " << e->energy << "\n";
        out << ".setvisible " << (e->visible ? "true" : "false") << "\n";
        out << ".setartefactmode " << (e->artefactMode ? "true" : "false") << "\n";
        if (!e->symbolicName.empty()) out << ".setsymbolicname \"" << e->symbolicName << "\"\n";
        out << "sel ..\n";
    }
    out << "sel ../..\n";
    out.close();
    std::cout << "[nRealWorld] Saved game to: " << full << " (" << rw->entities.size() << " entities)\n";
    return true;
}

inline bool loadGameFromFile(nRealWorld* rw, const std::string& rawPath) {
    if (!rw || !rw->ks) return false;
    auto* fs = rw->getFS();
    auto* tcl = dynamic_cast<nTclServer*>(rw->ks->lookup("/sys/servers/script"));
    if (!tcl) return false;
    std::string full = fs ? fs->manglePath(rawPath) : rawPath;
    std::ifstream test(full);
    if (!test.good()) return false;
    test.close();

    rw->clearEntities();
    rw->ensureUserClan();
    bool ok = tcl->runScriptFile(full);
    rw->hasMissionLoaded = true;
    rw->worldDirty = true;
    if (rw->onWorldLoaded) {
        rw->worldDirty = false;
        rw->onWorldLoaded();
    }
    std::cout << "[nRealWorld] Loaded savegame from: " << full << " (" << rw->entities.size() << " entities)\n";
    return ok;
}

inline void registerIslandAndSaveModule5(nKernelServer& ks) {
    // nNavPoint
    auto* clNav = ks.registerClass("nnavpoint", "ncontainer", []() { return std::make_unique<nNavPoint>(); });
    clNav->addCmdProto("v_enable_v", "ENBL", [](nRoot* o, nCmd&) {
        if (auto* n = dynamic_cast<nNavPoint*>(o)) n->enabled = true;
        if (auto* e = dynamic_cast<nEntity*>(o)) e->navEnabled = true;
    });
    clNav->addCmdProto("v_disable_v", "DSBL", [](nRoot* o, nCmd&) {
        if (auto* n = dynamic_cast<nNavPoint*>(o)) n->enabled = false;
        if (auto* e = dynamic_cast<nEntity*>(o)) e->navEnabled = false;
    });
    clNav->addCmdProto("b_isenabled_v", "ISEN", [](nRoot* o, nCmd& c) {
        auto* e = dynamic_cast<nEntity*>(o);
        c.outArgs.push_back(nArg::fromBool(e && e->navEnabled));
    });

    // nStation (also wire on nContainer since encounter entities use ncontainer)
    auto* clSt = ks.registerClass("nstation", "ncontainer", []() { return std::make_unique<nStation>(); });
    auto regStationCmds = [](nClass* cl) {
        cl->addCmdProto("b_islocked_v", "ISLO", [](nRoot* o, nCmd& c) {
            auto* e = dynamic_cast<nEntity*>(o); c.outArgs.push_back(nArg::fromBool(e && e->islandLocked));
        });
        cl->addCmdProto("v_lockstation_v", "LCKS", [](nRoot* o, nCmd&) {
            if (auto* e = dynamic_cast<nEntity*>(o)) e->islandLocked = true;
        });
        cl->addCmdProto("v_unlockstation_v", "UNLK", [](nRoot* o, nCmd&) {
            if (auto* e = dynamic_cast<nEntity*>(o)) e->islandLocked = false;
        });
        cl->addCmdProto("v_enable_v", "ENBL", [](nRoot* o, nCmd&) {
            if (auto* e = dynamic_cast<nEntity*>(o)) e->navEnabled = true;
        });
        cl->addCmdProto("v_disable_v", "DSBL", [](nRoot* o, nCmd&) {
            if (auto* e = dynamic_cast<nEntity*>(o)) e->navEnabled = false;
        });
        cl->addCmdProto("b_isenabled_v", "ISEN", [](nRoot* o, nCmd& c) {
            auto* e = dynamic_cast<nEntity*>(o); c.outArgs.push_back(nArg::fromBool(e && e->navEnabled));
        });
    };
    regStationCmds(clSt);
    if (auto* clCont = ks.findClass("ncontainer")) regStationCmds(clCont);

    // nIslandDrive
    auto* clDrv = ks.registerClass("nislanddrive", "nhouse", []() { return std::make_unique<nIslandDrive>(); });
    clDrv->addCmdProto("v_switchoffengine_v", "SOEN", [](nRoot* o, nCmd&) {
        if (auto* d = dynamic_cast<nIslandDrive*>(o)) d->engineOn = false;
    });

    // nRealWorld save/load commands
    if (auto* clRW = ks.findClass("nrealworld")) {
        clRW->addCmdProto("b_savegame_s", "SVGM", [](nRoot* o, nCmd& c) {
            auto* rw = dynamic_cast<nRealWorld*>(o);
            bool ok = (rw && !c.inArgs.empty() && saveGameToFile(rw, c.inArgs[0].sVal));
            c.outArgs.push_back(nArg::fromBool(ok));
        });
        clRW->addCmdProto("b_loadgame_s", "LDGM", [](nRoot* o, nCmd& c) {
            auto* rw = dynamic_cast<nRealWorld*>(o);
            bool ok = (rw && !c.inArgs.empty() && loadGameFromFile(rw, c.inArgs[0].sVal));
            c.outArgs.push_back(nArg::fromBool(ok));
        });
        clRW->addCmdProto("v_announcesavepoint_s", "ASVP", [](nRoot* o, nCmd& c) {
            if (auto* rw = dynamic_cast<nRealWorld*>(o); rw && !c.inArgs.empty()) saveGameToFile(rw, c.inArgs[0].sVal);
        });
        clRW->addCmdProto("v_announceloadsavepoint_s", "ALSP", [](nRoot* o, nCmd& c) {
            if (auto* rw = dynamic_cast<nRealWorld*>(o); rw && !c.inArgs.empty()) loadGameFromFile(rw, c.inArgs[0].sVal);
        });
    }
}

} // namespace nebula
