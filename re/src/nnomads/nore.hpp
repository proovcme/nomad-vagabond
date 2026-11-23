#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nore.asm
// Class: nore : public ncontainer  (sizeof = 0xeb8 = 3768 bytes)

#include <cstdint>

namespace re_nnomads {

struct nore_Layout {
    // +0x0004
    float field_0x0004;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x03c4
    float field_0x03c4;
    // +0x03c8
    float field_0x03c8;
    // +0x03cc
    float field_0x03cc;
    // +0x03d0
    uint8_t field_0x03d0;
    // +0x0eb0
    float field_0x0eb0;
    // +0x0eb4
    float field_0x0eb4;
};

// Script AddCmds (4):
//   v_setorequantity_f
//   v_reduceorequantity_f
//   f_getorequantity_v
//   b_isoreusedup_v

// Methods (15):
// 0x1001bb25  nore::cmd_getorequantity (f_getorequantity_v)  (11 insns)
// 0x1001c530  nore::vfunc_00  (17 insns)
//   calls:   -> nContainer::~nContainer()
// 0x1001c567  nore::vfunc_24  (47 insns)
//   calls:   -> nStateNode::GetPrototype, -> nDataHandler::GetIndexByProto, -> nStateNode::SetNetworkObject
// 0x1001c5eb  nore::vfunc_26  (1 insns)
//   calls:   -> nStateNode::NetRelease
// 0x1001c5f0  nore::vfunc_27  (48 insns)
//   calls:   -> nStateNode::GetNetworkObject, -> nContainer::GetPosition
// 0x1001c66e  nore::vfunc_28  (38 insns)
//   calls:   -> nStateNode::GetNetworkObject, -> nContainer::SetPosition
// 0x1001c6ea  nore::n_init_nore  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'ncontainer', 'cannot initialize ore class', 'container/nore_head.cc'
// 0x1001c745  nore::n_fini_nore  (14 insns)
// 0x1001c768  nore::n_new_nore  (10 insns)
// 0x1001c782  nore::n_version_nore  (30 insns)
//   strings: 'v_setorequantity_f', 'v_reduceorequantity_f', 'f_getorequantity_v', 'b_isoreusedup_v'
// 0x1001c7f5  nore::cmd_setorequantity (v_setorequantity_f)  (12 insns)
// 0x1001c822  nore::cmd_isoreusedup (b_isoreusedup_v)  (22 insns)
// 0x1001c85e  nore::vfunc_11  (35 insns)
//   calls:   -> nContainer::SaveCmds
// 0x1001c8b5  nore::vfunc_18  (30 insns)
//   calls:   -> nContainer::UpdateChannels
//   consts:  f32=0
// 0x10067565  nore::cmd_reduceorequantity (v_reduceorequantity_f)  (13 insns)

} // namespace re_nnomads
