// Native macOS arm64 Nebula Device 1 Kernel + Tcl Engine Core for Project Nomads
// Replaces nomads.exe (32 KB Win32 launcher) + nkernel.dll + ntclserver + nnpkfileserver.

#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

#include "nfileserver.hpp"
#include "ngen_classes.hpp"
#include "nkernel.hpp"
#include "ntclserver.hpp"

static void dumpNohTree(const nebula::nRoot* node, int depth, int maxDepth) {
    if (!node || depth > maxDepth) return;
    for (int i = 0; i < depth; ++i) std::cout << "  ";
    std::cout << (node->name.empty() ? "/" : node->name)
              << " [" << (node->cls ? node->cls->name : "?") << "]";
    if (depth == maxDepth && !node->children.empty()) {
        std::cout << " (+" << node->children.size() << " children)";
    }
    std::cout << "\n";
    if (depth < maxDepth) {
        for (const auto& c : node->children) {
            dumpNohTree(c.get(), depth + 1, maxDepth);
        }
    }
}

static size_t countNohNodes(const nebula::nRoot* node) {
    if (!node) return 0;
    size_t n = 1;
    for (const auto& c : node->children) n += countNohNodes(c.get());
    return n;
}

int main(int argc, const char** argv) {
    std::string runDir = "/Users/ovc/Downloads/Проект «Бродяги»/extracted/Run/";
    std::string scriptRel = "scripts/demo.tcl";
    bool trace = false;

    for (int i = 1; i < argc; ++i) {
        std::string arg = argv[i];
        if (arg == "-home" && i + 1 < argc) runDir = argv[++i];
        else if (arg == "-run" && i + 1 < argc) scriptRel = argv[++i];
        else if (arg == "-trace") trace = true;
    }
    if (!runDir.empty() && runDir.back() != '/') runDir += '/';

    std::cout << "=== Project Nomads Native macOS arm64 Core (Nebula Device 1) ===\n";

    nebula::nKernelServer ks;
    ks.traceStubs = trace;

    // 1. Register real native servers & all 250+ Nebula/Nomads/Nature/Network classes
    nebula::registerFileServers(ks);
    ks.registerClass("ntclserver", "nroot", []() { return std::make_unique<nebula::nTclServer>(); });
    registerAllGeneratedClasses(ks);
    ks.resolveSuperClasses();

    std::cout << "[Kernel] Registered " << ks.classes.size() << " Nebula/Nomads classes.\n";

    // 2. Setup assigns (matching nomads.exe)
    ks.setAssign("home", runDir);
    ks.setAssign("bin", runDir + "bin/win32/");

    // 3. Create core servers
    auto* fs1 = dynamic_cast<nebula::nFileServer*>(ks.newObj("nfileserver", "/sys/servers/file"));
    auto* fs2 = dynamic_cast<nebula::nFileServer*>(ks.newObj("nnpkfileserver", "/sys/servers/file2"));
    auto* tcl = dynamic_cast<nebula::nTclServer*>(ks.newObj("ntclserver", "/sys/servers/script"));
    ks.newObj("nroot", "/sys/share/arguments");

    // Pre-mount data.npk & data1.npk if present
    if (fs2) {
        fs2->mountNpk(runDir + "data.npk");
        fs2->mountNpk(runDir + "data1.npk");
    }
    (void)fs1;

    // 4. Execute the real game startup script!
    std::string fullScript = runDir + scriptRel;
    std::cout << "[Kernel] Executing real game script: " << fullScript << "\n";
    std::cout << "-----------------------------------------------------------------\n";
    bool ok = tcl->runScriptFile(fullScript);
    std::cout << "-----------------------------------------------------------------\n";

    std::cout << "[Kernel] Script finished: " << (ok ? "SUCCESS" : "ERROR") << "\n";
    std::cout << "[Kernel] Total NOH objects alive: " << countNohNodes(ks.root.get()) << "\n";
    std::cout << "[Kernel] Total Nebula cmds dispatched: " << ks.totalCmdCalls
              << " (real: " << (ks.totalCmdCalls - ks.stubCmdCalls)
              << ", stub: " << ks.stubCmdCalls << ")\n\n";

    std::cout << "=== Live Nebula Object Hierarchy (depth <= 3) ===\n";
    dumpNohTree(ks.root.get(), 0, 3);

    // Print top 20 most-called stub commands (roadmap for next implementations)
    std::vector<std::pair<std::string, size_t>> stubs(ks.stubCallCounts.begin(), ks.stubCallCounts.end());
    std::sort(stubs.begin(), stubs.end(), [](const auto& a, const auto& b) { return a.second > b.second; });
    std::cout << "\n=== Top 20 Called Stub Commands (Implementation Roadmap) ===\n";
    for (size_t i = 0; i < std::min<size_t>(20, stubs.size()); ++i) {
        std::cout << "  " << stubs[i].second << "x  " << stubs[i].first << "\n";
    }
    return ok ? 0 : 1;
}
