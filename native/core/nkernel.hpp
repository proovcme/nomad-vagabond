#pragma once
// Native C++17 re-implementation of The Nebula Device 1 Kernel (nKernelServer, nRoot, nClass, nCmd, nEnv)
// Designed for Project Nomads native macOS arm64 port.

#include <algorithm>
#include <cstdint>
#include <functional>
#include <iostream>
#include <map>
#include <memory>
#include <sstream>
#include <string>
#include <unordered_map>
#include <vector>

namespace nebula {

class nRoot;
class nClass;
class nKernelServer;

// ---------------------------------------------------------------------------
// nArg & nCmd
// ---------------------------------------------------------------------------
struct nArg {
    enum Type { VOID, INT, FLOAT, STRING, BOOL, OBJECT };
    Type type = VOID;
    int iVal = 0;
    float fVal = 0.0f;
    bool bVal = false;
    std::string sVal;
    nRoot* oVal = nullptr;

    static nArg fromInt(int v)             { nArg a; a.type = INT; a.iVal = v; return a; }
    static nArg fromFloat(float v)         { nArg a; a.type = FLOAT; a.fVal = v; return a; }
    static nArg fromBool(bool v)           { nArg a; a.type = BOOL; a.bVal = v; return a; }
    static nArg fromString(std::string v)  { nArg a; a.type = STRING; a.sVal = std::move(v); return a; }
    static nArg fromObject(nRoot* o)       { nArg a; a.type = OBJECT; a.oVal = o; return a; }
};

struct nCmd {
    std::string name;
    std::string fourcc;
    std::vector<nArg> inArgs;
    std::vector<nArg> outArgs;
};

using CmdHandler = std::function<void(nRoot*, nCmd&)>;

struct nCmdProto {
    std::string proto;     // e.g. "v_setpos_fff"
    std::string retTypes;  // e.g. "v" or "fff"
    std::string name;      // e.g. "setpos"
    std::string argTypes;  // e.g. "fff"
    std::string fourcc;
    CmdHandler  handler;   // nullptr -> stub handler

    static nCmdProto parse(const std::string& protoStr, const std::string& fcc, CmdHandler h = nullptr) {
        nCmdProto p;
        p.proto = protoStr;
        p.fourcc = fcc;
        p.handler = std::move(h);
        auto first = protoStr.find('_');
        auto last = protoStr.rfind('_');
        if (first != std::string::npos && last != std::string::npos && last > first) {
            p.retTypes = protoStr.substr(0, first);
            p.name = protoStr.substr(first + 1, last - first - 1);
            p.argTypes = protoStr.substr(last + 1);
        } else {
            p.name = protoStr;
        }
        return p;
    }
};

// ---------------------------------------------------------------------------
// nClass
// ---------------------------------------------------------------------------
class nClass {
public:
    using FactoryFn = std::function<std::unique_ptr<nRoot>()>;

    std::string name;
    std::string superName;
    nClass* superClass = nullptr;
    FactoryFn factory;
    std::unordered_map<std::string, nCmdProto> cmdsByName;
    std::unordered_map<std::string, nCmdProto*> cmdsByFourCC;

    void addCmdProto(const std::string& proto, const std::string& fourcc = "", CmdHandler h = nullptr) {
        auto p = nCmdProto::parse(proto, fourcc, std::move(h));
        std::string key = p.name;
        auto [it, _] = cmdsByName.insert_or_assign(key, std::move(p));
        if (!fourcc.empty()) {
            cmdsByFourCC[fourcc] = &it->second;
        }
    }

    const nCmdProto* findCmd(const std::string& cmdName) const {
        auto it = cmdsByName.find(cmdName);
        if (it != cmdsByName.end()) return &it->second;
        if (superClass) return superClass->findCmd(cmdName);
        return nullptr;
    }

    const nCmdProto* findCmdByFourCC(const std::string& fcc) const {
        auto it = cmdsByFourCC.find(fcc);
        if (it != cmdsByFourCC.end()) return it->second;
        if (superClass) return superClass->findCmdByFourCC(fcc);
        return nullptr;
    }

    bool isA(const std::string& target) const {
        if (name == target) return true;
        return superClass ? superClass->isA(target) : false;
    }
};

// ---------------------------------------------------------------------------
// nRoot — Base class of all Nebula Object Hierarchy (NOH) nodes
// ---------------------------------------------------------------------------
class nRoot {
public:
    std::string name;
    nClass* cls = nullptr;
    nKernelServer* ks = nullptr;
    nRoot* parent = nullptr;
    std::vector<std::unique_ptr<nRoot>> children;

    // Generic key/value store for stub properties so setX/getX round-trips work automatically
    std::unordered_map<std::string, std::vector<nArg>> stubProps;

    virtual ~nRoot() = default;

    std::string getFullName() const {
        if (!parent) return "/";
        std::vector<std::string> parts;
        const nRoot* cur = this;
        while (cur && cur->parent) {
            parts.push_back(cur->name);
            cur = cur->parent;
        }
        std::string res;
        for (auto it = parts.rbegin(); it != parts.rend(); ++it) {
            res += "/";
            res += *it;
        }
        return res.empty() ? "/" : res;
    }

    nRoot* findChild(const std::string& childName) const {
        for (const auto& c : children) {
            if (c->name == childName) return c.get();
        }
        return nullptr;
    }

    nRoot* addChild(std::unique_ptr<nRoot> child) {
        child->parent = this;
        children.push_back(std::move(child));
        return children.back().get();
    }

    bool removeChild(nRoot* target) {
        for (auto it = children.begin(); it != children.end(); ++it) {
            if (it->get() == target) {
                children.erase(it);
                return true;
            }
        }
        return false;
    }
};

// ---------------------------------------------------------------------------
// nEnv — Typed environment variable node (e.g. /sys/share/assigns/home)
// ---------------------------------------------------------------------------
class nEnv : public nRoot {
public:
    nArg value = nArg::fromString("");
};

// ---------------------------------------------------------------------------
// nKernelServer — Central NOH & Class Registry
// ---------------------------------------------------------------------------
class nKernelServer {
public:
    std::unordered_map<std::string, std::unique_ptr<nClass>> classes;
    std::unique_ptr<nRoot> root;
    nRoot* cwd = nullptr;
    std::vector<nRoot*> cwdStack;
    bool traceStubs = false;
    size_t totalCmdCalls = 0;
    size_t stubCmdCalls = 0;
    std::map<std::string, size_t> stubCallCounts;

    nKernelServer() {
        registerBuiltinClasses();
        root = std::make_unique<nRoot>();
        root->name = "";
        root->cls = findClass("nroot");
        root->ks = this;
        cwd = root.get();
    }

    static std::string toLower(std::string s) {
        std::transform(s.begin(), s.end(), s.begin(), [](unsigned char c) { return std::tolower(c); });
        return s;
    }

    nClass* findClass(const std::string& rawName) {
        auto it = classes.find(toLower(rawName));
        return it != classes.end() ? it->second.get() : nullptr;
    }

    nClass* registerClass(const std::string& rawName, const std::string& rawSuper, nClass::FactoryFn factory) {
        std::string name = toLower(rawName);
        std::string super = toLower(rawSuper);
        auto& ptr = classes[name];
        if (!ptr) ptr = std::make_unique<nClass>();
        ptr->name = name;
        ptr->superName = super;
        ptr->factory = std::move(factory);
        if (!super.empty() && super != name) {
            ptr->superClass = findClass(super);
        }
        return ptr.get();
    }

    nClass* registerStubClass(const std::string& rawName, const std::string& rawSuper) {
        std::string name = toLower(rawName);
        if (auto* existing = findClass(name)) {
            if (existing->superName.empty() && !rawSuper.empty() && toLower(rawSuper) != name) {
                existing->superName = toLower(rawSuper);
            }
            return existing;
        }
        return registerClass(name, rawSuper, []() { return std::make_unique<nRoot>(); });
    }

    void resolveSuperClasses() {
        for (auto& [name, cl] : classes) {
            if (!cl->superName.empty() && cl->superName != name) {
                cl->superClass = findClass(cl->superName);
                if (!cl->superClass) {
                    cl->superClass = findClass("nroot");
                }
            }
        }
    }

    nRoot* lookup(const std::string& path) {
        if (path.empty() || path == ".") return cwd;
        if (path == "/") return root.get();

        nRoot* cur = (path[0] == '/') ? root.get() : cwd;
        size_t i = (path[0] == '/') ? 1 : 0;
        while (i < path.size() && cur) {
            size_t slash = path.find('/', i);
            std::string tok = (slash == std::string::npos) ? path.substr(i) : path.substr(i, slash - i);
            if (tok == "..") {
                if (cur->parent) cur = cur->parent;
            } else if (!tok.empty() && tok != ".") {
                cur = cur->findChild(tok);
            }
            if (slash == std::string::npos) break;
            i = slash + 1;
        }
        return cur;
    }

    nRoot* newObj(const std::string& clsName, const std::string& path) {
        nClass* cl = findClass(clsName);
        if (!cl) {
            cl = registerStubClass(clsName, "nroot");
            cl->superClass = findClass("nroot");
        }
        // Ensure parent path exists (Nebula auto-creates intermediate nroot nodes!)
        nRoot* cur = (!path.empty() && path[0] == '/') ? root.get() : cwd;
        size_t i = (!path.empty() && path[0] == '/') ? 1 : 0;
        std::vector<std::string> parts;
        while (i < path.size()) {
            size_t slash = path.find('/', i);
            std::string tok = (slash == std::string::npos) ? path.substr(i) : path.substr(i, slash - i);
            if (!tok.empty() && tok != ".") parts.push_back(tok);
            if (slash == std::string::npos) break;
            i = slash + 1;
        }
        if (parts.empty()) return cur;

        for (size_t k = 0; k + 1 < parts.size(); ++k) {
            if (parts[k] == "..") {
                if (cur->parent) cur = cur->parent;
            } else {
                nRoot* next = cur->findChild(parts[k]);
                if (!next) {
                    auto nr = std::make_unique<nRoot>();
                    nr->name = parts[k];
                    nr->cls = findClass("nroot");
                    nr->ks = this;
                    next = cur->addChild(std::move(nr));
                }
                cur = next;
            }
        }

        const std::string& leafName = parts.back();
        if (nRoot* existing = cur->findChild(leafName)) {
            return existing;
        }
        auto obj = cl->factory ? cl->factory() : std::make_unique<nRoot>();
        obj->name = leafName;
        obj->cls = cl;
        obj->ks = this;
        return cur->addChild(std::move(obj));
    }

    void setCwd(nRoot* o) { if (o) cwd = o; }
    nRoot* getCwd() const { return cwd; }
    void pushCwd(nRoot* o) { cwdStack.push_back(cwd); if (o) cwd = o; }
    void popCwd() { if (!cwdStack.empty()) { cwd = cwdStack.back(); cwdStack.pop_back(); } }

    void setAssign(const std::string& name, const std::string& val) {
        auto* env = dynamic_cast<nEnv*>(newObj("nenv", "/sys/share/assigns/" + name));
        if (env) env->value = nArg::fromString(val);
    }

    std::string getAssign(const std::string& name) {
        auto* env = dynamic_cast<nEnv*>(lookup("/sys/share/assigns/" + name));
        return env ? env->value.sVal : "";
    }

    // Dispatch a script command to an object
    bool dispatch(nRoot* obj, const std::string& cmdName, const std::vector<std::string>& rawArgs, std::vector<nArg>& outArgs) {
        if (!obj || !obj->cls) return false;
        totalCmdCalls++;
        const nCmdProto* proto = obj->cls->findCmd(cmdName);

        nCmd cmd;
        cmd.name = cmdName;
        if (proto) {
            cmd.fourcc = proto->fourcc;
            // Convert raw string args according to proto->argTypes
            size_t ai = 0;
            for (char t : proto->argTypes) {
                if (t == 'v') continue;
                std::string s = (ai < rawArgs.size()) ? rawArgs[ai++] : "";
                if (t == 'i') {
                    try { cmd.inArgs.push_back(nArg::fromInt(std::stoi(s))); }
                    catch (...) { cmd.inArgs.push_back(nArg::fromInt(0)); }
                } else if (t == 'f') {
                    try { cmd.inArgs.push_back(nArg::fromFloat(std::stof(s))); }
                    catch (...) { cmd.inArgs.push_back(nArg::fromFloat(0.0f)); }
                } else if (t == 'b') {
                    bool b = (s == "true" || s == "1" || s == "yes");
                    cmd.inArgs.push_back(nArg::fromBool(b));
                } else if (t == 'o') {
                    cmd.inArgs.push_back(nArg::fromObject(lookup(s)));
                } else {
                    cmd.inArgs.push_back(nArg::fromString(s));
                }
            }
            if (proto->handler) {
                proto->handler(obj, cmd);
                outArgs = std::move(cmd.outArgs);
                return true;
            }
            // Smart stub: auto-store setX and return stored value for getX!
            stubCmdCalls++;
            stubCallCounts[obj->cls->name + "." + cmdName]++;
            if (cmdName.rfind("set", 0) == 0 && !cmd.inArgs.empty()) {
                obj->stubProps[cmdName.substr(3)] = cmd.inArgs;
            } else if (cmdName.rfind("get", 0) == 0) {
                auto it = obj->stubProps.find(cmdName.substr(3));
                if (it != obj->stubProps.end()) {
                    outArgs = it->second;
                    return true;
                }
            }
            // Synthesize default return values matching proto->retTypes
            for (char t : proto->retTypes) {
                if (t == 'v') continue;
                if (t == 'i') outArgs.push_back(nArg::fromInt(0));
                else if (t == 'f') outArgs.push_back(nArg::fromFloat(0.0f));
                else if (t == 'b') outArgs.push_back(nArg::fromBool(true));
                else if (t == 'o') outArgs.push_back(nArg::fromObject(nullptr));
                else outArgs.push_back(nArg::fromString(""));
            }
            return true;
        }

        // Fallback for unregistered Nebula 1 server methods (e.g. nGfxServer, nInputServer)
        stubCmdCalls++;
        stubCallCounts[obj->cls->name + "." + cmdName]++;
        if (traceStubs) {
            std::cout << "  [stub] " << obj->getFullName() << " (" << obj->cls->name << ")." << cmdName << "\n";
        }
        return true;
    }

private:
    void registerBuiltinClasses() {
        auto* clRoot = registerClass("nroot", "", []() { return std::make_unique<nRoot>(); });
        clRoot->addCmdProto("s_getclass_v", "GCLS", [](nRoot* o, nCmd& c) {
            c.outArgs.push_back(nArg::fromString(o->cls ? o->cls->name : "nroot"));
        });
        clRoot->addCmdProto("s_getname_v", "GNAM", [](nRoot* o, nCmd& c) {
            c.outArgs.push_back(nArg::fromString(o->name));
        });
        clRoot->addCmdProto("s_getfullname_v", "GFNM", [](nRoot* o, nCmd& c) {
            c.outArgs.push_back(nArg::fromString(o->getFullName()));
        });
        clRoot->addCmdProto("b_isa_s", "ISA_", [](nRoot* o, nCmd& c) {
            bool r = o->cls && !c.inArgs.empty() && o->cls->isA(nKernelServer::toLower(c.inArgs[0].sVal));
            c.outArgs.push_back(nArg::fromBool(r));
        });
        clRoot->addCmdProto("v_setname_s", "SNAM", [](nRoot* o, nCmd& c) {
            if (!c.inArgs.empty()) o->name = c.inArgs[0].sVal;
        });

        auto* clEnv = registerClass("nenv", "nroot", []() { return std::make_unique<nEnv>(); });
        clEnv->addCmdProto("v_sets_s", "SETS", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEnv*>(o)) if (!c.inArgs.empty()) e->value = nArg::fromString(c.inArgs[0].sVal);
        });
        clEnv->addCmdProto("s_gets_v", "GETS", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEnv*>(o)) c.outArgs.push_back(nArg::fromString(e->value.sVal));
        });
        clEnv->addCmdProto("v_seti_i", "SETI", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEnv*>(o)) if (!c.inArgs.empty()) e->value = nArg::fromInt(c.inArgs[0].iVal);
        });
        clEnv->addCmdProto("i_geti_v", "GETI", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEnv*>(o)) c.outArgs.push_back(nArg::fromInt(e->value.iVal));
        });
        clEnv->addCmdProto("v_setf_f", "SETF", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEnv*>(o)) if (!c.inArgs.empty()) e->value = nArg::fromFloat(c.inArgs[0].fVal);
        });
        clEnv->addCmdProto("f_getf_v", "GETF", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEnv*>(o)) c.outArgs.push_back(nArg::fromFloat(e->value.fVal));
        });
        clEnv->addCmdProto("v_setb_b", "SETB", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEnv*>(o)) if (!c.inArgs.empty()) e->value = nArg::fromBool(c.inArgs[0].bVal);
        });
        clEnv->addCmdProto("b_getb_v", "GETB", [](nRoot* o, nCmd& c) {
            if (auto* e = dynamic_cast<nEnv*>(o)) c.outArgs.push_back(nArg::fromBool(e->value.bVal));
        });
    }
};

} // namespace nebula
