#pragma once
// Auto-lifted C++ layout & method spec from ndirect3d8.dll
// Source ASM: re/disasm/ndirect3d8/nNtxFile.asm
// Class: nNtxFile

#include <cstdint>

namespace re_ndirect3d8 {

struct nNtxFile_Layout {
    // +0x0008
    uint32_t field_0x0008;
    // +0x0034
    uint32_t field_0x0034;
    // +0x003c
    uint32_t field_0x003c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0078
    uint8_t field_0x0078;
    // +0x0079
    uint8_t field_0x0079;
};

// Methods (2):
// 0x100017e7  nNtxFile::operator=  (11 insns)
// 0x100085f9  nNtxFile::nNtxFile()  (309 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: nkernel.dll!nn_malloc, IAT: nkernel.dll!n_free
//   strings: 'gfx/nd3d8tex_ntx.cc'

} // namespace re_ndirect3d8
