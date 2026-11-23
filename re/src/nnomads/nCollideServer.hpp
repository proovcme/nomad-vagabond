#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nCollideServer.asm
// Class: nCollideServer

#include <cstdint>

namespace re_nnomads {

struct nCollideServer_Layout {
    // +0x0044
    uint32_t field_0x0044;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint8_t field_0x006c;
    // +0x006d
    uint8_t field_0x006d;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0080
    uint32_t field_0x0080;
};

// Methods (3):
// 0x10004eac  nCollideServer::QueryCollType  (35 insns)
// 0x10004f03  nCollideServer::nCollideServer()  (42 insns)
//   calls:   -> nRoot::nRoot()
// 0x10004f69  nCollideServer::operator=  (41 insns)
//   calls:   -> nRoot::operator=

} // namespace re_nnomads
