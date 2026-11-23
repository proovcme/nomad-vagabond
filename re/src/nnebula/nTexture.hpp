#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nTexture.asm
// Class: nTexture : public nroot  (sizeof = 0xdc = 220 bytes)

#include <cstdint>

namespace re_nnebula {

struct nTexture_Layout {
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
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
    // +0x0080
    uint32_t field_0x0080;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00d4
    uint32_t field_0x00d4;
    // +0x00d8
    uint32_t field_0x00d8;
};

// Methods (27):
// 0x10007037  nTexture::nTexture()  (54 insns)
//   calls:   -> nRoot::nRoot(), -> nBmpFile::nBmpFile()
// 0x100070e5  nTexture::operator=  (53 insns)
//   calls:   -> nRoot::operator=, -> nBmpFile::operator=
// 0x100071f8  nTexture::SetMipLod  (11 insns)
// 0x10007214  nTexture::SetGenMipMaps  (3 insns)
// 0x1000721e  nTexture::GetGenMipMaps  (2 insns)
// 0x10007222  nTexture::SetHeight  (3 insns)
// 0x1000722c  nTexture::SetBytesPerPixel  (3 insns)
// 0x10007236  nTexture::GetBytesPerPixel  (2 insns)
// 0x1000723a  nTexture::SetHighQuality  (3 insns)
// 0x10007244  nTexture::GetHighQuality  (2 insns)
// 0x10007248  nTexture::SetUseCount  (3 insns)
// 0x10007252  nTexture::GetUseCount  (2 insns)
// 0x1000908b  nTexture::GetHeight  (2 insns)
// 0x1000950a  nTexture::GetMipLod  (2 insns)
// 0x1000ffbf  nTexture::n_init_ntexture  (21 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nroot', 'Could not open superclass nroot', 'gfx/ntexture.cc'
// 0x10010010  nTexture::n_fini_ntexture  (14 insns)
// 0x10010033  nTexture::n_new_ntexture  (10 insns)
//   calls:   -> nTexture::nTexture()
// 0x1001004d  nTexture::n_version_ntexture  (2 insns)
// 0x10010053  nTexture::nTexture()  (40 insns)
//   calls:   -> nBmpFile::nBmpFile()
//   strings: '/sys/servers/gfx'
// 0x100100d9  nTexture::~nTexture()  (59 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_printf, -> nGfxServer::SetCurrentTexture, -> nBmpFile::~nBmpFile()
// 0x1001017a  nTexture::SetTexture  (35 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x100101d1  nTexture::BeginLoad  (141 insns)
//   calls:   -> nPixelFormat::nPixelFormat(), IAT: nkernel.dll!n_printf, -> nPixelFormat::BeginConv, IAT: nkernel.dll!nn_malloc
//   strings: 'rb', 'nTexture: alpha channel not 8bpp or wrong size', 'gfx/ntex_main.cc', 'nTexture: alpha channel defined, but loading failed', 'nTexture: loading pixel channel failed'
// 0x1001037a  nTexture::LoadLine  (79 insns)
//   calls:   -> nPixelFormat::Conv
// 0x10010450  nTexture::EndLoad  (41 insns)
//   calls:   -> nPixelFormat::~nPixelFormat(), IAT: nkernel.dll!n_free
// 0x100104c9  nTexture::Load  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'pure virtual function called', 'gfx/ntex_main.cc'
// 0x100104ec  nTexture::Unload  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'pure virtual function called', 'gfx/ntex_main.cc'
// 0x1001050f  nTexture::GetByteSize  (48 insns)

} // namespace re_nnebula
