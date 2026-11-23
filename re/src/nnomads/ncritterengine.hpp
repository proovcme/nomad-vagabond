#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncritterengine.asm
// Class: ncritterengine : public nservice  (sizeof = 0x11c = 284 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncritterengine_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    float field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    float field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0030
    float field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x003c
    float field_0x003c;
    // +0x0044
    uint8_t field_0x0044;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0064
    uint8_t field_0x0064;
    // +0x0065
    uint8_t field_0x0065;
    // +0x009c
    float field_0x009c;
    // +0x00f0
    float field_0x00f0;
    // +0x0100
    uint32_t field_0x0100;
    // +0x0104
    float field_0x0104;
    // +0x0108
    float field_0x0108;
    // +0x010c
    float field_0x010c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    float field_0x0114;
    // +0x0118
    uint32_t field_0x0118;
    // +0x0b44
    uint32_t field_0x0b44;
    // +0x0d5c
    uint32_t field_0x0d5c;
    // +0x0d88
    uint32_t field_0x0d88;
    // +0x0e08
    uint8_t field_0x0e08;
};

// Methods (21):
// 0x1004cdb1  ncritterengine::cmd_settargetname (v_settargetname_s)  (11 insns)
// 0x1005657a  ncritterengine::cmd_settargetradius (v_settargetradius_f)  (13 insns)
// 0x1006768d  ncritterengine::n_init_ncritterengine  (15 insns)
//   strings: 'nservice'
// 0x100676b8  ncritterengine::n_fini_ncritterengine  (5 insns)
// 0x100676ca  ncritterengine::n_new_ncritterengine  (202 insns)
//   consts:  f32=0.2, f32=-0.2, f32=-5
// 0x100678e9  ncritterengine::vfunc_00  (24 insns)
// 0x10067928  ncritterengine::vfunc_16  (17 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x10067951  ncritterengine::vfunc_21  (617 insns)
//   calls:   -> nContainer::GetMatrix44, -> nContainer::SetMatrix44
//   consts:  f32=-1, f32=0.7, f32=0.5
// 0x1006806f  ncritterengine::vfunc_27  (102 insns)
//   calls:   -> nRealWorld::FindObjectBySymbolicName, -> nContainer::GetPosition, -> nRealWorld::FindNextObjectBySymbolicName
// 0x1006817e  ncritterengine::vfunc_22  (308 insns)
//   calls:   -> nContainer::CalcCommonAirConst, -> nContainer::GetPosition, -> nContainer::SetPosition
//   consts:  f64=0, f32=0, f32=-500
// 0x100684c8  ncritterengine::vfunc_18  (121 insns)
//   calls:   -> nStateNode::GetServiceData, -> nContainer::GetPosition, -> nconsumption::vfunc_37
//   consts:  f32=1
// 0x1006860c  ncritterengine::vfunc_19  (127 insns)
//   calls:   -> nContainer::IsVehicleClass
//   strings: 'concret.nature.skrit', 'concret.nature.island', 'concret.technical.static'
// 0x1006876d  ncritterengine::vfunc_20  (24 insns)
// 0x100687aa  ncritterengine::vfunc_14  (4 insns)
//   calls:   -> nSoundNode::vfunc_35
// 0x100687ba  ncritterengine::vfunc_15  (230 insns)
//   calls:   -> nSoundNode::vfunc_36
// 0x10068a05  ncritterengine::vfunc_23  (18 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2
// 0x10068a3a  ncritterengine::vfunc_24  (2 insns)
// 0x10068a41  ncritterengine::vfunc_25  (3 insns)
// 0x10068ac2  ncritterengine::cmd_gettargetname (s_gettargetname_v)  (15 insns)
// 0x10068aec  ncritterengine::cmd_gettargetradius (f_gettargetradius_v)  (14 insns)
// 0x10068b17  ncritterengine::vfunc_11  (62 insns)
//   calls:   -> ncollidedata::vfunc_11

} // namespace re_nnomads
