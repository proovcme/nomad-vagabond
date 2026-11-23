#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nvisual.asm
// Class: nvisual : public nservice  (sizeof = 0x90 = 144 bytes)

#include <cstdint>

namespace re_nnomads {

struct nvisual_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x004c
    uint32_t field_0x004c;
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
    // +0x0070
    uint32_t field_0x0070;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0078
    uint32_t field_0x0078;
    // +0x007c
    uint32_t field_0x007c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0084
    uint32_t field_0x0084;
    // +0x0088
    uint32_t field_0x0088;
    // +0x008c
    uint32_t field_0x008c;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0208
    uint32_t field_0x0208;
    // +0x02bc
    uint32_t field_0x02bc;
    // +0x0304
    uint32_t field_0x0304;
    // +0x0d9c
    float field_0x0d9c;
};

// Script AddCmds (7):
//   m_visual/nv_main.cc
//   v_setvisual_s
//   s_getvisual_v
//   v_setcharstate_s
//   s_getcharstate_v
//   v_setanimfinishednode_s
//   s_getanimfinishednode_v

// Methods (12):
// 0x10038c8c  nvisual::n_init_nvisual  (15 insns)
//   strings: 'nservice'
// 0x10038cb7  nvisual::n_fini_nvisual  (5 insns)
// 0x10038cc9  nvisual::n_new_nvisual  (32 insns)
// 0x10038d2d  nvisual::vfunc_00  (92 insns)
//   calls:   IAT: nkernel.dll!n_free, -> nContainer::GetPosition
// 0x10039098  nvisual::vfunc_17  (29 insns)
//   calls:   -> nContainer::SetCurrentVisNode, -> nContainer::SetAnimFinishedNode, -> nStateNode::NetImport
// 0x100390eb  nvisual::vfunc_18  (257 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort, -> nContainer::GetMatrix44, -> nRealWorld::GetGlobalTime, -> nContainer::UpdateSimpleCountChannels, -> nRealWorld::GetViewerMatrix, -> nContainer::GetCharAnimState, -> nContainer::IsVehicleClass, -> nContainer::ResetSimpleCountChannels, -> nconsumption::vfunc_37
//   strings: 'm_visual/nv_main.cc', 'concret.technical.static.flak', 'v_setvisual_s', 's_getvisual_v', 'v_setcharstate_s', 's_getcharstate_v', 'v_setanimfinishednode_s', 's_getanimfinishednode_v'
// 0x10039414  nvisual::cmd_setvisual (v_setvisual_s)  (10 insns)
// 0x10039437  nvisual::cmd_setcharstate (v_setcharstate_s)  (10 insns)
// 0x1003945a  nvisual::cmd_getvisual (s_getvisual_v)  (14 insns)
// 0x10039484  nvisual::cmd_setanimfinishednode (v_setanimfinishednode_s)  (10 insns)
// 0x100394a7  nvisual::cmd_getanimfinishednode (s_getanimfinishednode_v)  (14 insns)
// 0x100394d1  nvisual::vfunc_11  (165 insns)
//   calls:   -> ncollidedata::vfunc_11, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup

} // namespace re_nnomads
