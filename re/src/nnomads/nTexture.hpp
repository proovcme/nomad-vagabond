#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nTexture.asm
// Class: nTexture

#include <cstdint>

namespace re_nnomads {

struct nTexture_Layout {
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
    uint8_t field_0x0078;
    // +0x0079
    uint8_t field_0x0079;
    // +0x007c
    uint32_t field_0x007c;
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00d4
    uint32_t field_0x00d4;
    // +0x00d8
    uint32_t field_0x00d8;
};

// Methods (14):
// 0x10002b4f  nTexture::nTexture()  (54 insns)
//   calls:   -> nRoot::nRoot(), -> nBmpFile::nBmpFile()
// 0x10002bfd  nTexture::operator=  (53 insns)
//   calls:   -> nRoot::operator=, -> nBmpFile::operator=
// 0x10002d14  nTexture::SetMipLod  (11 insns)
// 0x10002d30  nTexture::SetGenMipMaps  (3 insns)
// 0x10002d3a  nTexture::GetGenMipMaps  (2 insns)
// 0x10002d48  nTexture::SetHeight  (3 insns)
// 0x10002d52  nTexture::SetBytesPerPixel  (3 insns)
// 0x10002d5c  nTexture::GetBytesPerPixel  (2 insns)
// 0x10002d60  nTexture::SetHighQuality  (3 insns)
// 0x10002d6a  nTexture::GetHighQuality  (2 insns)
// 0x10002d6e  nTexture::SetUseCount  (3 insns)
// 0x10002d78  nTexture::GetUseCount  (2 insns)
// 0x1000cd23  nTexture::GetHeight  (2 insns)
// 0x1000d182  nTexture::GetMipLod  (2 insns)

} // namespace re_nnomads
