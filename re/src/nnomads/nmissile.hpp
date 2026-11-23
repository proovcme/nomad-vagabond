#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nmissile.asm
// Class: nmissile : public nautonom  (sizeof = 0x1140 = 4416 bytes)

#include <cstdint>

namespace re_nnomads {

struct nmissile_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x1138
    uint8_t field_0x1138;
};

// Script AddCmds (2):
//   v_setguided_b
//   b_isguided_v

// Methods (9):
// 0x1002b512  nmissile::vfunc_00  (12 insns)
// 0x1002b534  nmissile::n_init_nmissile  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nautonom', 'cannot initialize missile class', 'container/nmsl_head.cc'
// 0x1002b58f  nmissile::n_fini_nmissile  (14 insns)
// 0x1002b5b2  nmissile::n_new_nmissile  (10 insns)
// 0x1002b5cc  nmissile::n_version_nmissile  (20 insns)
//   strings: 'v_setguided_b', 'b_isguided_v'
// 0x1002b613  nmissile::cmd_setguided (v_setguided_b)  (10 insns)
// 0x1002b637  nmissile::cmd_isguided (b_isguided_v)  (13 insns)
// 0x1002b663  nmissile::vfunc_11  (34 insns)
//   calls:   -> nautonom::vfunc_11
// 0x1002b6ba  nmissile::vfunc_18  (6 insns)
//   calls:   -> nautonom::vfunc_18

} // namespace re_nnomads
