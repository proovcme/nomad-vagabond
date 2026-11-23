#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nPixelFormat.asm
// Class: nPixelFormat

#include <cstdint>

namespace re_nnebula {

struct nPixelFormat_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
};

// Methods (6):
// 0x1000a48e  nPixelFormat::nPixelFormat()  (41 insns)
//   calls:   IAT: nkernel.dll!nn_malloc
//   strings: 'gfx/npixelformat.cc'
// 0x1000a4f2  nPixelFormat::nPixelFormat()  (103 insns)
// 0x1000a5d0  nPixelFormat::nPixelFormat()  (57 insns)
//   calls:   IAT: nkernel.dll!nn_malloc
//   strings: 'gfx/npixelformat.cc'
// 0x1000a662  nPixelFormat::~nPixelFormat()  (7 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1000a672  nPixelFormat::BeginConv  (40 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   strings: 'nPixelFormat: illegal conversion, rgba->clut!', 'gfx/npixelformat.cc'
// 0x1000a6d8  nPixelFormat::Conv  (300 insns)

} // namespace re_nnebula
