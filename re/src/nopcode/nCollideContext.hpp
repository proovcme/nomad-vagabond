#pragma once
// Auto-lifted C++ layout & method spec from nopcode.dll
// Source ASM: re/disasm/nopcode/nCollideContext.asm
// Class: nCollideContext

#include <cstdint>

namespace re_nopcode {

struct nCollideContext_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0838
    uint32_t field_0x0838;
    // +0x0860
    uint32_t field_0x0860;
};

// Methods (7):
// 0x100016e7  nCollideContext::nCollideContext()  (44 insns)
// 0x10001770  nCollideContext::operator=  (43 insns)
// 0x10001854  nCollideContext::nCollideContext()  (107 insns)
// 0x1000196a  nCollideContext::GetCollideServer  (2 insns)
// 0x100042b0  nCollideContext::vfunc_41  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideServer::QueryCollType
// 0x100042b6  nCollideContext::vfunc_40  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideServer::QueryCollClass
// 0x100042bc  nCollideContext::vfunc_39  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideServer::GetDefaultContext

} // namespace re_nopcode
