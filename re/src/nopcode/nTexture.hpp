#pragma once
// Auto-lifted C++ layout & method spec from nopcode.dll
// Source ASM: re/disasm/nopcode/nTexture.asm
// Class: nTexture

#include <cstdint>

namespace re_nopcode {

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

// Methods (18):
// 0x100033b3  nTexture::nTexture()  (54 insns)
//   calls:   -> nRoot::nRoot(), -> nBmpFile::nBmpFile()
// 0x10003461  nTexture::operator=  (53 insns)
//   calls:   -> nRoot::operator=, -> nBmpFile::operator=
// 0x1000356a  nTexture::SetNumMipLevels  (3 insns)
// 0x10003574  nTexture::GetNumMipLevels  (2 insns)
// 0x10003578  nTexture::SetMipLod  (11 insns)
// 0x10003594  nTexture::GetMipLod  (2 insns)
// 0x10003598  nTexture::SetGenMipMaps  (3 insns)
// 0x100035a2  nTexture::GetGenMipMaps  (2 insns)
// 0x100035a6  nTexture::SetWidth  (3 insns)
// 0x100035b0  nTexture::GetWidth  (2 insns)
// 0x100035b4  nTexture::SetHeight  (3 insns)
// 0x100035be  nTexture::GetHeight  (2 insns)
// 0x100035c2  nTexture::SetBytesPerPixel  (3 insns)
// 0x100035cc  nTexture::GetBytesPerPixel  (2 insns)
// 0x100035d0  nTexture::SetHighQuality  (3 insns)
// 0x100035da  nTexture::GetHighQuality  (2 insns)
// 0x100035de  nTexture::SetUseCount  (3 insns)
// 0x100035e8  nTexture::GetUseCount  (2 insns)

} // namespace re_nopcode
