#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nSoundNode.asm
// Class: nSoundNode

#include <cstdint>

namespace re_nnomads {

struct nSoundNode_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0014
    float field_0x0014;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    float field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    float field_0x0064;
    // +0x00f4
    uint8_t field_0x00f4;
    // +0x010c
    float field_0x010c;
    // +0x0110
    float field_0x0110;
    // +0x012c
    float field_0x012c;
    // +0x0130
    float field_0x0130;
    // +0x013c
    uint32_t field_0x013c;
    // +0x0140
    float field_0x0140;
    // +0x0144
    uint32_t field_0x0144;
    // +0x0148
    uint32_t field_0x0148;
    // +0x014c
    uint32_t field_0x014c;
    // +0x0150
    uint32_t field_0x0150;
    // +0x0154
    uint8_t field_0x0154;
    // +0x0155
    uint8_t field_0x0155;
    // +0x0156
    uint8_t field_0x0156;
    // +0x0157
    uint8_t field_0x0157;
    // +0x02b6
    uint8_t field_0x02b6;
    // +0x129c
    uint32_t field_0x129c;
    // +0x129e
    uint8_t field_0x129e;
};

// Script AddCmds (9):
//   m_menu/nmenu_main.cc
//   v_setitemdistance_f
//   f_getitemdistance_v
//   v_setmenuradius_f
//   f_getmenuradius_v
//   v_setitemspeed_f
//   f_getitemspeed_v
//   v_setthrowawaydistance_f
//   f_getthrowawaydistance_v

// Methods (45):
// 0x10009f06  nSoundNode::GetFrequency  (2 insns)
// 0x10031d88  nSoundNode::vfunc_35  (8 insns)
// 0x10031d9e  nSoundNode::vfunc_36  (5 insns)
// 0x1003c0e4  nSoundNode::nSoundNode()  (70 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x1003c1fc  nSoundNode::operator=  (84 insns)
//   calls:   -> nVisNode::operator=, IAT: nkernel.dll!n_free
// 0x1003c328  nSoundNode::vfunc_00  (41 insns)
// 0x1003c389  nSoundNode::SetAmbient  (3 insns)
// 0x1003c396  nSoundNode::GetAmbient  (2 insns)
// 0x1003c39d  nSoundNode::SetDoppler  (3 insns)
// 0x1003c3aa  nSoundNode::GetDoppler  (2 insns)
// 0x1003c3b1  nSoundNode::SetLooping  (3 insns)
// 0x1003c3be  nSoundNode::GetLooping  (2 insns)
// 0x1003c3c5  nSoundNode::SetPriority  (3 insns)
// 0x1003c3d2  nSoundNode::GetPriority  (2 insns)
// 0x1003c3d9  nSoundNode::SetVolume  (3 insns)
// 0x1003c3e6  nSoundNode::GetVolume  (2 insns)
// 0x1003c3ed  nSoundNode::SetFrequency  (3 insns)
// 0x1003c3fa  nSoundNode::SetMinMaxDist  (5 insns)
// 0x1003c411  nSoundNode::GetMinMaxDist  (7 insns)
// 0x1003c42c  nSoundNode::Start  (2 insns)
// 0x1003c434  nSoundNode::Stop  (2 insns)
// 0x1003c4bc  nSoundNode::vfunc_21  (14 insns)
// 0x1003c4e9  nSoundNode::vfunc_37  (115 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord, -> nContainer::GetPosition, -> nContainer::GetDirection, -> nContainer::SetPosition, -> nContainer::SetDirection
// 0x1003c617  nSoundNode::vfunc_38  (37 insns)
//   calls:   -> nRealWorld::SetArtefactUseEnergy, -> nStateNode::NetImport
// 0x1003c67b  nSoundNode::vfunc_52  (3 insns)
// 0x1003c687  nSoundNode::vfunc_53  (4 insns)
// 0x1003c697  nSoundNode::vfunc_48  (213 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::GetDirection, -> nContainer::SetPosition
//   consts:  f32=6.283185, f32=0.5
// 0x1003c8e0  nSoundNode::vfunc_49  (3 insns)
// 0x1003c8ec  nSoundNode::vfunc_50  (22 insns)
// 0x1003c929  nSoundNode::vfunc_43  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'm_menu/nmenu_main.cc'
// 0x1003c94c  nSoundNode::vfunc_44  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'm_menu/nmenu_main.cc'
// 0x1003c96f  nSoundNode::vfunc_45  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'm_menu/nmenu_main.cc'
// 0x1003c992  nSoundNode::vfunc_46  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'm_menu/nmenu_main.cc'
// 0x1003c9b5  nSoundNode::vfunc_40  (14 insns)
// 0x1003c9de  nSoundNode::vfunc_47  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'm_menu/nmenu_main.cc'
// 0x1003ca01  nSoundNode::vfunc_41  (26 insns)
// 0x1003ca43  nSoundNode::vfunc_42  (20 insns)
// 0x1003ca76  nSoundNode::vfunc_51  (29 insns)
//   calls:   -> nRealWorld::SetArtefactUseEnergy
// 0x1003cac0  nSoundNode::vfunc_54  (106 insns)
//   calls:   -> nContainer::IsVehicleClass
//   strings: 'concret.technical.static.building.artefactstorage', 'concret.technical.static.building.artefacttransformer', 'concret.technical.static.building.garage', 'concret.technical.static.building.flakbuilding', 'concret.technical.static.building.islanddrive', 'concret.technical.static.building.powerplant.windmill', 'concret.technical.static.building.powerplant.coal', 'concret.spell.spellbomb'
// 0x1003cc17  nSoundNode::vfunc_39  (264 insns)
//   calls:   -> nContainer::IsHandControl, -> nconsumption::vfunc_37
//   strings: 'menu_cancel', 'menu_prev', 'menu_next', 'cycle', 'menu_select', 'menu_throwaway', 'menu_back', 'v_setitemdistance_f'
// 0x1003cf01  nSoundNode::vfunc_32  (100 insns)
//   calls:   -> ncollidedata::vfunc_11
// 0x10079a3e  nSoundNode::vfunc_18  (1 insns)
//   calls:   IAT: nnebula.dll!nSoundNode::AttachChannels
// 0x10079a44  nSoundNode::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nSoundNode::Compute
// 0x10079a4a  nSoundNode::vfunc_14  (1 insns)
//   calls:   IAT: nnebula.dll!nSoundNode::Attach
// 0x10079a50  nSoundNode::vfunc_11  (3 insns)
//   calls:   IAT: nnebula.dll!nSoundNode::SaveCmds, IAT: nnebula.dll!nSoundNode::~nSoundNode(), IAT: nnebula.dll!nMeshNode::SetFilename

} // namespace re_nnomads
