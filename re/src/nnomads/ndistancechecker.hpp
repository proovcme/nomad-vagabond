#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ndistancechecker.asm
// Class: ndistancechecker : public nservice  (sizeof = 0x5c = 92 bytes)

#include <cstdint>

namespace re_nnomads {

struct ndistancechecker_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0df4
    float field_0x0df4;
    // +0x0df8
    float field_0x0df8;
};

// Script AddCmds (2):
//   v_setcollectdistance_f
//   f_getcollectdistance_v

// Methods (12):
// 0x10032709  ndistancechecker::vfunc_11  (3 insns)
//   calls:   -> ncollidedata::vfunc_11
// 0x1006676e  ndistancechecker::n_init_ndistancechecker  (10 insns)
//   strings: 'nservice'
// 0x1006678f  ndistancechecker::n_fini_ndistancechecker  (5 insns)
// 0x100667a1  ndistancechecker::n_new_ndistancechecker  (17 insns)
// 0x100667c9  ndistancechecker::vfunc_00  (12 insns)
// 0x100667eb  ndistancechecker::vfunc_16  (17 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord
//   strings: 'nvehicle'
// 0x10066823  ndistancechecker::vfunc_17  (3 insns)
//   calls:   -> nStateNode::NetImport
// 0x1006682f  ndistancechecker::vfunc_19  (26 insns)
//   consts:  f32=0.5
// 0x10066877  ndistancechecker::vfunc_18  (174 insns)
//   calls:   -> nStateNode::GetClan, -> nContainer::GetPosition, -> nContainer::IsVehicleClass, -> nContainer::KillByDistanceChecker, -> nconsumption::vfunc_37
//   consts:  f32=0, f32=0.5, f32=1, f32=0.01
//   strings: 'concret.technical.dynamic.maennel'
// 0x10066ad5  ndistancechecker::vfunc_20  (12 insns)
// 0x10066af7  ndistancechecker::vfunc_38  (198 insns)
//   calls:   -> nContainer::IsHandControl, -> nStateNode::GetClan, -> nContainer::GetPosition, -> nContainer::IsVehicleClass, -> nContainer::AddEnergy, -> nContainer::ReduceEnergy, -> nconsumption::vfunc_37
//   consts:  f32=0, f32=1
//   strings: 'generic', 'concret.energyclot', 'unknown', 'v_setcollectdistance_f', 'f_getcollectdistance_v'
// 0x10066d9b  ndistancechecker::vfunc_31  (39 insns)
//   calls:   -> ncollidedata::vfunc_11, -> nattack::vfunc_25

} // namespace re_nnomads
