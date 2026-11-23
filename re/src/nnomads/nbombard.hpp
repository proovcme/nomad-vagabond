#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nbombard.asm
// Class: nbombard : public nsquadronwatchtarget  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct nbombard_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0064
    float field_0x0064;
    // +0x1139
    uint8_t field_0x1139;
};

// Script AddCmds (2):
//   v_setmaxaberrance_f
//   f_getmaxaberrance_v

// Methods (6):
// 0x1006bea0  nbombard::n_init_nbombard  (15 insns)
//   strings: 'nsquadronwatchtarget'
// 0x1006becb  nbombard::n_fini_nbombard  (5 insns)
// 0x1006bedd  nbombard::n_new_nbombard  (17 insns)
// 0x1006bf08  nbombard::vfunc_00  (12 insns)
// 0x1006bf2a  nbombard::vfunc_22  (128 insns)
//   calls:   -> nContainer::IsHandControl, -> nRealWorld::IsEnemy, -> nContainer::GetPosition
//   consts:  f32=0
//   strings: 'v_setmaxaberrance_f', 'f_getmaxaberrance_v'
// 0x1006c0c9  nbombard::vfunc_11  (31 insns)
//   calls:   -> nsquadronwatchtarget::vfunc_11

} // namespace re_nnomads
