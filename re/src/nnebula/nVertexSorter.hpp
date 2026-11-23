#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nVertexSorter.asm
// Class: nVertexSorter

#include <cstdint>

namespace re_nnebula {

struct nVertexSorter_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    float field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    float field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0030
    float field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x0039
    uint8_t field_0x0039;
    // +0x003c
    float field_0x003c;
    // +0x0040
    uint32_t field_0x0040;
    // +0x0048
    uint32_t field_0x0048;
    // +0x0049
    uint8_t field_0x0049;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    float field_0x0064;
    // +0x0068
    float field_0x0068;
    // +0x006c
    float field_0x006c;
    // +0x0070
    float field_0x0070;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0078
    uint32_t field_0x0078;
    // +0x007c
    uint32_t field_0x007c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0094
    uint32_t field_0x0094;
    // +0x0098
    uint32_t field_0x0098;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00f8
    float field_0x00f8;
    // +0x00fc
    uint32_t field_0x00fc;
    // +0x0100
    float field_0x0100;
    // +0x0108
    float field_0x0108;
    // +0x010c
    float field_0x010c;
    // +0x0110
    float field_0x0110;
    // +0x0118
    float field_0x0118;
    // +0x011c
    float field_0x011c;
    // +0x0120
    float field_0x0120;
    // +0x0138
    float field_0x0138;
    // +0x013c
    uint32_t field_0x013c;
    // +0x0140
    float field_0x0140;
    // +0x0144
    float field_0x0144;
    // +0x0148
    float field_0x0148;
    // +0x014c
    float field_0x014c;
    // +0x0150
    float field_0x0150;
    // +0x0154
    float field_0x0154;
    // +0x0158
    float field_0x0158;
    // +0x0164
    uint32_t field_0x0164;
};

// Methods (8):
// 0x10004097  nVertexSorter::nVertexSorter()  (2313 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, IAT: MSVCRT.dll!sprintf, -> nAnimCurveArray::FindCurveByName, -> nVertexBuffer::LockVertices, -> nVertexBuffer::UnlockVertices, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f32=1, f32=0, f32=0.05, f32=-1, f32=0.5, f32=3.141593, f32=2
//   strings: '%s_%s_trans_%s', '%s_%s_rot_%s', '/sys/servers/gfx', 'Aborting.', 'c:/nomads/code/inc\\kernel/nref.h', 'dm_', 'u0', 'u1'
// 0x1000dc09  nVertexSorter::~nVertexSorter()  (1 insns)
//   calls:   -> nVertexSorter::FreeArrays
// 0x1000dc0e  nVertexSorter::FreeArrays  (21 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1000dc39  nVertexSorter::AllocArrays  (27 insns)
//   calls:   IAT: nkernel.dll!nn_malloc
//   strings: 'gfx/nvertexsorter.cc'
// 0x1000dc72  nVertexSorter::Prepare  (18 insns)
//   calls:   -> nVertexSorter::FreeArrays, -> nVertexSorter::AllocArrays
// 0x1000dc9f  nVertexSorter::QSortHook  (28 insns)
// 0x1000dcdd  nVertexSorter::SortIndices  (41 insns)
//   calls:   IAT: MSVCRT.dll!qsort
// 0x1000dd47  nVertexSorter::operator=  (11 insns)

} // namespace re_nnebula
