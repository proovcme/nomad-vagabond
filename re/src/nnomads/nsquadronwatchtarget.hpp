#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nsquadronwatchtarget.asm
// Class: nsquadronwatchtarget : public nwatchtarget  (sizeof = 0x64 = 100 bytes)

#include <cstdint>

namespace re_nnomads {

struct nsquadronwatchtarget_Layout {
    // +0x0004
    float field_0x0004;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0114
    uint32_t field_0x0114;
};

// Methods (11):
// 0x10035067  nsquadronwatchtarget::vfunc_22  (1 insns)
// 0x10035192  nsquadronwatchtarget::n_init_nsquadronwatchtarget  (15 insns)
//   strings: 'nwatchtarget'
// 0x100351bd  nsquadronwatchtarget::n_fini_nsquadronwatchtarget  (5 insns)
// 0x100351cf  nsquadronwatchtarget::n_new_nsquadronwatchtarget  (10 insns)
// 0x100351e6  nsquadronwatchtarget::n_version_nsquadronwatchtarget  (13 insns)
// 0x10035208  nsquadronwatchtarget::vfunc_00  (14 insns)
// 0x100354ee  nsquadronwatchtarget::cmd_setforgettargetdistance (v_setforgettargetdistance_f)  (13 insns)
// 0x10035516  nsquadronwatchtarget::cmd_getforgettargetdistance (f_getforgettargetdistance_v)  (14 insns)
// 0x10035541  nsquadronwatchtarget::cmd_setforgettargetangle (v_setforgettargetangle_f)  (15 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x10035574  nsquadronwatchtarget::cmd_getforgettargetangle (f_getforgettargetangle_v)  (16 insns)
//   consts:  f32=180, f32=0.3183099
// 0x100355ab  nsquadronwatchtarget::vfunc_11  (67 insns)
//   calls:   -> nwatchtarget::vfunc_11
//   consts:  f32=180, f32=0.3183099

} // namespace re_nnomads
