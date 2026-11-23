#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nbuildvehicle.asm
// Class: nbuildvehicle : public nbuild  (sizeof = 0x94 = 148 bytes)

#include <cstdint>

namespace re_nnomads {

struct nbuildvehicle_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x02b6
    uint8_t field_0x02b6;
};

// Methods (7):
// 0x10040157  nbuildvehicle::n_init_nbuildvehicle  (10 insns)
//   strings: 'nbuild'
// 0x10040178  nbuildvehicle::n_fini_nbuildvehicle  (5 insns)
// 0x1004018a  nbuildvehicle::n_new_nbuildvehicle  (10 insns)
// 0x100401a4  nbuildvehicle::n_version_nbuildvehicle  (9 insns)
// 0x100401bc  nbuildvehicle::vfunc_00  (12 insns)
// 0x100401de  nbuildvehicle::vfunc_22  (32 insns)
//   calls:   -> nContainer::GetDirection, -> nContainer::SetDirection, -> nbuild::vfunc_22
//   strings: 'sleep'
// 0x1004022d  nbuildvehicle::vfunc_20  (47 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   consts:  f32=0, f64=0.01
//   strings: '***Warning: setbuildrelpos is ignored by nbuildvehicle!'

} // namespace re_nnomads
