#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nviewerdata.asm
// Class: nviewerdata : public nservice  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct nviewerdata_Layout {
    // +0x0004
    float field_0x0004;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0028
    uint32_t field_0x0028;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint8_t field_0x0064;
    // +0x0065
    uint8_t field_0x0065;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0221
    uint8_t field_0x0221;
    // +0x0db8
    uint8_t field_0x0db8;
    // +0x0df0
    uint8_t field_0x0df0;
};

// Script AddCmds (10):
//   v_setcarriernode_s
//   s_getcarriernode_v
//   v_setwatchnode_s
//   s_getwatchnode_v
//   v_setnoderoot_s
//   s_getnoderoot_v
//   v_sethardcarrierchange_b
//   b_gethardcarrierchange_v
//   v_setkeepposition_b
//   b_getkeepposition_v

// Methods (16):
// 0x1003704f  nviewerdata::n_init_nviewerdata  (15 insns)
//   strings: 'nservice'
// 0x1003707a  nviewerdata::n_fini_nviewerdata  (5 insns)
// 0x1003708c  nviewerdata::n_new_nviewerdata  (23 insns)
// 0x100370c6  nviewerdata::vfunc_00  (42 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x10037129  nviewerdata::vfunc_20  (170 insns)
//   calls:   -> nStateNode::GetPrototype, IAT: nkernel.dll!n_printf, -> nStateNode::GetState, -> nRoot::GetHead, -> nContainer::AddViewerNode
//   strings: 'watch', 'carrier', 'hardconnect', 'delay'
// 0x10037320  nviewerdata::vfunc_16  (116 insns)
//   calls:   -> nRealWorld::GetUserClan, -> nRealWorld::GetViewerCarrier, -> nStateNode::GetClan, -> nRealWorld::IsFriend, -> nContainer::IsVehicleClass, -> nStateNode::AttachService, -> nStateNode::TriggerRecord, -> nContainer::GetCurrentViewerNode, -> nContainer::ClearViewerNodes, -> nContainer::FindViewerNode, -> nContainer::GetViewerNode, -> nContainer::SetCurrentViewerNode
//   strings: 'camera'
// 0x1003746c  nviewerdata::vfunc_19  (120 insns)
//   calls:   -> n3DNode::GetT
// 0x10037596  nviewerdata::vfunc_21  (52 insns)
//   calls:   -> nContainer::GetCurrentViewerNode
// 0x1003760a  nviewerdata::vfunc_18  (115 insns)
//   calls:   -> nconsumption::vfunc_37
//   strings: 'v_setcarriernode_s', 's_getcarriernode_v', 'v_setwatchnode_s', 's_getwatchnode_v', 'v_setnoderoot_s', 's_getnoderoot_v', 'v_sethardcarrierchange_b', 'b_gethardcarrierchange_v'
// 0x1003777e  nviewerdata::cmd_setcarriernode (v_setcarriernode_s)  (10 insns)
// 0x100377a1  nviewerdata::cmd_getcarriernode (s_getcarriernode_v)  (14 insns)
// 0x100377cb  nviewerdata::cmd_setwatchnode (v_setwatchnode_s)  (10 insns)
// 0x100377ee  nviewerdata::cmd_getwatchnode (s_getwatchnode_v)  (14 insns)
// 0x1003788b  nviewerdata::cmd_setnoderoot (v_setnoderoot_s)  (10 insns)
// 0x100378ae  nviewerdata::cmd_getnoderoot (s_getnoderoot_v)  (14 insns)
// 0x100378d8  nviewerdata::vfunc_11  (186 insns)
//   calls:   -> ncollidedata::vfunc_11, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup

} // namespace re_nnomads
