#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nsubtitleaudio.asm
// Class: nsubtitleaudio : public naudio  (sizeof = 0x70 = 112 bytes)

#include <cstdint>

namespace re_nnomads {

struct nsubtitleaudio_Layout {
    // +0x00f4
    uint8_t field_0x00f4;
    // +0x0308
    uint32_t field_0x0308;
};

// Methods (6):
// 0x1003bf5d  nsubtitleaudio::vfunc_11  (5 insns)
//   calls:   -> naudio::vfunc_11
// 0x1003bf6e  nsubtitleaudio::n_init_nsubtitleaudio  (15 insns)
//   strings: 'naudio'
// 0x1003bf99  nsubtitleaudio::n_fini_nsubtitleaudio  (5 insns)
// 0x1003bfab  nsubtitleaudio::n_new_nsubtitleaudio  (16 insns)
// 0x1003bfcf  nsubtitleaudio::vfunc_00  (12 insns)
// 0x1003bff1  nsubtitleaudio::vfunc_18  (91 insns)
//   calls:   -> nRealWorld::FindObjectBySymbolicName, -> nContainer::GetPosition, -> nContainer::SetPosition, -> naudio::vfunc_18
//   strings: 'sound'

} // namespace re_nnomads
