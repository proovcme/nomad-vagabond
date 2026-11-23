#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncollcheck2.asm
// Class: ncollcheck2 : public nservice  (sizeof = 0x9c = 156 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncollcheck2_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0020
    uint32_t field_0x0020;
    // +0x002c
    float field_0x002c;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0088
    float field_0x0088;
    // +0x008c
    uint32_t field_0x008c;
    // +0x0090
    uint32_t field_0x0090;
    // +0x0094
    uint32_t field_0x0094;
    // +0x0098
    uint32_t field_0x0098;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (7):
//   m_collide/ncollcheck2_main.cc
//   v_setshape_s
//   s_getshape_v
//   v_setcollclass_s
//   s_getcollclass_v
//   v_setradius_f
//   f_getradius_v

// Methods (16):
// 0x1004596d  ncollcheck2::n_init_ncollcheck2  (15 insns)
//   strings: 'nservice'
// 0x10045998  ncollcheck2::n_fini_ncollcheck2  (5 insns)
// 0x100459aa  ncollcheck2::n_new_ncollcheck2  (96 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x10045abf  ncollcheck2::vfunc_14  (93 insns)
//   calls:   -> nSoundNode::vfunc_35, -> nStateNode::NewServiceData, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'collide', 'ncollidedata', 'm_collide/ncollcheck2_main.cc'
// 0x10045bf2  ncollcheck2::vfunc_16  (68 insns)
//   calls:   -> nStateNode::GetServiceData, -> nRealWorld::GetGlobalTime, -> nContainer::GetMatrix44, -> nCollideObject::Transform, -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x10045cb0  ncollcheck2::vfunc_17  (15 insns)
//   calls:   -> nStateNode::GetServiceData, -> nStateNode::NetImport
// 0x10045cdf  ncollcheck2::vfunc_18  (82 insns)
//   calls:   -> nStateNode::GetServiceData, -> nContainer::GetMatrix44, -> nCollideObject::Transform, -> nconsumption::vfunc_37
//   strings: '/game/handler/coll2', '/sys/servers/collide'
// 0x10045dd0  ncollcheck2::vfunc_00  (49 insns)
//   strings: 'v_setshape_s', 's_getshape_v', 'v_setcollclass_s', 's_getcollclass_v', 'v_setradius_f', 'f_getradius_v'
// 0x10045e85  ncollcheck2::cmd_setshape (v_setshape_s)  (10 insns)
// 0x10045ea8  ncollcheck2::cmd_getshape (s_getshape_v)  (14 insns)
// 0x10045ed2  ncollcheck2::cmd_setradius (v_setradius_f)  (10 insns)
// 0x10045ef7  ncollcheck2::cmd_setcollclass (v_setcollclass_s)  (10 insns)
// 0x10045f1a  ncollcheck2::cmd_getcollclass (s_getcollclass_v)  (14 insns)
// 0x10045f44  ncollcheck2::vfunc_11  (127 insns)
//   calls:   -> ncollidedata::vfunc_11, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1004aebd  ncollcheck2::cmd_getradius (f_getradius_v)  (11 insns)
// 0x1006d70b  ncollcheck2::vfunc_15  (45 insns)
//   calls:   -> nStateNode::GetServiceData, -> nSoundNode::vfunc_36
//   strings: 'v_setcollclass_s', 's_getcollclass_v'

} // namespace re_nnomads
