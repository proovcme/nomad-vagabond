#pragma once
// Module 3 (Decompiled from nnomads.dll & verified against spec_nnomads.json + loadguntowerartefact.n):
//   - nGuiBar           (sizeof=428, 35 AddCmd): HUD energy / health bars
//   - nHouse            (sizeof=3888, 19 AddCmd): buildings, sleep mode, build slots
//   - nBuild            (sizeof=148, 14 AddCmd): building/unit production queue
//   - nPlaceHouse / nCollectArtefact / nUseArtefact / nQuickSlotManager
//   - Full Artifact Belt & Clan/Entity Energy APIs on nEntity (nContainer/nMaennel) & nClan!

#include <algorithm>
#include <cmath>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

#include "nbook.hpp"
#include "nkernel.hpp"
#include "nworld.hpp"

namespace nebula {

// ---------------------------------------------------------------------------
// 1. nGuiBar (nnomads.dll @ sizeof=428, 35 AddCmd)
// ---------------------------------------------------------------------------
class nGuiBar : public nRoot {
public:
    std::string visual, leftVisual, middleVisual, rightVisual;
    bool  visible  = false;
    float current  = 100.0f;
    float maxVal   = 100.0f;
    float baseMax  = 100.0f;
    float extension = 0.0f;
    float optional = 0.0f;
    float pos[3] = {0, 0, 0}, leftPos[3] = {0, 0, 0}, midPos[3] = {0, 0, 0}, midOff[3] = {0, 0, 0}, rightPos[3] = {0, 0, 0};
    float scale[3] = {1, 1, 1}, leftScale[3] = {1, 1, 1}, midScale[3] = {1, 1, 1}, rightScale[3] = {1, 1, 1};

    float ratio() const {
        return (maxVal > 1e-4f) ? std::clamp(current / maxVal, 0.0f, 1.0f) : 0.0f;
    }
};

// ---------------------------------------------------------------------------
// 2. nHouse (nnomads.dll @ sizeof=3888, 19 AddCmd) — Building subclass of nEntity
// ---------------------------------------------------------------------------
class nHouse : public nEntity {
public:
    std::string buildingClass;
    std::string buildStation;
    bool  sleepMode = false;
    bool  occupied  = false;
    bool  visualizePossessArea = false;
    float houseMenuRadius = 3.0f;
    float houseMenuAngle  = 0.0f;
    float houseMenuCentre[3] = {0, 0, 0};
};

// ---------------------------------------------------------------------------
// 3. nBuild (nnomads.dll @ sizeof=148, 14 AddCmd) — Production service
// ---------------------------------------------------------------------------
class nBuild : public nRoot {
public:
    float       buildTime   = 5.0f;
    float       buildEnergy = 100.0f;
    std::string buildProduct;
    int         maxProducts = 1;
    float       buildRelPos[3] = {0, 0, 0};
    std::string initCommand;
    int         slotId = 0;
};

// ---------------------------------------------------------------------------
// 4. nMaennelBelt — Artifact belt & quickslot state attached to userMaennel
// ---------------------------------------------------------------------------
struct nArtefactBelt {
    int maxArtefacts = 8;
    std::vector<nEntity*> artefacts;
    nEntity* quickSlot = nullptr;
    nEntity* usedArtefact = nullptr;
    int selectedIdx = 0;

    bool collect(nEntity* art, nEventHandler* eh) {
        if (!art || !art->artefactMode) return false;
        if (static_cast<int>(artefacts.size()) >= maxArtefacts) return false;
        if (std::find(artefacts.begin(), artefacts.end(), art) != artefacts.end()) return false;

        artefacts.push_back(art);
        art->visible = false;
        art->inBelt = true;
        if (!quickSlot) quickSlot = art;
        std::cout << "[nMaennel] Collected artefact: " << art->protoName << " (" << art->name
                  << "), belt count=" << artefacts.size() << "\n";
        if (eh) {
            auto it = art->eventSlots.find("collected");
            if (it != art->eventSlots.end() && !it->second.empty()) eh->putEvent(it->second);
        }
        return true;
    }

    bool remove(nEntity* art) {
        auto it = std::find(artefacts.begin(), artefacts.end(), art);
        if (it == artefacts.end()) return false;
        artefacts.erase(it);
        art->inBelt = false;
        if (quickSlot == art) quickSlot = artefacts.empty() ? nullptr : artefacts.front();
        if (selectedIdx >= static_cast<int>(artefacts.size())) selectedIdx = 0;
        return true;
    }

    // Build / place the currently selected artefact at (x, y, z, yawDeg) on an island!
    nEntity* placeSelected(float x, float y, float z, float yawDeg, nEventHandler* eh) {
        if (artefacts.empty()) return nullptr;
        selectedIdx = std::clamp(selectedIdx, 0, static_cast<int>(artefacts.size()) - 1);
        nEntity* art = artefacts[selectedIdx];
        remove(art);

        art->artefactMode = false;
        art->visible = true;
        art->px = x; art->py = y; art->pz = z;
        art->rx = 0; art->ry = yawDeg; art->rz = 0;
        art->state = "normal";
        std::cout << "[nPlaceHouse] Built " << art->protoName << " at (" << x << ", " << y << ", " << z << ")\n";
        if (eh) {
            auto it = art->eventSlots.find("built");
            if (it != art->eventSlots.end() && !it->second.empty()) eh->putEvent(it->second);
        }
        return art;
    }

    std::string listPaths() const {
        std::ostringstream os;
        for (size_t i = 0; i < artefacts.size(); ++i) {
            if (i > 0) os << " ";
            os << artefacts[i]->getFullName();
        }
        return os.str();
    }
};

// ---------------------------------------------------------------------------
// Register Module 3 classes & commands on nKernelServer
// ---------------------------------------------------------------------------
inline void registerGameplayModule3(nKernelServer& ks, nArtefactBelt* playerBelt) {
    // 1. nGuiBar
    auto* clBar = ks.registerClass("nguibar", "nroot", []() { return std::make_unique<nGuiBar>(); });
    clBar->addCmdProto("v_show_v", "SHOW", [](nRoot* o, nCmd&) { if (auto* b = dynamic_cast<nGuiBar*>(o)) b->visible = true; });
    clBar->addCmdProto("v_hide_v", "HIDE", [](nRoot* o, nCmd&) { if (auto* b = dynamic_cast<nGuiBar*>(o)) b->visible = false; });
    clBar->addCmdProto("b_visible_v", "VSBL", [](nRoot* o, nCmd& c) {
        auto* b = dynamic_cast<nGuiBar*>(o); c.outArgs.push_back(nArg::fromBool(b && b->visible));
    });
    clBar->addCmdProto("v_setcurrent_f", "STCU", [](nRoot* o, nCmd& c) {
        if (auto* b = dynamic_cast<nGuiBar*>(o); b && !c.inArgs.empty()) b->current = c.inArgs[0].fVal;
    });
    clBar->addCmdProto("f_getcurrent_v", "GTCU", [](nRoot* o, nCmd& c) {
        auto* b = dynamic_cast<nGuiBar*>(o); c.outArgs.push_back(nArg::fromFloat(b ? b->current : 0.0f));
    });
    clBar->addCmdProto("v_setmax_f", "STMX", [](nRoot* o, nCmd& c) {
        if (auto* b = dynamic_cast<nGuiBar*>(o); b && !c.inArgs.empty()) b->maxVal = c.inArgs[0].fVal;
    });
    clBar->addCmdProto("f_getmax_v", "GTMX", [](nRoot* o, nCmd& c) {
        auto* b = dynamic_cast<nGuiBar*>(o); c.outArgs.push_back(nArg::fromFloat(b ? b->maxVal : 100.0f));
    });
    clBar->addCmdProto("v_setbasemax_f", "STBM", [](nRoot* o, nCmd& c) {
        if (auto* b = dynamic_cast<nGuiBar*>(o); b && !c.inArgs.empty()) b->baseMax = c.inArgs[0].fVal;
    });
    clBar->addCmdProto("f_getbasemax_v", "GTBM", [](nRoot* o, nCmd& c) {
        auto* b = dynamic_cast<nGuiBar*>(o); c.outArgs.push_back(nArg::fromFloat(b ? b->baseMax : 100.0f));
    });
    clBar->addCmdProto("v_setvisual_s", "STVI", [](nRoot* o, nCmd& c) {
        if (auto* b = dynamic_cast<nGuiBar*>(o); b && !c.inArgs.empty()) b->visual = c.inArgs[0].sVal;
    });
    clBar->addCmdProto("v_setleftvisual_s", "STLV", [](nRoot* o, nCmd& c) {
        if (auto* b = dynamic_cast<nGuiBar*>(o); b && !c.inArgs.empty()) b->leftVisual = c.inArgs[0].sVal;
    });
    clBar->addCmdProto("v_setmiddlevisual_s", "STMV", [](nRoot* o, nCmd& c) {
        if (auto* b = dynamic_cast<nGuiBar*>(o); b && !c.inArgs.empty()) b->middleVisual = c.inArgs[0].sVal;
    });
    clBar->addCmdProto("v_setrightvisual_s", "STRV", [](nRoot* o, nCmd& c) {
        if (auto* b = dynamic_cast<nGuiBar*>(o); b && !c.inArgs.empty()) b->rightVisual = c.inArgs[0].sVal;
    });
    clBar->addCmdProto("v_setpos_fff", "STPO", [](nRoot* o, nCmd& c) {
        if (auto* b = dynamic_cast<nGuiBar*>(o); b && c.inArgs.size() >= 3) {
            b->pos[0] = c.inArgs[0].fVal; b->pos[1] = c.inArgs[1].fVal; b->pos[2] = c.inArgs[2].fVal;
        }
    });
    clBar->addCmdProto("v_setscale_fff", "STSC", [](nRoot* o, nCmd& c) {
        if (auto* b = dynamic_cast<nGuiBar*>(o); b && c.inArgs.size() >= 3) {
            b->scale[0] = c.inArgs[0].fVal; b->scale[1] = c.inArgs[1].fVal; b->scale[2] = c.inArgs[2].fVal;
        }
    });

    // 2. nHouse
    auto* clHouse = ks.registerClass("nhouse", "ncontainer", []() { return std::make_unique<nHouse>(); });
    clHouse->addCmdProto("v_setbuildingclass_s", "SBDC", [](nRoot* o, nCmd& c) {
        if (auto* h = dynamic_cast<nHouse*>(o); h && !c.inArgs.empty()) h->buildingClass = c.inArgs[0].sVal;
    });
    clHouse->addCmdProto("s_getbuildingclass_v", "GBDC", [](nRoot* o, nCmd& c) {
        auto* h = dynamic_cast<nHouse*>(o); c.outArgs.push_back(nArg::fromString(h ? h->buildingClass : ""));
    });
    clHouse->addCmdProto("v_setsleepmode_b", "SSMD", [](nRoot* o, nCmd& c) {
        if (auto* h = dynamic_cast<nHouse*>(o); h && !c.inArgs.empty()) h->sleepMode = c.inArgs[0].bVal;
    });
    clHouse->addCmdProto("b_getsleepmode_v", "GSMD", [](nRoot* o, nCmd& c) {
        auto* h = dynamic_cast<nHouse*>(o); c.outArgs.push_back(nArg::fromBool(h && h->sleepMode));
    });
    clHouse->addCmdProto("b_isoccupied_v", "ISOC", [](nRoot* o, nCmd& c) {
        auto* h = dynamic_cast<nHouse*>(o); c.outArgs.push_back(nArg::fromBool(h && h->occupied));
    });
    clHouse->addCmdProto("v_setbuildstation_s", "SBST", [](nRoot* o, nCmd& c) {
        if (auto* h = dynamic_cast<nHouse*>(o); h && !c.inArgs.empty()) h->buildStation = c.inArgs[0].sVal;
    });

    // 3. nBuild
    auto* clBuild = ks.registerClass("nbuild", "nservice", []() { return std::make_unique<nBuild>(); });
    clBuild->addCmdProto("v_setbuildtime_f", "SBTM", [](nRoot* o, nCmd& c) {
        if (auto* b = dynamic_cast<nBuild*>(o); b && !c.inArgs.empty()) b->buildTime = c.inArgs[0].fVal;
    });
    clBuild->addCmdProto("v_setbuildenergy_f", "SBEN", [](nRoot* o, nCmd& c) {
        if (auto* b = dynamic_cast<nBuild*>(o); b && !c.inArgs.empty()) b->buildEnergy = c.inArgs[0].fVal;
    });
    clBuild->addCmdProto("v_setbuildproduct_s", "SBPR", [](nRoot* o, nCmd& c) {
        if (auto* b = dynamic_cast<nBuild*>(o); b && !c.inArgs.empty()) b->buildProduct = c.inArgs[0].sVal;
    });
    clBuild->addCmdProto("v_setmaxproducts_i", "SMPR", [](nRoot* o, nCmd& c) {
        if (auto* b = dynamic_cast<nBuild*>(o); b && !c.inArgs.empty()) b->maxProducts = c.inArgs[0].iVal;
    });

    // 4. Wire Energy & Artefact commands onto nContainer, nClan, and nMaennel
    if (auto* clCont = ks.findClass("ncontainer")) {
        clCont->addCmdProto("v_setartefactmode_b", "SAMD", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) e->artefactMode = c.inArgs[0].bVal;
        });
        clCont->addCmdProto("b_getartefactmode_v", "GAMD", [](nRoot* o, nCmd& c) {
            auto* e = dynamic_cast<nEntity*>(o); c.outArgs.push_back(nArg::fromBool(e && e->artefactMode));
        });
        clCont->addCmdProto("v_setenergy_f", "SENG", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) e->energy = c.inArgs[0].fVal;
        });
        clCont->addCmdProto("f_getenergy_v", "GENG", [](nRoot* o, nCmd& c) {
            auto* e = dynamic_cast<nEntity*>(o); c.outArgs.push_back(nArg::fromFloat(e ? e->energy : 0.0f));
        });
        clCont->addCmdProto("v_setmaxenergy_f", "SMEN", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) e->maxEnergy = c.inArgs[0].fVal;
        });
        clCont->addCmdProto("f_getmaxenergy_v", "GMEN", [](nRoot* o, nCmd& c) {
            auto* e = dynamic_cast<nEntity*>(o); c.outArgs.push_back(nArg::fromFloat(e ? e->maxEnergy : 100.0f));
        });
        clCont->addCmdProto("v_setrelenergy_f", "SREN", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) e->energy = e->maxEnergy * c.inArgs[0].fVal;
        });
        clCont->addCmdProto("f_getrelenergy_v", "GREN", [](nRoot* o, nCmd& c) {
            auto* e = dynamic_cast<nEntity*>(o);
            float r = (e && e->maxEnergy > 0.0f) ? (e->energy / e->maxEnergy) : 1.0f;
            c.outArgs.push_back(nArg::fromFloat(r));
        });
        clCont->addCmdProto("b_reduceenergy_f", "RENG", [](nRoot* o, nCmd& c) {
            bool alive = true;
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) {
                e->energy = std::max(0.0f, e->energy - c.inArgs[0].fVal);
                alive = (e->energy > 0.0f);
            }
            c.outArgs.push_back(nArg::fromBool(alive));
        });
        clCont->addCmdProto("v_addenergy_f", "AENG", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty())
                e->energy = std::min(e->maxEnergy, e->energy + c.inArgs[0].fVal);
        });
        clCont->addCmdProto("b_isenergyzero_v", "IEZR", [](nRoot* o, nCmd& c) {
            auto* e = dynamic_cast<nEntity*>(o); c.outArgs.push_back(nArg::fromBool(e && e->energy <= 0.0f));
        });
    }

    if (auto* clClan = ks.findClass("nclan")) {
        clClan->addCmdProto("v_setcurrentenergy_f", "SCEN", [](nRoot* o, nCmd& c) {
            if (auto* cl = dynamic_cast<nClan*>(o); cl && !c.inArgs.empty()) cl->currentEnergy = c.inArgs[0].fVal;
        });
        clClan->addCmdProto("f_getcurrentenergy_v", "GCEN", [](nRoot* o, nCmd& c) {
            auto* cl = dynamic_cast<nClan*>(o); c.outArgs.push_back(nArg::fromFloat(cl ? cl->currentEnergy : 0.0f));
        });
        clClan->addCmdProto("v_setbasemaximum_f", "SBMX", [](nRoot* o, nCmd& c) {
            if (auto* cl = dynamic_cast<nClan*>(o); cl && !c.inArgs.empty()) cl->baseMaximum = c.inArgs[0].fVal;
        });
        clClan->addCmdProto("b_hasenergy_v", "HENG", [](nRoot* o, nCmd& c) {
            auto* cl = dynamic_cast<nClan*>(o); c.outArgs.push_back(nArg::fromBool(cl && cl->currentEnergy > 0.0f));
        });
    }

    if (auto* clMnl = ks.findClass("nmaennel")) {
        clMnl->addCmdProto("v_collectartefact_o", "CART", [playerBelt](nRoot* o, nCmd& c) {
            if (playerBelt && !c.inArgs.empty()) {
                auto* art = dynamic_cast<nEntity*>(c.inArgs[0].oVal);
                auto* eh = o->ks ? dynamic_cast<nEventHandler*>(o->ks->lookup("/game/handler/event")) : nullptr;
                playerBelt->collect(art, eh);
            }
        });
        clMnl->addCmdProto("b_takeoutartefact_o", "TART", [playerBelt](nRoot*, nCmd& c) {
            bool ok = false;
            if (playerBelt && !c.inArgs.empty()) ok = playerBelt->remove(dynamic_cast<nEntity*>(c.inArgs[0].oVal));
            c.outArgs.push_back(nArg::fromBool(ok));
        });
        clMnl->addCmdProto("i_numartefacts_v", "NART", [playerBelt](nRoot*, nCmd& c) {
            c.outArgs.push_back(nArg::fromInt(playerBelt ? static_cast<int>(playerBelt->artefacts.size()) : 0));
        });
        clMnl->addCmdProto("s_artefactlist_v", "ALST", [playerBelt](nRoot*, nCmd& c) {
            c.outArgs.push_back(nArg::fromString(playerBelt ? playerBelt->listPaths() : ""));
        });
        clMnl->addCmdProto("v_setmaxartefacts_i", "SMAR", [playerBelt](nRoot*, nCmd& c) {
            if (playerBelt && !c.inArgs.empty()) playerBelt->maxArtefacts = c.inArgs[0].iVal;
        });
        clMnl->addCmdProto("o_getquickslot_v", "GQSL", [playerBelt](nRoot*, nCmd& c) {
            c.outArgs.push_back(nArg::fromObject(playerBelt ? playerBelt->quickSlot : nullptr));
        });
        clMnl->addCmdProto("v_setquickslot_s", "SQSL", [playerBelt](nRoot* o, nCmd& c) {
            if (playerBelt && o->ks && !c.inArgs.empty()) {
                playerBelt->quickSlot = dynamic_cast<nEntity*>(o->ks->lookup(c.inArgs[0].sVal));
            }
        });
    }
}

} // namespace nebula
