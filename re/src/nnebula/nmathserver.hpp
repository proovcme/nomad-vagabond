#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nmathserver.asm
// Class: nmathserver : public nroot  (sizeof = 0xb0 = 176 bytes)

#include <cstdint>

namespace re_nnebula {

struct nmathserver_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00ac
    uint32_t field_0x00ac;
};

// Methods (23):
// 0x10017429  nmathserver::n_init_nmathserver  (21 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nroot', 'misc/nmathserver.cc'
// 0x1001747a  nmathserver::n_fini_nmathserver  (14 insns)
// 0x1001749d  nmathserver::n_new_nmathserver  (10 insns)
// 0x100174b7  nmathserver::n_version_nmathserver  (114 insns)
//   calls:   -> nmathserver::vfunc_14, IAT: nkernel.dll!nn_malloc, IAT: MSVCRT.dll!time, IAT: MSVCRT.dll!srand, IAT: MSVCRT.dll!rand
//   consts:  f32=6.103702e-05, f32=1, f32=0
//   strings: 'misc/nmath_main.cc'
// 0x10017624  nmathserver::vfunc_00  (24 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x10017664  nmathserver::vfunc_14  (10 insns)
// 0x10017676  nmathserver::vfunc_15  (10 insns)
// 0x10017689  nmathserver::vfunc_16  (10 insns)
// 0x1001769c  nmathserver::vfunc_17  (4 insns)
// 0x100176ab  nmathserver::vfunc_18  (4 insns)
// 0x100176ba  nmathserver::vfunc_19  (15 insns)
// 0x100176e2  nmathserver::vfunc_21  (6 insns)
// 0x100176f5  nmathserver::vfunc_22  (6 insns)
// 0x10017708  nmathserver::vfunc_23  (6 insns)
// 0x1001771b  nmathserver::vfunc_20  (184 insns)
// 0x100178cb  nmathserver::vfunc_24  (5 insns)
// 0x100178e2  nmathserver::vfunc_25  (7 insns)
// 0x10017902  nmathserver::vfunc_26  (89 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'misc/nmath_varray.cc'
// 0x100179f4  nmathserver::vfunc_27  (94 insns)
// 0x10017af5  nmathserver::vfunc_28  (151 insns)
// 0x10017c63  nmathserver::vfunc_29  (90 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f32=0
//   strings: 'misc/nmath_varray.cc'
// 0x10017d58  nmathserver::vfunc_30  (197 insns)
// 0x10017f65  nmathserver::vfunc_31  (246 insns)

} // namespace re_nnebula
