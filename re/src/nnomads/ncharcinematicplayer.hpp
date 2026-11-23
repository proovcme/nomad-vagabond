#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncharcinematicplayer.asm
// Class: ncharcinematicplayer : public ncinematicplayer  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncharcinematicplayer_Layout {
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
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x00a0
    uint8_t field_0x00a0;
    // +0x0140
    double field_0x0140;
    // +0x0148
    double field_0x0148;
    // +0x0150
    double field_0x0150;
    // +0x01a5
    uint8_t field_0x01a5;
    // +0x0308
    uint32_t field_0x0308;
};

// Methods (13):
// 0x1004e116  ncharcinematicplayer::vfunc_16  (98 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord, -> nContainer::GetLocalMatrix44, -> nContainer::SetCinematicsMatrix, IAT: MSVCRT.dll!strrchr, IAT: MSVCRT.dll!sprintf, -> nRealWorld::GetGlobalTime
//   strings: '/game/handler/book', '%s/cinematics/%s.n', '/game/cinematics'
// 0x1004e231  ncharcinematicplayer::vfunc_17  (23 insns)
//   calls:   -> nStateNode::NetImport
// 0x1004e263  ncharcinematicplayer::vfunc_19  (139 insns)
//   calls:   -> nAnimSequence::IsVehicleRelated, -> nContainer::GetCinematicsMatrix, -> nContainer::GetPosition, -> nContainer::SetLocalMatrix44, -> nStateNode::GetClan, -> nContainer::SetMatrix44, -> nRealWorld::GetFrameTime
//   consts:  f64=0
// 0x1004e4bc  ncharcinematicplayer::vfunc_21  (37 insns)
//   calls:   -> nStateNode::GetPrototype, -> nRealWorld::GetGlobalTime, -> nContainer::SetCurrentAudioNode
// 0x1004e529  ncharcinematicplayer::vfunc_22  (44 insns)
//   calls:   -> nAnimSequence::GetChannelIndex
// 0x1004e593  ncharcinematicplayer::vfunc_23  (70 insns)
//   calls:   -> nRealWorld::GetGlobalTime, -> nAnimSequence::GetFrame, -> nAnimSequence::GetDuration
// 0x1004e657  ncharcinematicplayer::vfunc_18  (156 insns)
//   calls:   -> nconsumption::vfunc_37
//   consts:  f32=1, f32=2
// 0x1004e7dc  ncharcinematicplayer::vfunc_11  (5 insns)
//   calls:   -> ncollidedata::vfunc_11
// 0x1004e973  ncharcinematicplayer::n_init_ncharcinematicplayer  (10 insns)
//   strings: 'ncinematicplayer'
// 0x1004e994  ncharcinematicplayer::n_fini_ncharcinematicplayer  (5 insns)
// 0x1004e9a6  ncharcinematicplayer::n_new_ncharcinematicplayer  (16 insns)
// 0x1004e9ca  ncharcinematicplayer::vfunc_00  (12 insns)
// 0x1004e9ec  ncharcinematicplayer::vfunc_20  (149 insns)
//   calls:   -> ncinematicplayer::vfunc_20, IAT: MSVCRT.dll!strrchr, -> nContainer::GetCharAnimState, -> nStateNode::GetPrototype, -> nContainer::SetCurrentVisNode, -> nRealWorld::GetGlobalTime, -> nContainer::SetCharAnimState, IAT: nkernel.dll!n_printf
//   strings: 'visual/invis', 'visual/character'

} // namespace re_nnomads
