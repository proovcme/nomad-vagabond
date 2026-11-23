#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nmoving.asm
// Class: nmoving : public nservice  (sizeof = 0x60 = 96 bytes)

#include <cstdint>

namespace re_nnomads {

struct nmoving_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0014
    float field_0x0014;
    // +0x001c
    float field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    uint8_t field_0x0058;
    // +0x0059
    uint8_t field_0x0059;
    // +0x0b42
    uint8_t field_0x0b42;
    // +0x0b43
    uint8_t field_0x0b43;
};

// Script AddCmds (4):
//   v_setallowmove_b
//   b_getallowmove_v
//   v_setallowrotate_b
//   b_getallowrotate_v

// Methods (7):
// 0x100384d1  nmoving::vfunc_00  (14 insns)
// 0x100385f7  nmoving::vfunc_20  (252 insns)
//   calls:   -> nContainer::GetDirection, -> nContainer::CalcStabilityAxis, -> nContainer::SetDirection, -> nconsumption::vfunc_37
// 0x10038887  nmoving::n_init_nmoving  (15 insns)
//   strings: 'nservice'
// 0x100388b2  nmoving::n_fini_nmoving  (5 insns)
// 0x100388c4  nmoving::n_new_nmoving  (10 insns)
// 0x100388db  nmoving::n_version_nmoving  (30 insns)
//   strings: 'v_setallowmove_b', 'b_getallowmove_v', 'v_setallowrotate_b', 'b_getallowrotate_v'
// 0x1003894e  nmoving::vfunc_11  (67 insns)
//   calls:   -> ncollidedata::vfunc_11

} // namespace re_nnomads
