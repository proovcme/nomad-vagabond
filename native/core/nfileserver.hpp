#pragma once
// Native C++17 nFileServer / nFileServer2 / nNpkFileServer for Nebula Device 1

#include <filesystem>
#include <fstream>
#include <iostream>
#include <string>
#include <vector>

#include "../viewer/nebula_assets.hpp"
#include "nkernel.hpp"

namespace nebula {

class nFileServer : public nRoot {
public:
    std::vector<NpkArchive> mountedNpks;

    std::string manglePath(const std::string& raw) const {
        std::string p = raw;
        std::replace(p.begin(), p.end(), '\\', '/');
        auto colon = p.find(':');
        if (colon != std::string::npos && colon > 1) { // assign like "home:scripts/demo.tcl"
            std::string assignName = p.substr(0, colon);
            std::string rest = p.substr(colon + 1);
            std::string base = ks ? ks->getAssign(assignName) : "";
            if (!base.empty()) {
                if (base.back() != '/' && !rest.empty() && rest.front() != '/') base += '/';
                return base + rest;
            }
        }
        return p;
    }

    bool mountNpk(const std::string& rawPath) {
        std::string full = manglePath(rawPath);
        NpkArchive arc;
        if (arc.open(full)) {
            std::cout << "[nFileServer] Mounted NPK: " << full
                      << " (" << arc.entries.size() << " files)\n";
            mountedNpks.push_back(std::move(arc));
            return true;
        }
        return false;
    }

    int mountDirectory(const std::string& rawDir, const std::string& ext) {
        std::string full = manglePath(rawDir);
        int count = 0;
        std::error_code ec;
        if (!std::filesystem::exists(full, ec)) return 0;
        for (const auto& entry : std::filesystem::directory_iterator(full, ec)) {
            if (entry.is_regular_file()) {
                auto p = entry.path().string();
                std::string low = nKernelServer::toLower(p);
                std::string want = "." + nKernelServer::toLower(ext);
                if (low.size() >= want.size() && low.compare(low.size() - want.size(), want.size(), want) == 0) {
                    if (mountNpk(p)) count++;
                }
            }
        }
        return count;
    }

    bool readFile(const std::string& rawPath, std::vector<uint8_t>& out) const {
        std::string full = manglePath(rawPath);
        std::ifstream f(full, std::ios::binary);
        if (f) {
            f.seekg(0, std::ios::end);
            auto sz = f.tellg();
            f.seekg(0, std::ios::beg);
            out.resize(static_cast<size_t>(sz));
            f.read(reinterpret_cast<char*>(out.data()), sz);
            return true;
        }
        // Fallback to mounted NPK archives
        for (const auto& arc : mountedNpks) {
            if (arc.readFile(rawPath, out)) return true;
        }
        return false;
    }
};

inline void registerFileServers(nKernelServer& ks) {
    auto registerFS = [&](const std::string& clsName) {
        auto* cl = ks.registerClass(clsName, "nroot", []() { return std::make_unique<nFileServer>(); });
        cl->addCmdProto("v_setassign_ss", "SASN", [](nRoot* o, nCmd& c) {
            if (o->ks && c.inArgs.size() >= 2) {
                o->ks->setAssign(c.inArgs[0].sVal, c.inArgs[1].sVal);
            }
        });
        cl->addCmdProto("s_getassign_s", "GASN", [](nRoot* o, nCmd& c) {
            std::string v = (o->ks && !c.inArgs.empty()) ? o->ks->getAssign(c.inArgs[0].sVal) : "";
            c.outArgs.push_back(nArg::fromString(v));
        });
        cl->addCmdProto("s_manglepath_s", "MPTH", [](nRoot* o, nCmd& c) {
            std::string v;
            if (auto* fs = dynamic_cast<nFileServer*>(o); fs && !c.inArgs.empty()) {
                v = fs->manglePath(c.inArgs[0].sVal);
            }
            c.outArgs.push_back(nArg::fromString(v));
        });
        cl->addCmdProto("b_parsefile_s", "PRSF", [](nRoot* o, nCmd& c) {
            bool ok = false;
            if (auto* fs = dynamic_cast<nFileServer*>(o)) {
                if (!c.inArgs.empty()) ok = fs->mountNpk(c.inArgs[0].sVal);
            }
            c.outArgs.push_back(nArg::fromBool(ok));
        });
        cl->addCmdProto("i_parsedirectory_ss", "PRSD", [](nRoot* o, nCmd& c) {
            int n = 0;
            if (auto* fs = dynamic_cast<nFileServer*>(o)) {
                if (c.inArgs.size() >= 2) n = fs->mountDirectory(c.inArgs[0].sVal, c.inArgs[1].sVal);
            }
            c.outArgs.push_back(nArg::fromInt(n));
        });
    };
    registerFS("nfileserver");
    registerFS("nfileserver2");
    registerFS("nnpkfileserver");
}

} // namespace nebula
