#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/ncharacterserver.asm
// Class: ncharacterserver : public nroot  (sizeof = 0x5c = 92 bytes)

#include <cstdint>

namespace re_nnebula {

struct ncharacterserver_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x015c
    uint32_t field_0x015c;
};

// Methods (4):
// 0x10003664  ncharacterserver::n_init_ncharacterserver  (10 insns)
//   strings: 'nroot'
// 0x10003685  ncharacterserver::n_fini_ncharacterserver  (5 insns)
// 0x10003697  ncharacterserver::n_new_ncharacterserver  (22 insns)
// 0x100036d0  ncharacterserver::vfunc_00  (373 insns)
//   calls:   IAT: MSVCRT.dll!memmove, IAT: nkernel.dll!n_free

} // namespace re_nnebula
