#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nTexture.asm
// Class: nTexture

#include <cstdint>

namespace re_nparticle {

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
// 0x100037a1  nTexture::nTexture()  (54 insns)
//   calls:   -> nRoot::nRoot(), -> nBmpFile::nBmpFile()
// 0x1000384f  nTexture::operator=  (53 insns)
//   calls:   -> nRoot::operator=, -> nBmpFile::operator=
// 0x10003958  nTexture::SetNumMipLevels  (3 insns)
// 0x10003962  nTexture::GetNumMipLevels  (2 insns)
// 0x10003966  nTexture::SetMipLod  (11 insns)
// 0x10003982  nTexture::GetMipLod  (2 insns)
// 0x10003986  nTexture::SetGenMipMaps  (3 insns)
// 0x10003990  nTexture::GetGenMipMaps  (2 insns)
// 0x10003994  nTexture::SetWidth  (3 insns)
// 0x100039a2  nTexture::SetHeight  (3 insns)
// 0x100039ac  nTexture::SetBytesPerPixel  (3 insns)
// 0x100039b6  nTexture::GetBytesPerPixel  (2 insns)
// 0x100039ba  nTexture::SetHighQuality  (3 insns)
// 0x100039c4  nTexture::GetHighQuality  (2 insns)
// 0x100039c8  nTexture::SetUseCount  (3 insns)
// 0x100039d2  nTexture::GetUseCount  (2 insns)
// 0x10005230  nTexture::GetHeight  (2 insns)

} // namespace re_nparticle
