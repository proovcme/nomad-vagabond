#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nsubtitlevisual.asm
// Class: nsubtitlevisual : public nvisual  (sizeof = 0x90 = 144 bytes)

#include <cstdint>

namespace re_nnomads {

struct nsubtitlevisual_Layout {
    // +0x0028
    uint32_t field_0x0028;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0064
    uint32_t field_0x0064;
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
    // +0x0304
    uint32_t field_0x0304;
};

// Script AddCmds (1):
//   m_visual/nv_main.cc

// Methods (9):
// 0x10038e14  nsubtitlevisual::vfunc_14  (23 insns)
//   calls:   -> nSoundNode::vfunc_35
//   strings: 'n3dnode', 'nvehicle', 'nfactory'
// 0x10038e66  nsubtitlevisual::vfunc_16  (168 insns)
//   calls:   -> nStateNode::GetPrototype, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort, -> nContainer::SetCurrentVisNode, -> nContainer::SetAnimFinishedNode, -> nContainer::SetCharAnimState, -> nStateNode::AttachService, -> nStateNode::TriggerRecord
//   strings: 'm_visual/nv_main.cc'
// 0x100396b5  nsubtitlevisual::vfunc_11  (5 insns)
//   calls:   -> nvisual::vfunc_11
// 0x100396c6  nsubtitlevisual::n_init_nsubtitlevisual  (15 insns)
//   strings: 'nvisual'
// 0x100396f1  nsubtitlevisual::n_fini_nsubtitlevisual  (5 insns)
// 0x10039703  nsubtitlevisual::n_new_nsubtitlevisual  (16 insns)
// 0x1003972a  nsubtitlevisual::vfunc_00  (12 insns)
// 0x1003974c  nsubtitlevisual::vfunc_17  (16 insns)
//   calls:   -> nStateNode::NetImport
//   strings: '/world/gui/subtitle'
// 0x1003977b  nsubtitlevisual::vfunc_18  (63 insns)
//   calls:   -> nconsumption::vfunc_37
//   strings: '/world/gui/subtitle', 'nlinknode', 'sub/tex'

} // namespace re_nnomads
