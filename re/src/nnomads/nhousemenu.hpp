#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nhousemenu.asm
// Class: nhousemenu : public nmenu  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct nhousemenu_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0044
    uint8_t field_0x0044;
    // +0x02b6
    uint8_t field_0x02b6;
    // +0x0df4
    float field_0x0df4;
    // +0x0df8
    float field_0x0df8;
    // +0x0e64
    uint8_t field_0x0e64;
    // +0x0e74
    uint32_t field_0x0e74;
    // +0x0e78
    float field_0x0e78;
    // +0x11b9
    uint8_t field_0x11b9;
    // +0x129c
    uint32_t field_0x129c;
};

// Methods (17):
// 0x1003d521  nhousemenu::vfunc_24  (1 insns)
// 0x1003e4cc  nhousemenu::n_init_nhousemenu  (15 insns)
//   strings: 'nmenu'
// 0x1003e4f7  nhousemenu::n_fini_nhousemenu  (5 insns)
// 0x1003e509  nhousemenu::n_new_nhousemenu  (16 insns)
// 0x1003e52d  nhousemenu::vfunc_00  (12 insns)
// 0x1003e54f  nhousemenu::vfunc_16  (312 insns)
//   calls:   -> nStateNode::GetClan, -> nContainer::SetArtefactOwner, -> nContainer::IsVehicleClass, -> nSoundNode::vfunc_37
//   strings: 'menuitem_wake', 'menuitem_sleep', 'menuitem_default', 'concret.technical.static.building.artefactstorage', 'menuitem_input', 'menuitem_output', 'menuitem_repair', 'menuitem_lastremove'
// 0x1003e906  nhousemenu::vfunc_17  (9 insns)
//   calls:   -> nSoundNode::vfunc_38
// 0x1003e91f  nhousemenu::vfunc_31  (4 insns)
// 0x1003e92e  nhousemenu::vfunc_32  (5 insns)
// 0x1003e941  nhousemenu::vfunc_28  (19 insns)
// 0x1003e96d  nhousemenu::vfunc_29  (28 insns)
// 0x1003e9af  nhousemenu::vfunc_22  (5 insns)
// 0x1003e9c0  nhousemenu::vfunc_23  (149 insns)
//   calls:   IAT: MSVCRT.dll!strncmp, IAT: nkernel.dll!n_printf
//   strings: 'menuitem_sleep', 'menuitem_wake', 'menuitem_remove', 'menuitem_lastremove', 'menuitem_default', 'menuitem_repair', 'menuitem_input', 'menuitem_output'
// 0x1003eb66  nhousemenu::vfunc_26  (14 insns)
// 0x1003eb8f  nhousemenu::vfunc_30  (8 insns)
//   calls:   -> nRealWorld::SetArtefactUseEnergy
// 0x1003eba7  nhousemenu::vfunc_33  (463 insns)
//   calls:   IAT: MSVCRT.dll!strncmp, -> nContainer::IsVehicleClass, -> nRealWorld::SetHandControlVehicle, -> nRealWorld::SetViewerCarrier, -> nStateNode::GetClan, -> nContainer::GetPosition, -> nContainer::GetDirection, -> nContainer::SetPosition, -> nContainer::SetDirection, -> nRoot::GetHead
//   consts:  f32=0, f32=1, f32=0.25, f64=0
//   strings: 'menuitem_default', 'menuitem_repair', 'menuitem_remove', 'menuitem_lastremove', 'menuitem_sleep', 'menuitem_wake', 'menuitem_input', 'menuitem_output'
// 0x1003f0da  nhousemenu::vfunc_11  (5 insns)
//   calls:   -> nSoundNode::vfunc_32

} // namespace re_nnomads
