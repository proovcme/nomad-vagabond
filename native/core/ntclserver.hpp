#pragma once
// Native C++17 nTclServer backed by macOS Tcl.framework (Tcl 8.5)
// Implements Nebula Device 1's Tcl command bridge: new, delete, sel, psel, exists, dir, get, unknown.

#include <Tcl/tcl.h>

#include <cstring>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

#include "nfileserver.hpp"
#include "nkernel.hpp"

namespace nebula {

class nTclServer : public nRoot {
public:
    Tcl_Interp* interp = nullptr;

    nTclServer() {
        interp = Tcl_CreateInterp();
        Tcl_Init(interp);
        registerTclCommands();
    }

    ~nTclServer() override {
        if (interp) {
            Tcl_DeleteInterp(interp);
            interp = nullptr;
        }
    }

    bool runScriptFile(const std::string& path) {
        int rc = Tcl_EvalFile(interp, path.c_str());
        if (rc != TCL_OK) {
            const char* err = Tcl_GetVar(interp, "errorInfo", TCL_GLOBAL_ONLY);
            std::cerr << "[nTclServer] ERROR in " << path << ":\n"
                      << (err ? err : Tcl_GetStringResult(interp)) << "\n";
            return false;
        }
        return true;
    }

    bool evalString(const std::string& code) {
        int rc = Tcl_Eval(interp, code.c_str());
        if (rc != TCL_OK) {
            std::cerr << "[nTclServer] Eval error: " << Tcl_GetStringResult(interp) << "\n";
            return false;
        }
        return true;
    }

private:
    static std::string argToTcl(const nArg& a) {
        switch (a.type) {
            case nArg::INT:    return std::to_string(a.iVal);
            case nArg::FLOAT: {
                std::ostringstream os; os << a.fVal; return os.str();
            }
            case nArg::BOOL:   return a.bVal ? "true" : "false";
            case nArg::STRING: return a.sVal;
            case nArg::OBJECT: return a.oVal ? a.oVal->getFullName() : "null";
            default:           return "";
        }
    }

    static void setTclResultFromArgs(Tcl_Interp* interp, const std::vector<nArg>& out) {
        if (out.empty()) {
            Tcl_ResetResult(interp);
        } else if (out.size() == 1) {
            std::string s = argToTcl(out[0]);
            Tcl_SetObjResult(interp, Tcl_NewStringObj(s.c_str(), static_cast<int>(s.size())));
        } else {
            Tcl_Obj* list = Tcl_NewListObj(0, nullptr);
            for (const auto& a : out) {
                std::string s = argToTcl(a);
                Tcl_ListObjAppendElement(interp, list, Tcl_NewStringObj(s.c_str(), static_cast<int>(s.size())));
            }
            Tcl_SetObjResult(interp, list);
        }
    }

    void registerTclCommands() {
        Tcl_CreateObjCommand(interp, "new",     cmdNew,     this, nullptr);
        Tcl_CreateObjCommand(interp, "delete",  cmdDelete,  this, nullptr);
        Tcl_CreateObjCommand(interp, "sel",     cmdSel,     this, nullptr);
        Tcl_CreateObjCommand(interp, "psel",    cmdPsel,    this, nullptr);
        Tcl_CreateObjCommand(interp, "exists",  cmdExists,  this, nullptr);
        Tcl_CreateObjCommand(interp, "dir",     cmdDir,     this, nullptr);
        Tcl_CreateObjCommand(interp, "get",     cmdGet,     this, nullptr);
        Tcl_CreateObjCommand(interp, "unknown", cmdUnknown, this, nullptr);
    }

    static int cmdNew(ClientData cd, Tcl_Interp* interp, int objc, Tcl_Obj* const objv[]) {
        auto* self = static_cast<nTclServer*>(cd);
        if (objc < 3) {
            Tcl_SetResult(interp, const_cast<char*>("Usage: new class path"), TCL_STATIC);
            return TCL_ERROR;
        }
        std::string cls = Tcl_GetString(objv[1]);
        std::string path = Tcl_GetString(objv[2]);
        nRoot* obj = self->ks->newObj(cls, path);
        std::string full = obj ? obj->getFullName() : "null";
        Tcl_SetObjResult(interp, Tcl_NewStringObj(full.c_str(), static_cast<int>(full.size())));
        return TCL_OK;
    }

    static int cmdDelete(ClientData cd, Tcl_Interp* interp, int objc, Tcl_Obj* const objv[]) {
        auto* self = static_cast<nTclServer*>(cd);
        if (objc >= 2) {
            nRoot* obj = self->ks->lookup(Tcl_GetString(objv[1]));
            if (obj && obj->parent) {
                if (self->ks->getCwd() == obj) self->ks->setCwd(obj->parent);
                obj->parent->removeChild(obj);
            }
        }
        Tcl_ResetResult(interp);
        return TCL_OK;
    }

    static int cmdSel(ClientData cd, Tcl_Interp* interp, int objc, Tcl_Obj* const objv[]) {
        auto* self = static_cast<nTclServer*>(cd);
        if (objc < 2) {
            std::string full = self->ks->getCwd()->getFullName();
            Tcl_SetObjResult(interp, Tcl_NewStringObj(full.c_str(), static_cast<int>(full.size())));
            return TCL_OK;
        }
        std::string path = Tcl_GetString(objv[1]);
        nRoot* obj = self->ks->lookup(path);
        if (!obj) {
            // Auto-create placeholder nroot so startup scripts don't abort on unimplemented subtrees
            obj = self->ks->newObj("nroot", path);
        }
        self->ks->setCwd(obj);
        std::string full = obj->getFullName();
        Tcl_SetObjResult(interp, Tcl_NewStringObj(full.c_str(), static_cast<int>(full.size())));
        return TCL_OK;
    }

    static int cmdPsel(ClientData cd, Tcl_Interp* interp, int, Tcl_Obj* const[]) {
        auto* self = static_cast<nTclServer*>(cd);
        std::string full = self->ks->getCwd()->getFullName();
        Tcl_SetObjResult(interp, Tcl_NewStringObj(full.c_str(), static_cast<int>(full.size())));
        return TCL_OK;
    }

    static int cmdExists(ClientData cd, Tcl_Interp* interp, int objc, Tcl_Obj* const objv[]) {
        auto* self = static_cast<nTclServer*>(cd);
        int ex = (objc >= 2 && self->ks->lookup(Tcl_GetString(objv[1])) != nullptr) ? 1 : 0;
        Tcl_SetObjResult(interp, Tcl_NewIntObj(ex));
        return TCL_OK;
    }

    static int cmdDir(ClientData cd, Tcl_Interp* interp, int, Tcl_Obj* const[]) {
        auto* self = static_cast<nTclServer*>(cd);
        Tcl_Obj* list = Tcl_NewListObj(0, nullptr);
        for (const auto& c : self->ks->getCwd()->children) {
            Tcl_ListObjAppendElement(interp, list, Tcl_NewStringObj(c->name.c_str(), static_cast<int>(c->name.size())));
        }
        Tcl_SetObjResult(interp, list);
        return TCL_OK;
    }

    static int cmdGet(ClientData cd, Tcl_Interp* interp, int objc, Tcl_Obj* const objv[]) {
        auto* self = static_cast<nTclServer*>(cd);
        if (objc < 2) {
            Tcl_SetResult(interp, const_cast<char*>("null"), TCL_STATIC);
            return TCL_OK;
        }
        std::string fname = Tcl_GetString(objv[1]);
        // Derive object name from filename (e.g. "foo/bar.n" -> "bar")
        std::string base = fname;
        auto sl = base.find_last_of("/\\:");
        if (sl != std::string::npos) base = base.substr(sl + 1);
        auto dot = base.rfind('.');
        if (dot != std::string::npos) base = base.substr(0, dot);

        auto* fs = dynamic_cast<nFileServer*>(self->ks->lookup("/sys/servers/file2"));
        if (!fs) fs = dynamic_cast<nFileServer*>(self->ks->lookup("/sys/servers/file"));

        std::vector<uint8_t> data;
        if (fs && fs->readFile(fname, data)) {
            if (data.size() >= 4 && std::memcmp(data.data(), "0BON", 4) == 0) {
                // Binary NOB0 object — create node under cwd
                nRoot* obj = self->ks->newObj("n3dnode", base);
                std::string full = obj->getFullName();
                Tcl_SetObjResult(interp, Tcl_NewStringObj(full.c_str(), static_cast<int>(full.size())));
                return TCL_OK;
            } else {
                // Text .n script — execute in a newly created object context
                nRoot* obj = self->ks->newObj("nroot", base);
                self->ks->pushCwd(obj);
                std::string code(reinterpret_cast<const char*>(data.data()), data.size());
                Tcl_Eval(interp, code.c_str());
                self->ks->popCwd();
                std::string full = obj->getFullName();
                Tcl_SetObjResult(interp, Tcl_NewStringObj(full.c_str(), static_cast<int>(full.size())));
                return TCL_OK;
            }
        }
        // Fallback placeholder
        nRoot* obj = self->ks->newObj("nroot", base);
        std::string full = obj->getFullName();
        Tcl_SetObjResult(interp, Tcl_NewStringObj(full.c_str(), static_cast<int>(full.size())));
        return TCL_OK;
    }

    static int cmdUnknown(ClientData cd, Tcl_Interp* interp, int objc, Tcl_Obj* const objv[]) {
        auto* self = static_cast<nTclServer*>(cd);
        if (objc < 2) return TCL_ERROR;
        std::string head = Tcl_GetString(objv[1]);

        std::vector<std::string> args;
        for (int i = 2; i < objc; ++i) {
            args.emplace_back(Tcl_GetString(objv[i]));
        }

        std::string objPath;
        std::string cmdName = head;
        auto dot = head.rfind('.');
        if (dot != std::string::npos) {
            objPath = head.substr(0, dot);
            cmdName = head.substr(dot + 1);
        }

        nRoot* target = objPath.empty() ? self->ks->getCwd() : self->ks->lookup(objPath);
        if (!target) {
            // If a script calls a method on an uncreated path, create a placeholder so we can trace the full boot
            if (!objPath.empty() && objPath[0] == '/') {
                target = self->ks->newObj("nroot", objPath);
            } else {
                target = self->ks->getCwd();
            }
        }

        std::vector<nArg> out;
        self->ks->dispatch(target, cmdName, args, out);
        setTclResultFromArgs(interp, out);
        return TCL_OK;
    }
};

} // namespace nebula
