#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nsubtitleplayer.asm
// Class: nsubtitleplayer : public ncinematicplayer  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnomads {

struct nsubtitleplayer_Layout {
    // +0x0140
    double field_0x0140;
    // +0x01a5
    uint8_t field_0x01a5;
};

// Methods (5):
// 0x1004e7ed  nsubtitleplayer::n_init_nsubtitleplayer  (10 insns)
//   strings: 'ncinematicplayer'
// 0x1004e80e  nsubtitleplayer::n_fini_nsubtitleplayer  (5 insns)
// 0x1004e820  nsubtitleplayer::n_new_nsubtitleplayer  (16 insns)
// 0x1004e844  nsubtitleplayer::vfunc_00  (12 insns)
// 0x1004e866  nsubtitleplayer::vfunc_23  (96 insns)
//   calls:   -> nRealWorld::GetGlobalTime, -> nAnimSequence::GetFrame, IAT: MSVCRT.dll!strchr, -> nAnimSequence::GetDuration

} // namespace re_nnomads
