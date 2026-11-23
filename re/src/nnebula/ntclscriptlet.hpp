#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/ntclscriptlet.asm
// Class: ntclscriptlet : public nscriptlet  (sizeof = 0x7c = 124 bytes)

#include <cstdint>

namespace re_nnebula {

struct ntclscriptlet_Layout {
    // +0x0074
    uint32_t field_0x0074;
};

// Methods (6):
// 0x100354a2  ntclscriptlet::n_init_ntclscriptlet  (10 insns)
//   strings: 'nscriptlet'
// 0x100354c3  ntclscriptlet::n_fini_ntclscriptlet  (5 insns)
// 0x100354d5  ntclscriptlet::n_new_ntclscriptlet  (10 insns)
// 0x100354ec  ntclscriptlet::n_version_ntclscriptlet  (9 insns)
// 0x10035504  ntclscriptlet::vfunc_00  (92 insns)
//   calls:   IAT: nkernel.dll!nn_malloc, IAT: MSVCRT.dll!fgets, IAT: nkernel.dll!n_free
//   strings: 'script/ntclscriptlet_main.cc'
// 0x100355e7  ntclscriptlet::vfunc_14  (65 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: nkernel.dll!nn_malloc, IAT: MSVCRT.dll!fseek
//   strings: 'script/ntclscriptlet_main.cc'

} // namespace re_nnebula
