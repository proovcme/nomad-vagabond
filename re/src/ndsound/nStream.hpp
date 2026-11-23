#pragma once
// Auto-lifted C++ layout & method spec from ndsound.dll
// Source ASM: re/disasm/ndsound/nStream.asm
// Class: nStream

#include <cstdint>

namespace re_ndsound {

struct nStream_Layout {
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint8_t field_0x0060;
    // +0x0061
    uint8_t field_0x0061;
    // +0x0062
    uint8_t field_0x0062;
    // +0x0063
    uint8_t field_0x0063;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0070
    uint32_t field_0x0070;
};

// Methods (8):
// 0x10001efa  nStream::nStream()  (70 insns)
//   calls:   -> nRoot::nRoot(), IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x10001fa8  nStream::operator=  (56 insns)
//   calls:   -> nRoot::operator=, IAT: nkernel.dll!n_free
// 0x10002093  nStream::SetBaseFreq  (3 insns)
// 0x1000209d  nStream::GetBaseFreq  (2 insns)
// 0x100020a1  nStream::GetLooping  (2 insns)
// 0x100020a5  nStream::SetNumChannels  (3 insns)
// 0x100020af  nStream::GetNumChannels  (2 insns)
// 0x100020b3  nStream::EndOfStream  (2 insns)

} // namespace re_ndsound
