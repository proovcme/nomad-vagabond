#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nwavstream.asm
// Class: nwavstream : public nstream  (sizeof = 0x284 = 644 bytes)

#include <cstdint>

namespace re_nnebula {

struct nwavstream_Layout {
    // +0x0061
    uint8_t field_0x0061;
    // +0x0062
    uint8_t field_0x0062;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x0274
    uint32_t field_0x0274;
    // +0x0278
    uint32_t field_0x0278;
    // +0x027c
    uint32_t field_0x027c;
    // +0x0280
    uint32_t field_0x0280;
};

// Methods (9):
// 0x10035966  nwavstream::n_init_nwavstream  (10 insns)
//   strings: 'nstream'
// 0x10035987  nwavstream::n_fini_nwavstream  (5 insns)
// 0x10035999  nwavstream::n_new_nwavstream  (22 insns)
//   calls:   -> nStream::nStream()
// 0x100359df  nwavstream::vfunc_00  (59 insns)
//   calls:   -> nStream::~nStream()
// 0x10035a6d  nwavstream::vfunc_14  (117 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nStream::Open
//   strings: 'rb'
// 0x10035bd9  nwavstream::vfunc_18  (16 insns)
//   calls:   -> nStream::Close
// 0x10035c07  nwavstream::vfunc_15  (85 insns)
//   calls:   -> nStream::UpdateXFadeBuffer, -> nStream::ModulateXFadeBuffer
// 0x10035ce2  nwavstream::vfunc_16  (16 insns)
// 0x10035d0d  nwavstream::vfunc_17  (26 insns)

} // namespace re_nnebula
