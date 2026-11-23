#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncollhandler2.asm
// Class: ncollhandler2 : public nroot  (sizeof = 0x5080 = 20608 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncollhandler2_Layout {
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
    // +0x001c
    uint32_t field_0x001c;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint8_t field_0x006c;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0078
    uint32_t field_0x0078;
    // +0x00f8
    uint32_t field_0x00f8;
};

// Methods (5):
// 0x10004a65  ncollhandler2::n_init_ncollhandler2  (15 insns)
//   strings: 'nroot'
// 0x10004a90  ncollhandler2::n_fini_ncollhandler2  (5 insns)
// 0x10004aa2  ncollhandler2::n_new_ncollhandler2  (10 insns)
// 0x10004abc  ncollhandler2::n_version_ncollhandler2  (2 insns)
// 0x10006753  ncollhandler2::vfunc_00  (555 insns)
//   calls:   -> nContainer::GetPosition, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'gamehandler/ncollhandler2_main.cc'

} // namespace re_nnomads
