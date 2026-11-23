#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nflipflop.asm
// Class: nflipflop : public nanimnode  (sizeof = 0xc4 = 196 bytes)

#include <cstdint>

namespace re_nnebula {

struct nflipflop_Layout {
    // +0x0004
    float field_0x0004;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    float field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00bc
    uint32_t field_0x00bc;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (1):
//   b_addkey_fs

// Methods (9):
// 0x1003013c  nflipflop::n_init_nflipflop  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nanimnode', 'could not open superclass nanimnode!', 'node/nflip_init.cc'
// 0x10030197  nflipflop::n_fini_nflipflop  (14 insns)
// 0x100301ba  nflipflop::n_new_nflipflop  (10 insns)
// 0x100301d4  nflipflop::n_version_nflipflop  (40 insns)
//   calls:   -> nAnimNode::nAnimNode(), IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Out of mem!', 'node/nflip_main.cc'
// 0x10030253  nflipflop::vfunc_00  (96 insns)
//   calls:   -> nAnimNode::~nAnimNode(), IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Out of mem!', 'node/nflip_main.cc'
// 0x1003036b  nflipflop::vfunc_21  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x100303ae  nflipflop::vfunc_14  (126 insns)
//   calls:   IAT: MSVCRT.dll!floor, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f64=0, f32=0.0001, f32=0
//   strings: 'node/nflip_main.cc', 'b_addkey_fs'
// 0x10030525  nflipflop::cmd_addkey (b_addkey_fs)  (27 insns)
// 0x10030571  nflipflop::vfunc_11  (55 insns)
//   calls:   -> nAnimNode::SaveCmds

} // namespace re_nnebula
