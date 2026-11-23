#pragma once
// Auto-lifted C++ layout & method spec from nkernel.dll
// Source ASM: re/disasm/nkernel/nHardRefServer.asm
// Class: nHardRefServer

#include <cstdint>

namespace re_nkernel {

struct nHardRefServer_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x0020
    uint32_t field_0x0020;
};

// Methods (5):
// 0x10005952  nHardRefServer::nHardRefServer()  (6 insns)
// 0x10005961  nHardRefServer::~nHardRefServer()  (8 insns)
// 0x10005971  nHardRefServer::RegisterHardRef  (35 insns)
// 0x100059cf  nHardRefServer::RegisterTargetObject  (132 insns)
//   calls:   -> nRoot::GetFullName, -> n_strncpy2, -> n_free, -> nRoot::AddObjectRef
// 0x10005b07  nHardRefServer::operator=  (11 insns)

} // namespace re_nkernel
