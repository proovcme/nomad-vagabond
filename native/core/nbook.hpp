#pragma once
// Module 1 (Decompiled from nnomads.dll & verified against scriptlib.tcl):
//   - nCookieHandler  (sizeof=84,  6 AddCmd)
//   - nEventHandler   (sizeof=128, 6 AddCmd)
//   - nBookHandler    (sizeof=248, 10 AddCmd)

#include <deque>
#include <functional>
#include <iostream>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

#include "nfileserver.hpp"
#include "nkernel.hpp"
#include "ntclserver.hpp"

namespace nebula {

// ---------------------------------------------------------------------------
// 1. nCookieHandler (nnomads.dll @ 0x58bbe)
// Stores campaign script variables (setvar / getvar / existsvar / clearvar)
// ---------------------------------------------------------------------------
class nCookieHandler : public nRoot {
public:
    std::unordered_map<std::string, std::string> cookies;
    std::unordered_set<std::string> temporaryKeys;
    std::function<void(const std::string&, const std::string&)> onCookieChanged;

    void setCookie(const std::string& k, const std::string& v) {
        cookies[k] = v;
        if (onCookieChanged) onCookieChanged(k, v);
    }
    std::string getCookie(const std::string& k) const {
        auto it = cookies.find(k);
        return it != cookies.end() ? it->second : "";
    }
    bool cookieExists(const std::string& k) const {
        return cookies.find(k) != cookies.end();
    }
    void clearCookie(const std::string& k) {
        cookies.erase(k);
        temporaryKeys.erase(k);
    }
    void clearCookies() {
        cookies.clear();
        temporaryKeys.clear();
    }
    void markTemporary(const std::string& k) {
        temporaryKeys.insert(k);
    }
    void clearTemporaryCookies() {
        for (const auto& k : temporaryKeys) cookies.erase(k);
        temporaryKeys.clear();
    }
};

// ---------------------------------------------------------------------------
// 2. nEventHandler (nnomads.dll @ 0x58feb)
// Event queue + Tcl handler registry (addhandler, addhandler2, putevent)
// Verified arg order from scriptlib.tcl lines 163 & 173:
//   addhandler  $scriptBody $event0
//   addhandler2 $scriptBody $event0 $opcode $event1
// ---------------------------------------------------------------------------
class nEventHandler : public nRoot {
public:
    struct Handler {
        std::string scriptBody;
        std::string event0;
        std::string opcode; // "" (single), "and", "or"
        std::string event1;
        bool        hit0 = false;
        bool        hit1 = false;
    };

    std::vector<Handler>    handlers;
    std::deque<std::string> eventQueue;
    bool                    logging = true;

    void clear() {
        handlers.clear();
        eventQueue.clear();
    }

    void addHandler(const std::string& scriptBody, const std::string& event0) {
        handlers.push_back({scriptBody, event0, "", "", false, false});
    }

    void addHandler2(const std::string& scriptBody, const std::string& event0,
                     const std::string& opcode, const std::string& event1) {
        handlers.push_back({scriptBody, event0, opcode, event1, false, false});
    }

    void putEvent(const std::string& eventName) {
        if (eventName.empty()) return;
        eventQueue.push_back(eventName);
    }

    // Dispatches queued events in FIFO order (safe against handlers pushing new events)
    void trigger() {
        auto* tcl = ks ? dynamic_cast<nTclServer*>(ks->lookup("/sys/servers/script")) : nullptr;
        if (!tcl) return;

        int maxPerFrame = 32;
        while (!eventQueue.empty() && maxPerFrame-- > 0) {
            std::string ev = eventQueue.front();
            eventQueue.pop_front();
            if (logging) {
                std::cout << "[nEventHandler] Event: " << ev << "\n";
            }

            // Collect matching scripts first (handler execution may register new handlers!)
            std::vector<std::string> toRun;
            for (auto& h : handlers) {
                if (h.opcode.empty()) {
                    if (h.event0 == ev) toRun.push_back(h.scriptBody);
                } else if (h.opcode == "or" || h.opcode == "||") {
                    if (h.event0 == ev || h.event1 == ev) toRun.push_back(h.scriptBody);
                } else if (h.opcode == "and" || h.opcode == "&&") {
                    if (h.event0 == ev) h.hit0 = true;
                    if (h.event1 == ev) h.hit1 = true;
                    if (h.hit0 && h.hit1) {
                        toRun.push_back(h.scriptBody);
                        h.hit0 = h.hit1 = false;
                    }
                }
            }

            for (const auto& code : toRun) {
                tcl->evalString(code);
            }
        }
    }
};

// ---------------------------------------------------------------------------
// 3. nBookHandler (nnomads.dll @ 0x59839)
// Loads campaign book (book/story.tcl -> chapters -> 35 parts) and activates parts!
// ---------------------------------------------------------------------------
class nBookHandler : public nRoot {
public:
    struct Part {
        std::string name;
        std::string dir;
        std::string scriptBody;
    };

    std::string       currentBook;
    std::vector<Part> parts;
    int               currentPartIdx = -1;

    nFileServer* getFS() const {
        if (!ks) return nullptr;
        auto* fs = dynamic_cast<nFileServer*>(ks->lookup("/sys/servers/file2"));
        if (!fs) fs = dynamic_cast<nFileServer*>(ks->lookup("/sys/servers/file"));
        return fs;
    }

    void unloadBook() {
        currentBook.clear();
        parts.clear();
        currentPartIdx = -1;
        if (auto* eh = dynamic_cast<nEventHandler*>(ks->lookup("/game/handler/event"))) {
            eh->clear();
        }
    }

    bool loadBook(const std::string& bookPath, bool quiet) {
        unloadBook();
        auto* fs = getFS();
        auto* tcl = dynamic_cast<nTclServer*>(ks->lookup("/sys/servers/script"));
        if (!fs || !tcl) return false;

        currentBook = fs->manglePath(bookPath);
        while (!currentBook.empty() && currentBook.back() == '/') currentBook.pop_back();

        std::string storyFile = currentBook + "/story.tcl";
        std::cout << "[nBookHandler] Loading book: " << storyFile << "\n";

        // scriptlib.tcl expects global `curBookDir` to be set while sourcing story.tcl!
        Tcl_SetVar(tcl->interp, "curBookDir", currentBook.c_str(), TCL_GLOBAL_ONLY);
        if (!tcl->runScriptFile(storyFile)) return false;

        std::cout << "[nBookHandler] Registered " << parts.size() << " campaign parts.\n";
        if (!quiet && !parts.empty()) {
            return activatePart(parts[0].name, false);
        }
        return true;
    }

    bool registerPart(const std::string& name, const std::string& dir, const std::string& body) {
        parts.push_back({name, dir, body});
        return true;
    }

    bool activatePart(const std::string& name, bool quiet) {
        int found = -1;
        for (size_t i = 0; i < parts.size(); ++i) {
            if (parts[i].name == name) { found = static_cast<int>(i); break; }
        }
        if (found < 0) return false;

        currentPartIdx = found;
        const auto& p = parts[found];
        std::cout << "[nBookHandler] Activating part: " << p.name << " (" << p.dir << ")\n";

        auto* eh = dynamic_cast<nEventHandler*>(ks->lookup("/game/handler/event"));
        auto* ch = dynamic_cast<nCookieHandler*>(ks->lookup("/game/handler/cookie"));
        auto* tcl = dynamic_cast<nTclServer*>(ks->lookup("/sys/servers/script"));
        if (ch) ch->clearTemporaryCookies();
        if (eh) eh->clear();

        if (tcl) {
            // Source book/defaultevents.tcl if present
            std::string defEv = currentBook + "/defaultevents.tcl";
            std::ifstream ftest(defEv);
            if (ftest.good()) {
                ftest.close();
                tcl->runScriptFile(defEv);
            }
            // Evaluate the part's body (registers all `on <event> { ... }` handlers!)
            tcl->evalString(p.scriptBody);
        }

        if (!quiet && eh) {
            eh->putEvent("part_activated");
            // Immediately dispatch part_activated so loadencounter & player spawn run right away!
            eh->trigger();
        }
        return true;
    }

    bool activateNextPart() {
        if (currentPartIdx + 1 < static_cast<int>(parts.size())) {
            return activatePart(parts[currentPartIdx + 1].name, false);
        }
        if (auto* tcl = dynamic_cast<nTclServer*>(ks->lookup("/sys/servers/script"))) {
            tcl->evalString("on_bookfinished");
        }
        return false;
    }

    std::string getCurrentPartName() const {
        return (currentPartIdx >= 0 && currentPartIdx < static_cast<int>(parts.size()))
             ? parts[currentPartIdx].name : "";
    }
    std::string getCurrentPartDir() const {
        return (currentPartIdx >= 0 && currentPartIdx < static_cast<int>(parts.size()))
             ? parts[currentPartIdx].dir : "";
    }
};

// ---------------------------------------------------------------------------
// Register Module 1 classes on nKernelServer
// ---------------------------------------------------------------------------
inline void registerBookAndEvents(nKernelServer& ks) {
    // nCookieHandler
    auto* clC = ks.registerClass("ncookiehandler", "nroot", []() { return std::make_unique<nCookieHandler>(); });
    clC->addCmdProto("v_setcookie_ss", "SCKI", [](nRoot* o, nCmd& c) {
        if (auto* h = dynamic_cast<nCookieHandler*>(o); h && c.inArgs.size() >= 2)
            h->setCookie(c.inArgs[0].sVal, c.inArgs[1].sVal);
    });
    clC->addCmdProto("s_getcookie_s", "GCKI", [](nRoot* o, nCmd& c) {
        auto* h = dynamic_cast<nCookieHandler*>(o);
        c.outArgs.push_back(nArg::fromString((h && !c.inArgs.empty()) ? h->getCookie(c.inArgs[0].sVal) : ""));
    });
    clC->addCmdProto("b_cookieexists_s", "CKEX", [](nRoot* o, nCmd& c) {
        auto* h = dynamic_cast<nCookieHandler*>(o);
        c.outArgs.push_back(nArg::fromBool(h && !c.inArgs.empty() && h->cookieExists(c.inArgs[0].sVal)));
    });
    clC->addCmdProto("v_clearcookie_s", "CLCK", [](nRoot* o, nCmd& c) {
        if (auto* h = dynamic_cast<nCookieHandler*>(o); h && !c.inArgs.empty()) h->clearCookie(c.inArgs[0].sVal);
    });
    clC->addCmdProto("v_clearcookies_v", "CLRC", [](nRoot* o, nCmd&) {
        if (auto* h = dynamic_cast<nCookieHandler*>(o)) h->clearCookies();
    });
    clC->addCmdProto("v_marktemporary_s", "MTMP", [](nRoot* o, nCmd& c) {
        if (auto* h = dynamic_cast<nCookieHandler*>(o); h && !c.inArgs.empty()) h->markTemporary(c.inArgs[0].sVal);
    });

    // nEventHandler
    auto* clE = ks.registerClass("neventhandler", "nroot", []() { return std::make_unique<nEventHandler>(); });
    clE->addCmdProto("v_clear_v", "CLER", [](nRoot* o, nCmd&) {
        if (auto* h = dynamic_cast<nEventHandler*>(o)) h->clear();
    });
    clE->addCmdProto("v_addhandler_ss", "REGS", [](nRoot* o, nCmd& c) {
        if (auto* h = dynamic_cast<nEventHandler*>(o); h && c.inArgs.size() >= 2)
            h->addHandler(c.inArgs[0].sVal, c.inArgs[1].sVal);
    });
    clE->addCmdProto("v_addhandler2_ssss", "REG2", [](nRoot* o, nCmd& c) {
        if (auto* h = dynamic_cast<nEventHandler*>(o); h && c.inArgs.size() >= 4)
            h->addHandler2(c.inArgs[0].sVal, c.inArgs[1].sVal, c.inArgs[2].sVal, c.inArgs[3].sVal);
    });
    clE->addCmdProto("v_putevent_s", "PUTE", [](nRoot* o, nCmd& c) {
        if (auto* h = dynamic_cast<nEventHandler*>(o); h && !c.inArgs.empty()) h->putEvent(c.inArgs[0].sVal);
    });
    clE->addCmdProto("v_setlogging_b", "SLOG", [](nRoot* o, nCmd& c) {
        if (auto* h = dynamic_cast<nEventHandler*>(o); h && !c.inArgs.empty()) h->logging = c.inArgs[0].bVal;
    });
    clE->addCmdProto("b_getlogging_v", "GLOG", [](nRoot* o, nCmd& c) {
        auto* h = dynamic_cast<nEventHandler*>(o);
        c.outArgs.push_back(nArg::fromBool(h ? h->logging : false));
    });

    // nBookHandler
    auto* clB = ks.registerClass("nbookhandler", "nroot", []() { return std::make_unique<nBookHandler>(); });
    clB->addCmdProto("b_loadbook_s", "LDBK", [](nRoot* o, nCmd& c) {
        auto* h = dynamic_cast<nBookHandler*>(o);
        c.outArgs.push_back(nArg::fromBool(h && !c.inArgs.empty() && h->loadBook(c.inArgs[0].sVal, false)));
    });
    clB->addCmdProto("b_loadbookquiet_s", "LDBQ", [](nRoot* o, nCmd& c) {
        auto* h = dynamic_cast<nBookHandler*>(o);
        c.outArgs.push_back(nArg::fromBool(h && !c.inArgs.empty() && h->loadBook(c.inArgs[0].sVal, true)));
    });
    clB->addCmdProto("v_unloadbook_v", "ULDB", [](nRoot* o, nCmd&) {
        if (auto* h = dynamic_cast<nBookHandler*>(o)) h->unloadBook();
    });
    clB->addCmdProto("b_registerpart_sss", "RCHP", [](nRoot* o, nCmd& c) {
        auto* h = dynamic_cast<nBookHandler*>(o);
        bool ok = (h && c.inArgs.size() >= 3 && h->registerPart(c.inArgs[0].sVal, c.inArgs[1].sVal, c.inArgs[2].sVal));
        c.outArgs.push_back(nArg::fromBool(ok));
    });
    clB->addCmdProto("b_activatepart_s", "ACTP", [](nRoot* o, nCmd& c) {
        auto* h = dynamic_cast<nBookHandler*>(o);
        c.outArgs.push_back(nArg::fromBool(h && !c.inArgs.empty() && h->activatePart(c.inArgs[0].sVal, false)));
    });
    clB->addCmdProto("b_activatepartquiet_s", "ACPQ", [](nRoot* o, nCmd& c) {
        auto* h = dynamic_cast<nBookHandler*>(o);
        c.outArgs.push_back(nArg::fromBool(h && !c.inArgs.empty() && h->activatePart(c.inArgs[0].sVal, true)));
    });
    clB->addCmdProto("b_activatenextpart_v", "ACNP", [](nRoot* o, nCmd& c) {
        auto* h = dynamic_cast<nBookHandler*>(o);
        c.outArgs.push_back(nArg::fromBool(h && h->activateNextPart()));
    });
    clB->addCmdProto("s_getcurrentbook_v", "GCRB", [](nRoot* o, nCmd& c) {
        auto* h = dynamic_cast<nBookHandler*>(o);
        c.outArgs.push_back(nArg::fromString(h ? h->currentBook : ""));
    });
    clB->addCmdProto("s_getcurrentpart_v", "GCRC", [](nRoot* o, nCmd& c) {
        auto* h = dynamic_cast<nBookHandler*>(o);
        c.outArgs.push_back(nArg::fromString(h ? h->getCurrentPartName() : ""));
    });
    clB->addCmdProto("s_getcurrentpartdir_v", "GCPD", [](nRoot* o, nCmd& c) {
        auto* h = dynamic_cast<nBookHandler*>(o);
        c.outArgs.push_back(nArg::fromString(h ? h->getCurrentPartDir() : ""));
    });
}

} // namespace nebula
