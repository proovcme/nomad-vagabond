#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncritter2.asm
// Class: ncritter2 : public nvehicle  (sizeof = 0x12a8 = 4776 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncritter2_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint8_t field_0x0010;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0ec8
    uint32_t field_0x0ec8;
    // +0x1288
    float field_0x1288;
    // +0x128c
    uint32_t field_0x128c;
    // +0x129c
    uint32_t field_0x129c;
    // +0x12a0
    uint32_t field_0x12a0;
    // +0x12a4
    uint8_t field_0x12a4;
};

// Script AddCmds (1):
//   b_hitvictim_v

// Methods (6):
// 0x10060dd8  ncritter2::n_init_ncritter2  (15 insns)
//   strings: 'nvehicle'
// 0x10060e03  ncritter2::n_fini_ncritter2  (5 insns)
// 0x10060e15  ncritter2::n_new_ncritter2  (41 insns)
// 0x10060e90  ncritter2::vfunc_00  (132 insns)
//   consts:  f32=0.001, f32=1
//   strings: 'b_hitvictim_v'
// 0x10061002  ncritter2::cmd_hitvictim (b_hitvictim_v)  (13 insns)
// 0x1006102d  ncritter2::vfunc_11  (5 insns)

} // namespace re_nnomads
