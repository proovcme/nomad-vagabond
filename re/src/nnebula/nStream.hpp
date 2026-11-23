#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nStream.asm
// Class: nStream : public nroot  (sizeof = 0x274 = 628 bytes)

#include <cstdint>

namespace re_nnebula {

struct nStream_Layout {
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

// Methods (24):
// 0x100071ee  nStream::SetBaseFreq  (3 insns)
// 0x10009087  nStream::GetNumChannels  (2 insns)
// 0x10031bd2  nStream::nStream()  (45 insns)
//   calls:   -> nRoot::nRoot()
// 0x10031c49  nStream::operator=  (56 insns)
//   calls:   -> nRoot::operator=, IAT: nkernel.dll!n_free
// 0x10031cd3  nStream::vfunc_00  (41 insns)
//   calls:   -> nStream::~nStream()
// 0x10031d34  nStream::GetBaseFreq  (2 insns)
// 0x10031d38  nStream::GetLooping  (2 insns)
// 0x10031d3c  nStream::SetNumChannels  (3 insns)
// 0x10031d46  nStream::EndOfStream  (32 insns)
// 0x100356a3  nStream::n_init_nstream  (11 insns)
//   calls:   -> nStream::InitStaticData
//   strings: 'nroot'
// 0x100356c9  nStream::n_fini_nstream  (5 insns)
// 0x100356db  nStream::n_new_nstream  (10 insns)
//   calls:   -> nStream::nStream()
// 0x100356f5  nStream::InitStaticData  (15 insns)
//   consts:  f32=1, f32=0.5, f32=0.01227185
// 0x10035725  nStream::nStream()  (29 insns)
//   strings: '/sys/servers/file2'
// 0x1003577c  nStream::~nStream()  (23 insns)
//   calls:   -> nStream::Close, IAT: nkernel.dll!n_free
// 0x100357bc  nStream::Open  (29 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x10035806  nStream::Close  (13 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x10035826  nStream::Read  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'audio/nstream_main.cc'
// 0x10035846  nStream::Tell  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'audio/nstream_main.cc'
// 0x10035866  nStream::Seek  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'audio/nstream_main.cc'
// 0x10035886  nStream::BeginXFade  (4 insns)
// 0x10035893  nStream::EndXFade  (2 insns)
// 0x10035898  nStream::UpdateXFadeBuffer  (32 insns)
// 0x100358e4  nStream::ModulateXFadeBuffer  (53 insns)

} // namespace re_nnebula
