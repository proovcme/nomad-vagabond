#pragma once
// Auto-lifted C++ layout & method spec from ndirect3d8.dll
// Source ASM: re/disasm/ndirect3d8/nTexture.asm
// Class: nTexture

#include <cstdint>

namespace re_ndirect3d8 {

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
// 0x10001964  nTexture::nTexture()  (54 insns)
//   calls:   -> nRoot::nRoot(), -> nBmpFile::nBmpFile()
// 0x10001a12  nTexture::operator=  (53 insns)
//   calls:   -> nRoot::operator=, -> nBmpFile::operator=
// 0x10001b1b  nTexture::SetNumMipLevels  (3 insns)
// 0x10001b25  nTexture::GetNumMipLevels  (2 insns)
// 0x10001b29  nTexture::SetMipLod  (11 insns)
// 0x10001b45  nTexture::SetGenMipMaps  (3 insns)
// 0x10001b4f  nTexture::GetGenMipMaps  (2 insns)
// 0x10001b53  nTexture::SetWidth  (3 insns)
// 0x10001b5d  nTexture::SetHeight  (3 insns)
// 0x10001b67  nTexture::SetBytesPerPixel  (3 insns)
// 0x10001b71  nTexture::GetBytesPerPixel  (2 insns)
// 0x10001b75  nTexture::SetHighQuality  (3 insns)
// 0x10001b7f  nTexture::GetHighQuality  (2 insns)
// 0x10001b83  nTexture::SetUseCount  (3 insns)
// 0x10001b8d  nTexture::GetUseCount  (2 insns)
// 0x10002f86  nTexture::GetHeight  (2 insns)
// 0x10003405  nTexture::GetMipLod  (2 insns)

} // namespace re_ndirect3d8
