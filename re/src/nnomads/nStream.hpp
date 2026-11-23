#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nStream.asm
// Class: nStream

#include <cstdint>

namespace re_nnomads {

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
// 0x10002d06  nStream::SetBaseFreq  (3 insns)
// 0x10002d10  nStream::GetBaseFreq  (2 insns)
// 0x10002d3e  nStream::SetNumChannels  (3 insns)
// 0x10008f93  nStream::nStream()  (45 insns)
//   calls:   -> nRoot::nRoot()
// 0x1000900a  nStream::operator=  (56 insns)
//   calls:   -> nRoot::operator=, IAT: nkernel.dll!n_free
// 0x100090f5  nStream::GetLooping  (2 insns)
// 0x100090f9  nStream::EndOfStream  (2 insns)
// 0x1000cd1f  nStream::GetNumChannels  (2 insns)

} // namespace re_nnomads
