#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nvehicle.asm
// Class: nvehicle : public nautonom  (sizeof = 0x1258 = 4696 bytes)

#include <cstdint>

namespace re_nnomads {

struct nvehicle_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    float field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    float field_0x0018;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x0040
    float field_0x0040;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0045
    uint8_t field_0x0045;
    // +0x0060
    float field_0x0060;
    // +0x0064
    float field_0x0064;
    // +0x0114
    uint32_t field_0x0114;
    // +0x1139
    uint8_t field_0x1139;
    // +0x115c
    uint32_t field_0x115c;
    // +0x1174
    float field_0x1174;
    // +0x119c
    uint8_t field_0x119c;
    // +0x11a0
    uint32_t field_0x11a0;
    // +0x11a4
    uint8_t field_0x11a4;
    // +0x11a8
    double field_0x11a8;
    // +0x11b0
    uint32_t field_0x11b0;
    // +0x11b4
    uint32_t field_0x11b4;
    // +0x11b8
    uint8_t field_0x11b8;
    // +0x11b9
    uint8_t field_0x11b9;
    // +0x11ba
    uint8_t field_0x11ba;
    // +0x11e4
    uint32_t field_0x11e4;
};

// Script AddCmds (24):
//   c_vehicle/nvhcl_head.cc
//   v_setinsidegarage_b
//   b_isinsidegarage_v
//   v_setvisualizemachinegun_b
//   b_getvisualizemachinegun_v
//   v_setleader_o
//   o_getleader_v
//   v_setasleader_v
//   b_isleader_v
//   v_leavesquadron_v
//   v_setleadername_s
//   v_attachmember_s
//   o_getfirstmember_v
//   o_getnextmember_o
//   o_getfirstlivingmember_v
//   o_getnextlivingmember_o
//   v_formsquadron_f
//   v_givetargettomembers_b
//   v_showsquadroninfo_v
//   v_setvisualizeformationpos_b
//   v_setvisualizesquadron_b
//   v_setfirecommand_b
//   v_setviewergrab_b
//   b_getviewergrab_v

// Methods (25):
// 0x1002410c  nvehicle::n_init_nvehicle  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nautonom', 'cannot initialize vehicle class', 'c_vehicle/nvhcl_head.cc'
// 0x10024167  nvehicle::n_fini_nvehicle  (14 insns)
// 0x1002418a  nvehicle::n_new_nvehicle  (10 insns)
// 0x100241a4  nvehicle::n_version_nvehicle  (125 insns)
//   strings: 'v_setinsidegarage_b', 'b_isinsidegarage_v', 'v_setvisualizemachinegun_b', 'b_getvisualizemachinegun_v', 'v_setleader_o', 'o_getleader_v', 'v_setasleader_v', 'b_isleader_v'
// 0x100243b9  nvehicle::cmd_setinsidegarage (v_setinsidegarage_b)  (12 insns)
// 0x100243df  nvehicle::cmd_setviewergrab (v_setviewergrab_b)  (10 insns)
// 0x10024403  nvehicle::cmd_getviewergrab (b_getviewergrab_v)  (13 insns)
// 0x1002442f  nvehicle::cmd_isinsidegarage (b_isinsidegarage_v)  (13 insns)
// 0x1002445b  nvehicle::cmd_setvisualizemachinegun (v_setvisualizemachinegun_b)  (10 insns)
// 0x1002447f  nvehicle::cmd_getvisualizemachinegun (b_getvisualizemachinegun_v)  (13 insns)
// 0x100244d2  nvehicle::cmd_getleader (o_getleader_v)  (14 insns)
// 0x10024500  nvehicle::cmd_setasleader (v_setasleader_v)  (3 insns)
// 0x1002450c  nvehicle::cmd_isleader (b_isleader_v)  (14 insns)
// 0x1002453a  nvehicle::cmd_leavesquadron (v_leavesquadron_v)  (3 insns)
// 0x1002456d  nvehicle::cmd_attachmember (v_attachmember_s)  (11 insns)
// 0x10024594  nvehicle::cmd_getfirstmember (o_getfirstmember_v)  (14 insns)
// 0x100245c2  nvehicle::cmd_getnextmember (o_getnextmember_o)  (23 insns)
// 0x10024608  nvehicle::cmd_getfirstlivingmember (o_getfirstlivingmember_v)  (14 insns)
// 0x10024636  nvehicle::cmd_getnextlivingmember (o_getnextlivingmember_o)  (23 insns)
// 0x1002467c  nvehicle::cmd_formsquadron (v_formsquadron_f)  (13 insns)
// 0x100246a7  nvehicle::cmd_givetargettomembers (v_givetargettomembers_b)  (12 insns)
// 0x100246ce  nvehicle::cmd_showsquadroninfo (v_showsquadroninfo_v)  (3 insns)
// 0x100246da  nvehicle::cmd_setvisualizeformationpos (v_setvisualizeformationpos_b)  (12 insns)
// 0x10024701  nvehicle::cmd_setvisualizesquadron (v_setvisualizesquadron_b)  (12 insns)
// 0x10024728  nvehicle::cmd_setfirecommand (v_setfirecommand_b)  (674 insns)
//   calls:   -> nautonom::vfunc_11, -> nRealWorld::IsNetSession, -> nStateNode::GetNetworkObject, -> nContainer::GetPosition, -> nContainer::IsVehicleClass, -> nContainer::IsHandControl, -> nRealWorld::IsFriend, -> nContainer::SendEnergyUpdate, -> nContainer::ReduceEnergy, -> nStateNode::GetPrototype, -> nStateNode::GetState, IAT: MSVCRT.dll!sprintf
//   consts:  f32=0.25, f64=0.3000000119, f32=0
//   strings: 'gun', 'concret.technical', 'concret.nature', 'concret.weapon.volcanobomb', 'vhcl', 'nmissileengine2', 'nmissileengine3', 'weapon'

} // namespace re_nnomads
