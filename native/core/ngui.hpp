#pragma once
// Native C++17 implementation of Project Nomads GUI classes (nGuiMenuHandler, nGuiStandardMenu,
// nGuiStandardMenuEntry, nGuiCharacterEntry) + 8-bit/24-bit Windows BMP (+ alpha BMP) loader.

#include <algorithm>
#include <cstdint>
#include <cstring>
#include <fstream>
#include <functional>
#include <iostream>
#include <string>
#include <vector>

#include "nkernel.hpp"

namespace nebula {

struct GuiRect {
    float x0 = 0, x1 = 0, y0 = 0, y1 = 0; // NDC [-1, 1], y0 > y1 typically
    float minX() const { return std::min(x0, x1); }
    float maxX() const { return std::max(x0, x1); }
    float minY() const { return std::min(y0, y1); }
    float maxY() const { return std::max(y0, y1); }
    bool contains(float x, float y) const {
        return x >= minX() && x <= maxX() && y >= minY() && y <= maxY();
    }
    bool valid() const { return (maxX() - minX()) > 1e-4f && (maxY() - minY()) > 1e-4f; }
};

class nGuiMenuEntry : public nRoot {
public:
    GuiRect rect;
    std::string command;
    std::string imageOverride;
    bool visible = true;
    bool isHitboxOnly = false; // true for nguicharacterentry (3D hitbox, label is a child nguistandardmenuentry)
    float posX = 0, posY = 0, posZ = 0;
    float oriX = 0, oriY = 0, oriZ = 0;

    std::string getImageKey() const {
        return imageOverride.empty() ? name : imageOverride;
    }
};

class nGuiStandardMenu : public nRoot {
public:
    std::string title;
    std::string background;
    GuiRect titleRect = {-0.5f, 0.5f, 0.96f, 0.55f};
    bool abortable = true;
    bool mouseOverSelect = true;

    void collectEntries(std::vector<nGuiMenuEntry*>& out) const {
        nRoot* entriesRoot = findChild("entries");
        if (!entriesRoot) return;
        for (const auto& c : entriesRoot->children) {
            if (auto* e = dynamic_cast<nGuiMenuEntry*>(c.get())) {
                if (e->visible && e->rect.valid()) {
                    out.push_back(e);
                }
                // Character entries can also have a child label entry
                for (const auto& sub : e->children) {
                    if (auto* se = dynamic_cast<nGuiMenuEntry*>(sub.get())) {
                        if (se->command.empty()) se->command = e->command;
                        if (se->visible && se->rect.valid()) {
                            out.push_back(se);
                        }
                    }
                }
            }
        }
    }
};

class nGuiMenuHandler : public nRoot {
public:
    std::string activeMenu;
    std::function<void()> onMenuChanged;

    void openMenu(const std::string& menuName) {
        activeMenu = menuName;
        std::cout << "[nGuiMenuHandler] OpenMenu: " << menuName << "\n";
        if (onMenuChanged) onMenuChanged();
    }

    void closeMenu() {
        if (!activeMenu.empty()) {
            std::cout << "[nGuiMenuHandler] CloseMenu: " << activeMenu << "\n";
            activeMenu.clear();
            if (onMenuChanged) onMenuChanged();
        }
    }

    void closeAllMenus() {
        activeMenu.clear();
        if (onMenuChanged) onMenuChanged();
    }

    bool isMenuOpen() const { return !activeMenu.empty(); }

    nGuiStandardMenu* getActiveMenu() const {
        if (activeMenu.empty() || !ks) return nullptr;
        const std::string& nm = activeMenu;
        // Menus live under /world/gui/menus/<name> (created by newmenu.tcl)
        if (auto* m = dynamic_cast<nGuiStandardMenu*>(ks->lookup("/world/gui/menus/" + nm))) return m;
        if (auto* m = dynamic_cast<nGuiStandardMenu*>(findChild(nm))) return m;
        if (auto* m = dynamic_cast<nGuiStandardMenu*>(ks->lookup("/sys/servers/menuhandler/" + nm))) return m;
        return nullptr;
    }

    void handleEscape() {
        auto* m = getActiveMenu();
        if (m && m->abortable) {
            if (activeMenu != "main") openMenu("main");
            else closeMenu();
        }
    }
};

// ---------------------------------------------------------------------------
// Windows BMP loader (8-bit paletted & 24-bit BGR) + optional Alpha BMP combiner
// ---------------------------------------------------------------------------
struct BmpImage {
    uint32_t width = 0;
    uint32_t height = 0;
    std::vector<uint8_t> rgba;
};

inline bool loadBmpFile(const std::string& path, BmpImage& out) {
    std::ifstream f(path, std::ios::binary);
    if (!f) return false;
    std::vector<uint8_t> buf((std::istreambuf_iterator<char>(f)), std::istreambuf_iterator<char>());
    if (buf.size() < 54 || buf[0] != 'B' || buf[1] != 'M') return false;

    uint32_t dataOff = 0, dibSize = 0;
    int32_t w = 0, h = 0;
    uint16_t bpp = 0;
    std::memcpy(&dataOff, buf.data() + 10, 4);
    std::memcpy(&dibSize, buf.data() + 14, 4);
    std::memcpy(&w, buf.data() + 18, 4);
    std::memcpy(&h, buf.data() + 22, 4);
    std::memcpy(&bpp, buf.data() + 28, 2);

    bool topDown = (h < 0);
    uint32_t width = static_cast<uint32_t>(std::abs(w));
    uint32_t height = static_cast<uint32_t>(std::abs(h));
    if (width == 0 || height == 0 || width > 4096 || height > 4096) return false;

    out.width = width;
    out.height = height;
    out.rgba.assign(static_cast<size_t>(width) * height * 4, 255);

    if (bpp == 8) {
        size_t palOff = 14 + dibSize;
        if (palOff + 1024 > buf.size()) return false;
        const uint8_t* pal = buf.data() + palOff;
        uint32_t rowStride = (width + 3) & ~3u;
        for (uint32_t y = 0; y < height; ++y) {
            uint32_t srcY = topDown ? y : (height - 1 - y);
            size_t rowOff = dataOff + static_cast<size_t>(srcY) * rowStride;
            if (rowOff + width > buf.size()) break;
            for (uint32_t x = 0; x < width; ++x) {
                uint8_t idx = buf[rowOff + x];
                size_t dst = (static_cast<size_t>(y) * width + x) * 4;
                out.rgba[dst + 0] = pal[idx * 4 + 2]; // R
                out.rgba[dst + 1] = pal[idx * 4 + 1]; // G
                out.rgba[dst + 2] = pal[idx * 4 + 0]; // B
                out.rgba[dst + 3] = 255;
            }
        }
        return true;
    } else if (bpp == 24) {
        uint32_t rowStride = ((width * 3) + 3) & ~3u;
        for (uint32_t y = 0; y < height; ++y) {
            uint32_t srcY = topDown ? y : (height - 1 - y);
            size_t rowOff = dataOff + static_cast<size_t>(srcY) * rowStride;
            if (rowOff + width * 3 > buf.size()) break;
            for (uint32_t x = 0; x < width; ++x) {
                size_t dst = (static_cast<size_t>(y) * width + x) * 4;
                out.rgba[dst + 0] = buf[rowOff + x * 3 + 2];
                out.rgba[dst + 1] = buf[rowOff + x * 3 + 1];
                out.rgba[dst + 2] = buf[rowOff + x * 3 + 0];
                out.rgba[dst + 3] = 255;
            }
        }
        return true;
    }
    return false;
}

inline bool loadLocaleMenuTexture(const std::string& localeDir, const std::string& key, BmpImage& out) {
    std::string rgbPath = localeDir + "if_" + key + ".bmp";
    std::string alpPath = localeDir + "ifa_" + key + ".bmp";
    if (!loadBmpFile(rgbPath, out)) return false;

    BmpImage alpha;
    if (loadBmpFile(alpPath, alpha) && alpha.width == out.width && alpha.height == out.height) {
        for (size_t i = 0; i < static_cast<size_t>(out.width) * out.height; ++i) {
            out.rgba[i * 4 + 3] = alpha.rgba[i * 4 + 0];
        }
    }
    return true;
}

// ---------------------------------------------------------------------------
// Register GUI & RealWorld callbacks on nKernelServer
// ---------------------------------------------------------------------------
struct EngineHooks {
    std::function<void()> onStartGame;
    std::function<void()> onStopGame;
    std::function<void(const std::string&)> onPlaySound;
    std::function<void(const std::string&)> onShowTextMessage;
    std::function<void()> onMenuChanged;
};

inline void registerGuiAndWorld(nKernelServer& ks, EngineHooks* hooks) {
    auto regEntry = [&](const std::string& clsName, bool hitboxOnly = false) {
        auto* cl = ks.registerClass(clsName, "nroot", [hitboxOnly]() {
            auto e = std::make_unique<nGuiMenuEntry>();
            e->isHitboxOnly = hitboxOnly;
            return e;
        });
        cl->addCmdProto("v_setrect_ffff", "SRCT", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nGuiMenuEntry*>(o); e && c.inArgs.size() >= 4) {
                e->rect = {c.inArgs[0].fVal, c.inArgs[1].fVal, c.inArgs[2].fVal, c.inArgs[3].fVal};
            }
        });
        cl->addCmdProto("v_setcommand_s", "SCMD", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nGuiMenuEntry*>(o); e && !c.inArgs.empty()) {
                e->command = c.inArgs[0].sVal;
            }
        });
        cl->addCmdProto("v_setimage_s", "SIMG", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nGuiMenuEntry*>(o); e && !c.inArgs.empty()) {
                e->imageOverride = c.inArgs[0].sVal;
            }
        });
        cl->addCmdProto("v_show_v", "SHOW", [](nRoot* o, nCmd&) {
            if (auto* e = dynamic_cast<nGuiMenuEntry*>(o)) e->visible = true;
        });
        cl->addCmdProto("v_hide_v", "HIDE", [](nRoot* o, nCmd&) {
            if (auto* e = dynamic_cast<nGuiMenuEntry*>(o)) e->visible = false;
        });
        cl->addCmdProto("v_setposition_fff", "SPOS", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nGuiMenuEntry*>(o); e && c.inArgs.size() >= 3) {
                e->posX = c.inArgs[0].fVal; e->posY = c.inArgs[1].fVal; e->posZ = c.inArgs[2].fVal;
            }
        });
        cl->addCmdProto("v_setorientation_fff", "SORI", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nGuiMenuEntry*>(o); e && c.inArgs.size() >= 3) {
                e->oriX = c.inArgs[0].fVal; e->oriY = c.inArgs[1].fVal; e->oriZ = c.inArgs[2].fVal;
            }
        });
    };
    regEntry("nguimenuentry", false);
    regEntry("nguistandardmenuentry", false);
    regEntry("nguicharacterentry", true);
    regEntry("nguiloadsaveentry", false);
    regEntry("nguisessionentry", false);

    auto regMenu = [&](const std::string& clsName) {
        auto* cl = ks.registerClass(clsName, "nroot", []() { return std::make_unique<nGuiStandardMenu>(); });
        cl->addCmdProto("v_settitle_s", "STTL", [](nRoot* o, nCmd& c) {
            if (auto* m = dynamic_cast<nGuiStandardMenu*>(o); m && !c.inArgs.empty()) m->title = c.inArgs[0].sVal;
        });
        cl->addCmdProto("v_settitlerect_ffff", "STTR", [](nRoot* o, nCmd& c) {
            if (auto* m = dynamic_cast<nGuiStandardMenu*>(o); m && c.inArgs.size() >= 4) {
                m->titleRect = {c.inArgs[0].fVal, c.inArgs[1].fVal, c.inArgs[2].fVal, c.inArgs[3].fVal};
            }
        });
        cl->addCmdProto("v_setabortable_b", "SABT", [](nRoot* o, nCmd& c) {
            if (auto* m = dynamic_cast<nGuiStandardMenu*>(o); m && !c.inArgs.empty()) m->abortable = c.inArgs[0].bVal;
        });
        cl->addCmdProto("v_setbackground_s", "SBGD", [](nRoot* o, nCmd& c) {
            if (auto* m = dynamic_cast<nGuiStandardMenu*>(o); m && !c.inArgs.empty()) m->background = c.inArgs[0].sVal;
        });
        cl->addCmdProto("v_setmouseoverselect_b", "SMOS", [](nRoot* o, nCmd& c) {
            if (auto* m = dynamic_cast<nGuiStandardMenu*>(o); m && !c.inArgs.empty()) m->mouseOverSelect = c.inArgs[0].bVal;
        });
    };
    regMenu("nguimenu");
    regMenu("nguistandardmenu");

    auto* clMH = ks.registerClass("nguimenuhandler", "nroot", [hooks]() {
        auto mh = std::make_unique<nGuiMenuHandler>();
        if (hooks) mh->onMenuChanged = hooks->onMenuChanged;
        return mh;
    });
    clMH->addCmdProto("v_openmenu_s", "OPMN", [](nRoot* o, nCmd& c) {
        if (auto* mh = dynamic_cast<nGuiMenuHandler*>(o); mh && !c.inArgs.empty()) mh->openMenu(c.inArgs[0].sVal);
    });
    clMH->addCmdProto("v_closemenu_v", "CLMN", [](nRoot* o, nCmd&) {
        if (auto* mh = dynamic_cast<nGuiMenuHandler*>(o)) mh->closeMenu();
    });
    clMH->addCmdProto("v_cancelmenu_v", "CNMN", [](nRoot* o, nCmd&) {
        if (auto* mh = dynamic_cast<nGuiMenuHandler*>(o)) mh->handleEscape();
    });
    clMH->addCmdProto("v_closeallmenus_v", "CLAM", [](nRoot* o, nCmd&) {
        if (auto* mh = dynamic_cast<nGuiMenuHandler*>(o)) mh->closeAllMenus();
    });
    clMH->addCmdProto("b_menuopen_v", "MNOP", [](nRoot* o, nCmd& c) {
        bool open = false;
        if (auto* mh = dynamic_cast<nGuiMenuHandler*>(o)) open = mh->isMenuOpen();
        c.outArgs.push_back(nArg::fromBool(open));
    });
    clMH->addCmdProto("v_showtextmessage_s", "SHTM", [hooks](nRoot*, nCmd& c) {
        if (hooks && hooks->onShowTextMessage && !c.inArgs.empty()) {
            hooks->onShowTextMessage(c.inArgs[0].sVal);
        }
    });

    // Hook key nRealWorld commands
    if (auto* clRW = ks.findClass("nrealworld")) {
        clRW->addCmdProto("v_startgame_v", "STGM", [hooks](nRoot*, nCmd&) {
            if (hooks && hooks->onStartGame) hooks->onStartGame();
        });
        clRW->addCmdProto("v_stopgame_v", "SPGM", [hooks](nRoot*, nCmd&) {
            if (hooks && hooks->onStopGame) hooks->onStopGame();
        });
        clRW->addCmdProto("v_playsound_s", "PLSD", [hooks](nRoot*, nCmd& c) {
            if (hooks && hooks->onPlaySound && !c.inArgs.empty()) hooks->onPlaySound(c.inArgs[0].sVal);
        });
        clRW->addCmdProto("b_ispaused_v", "ISPS", [](nRoot*, nCmd& c) {
            c.outArgs.push_back(nArg::fromBool(false));
        });
        clRW->addCmdProto("b_isnetsession_v", "ISNS", [](nRoot*, nCmd& c) {
            c.outArgs.push_back(nArg::fromBool(false));
        });
    }
    if (auto* clFH = ks.findClass("nfeedbackhandler")) {
        clFH->addCmdProto("v_playsound_s", "PLSD", [hooks](nRoot*, nCmd& c) {
            if (hooks && hooks->onPlaySound && !c.inArgs.empty()) hooks->onPlaySound(c.inArgs[0].sVal);
        });
    }
}

} // namespace nebula
