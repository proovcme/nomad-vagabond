#pragma once
// Module 20: Native macOS Input Server (ndinput8.dll / nInputServer / nDI8Server / nLxInputServer)
// Full action-mapping engine for scripts/input.tcl (beginmap / map / endmap) + macOS CGKeyCode bridge.

#include <algorithm>
#include <cctype>
#include <cstdint>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

#include "nkernel.hpp"

namespace nebula {

struct InputBinding {
    std::string device;    // e.g. "keyb0", "relmouse0", "joy0"
    std::string key;       // e.g. "w", "space", "btn0", "+x", "-y"
    std::string modifier;  // "down", "up", "pressed", "double", "longpressed", ""
    std::string action;    // e.g. "move_forward" or "script:nm_mainmenu"
};

class nInputServerNode : public nRoot {
public:
    std::vector<InputBinding> bindings;
    std::vector<InputBinding> stagingBindings;
    bool inMap = false;

    float longPressedTime  = 0.5f;
    float doubleClickTime  = 0.35f;
    bool  mouseInvert      = false;
    float mouseSensitivity = 1.0f;
    bool  logging          = false;

    std::unordered_set<std::string> keysPressed;
    std::unordered_set<std::string> keysJustDown;
    std::unordered_set<std::string> keysJustUp;

    static std::string toLowerStr(std::string s) {
        std::transform(s.begin(), s.end(), s.begin(),
                       [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
        return s;
    }

    // Translate macOS NSEvent keyCode -> Nebula keyb0 key name
    static const char* macKeyCodeToNebula(uint16_t kc) {
        switch (kc) {
            case 0: return "a"; case 1: return "s"; case 2: return "d"; case 3: return "f";
            case 4: return "h"; case 5: return "g"; case 6: return "z"; case 7: return "x";
            case 8: return "c"; case 9: return "v"; case 11: return "b"; case 12: return "q";
            case 13: return "w"; case 14: return "e"; case 15: return "r"; case 16: return "y";
            case 17: return "t"; case 18: return "1"; case 19: return "2"; case 20: return "3";
            case 21: return "4"; case 22: return "6"; case 23: return "5"; case 25: return "9";
            case 26: return "7"; case 28: return "8"; case 29: return "0"; case 31: return "o";
            case 32: return "u"; case 34: return "i"; case 35: return "p"; case 36: return "return";
            case 37: return "l"; case 38: return "j"; case 40: return "k"; case 45: return "n";
            case 46: return "m"; case 48: return "tab"; case 49: return "space"; case 51: return "bs";
            case 53: return "esc"; case 56: return "lshift"; case 59: return "lctrl"; case 60: return "rshift";
            case 122: return "f1"; case 120: return "f2"; case 99: return "f3"; case 118: return "f4";
            case 96: return "f5"; case 97: return "f6"; case 98: return "f7"; case 100: return "f8";
            case 101: return "f9"; case 109: return "f10"; case 103: return "f11"; case 111: return "f12";
            case 123: return "left"; case 124: return "right"; case 125: return "down"; case 126: return "up";
            default: return "";
        }
    }

    void beginMap() {
        stagingBindings.clear();
        inMap = true;
    }

    bool map(const std::string& eventExpr, const std::string& action) {
        std::string ev = toLowerStr(eventExpr);
        InputBinding b;
        b.action = action;

        // Parse "dev:key.modifier" (e.g. "keyb0:w.pressed")
        auto colon = ev.find(':');
        if (colon != std::string::npos) {
            b.device = ev.substr(0, colon);
            ev = ev.substr(colon + 1);
        } else {
            b.device = "keyb0";
        }
        auto dot = ev.rfind('.');
        if (dot != std::string::npos) {
            b.key = ev.substr(0, dot);
            b.modifier = ev.substr(dot + 1);
        } else {
            b.key = ev;
            b.modifier = "pressed";
        }

        if (inMap) stagingBindings.push_back(std::move(b));
        else bindings.push_back(std::move(b));
        return true;
    }

    void endMap() {
        if (inMap) {
            bindings = std::move(stagingBindings);
            inMap = false;
        }
    }

    void onMacKey(uint16_t kc, bool isDown) {
        const char* k = macKeyCodeToNebula(kc);
        if (!k || !k[0]) return;
        std::string key(k);
        if (isDown) {
            if (!keysPressed.count(key)) keysJustDown.insert(key);
            keysPressed.insert(key);
        } else {
            if (keysPressed.count(key)) keysJustUp.insert(key);
            keysPressed.erase(key);
        }
    }

    void endFrame() {
        keysJustDown.clear();
        keysJustUp.clear();
    }

    bool getButton(const std::string& actionName) const {
        for (const auto& b : bindings) {
            if (b.action != actionName) continue;
            if (b.modifier == "down" && keysJustDown.count(b.key)) return true;
            if (b.modifier == "up" && keysJustUp.count(b.key)) return true;
            if ((b.modifier == "pressed" || b.modifier.empty()) && keysPressed.count(b.key)) return true;
        }
        return false;
    }
};

inline void registerInputModule20(nKernelServer& ks) {
    auto regInput = [&](const std::string& name, const std::string& sup) {
        auto* cl = ks.registerClass(name, sup, []() { return std::make_unique<nInputServerNode>(); });
        cl->addCmdProto("v_beginmap_v", "BGMP", [](nRoot* o, nCmd&) {
            if (auto* s = dynamic_cast<nInputServerNode*>(o)) s->beginMap();
        });
        cl->addCmdProto("b_map_ss", "MAPP", [](nRoot* o, nCmd& c) {
            bool ok = false;
            if (auto* s = dynamic_cast<nInputServerNode*>(o); s && c.inArgs.size() >= 2)
                ok = s->map(c.inArgs[0].sVal, c.inArgs[1].sVal);
            c.outArgs.push_back(nArg::fromBool(ok));
        });
        cl->addCmdProto("v_endmap_v", "EDMP", [](nRoot* o, nCmd&) {
            if (auto* s = dynamic_cast<nInputServerNode*>(o)) s->endMap();
        });
        cl->addCmdProto("v_startlogging_v", "STLG", [](nRoot* o, nCmd&) {
            if (auto* s = dynamic_cast<nInputServerNode*>(o)) s->logging = true;
        });
        cl->addCmdProto("v_stoplogging_v", "SPLG", [](nRoot* o, nCmd&) {
            if (auto* s = dynamic_cast<nInputServerNode*>(o)) s->logging = false;
        });
        cl->addCmdProto("b_islogging_v", "ISLG", [](nRoot* o, nCmd& c) {
            auto* s = dynamic_cast<nInputServerNode*>(o);
            c.outArgs.push_back(nArg::fromBool(s ? s->logging : false));
        });
        cl->addCmdProto("v_setlongpressedtime_f", "SLPT", [](nRoot* o, nCmd& c) {
            if (auto* s = dynamic_cast<nInputServerNode*>(o); s && !c.inArgs.empty())
                s->longPressedTime = c.inArgs[0].fVal;
        });
        cl->addCmdProto("f_getlongpressedtime_v", "GLPT", [](nRoot* o, nCmd& c) {
            auto* s = dynamic_cast<nInputServerNode*>(o);
            c.outArgs.push_back(nArg::fromFloat(s ? s->longPressedTime : 0.5f));
        });
        cl->addCmdProto("v_setdoubleclicktime_f", "SDCT", [](nRoot* o, nCmd& c) {
            if (auto* s = dynamic_cast<nInputServerNode*>(o); s && !c.inArgs.empty())
                s->doubleClickTime = c.inArgs[0].fVal;
        });
        cl->addCmdProto("f_getdoubleclicktime_v", "GDCT", [](nRoot* o, nCmd& c) {
            auto* s = dynamic_cast<nInputServerNode*>(o);
            c.outArgs.push_back(nArg::fromFloat(s ? s->doubleClickTime : 0.35f));
        });
        cl->addCmdProto("v_setmouseinvert_b", "SMIV", [](nRoot* o, nCmd& c) {
            if (auto* s = dynamic_cast<nInputServerNode*>(o); s && !c.inArgs.empty())
                s->mouseInvert = c.inArgs[0].bVal;
        });
        cl->addCmdProto("b_getmouseinvert_v", "GMIV", [](nRoot* o, nCmd& c) {
            auto* s = dynamic_cast<nInputServerNode*>(o);
            c.outArgs.push_back(nArg::fromBool(s ? s->mouseInvert : false));
        });
        cl->addCmdProto("v_setmousesensitivity_f", "SMSS", [](nRoot* o, nCmd& c) {
            if (auto* s = dynamic_cast<nInputServerNode*>(o); s && !c.inArgs.empty())
                s->mouseSensitivity = c.inArgs[0].fVal;
        });
        cl->addCmdProto("f_getmousesensitivity_v", "GMSS", [](nRoot* o, nCmd& c) {
            auto* s = dynamic_cast<nInputServerNode*>(o);
            c.outArgs.push_back(nArg::fromFloat(s ? s->mouseSensitivity : 1.0f));
        });
        cl->addCmdProto("b_getbutton_s", "GBUT", [](nRoot* o, nCmd& c) {
            bool v = false;
            if (auto* s = dynamic_cast<nInputServerNode*>(o); s && !c.inArgs.empty())
                v = s->getButton(c.inArgs[0].sVal);
            c.outArgs.push_back(nArg::fromBool(v));
        });
        cl->addCmdProto("f_getslider_s", "GSLD", [](nRoot* o, nCmd& c) {
            float v = 0.0f;
            if (auto* s = dynamic_cast<nInputServerNode*>(o); s && !c.inArgs.empty())
                v = s->getButton(c.inArgs[0].sVal) ? 1.0f : 0.0f;
            c.outArgs.push_back(nArg::fromFloat(v));
        });
        cl->addCmdProto("v_flushevents_v", "FLSH", [](nRoot* o, nCmd&) {
            if (auto* s = dynamic_cast<nInputServerNode*>(o)) s->endFrame();
        });
    };

    regInput("ninputserver", "nroot");
    regInput("ndi8server", "ninputserver");
    regInput("nlxinputserver", "ninputserver");
}

} // namespace nebula
