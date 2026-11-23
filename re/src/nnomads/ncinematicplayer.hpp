#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncinematicplayer.asm
// Class: ncinematicplayer : public nservice  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncinematicplayer_Layout {
    // +0x001c
    uint32_t field_0x001c;
    // +0x0028
    uint32_t field_0x0028;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0148
    double field_0x0148;
    // +0x0304
    uint32_t field_0x0304;
};

// Script AddCmds (1):
//   m_cinematicplayer/ncinematicplayer_main.cc

// Methods (5):
// 0x1004e076  ncinematicplayer::n_init_ncinematicplayer  (15 insns)
//   strings: 'nservice'
// 0x1004e0a1  ncinematicplayer::n_fini_ncinematicplayer  (5 insns)
// 0x1004e0b3  ncinematicplayer::n_new_ncinematicplayer  (23 insns)
// 0x1004e0e9  ncinematicplayer::vfunc_00  (14 insns)
// 0x1004e3d1  ncinematicplayer::vfunc_20  (74 insns)
//   calls:   -> nStateNode::GetPrototype, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort, -> nRealWorld::GetGlobalTime, -> nContainer::SetCurrentVisNode
//   strings: 'm_cinematicplayer/ncinematicplayer_main.cc'

} // namespace re_nnomads
