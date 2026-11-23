#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nVertexPool.asm
// Class: nVertexPool

#include <cstdint>

namespace re_nnomads {

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
    // +0x0038
    uint32_t field_0x0038;
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
};

// Methods (17):
// 0x10001602  nVertexPool::GetStride4  (2 insns)
// 0x1000cc77  nVertexPool::nVertexPool()  (53 insns)
// 0x1000cd04  nVertexPool::GetVertexType  (2 insns)
// 0x1000cd08  nVertexPool::GetNumVertices  (2 insns)
// 0x1000cd14  nVertexPool::GetUvPtr  (3 insns)
// 0x1000cd27  nVertexPool::IsEmpty  (4 insns)
// 0x1000cd31  nVertexPool::nVertexPool()  (59 insns)
// 0x1000cdb7  nVertexPool::operator=  (64 insns)
// 0x1000ce44  nVertexPool::vfunc_00  (41 insns)
// 0x1000d47b  nVertexPool::GetNormPtr  (2 insns)
// 0x1000d47f  nVertexPool::GetColorPtr  (36 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2
// 0x1007994e  nVertexPool::vfunc_06  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::ReleaseBubble
// 0x10079954  nVertexPool::vfunc_05  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::NewBubble
// 0x1007995a  nVertexPool::vfunc_04  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::RenderBubble
// 0x10079960  nVertexPool::vfunc_03  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::UnlockBubble
// 0x10079966  nVertexPool::vfunc_02  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::LockBubble
// 0x1007996c  nVertexPool::vfunc_01  (3 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::Initialize, IAT: nnebula.dll!nVertexPool::~nVertexPool(), IAT: nnebula.dll!nVertexBuffer::~nVertexBuffer()

} // namespace re_nnomads
