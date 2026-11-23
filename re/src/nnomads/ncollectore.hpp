#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncollectore.asm
// Class: ncollectore : public nsquadronwatchtarget  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncollectore_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0064
    float field_0x0064;
    // +0x1258
    float field_0x1258;
    // +0x125c
    float field_0x125c;
};

// Script AddCmds (2):
//   v_setcollectpersecond_f
//   f_getcollectpersecond_v

// Methods (7):
// 0x100360ba  ncollectore::n_init_ncollectore  (15 insns)
//   strings: 'nsquadronwatchtarget'
// 0x100360e5  ncollectore::n_fini_ncollectore  (5 insns)
// 0x100360f7  ncollectore::n_new_ncollectore  (10 insns)
// 0x1003610e  ncollectore::n_version_ncollectore  (11 insns)
// 0x1003612b  ncollectore::vfunc_00  (12 insns)
// 0x1003614d  ncollectore::vfunc_22  (101 insns)
//   calls:   -> nContainer::IsVehicleClass, -> nContainer::SendEnergyUpdate
//   consts:  f32=0
//   strings: 'concret.nature.ore', 'v_setcollectpersecond_f', 'f_getcollectpersecond_v'
// 0x100362a6  ncollectore::vfunc_11  (35 insns)
//   calls:   -> nsquadronwatchtarget::vfunc_11

} // namespace re_nnomads
