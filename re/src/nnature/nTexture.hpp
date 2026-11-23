#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nTexture.asm
// Class: nTexture

#include <cstdint>

namespace re_nnature {

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

// Methods (17):
// 0x10001c2c  nTexture::GetHeight  (2 insns)
// 0x10002029  nTexture::nTexture()  (54 insns)
//   calls:   -> nRoot::nRoot(), -> nBmpFile::nBmpFile()
// 0x100020d7  nTexture::operator=  (53 insns)
//   calls:   -> nRoot::operator=, -> nBmpFile::operator=
// 0x100021e0  nTexture::SetNumMipLevels  (3 insns)
// 0x100021ea  nTexture::GetNumMipLevels  (2 insns)
// 0x100021ee  nTexture::SetMipLod  (11 insns)
// 0x1000220a  nTexture::GetMipLod  (2 insns)
// 0x1000220e  nTexture::SetGenMipMaps  (3 insns)
// 0x10002218  nTexture::GetGenMipMaps  (2 insns)
// 0x1000221c  nTexture::SetWidth  (3 insns)
// 0x10002226  nTexture::SetHeight  (3 insns)
// 0x10002230  nTexture::SetBytesPerPixel  (3 insns)
// 0x1000223a  nTexture::GetBytesPerPixel  (2 insns)
// 0x1000223e  nTexture::SetHighQuality  (3 insns)
// 0x10002248  nTexture::GetHighQuality  (2 insns)
// 0x1000224c  nTexture::SetUseCount  (3 insns)
// 0x10002256  nTexture::GetUseCount  (2 insns)

} // namespace re_nnature
