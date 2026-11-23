#pragma once
// Module 9: Line-by-line reconstructed Lighting, Radial Building Menu & Economy
// Verified against:
//   - nnebula/nlightnode.asm      (nLightNode)
//   - nnomads/nhousemenu.asm      (nHouseMenu)
//   - nnomads/nsammler.asm        (nSammler)
//   - nnomads/npawnshop.asm       (nPawnShop)

#include <algorithm>
#include <cmath>
#include <iostream>
#include <string>
#include <vector>

#include "ngameplay.hpp"
#include "nkernel.hpp"
#include "nworld.hpp"

namespace nebula {

// ---------------------------------------------------------------------------
// nLightNode (verified from nnebula/nlightnode.asm 0x10020e0c..0x1002130b)
// ---------------------------------------------------------------------------
class nLightNode : public nRoot {
public:
    std::string lightType = "point"; // "ambient", "directional", "point", "spot"
    float color[4] = {1.0f, 1.0f, 1.0f, 1.0f};
    float attenuation[3] = {1.0f, 0.0f, 0.0f};
    float spotCutoff = 45.0f;
    float spotExponent = 1.0f;
};

// ---------------------------------------------------------------------------
// nFogNode (verified from nnebula/nfognode.asm 0x10028ce1..0x10028e4f)
// ---------------------------------------------------------------------------
class nFogNode : public nRoot {
public:
    std::string mode = "linear"; // "off", "linear", "exp", "exp2"
    float fogStart = 1800.0f;
    float fogEnd   = 9300.0f;
    float density  = 0.0005f;
    float color[4] = {0.44f, 0.61f, 0.82f, 1.0f};
};

// ---------------------------------------------------------------------------
// nChannelServer (verified from nnebula/nchannelserver.asm)
// Stores global channels: windstrength, winddir, time, daytime, etc.
// ---------------------------------------------------------------------------
class nChannelServerNode : public nRoot {
public:
    std::unordered_map<std::string, float> float1;
    std::unordered_map<std::string, std::string> strVals;

    float get1f(const std::string& name, float def = 0.0f) const {
        auto it = float1.find(name);
        return (it != float1.end()) ? it->second : def;
    }
};

// ---------------------------------------------------------------------------
// nSammler (Resource Collector, verified from nnomads/nsammler.asm)
// ---------------------------------------------------------------------------
class nSammler : public nEntity {
public:
    float maxContainer = 100.0f;     // offset +0x1258
    float currentContainer = 0.0f;   // offset +0x125c

    void addToContainer(float amount) {
        currentContainer = std::clamp(currentContainer + amount, 0.0f, maxContainer);
    }
    bool isContainerFull() const { return currentContainer >= maxContainer; }
    bool isContainerEmpty() const { return currentContainer <= 0.0f; }
};

// ---------------------------------------------------------------------------
// nPawnShop (Trader / Shop, verified from nnomads/npawnshop.asm)
// ---------------------------------------------------------------------------
class nPawnShop : public nEntity {
public:
    int  maxPriceDelta = 10;
    bool maennelInside = false;
    bool tradeFinished = false;
    bool tradeCancelled = false;
    bool contentment[3] = {false, false, false};

    void resetContentmentFlags() {
        contentment[0] = contentment[1] = contentment[2] = false;
    }
};

// ---------------------------------------------------------------------------
// nHouseMenu (Radial Building Context Menu, verified from nnomads/nhousemenu.asm)
// Exact original menuitem IDs from 0x1003e5bf..0x1003ee98:
//   menuitem_wake, menuitem_sleep, menuitem_default, menuitem_input,
//   menuitem_output, menuitem_repair, menuitem_remove, menuitem_lastremove
// ---------------------------------------------------------------------------
struct HouseMenuItem {
    std::string id;    // e.g. "menuitem_repair"
    std::string label; // Russian HUD label
    bool enabled = true;
};

struct nHouseMenuState {
    bool open = false;
    nEntity* targetBuilding = nullptr;
    int selectedIndex = 0;
    std::vector<HouseMenuItem> items;

    void openFor(nEntity* building) {
        if (!building) { close(); return; }
        targetBuilding = building;
        selectedIndex = 0;
        items.clear();

        bool sleeping = (building->state == "sleep");
        items.push_back({sleeping ? "menuitem_wake" : "menuitem_sleep",
                         sleeping ? "Включить (Wake)" : "Отключить (Sleep)", true});

        std::string low = NpkArchive::toLower(building->protoName);
        if (low.find("guntower") != std::string::npos || low.find("flak") != std::string::npos ||
            low.find("garage") != std::string::npos || low.find("navigation") != std::string::npos ||
            low.find("lighthouse") != std::string::npos) {
            items.push_back({"menuitem_default", "Управление (Enter)", true});
        }
        if (low.find("silo") != std::string::npos || low.find("storage") != std::string::npos) {
            items.push_back({"menuitem_input",  "Положить артефакт", true});
            items.push_back({"menuitem_output", "Забрать артефакт",  true});
        }
        if (building->energy < building->maxEnergy) {
            items.push_back({"menuitem_repair", "Ремонт (-50 энергии)", true});
        }
        items.push_back({"menuitem_remove", "Разобрать в пояс", true});
        open = true;
        std::cout << "[nHouseMenu] Opened for " << building->name
                  << " (" << building->protoName << "), " << items.size() << " items\n";
    }

    void close() {
        open = false;
        targetBuilding = nullptr;
        items.clear();
        selectedIndex = 0;
    }

    // Executes the currently selected menu item; returns item id if caller needs special action (e.g. possess)
    std::string executeSelected(nRealWorld* rw, nArtefactBelt* belt) {
        if (!open || !targetBuilding || selectedIndex < 0 ||
            static_cast<size_t>(selectedIndex) >= items.size()) return "";
        const std::string id = items[selectedIndex].id;
        nEntity* b = targetBuilding;

        if (id == "menuitem_sleep") {
            b->state = "sleep";
            std::cout << "[nHouseMenu] " << b->name << " -> sleep\n";
        } else if (id == "menuitem_wake") {
            b->state = "normal";
            std::cout << "[nHouseMenu] " << b->name << " -> normal\n";
        } else if (id == "menuitem_repair") {
            if (rw && rw->userClan && rw->userClan->currentEnergy >= 50.0f) {
                rw->userClan->currentEnergy -= 50.0f;
                b->energy = b->maxEnergy;
                std::cout << "[nHouseMenu] Repaired " << b->name << " to full energy\n";
            }
        } else if (id == "menuitem_remove" || id == "menuitem_lastremove") {
            b->artefactMode = true;
            if (belt) {
                auto* eh = rw && rw->ks ? dynamic_cast<nEventHandler*>(rw->ks->lookup("/game/handler/event")) : nullptr;
                belt->collect(b, eh);
            } else {
                b->visible = false;
                b->inBelt = true;
            }
            if (rw) rw->worldDirty = true;
            std::cout << "[nHouseMenu] Removed " << b->name << " back to artefact belt\n";
        } else if (id == "menuitem_default") {
            std::cout << "[nHouseMenu] Activate/Enter " << b->name << "\n";
        }
        close();
        return id;
    }
};

inline void registerEconomyAndLightingModule9(nKernelServer& ks) {
    // 1. nLightNode (from nnebula/nlightnode.asm)
    auto* clLight = ks.registerClass("nlightnode", "n3dnode", []() { return std::make_unique<nLightNode>(); });
    clLight->addCmdProto("v_settype_s", "STYP", [](nRoot* o, nCmd& c) {
        if (auto* l = dynamic_cast<nLightNode*>(o); l && !c.inArgs.empty()) l->lightType = c.inArgs[0].sVal;
    });
    clLight->addCmdProto("s_gettype_v", "GTYP", [](nRoot* o, nCmd& c) {
        auto* l = dynamic_cast<nLightNode*>(o);
        c.outArgs.push_back(nArg::fromString(l ? l->lightType : "point"));
    });
    clLight->addCmdProto("v_setcolor_ffff", "SCOL", [](nRoot* o, nCmd& c) {
        if (auto* l = dynamic_cast<nLightNode*>(o); l && c.inArgs.size() >= 4) {
            for (int i = 0; i < 4; ++i) l->color[i] = c.inArgs[i].fVal;
        }
    });
    clLight->addCmdProto("v_setr_f", "SETR", [](nRoot* o, nCmd& c) {
        if (auto* l = dynamic_cast<nLightNode*>(o); l && !c.inArgs.empty()) l->color[0] = c.inArgs[0].fVal;
    });
    clLight->addCmdProto("v_setg_f", "SETG", [](nRoot* o, nCmd& c) {
        if (auto* l = dynamic_cast<nLightNode*>(o); l && !c.inArgs.empty()) l->color[1] = c.inArgs[0].fVal;
    });
    clLight->addCmdProto("v_setb_f", "SETB", [](nRoot* o, nCmd& c) {
        if (auto* l = dynamic_cast<nLightNode*>(o); l && !c.inArgs.empty()) l->color[2] = c.inArgs[0].fVal;
    });
    clLight->addCmdProto("v_seta_f", "SETA", [](nRoot* o, nCmd& c) {
        if (auto* l = dynamic_cast<nLightNode*>(o); l && !c.inArgs.empty()) l->color[3] = c.inArgs[0].fVal;
    });
    clLight->addCmdProto("v_setattenuation_fff", "SATT", [](nRoot* o, nCmd& c) {
        if (auto* l = dynamic_cast<nLightNode*>(o); l && c.inArgs.size() >= 3) {
            for (int i = 0; i < 3; ++i) l->attenuation[i] = c.inArgs[i].fVal;
        }
    });
    clLight->addCmdProto("v_setspot_ff", "SSPT", [](nRoot* o, nCmd& c) {
        if (auto* l = dynamic_cast<nLightNode*>(o); l && c.inArgs.size() >= 2) {
            l->spotCutoff = c.inArgs[0].fVal;
            l->spotExponent = c.inArgs[1].fVal;
        }
    });

    // 1b. nFogNode (from nnebula/nfognode.asm)
    auto* clFog = ks.registerClass("nfognode", "nvisnode", []() { return std::make_unique<nFogNode>(); });
    clFog->addCmdProto("v_setmode_s", "SMOD", [](nRoot* o, nCmd& c) {
        if (auto* f = dynamic_cast<nFogNode*>(o); f && !c.inArgs.empty()) f->mode = c.inArgs[0].sVal;
    });
    clFog->addCmdProto("s_getmode_v", "GMOD", [](nRoot* o, nCmd& c) {
        auto* f = dynamic_cast<nFogNode*>(o);
        c.outArgs.push_back(nArg::fromString(f ? f->mode : "linear"));
    });
    clFog->addCmdProto("v_setrange_ff", "SRNG", [](nRoot* o, nCmd& c) {
        if (auto* f = dynamic_cast<nFogNode*>(o); f && c.inArgs.size() >= 2) {
            f->fogStart = c.inArgs[0].fVal; f->fogEnd = c.inArgs[1].fVal;
        }
    });
    clFog->addCmdProto("v_setdensity_f", "SDNS", [](nRoot* o, nCmd& c) {
        if (auto* f = dynamic_cast<nFogNode*>(o); f && !c.inArgs.empty()) f->density = c.inArgs[0].fVal;
    });
    clFog->addCmdProto("f_getdensity_v", "GDNS", [](nRoot* o, nCmd& c) {
        auto* f = dynamic_cast<nFogNode*>(o);
        c.outArgs.push_back(nArg::fromFloat(f ? f->density : 0.0f));
    });
    clFog->addCmdProto("v_setcolor_ffff", "SCOL", [](nRoot* o, nCmd& c) {
        if (auto* f = dynamic_cast<nFogNode*>(o); f && c.inArgs.size() >= 4) {
            for (int i = 0; i < 4; ++i) f->color[i] = c.inArgs[i].fVal;
        }
    });

    // 1c. nChannelServer (from nnebula/nchannelserver.asm)
    auto* clCh = ks.registerClass("nchannelserver", "nroot", []() { return std::make_unique<nChannelServerNode>(); });
    clCh->addCmdProto("v_setchannel1f_sf", "SC1F", [](nRoot* o, nCmd& c) {
        if (auto* ch = dynamic_cast<nChannelServerNode*>(o); ch && c.inArgs.size() >= 2)
            ch->float1[c.inArgs[0].sVal] = c.inArgs[1].fVal;
    });
    clCh->addCmdProto("f_getchannel1f_s", "GC1F", [](nRoot* o, nCmd& c) {
        auto* ch = dynamic_cast<nChannelServerNode*>(o);
        float v = (ch && !c.inArgs.empty()) ? ch->get1f(c.inArgs[0].sVal) : 0.0f;
        c.outArgs.push_back(nArg::fromFloat(v));
    });
    clCh->addCmdProto("v_setchannel2f_sff", "SC2F", [](nRoot* o, nCmd& c) {
        if (auto* ch = dynamic_cast<nChannelServerNode*>(o); ch && c.inArgs.size() >= 2)
            ch->float1[c.inArgs[0].sVal] = c.inArgs[1].fVal;
    });
    clCh->addCmdProto("v_setchannel3f_sfff", "SC3F", [](nRoot* o, nCmd& c) {
        if (auto* ch = dynamic_cast<nChannelServerNode*>(o); ch && c.inArgs.size() >= 2)
            ch->float1[c.inArgs[0].sVal] = c.inArgs[1].fVal;
    });
    clCh->addCmdProto("v_setchannel4f_sffff", "SC4F", [](nRoot* o, nCmd& c) {
        if (auto* ch = dynamic_cast<nChannelServerNode*>(o); ch && c.inArgs.size() >= 2)
            ch->float1[c.inArgs[0].sVal] = c.inArgs[1].fVal;
    });
    clCh->addCmdProto("v_setchannelstring_ss", "SCST", [](nRoot* o, nCmd& c) {
        if (auto* ch = dynamic_cast<nChannelServerNode*>(o); ch && c.inArgs.size() >= 2)
            ch->strVals[c.inArgs[0].sVal] = c.inArgs[1].sVal;
    });
    clCh->addCmdProto("s_getchannelstring_s", "GCST", [](nRoot* o, nCmd& c) {
        auto* ch = dynamic_cast<nChannelServerNode*>(o);
        std::string s;
        if (ch && !c.inArgs.empty()) {
            auto it = ch->strVals.find(c.inArgs[0].sVal);
            if (it != ch->strVals.end()) s = it->second;
        }
        c.outArgs.push_back(nArg::fromString(s));
    });

    // 2. nSammler (from nnomads/nsammler.asm)
    auto* clSam = ks.registerClass("nsammler", "ncontainer", []() { return std::make_unique<nSammler>(); });
    clSam->addCmdProto("v_setmaxcontainer_f", "SMXC", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nSammler*>(o); s && !c.inArgs.empty()) s->maxContainer = c.inArgs[0].fVal;
    });
    clSam->addCmdProto("f_getmaxcontainer_v", "GMXC", [](nRoot* o, nCmd& c) {
        auto* s = dynamic_cast<nSammler*>(o);
        c.outArgs.push_back(nArg::fromFloat(s ? s->maxContainer : 0.0f));
    });
    clSam->addCmdProto("v_setcurrentcontainer_f", "SCCR", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nSammler*>(o); s && !c.inArgs.empty()) s->currentContainer = c.inArgs[0].fVal;
    });
    clSam->addCmdProto("f_getcurrentcontainer_v", "GCCR", [](nRoot* o, nCmd& c) {
        auto* s = dynamic_cast<nSammler*>(o);
        c.outArgs.push_back(nArg::fromFloat(s ? s->currentContainer : 0.0f));
    });
    clSam->addCmdProto("v_addtocontainer_f", "ADTC", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nSammler*>(o); s && !c.inArgs.empty()) s->addToContainer(c.inArgs[0].fVal);
    });
    clSam->addCmdProto("b_iscontainerfull_v", "ICFL", [](nRoot* o, nCmd& c) {
        auto* s = dynamic_cast<nSammler*>(o);
        c.outArgs.push_back(nArg::fromBool(s && s->isContainerFull()));
    });
    clSam->addCmdProto("b_iscontainerempty_v", "ICEM", [](nRoot* o, nCmd& c) {
        auto* s = dynamic_cast<nSammler*>(o);
        c.outArgs.push_back(nArg::fromBool(!s || s->isContainerEmpty()));
    });

    // 3. nPawnShop (from nnomads/npawnshop.asm)
    auto* clShop = ks.registerClass("npawnshop", "ncontainer", []() { return std::make_unique<nPawnShop>(); });
    clShop->addCmdProto("v_setmaxpricedelta_i", "SMPD", [](nRoot* o, nCmd& c) {
        if (auto* p = dynamic_cast<nPawnShop*>(o); p && !c.inArgs.empty()) p->maxPriceDelta = c.inArgs[0].iVal;
    });
    clShop->addCmdProto("i_getmaxpricedelta_v", "GMPD", [](nRoot* o, nCmd& c) {
        auto* p = dynamic_cast<nPawnShop*>(o);
        c.outArgs.push_back(nArg::fromInt(p ? p->maxPriceDelta : 0));
    });
    clShop->addCmdProto("b_ismaennelinside_v", "IMIN", [](nRoot* o, nCmd& c) {
        auto* p = dynamic_cast<nPawnShop*>(o);
        c.outArgs.push_back(nArg::fromBool(p && p->maennelInside));
    });
    clShop->addCmdProto("v_settradefinished_b", "STFN", [](nRoot* o, nCmd& c) {
        if (auto* p = dynamic_cast<nPawnShop*>(o); p && !c.inArgs.empty()) p->tradeFinished = c.inArgs[0].bVal;
    });
    clShop->addCmdProto("b_istradefinished_v", "ITFN", [](nRoot* o, nCmd& c) {
        auto* p = dynamic_cast<nPawnShop*>(o);
        c.outArgs.push_back(nArg::fromBool(p && p->tradeFinished));
    });
    clShop->addCmdProto("v_settradecancelled_b", "STCN", [](nRoot* o, nCmd& c) {
        if (auto* p = dynamic_cast<nPawnShop*>(o); p && !c.inArgs.empty()) p->tradeCancelled = c.inArgs[0].bVal;
    });
    clShop->addCmdProto("b_istradecancelled_v", "ITCN", [](nRoot* o, nCmd& c) {
        auto* p = dynamic_cast<nPawnShop*>(o);
        c.outArgs.push_back(nArg::fromBool(p && p->tradeCancelled));
    });
    clShop->addCmdProto("b_iscontentmentlevel1_v", "ICL1", [](nRoot* o, nCmd& c) {
        auto* p = dynamic_cast<nPawnShop*>(o);
        c.outArgs.push_back(nArg::fromBool(p && p->contentment[0]));
    });
    clShop->addCmdProto("b_iscontentmentlevel2_v", "ICL2", [](nRoot* o, nCmd& c) {
        auto* p = dynamic_cast<nPawnShop*>(o);
        c.outArgs.push_back(nArg::fromBool(p && p->contentment[1]));
    });
    clShop->addCmdProto("b_iscontentmentlevel3_v", "ICL3", [](nRoot* o, nCmd& c) {
        auto* p = dynamic_cast<nPawnShop*>(o);
        c.outArgs.push_back(nArg::fromBool(p && p->contentment[2]));
    });
    clShop->addCmdProto("v_resetcontentmentflags_v", "RCNF", [](nRoot* o, nCmd&) {
        if (auto* p = dynamic_cast<nPawnShop*>(o)) p->resetContentmentFlags();
    });
}

} // namespace nebula
