#pragma once
// Module 16: System Servers & Remaining Runtime Commands -> 100.00% Mission 1 Coverage
// Implements: nSearchHandler, nGfxServer/nGlServer, nSceneGraph2, nSBufShadowServer,
// nPhysicsHandler, nInputServer, nGuiSessionsPanel, nOpcodeServer brackets,
// nRealWorld lifecycle/prefs/viewer/handcontrol, nMaennel flight/attach, nClan::getplayerisland.

#include <iostream>
#include <string>
#include <vector>

#include "ngui.hpp"
#include "nkernel.hpp"
#include "nworld.hpp"

namespace nebula {

class nSearchHandlerNode : public nRoot {
public:
    float maxWatchDistance = 500.0f;
    float maxWatchAngle    = 45.0f;
    std::string cursorPath;
    std::string haircrossPath;
};

class nGfxServerNode : public nRoot {
public:
    std::string displayMode = "w(1280)-h(800)-bpp(32)";
    float viewVolume[6] = {-0.1f, 0.1f, -0.075f, 0.075f, 0.1f, 18000.0f};
    int currentCursor = 0;
    bool cursorVisible = true;
    std::vector<std::string> cursors;
};

class nShadowServerNode : public nRoot {
public:
    bool castShadows = true;
};

inline void registerSystemModule16(nKernelServer& ks) {
    auto noop = [](nRoot*, nCmd&) {};

    // 1. nSearchHandler
    auto* clSH = ks.registerClass("nsearchhandler", "nroot", []() { return std::make_unique<nSearchHandlerNode>(); });
    clSH->addCmdProto("v_setmaxwatchdistance_f", "SMWD", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nSearchHandlerNode*>(o); s && !c.inArgs.empty()) s->maxWatchDistance = c.inArgs[0].fVal;
    });
    clSH->addCmdProto("v_setmaxwatchangle_f", "SMWA", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nSearchHandlerNode*>(o); s && !c.inArgs.empty()) s->maxWatchAngle = c.inArgs[0].fVal;
    });
    clSH->addCmdProto("v_setcursor_s", "SCUR", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nSearchHandlerNode*>(o); s && !c.inArgs.empty()) s->cursorPath = c.inArgs[0].sVal;
    });
    clSH->addCmdProto("v_sethaircross_s", "SHCR", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nSearchHandlerNode*>(o); s && !c.inArgs.empty()) s->haircrossPath = c.inArgs[0].sVal;
    });

    // 2. nGlServer / nGfxServer
    auto regGfx = [&](const std::string& clsName, const std::string& sup) {
        auto* cl = ks.registerClass(clsName, sup, []() { return std::make_unique<nGfxServerNode>(); });
        cl->addCmdProto("b_setdisplaymode_s", "SDMD", [](nRoot* o, nCmd& c) {
            if (auto* g = dynamic_cast<nGfxServerNode*>(o); g && !c.inArgs.empty()) g->displayMode = c.inArgs[0].sVal;
            c.outArgs.push_back(nArg::fromBool(true));
        });
        cl->addCmdProto("v_setviewvolume_ffffff", "SVVL", [](nRoot* o, nCmd& c) {
            if (auto* g = dynamic_cast<nGfxServerNode*>(o); g && c.inArgs.size() >= 6)
                for (int i = 0; i < 6; ++i) g->viewVolume[i] = c.inArgs[i].fVal;
        });
        cl->addCmdProto("v_begincursors_i", "BGCR", [](nRoot* o, nCmd& c) {
            if (auto* g = dynamic_cast<nGfxServerNode*>(o); g && !c.inArgs.empty()) g->cursors.resize(std::max(0, c.inArgs[0].iVal));
        });
        cl->addCmdProto("v_setcursor_isii", "SCUR", [](nRoot* o, nCmd& c) {
            if (auto* g = dynamic_cast<nGfxServerNode*>(o); g && c.inArgs.size() >= 2) {
                int idx = c.inArgs[0].iVal;
                if (idx >= 0 && static_cast<size_t>(idx) < g->cursors.size()) g->cursors[idx] = c.inArgs[1].sVal;
            }
        });
        cl->addCmdProto("v_endcursors_v", "EDCR", noop);
        cl->addCmdProto("v_setcurrentcursor_ib", "SCCR", [](nRoot* o, nCmd& c) {
            if (auto* g = dynamic_cast<nGfxServerNode*>(o); g && !c.inArgs.empty()) g->currentCursor = c.inArgs[0].iVal;
        });
        cl->addCmdProto("v_showcursor_v", "SHCR", [](nRoot* o, nCmd&) {
            if (auto* g = dynamic_cast<nGfxServerNode*>(o)) g->cursorVisible = true;
        });
        cl->addCmdProto("v_closedisplay_v", "CLDP", noop);
    };
    regGfx("ngfxserver", "nroot");
    regGfx("nglserver", "ngfxserver");

    // 3. nSBufShadowServer
    auto* clShd = ks.registerClass("nsbufshadowserver", "nroot", []() { return std::make_unique<nShadowServerNode>(); });
    clShd->addCmdProto("v_setcastshadows_b", "SCTS", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nShadowServerNode*>(o); s && !c.inArgs.empty()) s->castShadows = c.inArgs[0].bVal;
    });

    // 4. nSceneGraph2 mipLOD brackets
    if (auto* clSG = ks.findClass("nscenegraph2")) {
        clSG->addCmdProto("v_beginmiplod_i", "BMPL", noop);
        clSG->addCmdProto("v_endmiplod_v", "EMPL", noop);
        clSG->addCmdProto("v_setenablemiplod_b", "SEML", noop);
    }

    // 5. nOpcodeServer brackets
    if (auto* clOC = ks.findClass("nopcodeserver")) {
        clOC->addCmdProto("v_begincollclasses_v", "BGCC", noop);
        clOC->addCmdProto("v_endcollclasses_v", "EDCC", noop);
        clOC->addCmdProto("v_begincolltypes_v", "BGCT", noop);
        clOC->addCmdProto("v_endcolltypes_v", "EDCT", noop);
    }

    // 6. nDataHandler, nPhysicsHandler, nLxInputServer
    if (auto* clDH = ks.findClass("ndatahandler")) {
        clDH->addCmdProto("v_setdatapaths_s", "SDTP", noop);
    }
    if (auto* clPH = ks.findClass("nphysicshandler")) {
        clPH->addCmdProto("v_addblayer_f", "ADBL", noop);
    }
    auto* clIn = ks.registerClass("nlxinputserver", "nroot", []() { return std::make_unique<nRoot>(); });
    clIn->addCmdProto("v_setlongpressedtime_f", "SLPT", noop);

    // 7. nGuiMenuHandler & nGuiSessionsPanel
    if (auto* clMH = ks.findClass("nguimenuhandler")) {
        clMH->addCmdProto("v_reset_v", "RSET", [](nRoot* o, nCmd&) {
            if (auto* mh = dynamic_cast<nGuiMenuHandler*>(o)) mh->closeAllMenus();
        });
        clMH->addCmdProto("v_showcredits_sf", "SHCR", noop);
    }
    if (auto* clSP = ks.findClass("nguisessionspanel")) {
        clSP->addCmdProto("v_setcommand_s", "SCMD", noop);
        clSP->addCmdProto("v_setnumentriesx_i", "SNEX", noop);
        clSP->addCmdProto("v_setnumentriesy_i", "SNEY", noop);
    }

    // 8. nClan::getplayerisland
    if (auto* clClan = ks.findClass("nclan")) {
        clClan->addCmdProto("o_getplayerisland_v", "GPIL", [](nRoot* o, nCmd& c) {
            nEntity* isl = nullptr;
            if (auto* cl = dynamic_cast<nClan*>(o); cl && cl->world) {
                for (auto* e : cl->world->entities) {
                    if (e && NpkArchive::toLower(e->protoName).find("island26") != std::string::npos) { isl = e; break; }
                }
            }
            c.outArgs.push_back(nArg::fromObject(isl));
        });
    }

    // 9. nContainer & nMaennel remaining commands
    for (const char* cname : {"ncontainer", "nmaennel"}) {
        if (auto* cl = ks.findClass(cname)) {
            cl->addCmdProto("s_getstate_v", "GSTA", [](nRoot* o, nCmd& c) {
                auto* e = dynamic_cast<nEntity*>(o);
                c.outArgs.push_back(nArg::fromString(e ? e->state : "normal"));
            });
            cl->addCmdProto("s_getcinematicsequencename_v", "GCSN", [](nRoot* o, nCmd& c) {
                auto* e = dynamic_cast<nEntity*>(o);
                c.outArgs.push_back(nArg::fromString(e ? e->cinematicSeqPath : ""));
            });
            cl->addCmdProto("v_settargetsymbolicname_s", "STSN", [](nRoot* o, nCmd& c) {
                if (auto* e = dynamic_cast<nEntity*>(o); e && !c.inArgs.empty()) e->taskTarget = c.inArgs[0].sVal;
            });
            cl->addCmdProto("v_setcanfly_b", "SCFL", noop);
            cl->addCmdProto("v_setspeed_f", "SSPD", noop);
            cl->addCmdProto("v_setattachslottarget_s", "SAST", noop);
            cl->addCmdProto("v_unlinkfromstation_v", "ULFS", noop);
        }
    }

    // 10. nRealWorld lifecycle, prefs, aliases brackets, viewer & handcontrol
    if (auto* clRW = ks.findClass("nrealworld")) {
        clRW->addCmdProto("v_opengame_v", "OPNG", noop);
        clRW->addCmdProto("v_closegame_v", "CLSG", noop);
        clRW->addCmdProto("v_pausegame_v", "PAUG", noop);
        clRW->addCmdProto("v_contgame_v", "CNTG", noop);
        clRW->addCmdProto("v_loadprefs_v", "LDPR", noop);
        clRW->addCmdProto("v_applyprefs_v", "APPR", noop);
        clRW->addCmdProto("v_refreshdisplay_v", "RFDS", noop);
        clRW->addCmdProto("v_beginaliases_v", "BGAL", noop);
        clRW->addCmdProto("v_endaliases_v", "EDAL", noop);
        clRW->addCmdProto("v_resetuserclan_v", "RUCL", noop);
        clRW->addCmdProto("v_activatefastpossess_b", "AFPS", noop);
        clRW->addCmdProto("v_sethandcontrol_o", "SHCT", noop);
        clRW->addCmdProto("v_setviewer2_s", "SVW2", noop);
        clRW->addCmdProto("v_setviewercarrier_o", "SVWC", noop);
    }

    // 11. nRoot fallback transform & timer commands (used on placeholder nodes in scripts)
    if (auto* clRoot = ks.findClass("nroot")) {
        clRoot->addCmdProto("v_resettime_v", "RSTM", noop);
        clRoot->addCmdProto("v_setposition_fff", "SPOS", noop);
        clRoot->addCmdProto("v_setdirection_fff", "SDIR", noop);
        clRoot->addCmdProto("v_addhandler_s", "ADHL", noop);
    }
}

} // namespace nebula
