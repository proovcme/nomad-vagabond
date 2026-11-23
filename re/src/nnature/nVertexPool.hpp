#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nVertexPool.asm
// Class: nVertexPool

#include <cstdint>

namespace re_nnature {

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

// Methods (13):
// 0x10001b49  nVertexPool::nVertexPool()  (74 insns)
// 0x10001c09  nVertexPool::GetVertexType  (2 insns)
// 0x10001c0d  nVertexPool::GetNumVertices  (2 insns)
// 0x10001c11  nVertexPool::GetVertexPoolManager  (2 insns)
// 0x10001c15  nVertexPool::GetCoordPtr  (2 insns)
// 0x10001c19  nVertexPool::GetNormPtr  (2 insns)
// 0x10001c1d  nVertexPool::GetUvPtr  (3 insns)
// 0x10001c28  nVertexPool::GetWeightPtr  (2 insns)
// 0x10001c30  nVertexPool::GetStride4  (2 insns)
// 0x10001c34  nVertexPool::IsEmpty  (4 insns)
// 0x10001c3e  nVertexPool::nVertexPool()  (59 insns)
// 0x10001cc4  nVertexPool::operator=  (64 insns)
// 0x10002e97  nVertexPool::GetColorPtr  (2 insns)

} // namespace re_nnature
