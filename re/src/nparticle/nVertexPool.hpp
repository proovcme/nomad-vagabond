#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nVertexPool.asm
// Class: nVertexPool

#include <cstdint>

namespace re_nparticle {

struct nVertexPool_Layout {
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
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0038
    uint8_t field_0x0038;
    // +0x0039
    uint8_t field_0x0039;
    // +0x003c
    uint32_t field_0x003c;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00e8
    uint32_t field_0x00e8;
    // +0x00ec
    uint32_t field_0x00ec;
    // +0x00f0
    uint32_t field_0x00f0;
    // +0x00f4
    uint32_t field_0x00f4;
    // +0x00f8
    uint32_t field_0x00f8;
    // +0x00fc
    uint32_t field_0x00fc;
    // +0x0100
    uint32_t field_0x0100;
    // +0x0104
    uint32_t field_0x0104;
    // +0x0108
    uint32_t field_0x0108;
    // +0x010c
    uint32_t field_0x010c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0118
    uint32_t field_0x0118;
    // +0x011c
    uint32_t field_0x011c;
    // +0x0120
    uint32_t field_0x0120;
    // +0x0124
    uint32_t field_0x0124;
    // +0x0128
    uint32_t field_0x0128;
    // +0x012c
    uint32_t field_0x012c;
    // +0x0130
    uint32_t field_0x0130;
    // +0x0134
    float field_0x0134;
    // +0x0138
    float field_0x0138;
};

// Methods (20):
// 0x10001586  nVertexPool::GetStride4  (2 insns)
// 0x1000399e  nVertexPool::GetWeightPtr  (2 insns)
// 0x1000516f  nVertexPool::nVertexPool()  (64 insns)
// 0x10005215  nVertexPool::GetVertexType  (2 insns)
// 0x10005219  nVertexPool::GetNumVertices  (2 insns)
// 0x1000521d  nVertexPool::GetVertexPoolManager  (2 insns)
// 0x10005221  nVertexPool::GetCoordPtr  (2 insns)
// 0x10005225  nVertexPool::GetUvPtr  (3 insns)
// 0x10005234  nVertexPool::IsEmpty  (4 insns)
// 0x1000523e  nVertexPool::nVertexPool()  (59 insns)
// 0x100052c4  nVertexPool::operator=  (64 insns)
// 0x10005351  nVertexPool::vfunc_00  (41 insns)
// 0x100074ee  nVertexPool::GetNormPtr  (2 insns)
// 0x100074f2  nVertexPool::GetColorPtr  (84 insns)
//   strings: '/sys/servers/gfx', '/sys/servers/math'
// 0x100099fe  nVertexPool::vfunc_06  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::ReleaseBubble
// 0x10009a04  nVertexPool::vfunc_05  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::NewBubble
// 0x10009a0a  nVertexPool::vfunc_04  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::RenderBubble
// 0x10009a10  nVertexPool::vfunc_03  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::UnlockBubble
// 0x10009a16  nVertexPool::vfunc_02  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::LockBubble
// 0x10009a1c  nVertexPool::vfunc_01  (3 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::Initialize, IAT: nnebula.dll!nVertexPool::~nVertexPool(), IAT: nnebula.dll!nVertexBuffer::~nVertexBuffer()

} // namespace re_nparticle
