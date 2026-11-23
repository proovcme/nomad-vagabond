#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nScriptServer.asm
// Class: nScriptServer

#include <cstdint>

namespace re_nnetwork {

struct nScriptServer_Layout {
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint8_t field_0x004c;
    // +0x004d
    uint8_t field_0x004d;
    // +0x004e
    uint8_t field_0x004e;
    // +0x004f
    uint8_t field_0x004f;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint8_t field_0x005c;
};

// Methods (7):
// 0x1000172f  nScriptServer::nScriptServer()  (18 insns)
// 0x10001762  nScriptServer::SetSelectMethod  (3 insns)
// 0x1000176c  nScriptServer::GetSelectMethod  (2 insns)
// 0x10001770  nScriptServer::nScriptServer()  (31 insns)
//   calls:   -> nRoot::nRoot()
// 0x100017c7  nScriptServer::operator=  (30 insns)
//   calls:   -> nRoot::operator=
// 0x10001874  nScriptServer::SetFailOnError  (3 insns)
// 0x1000187e  nScriptServer::GetFailOnError  (2 insns)

} // namespace re_nnetwork
