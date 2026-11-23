#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nVertexPool.asm
// Class: nVertexPool

#include <cstdint>

namespace re_nnebula {

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
    uint8_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0038
    uint32_t field_0x0038;
    // +0x003c
    uint32_t field_0x003c;
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
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
};

// Methods (20):
// 0x1000150b  nVertexPool::GetStride4  (2 insns)
// 0x10008fe3  nVertexPool::nVertexPool()  (53 insns)
// 0x1000906c  nVertexPool::GetVertexType  (2 insns)
// 0x10009070  nVertexPool::GetNumVertices  (2 insns)
// 0x10009074  nVertexPool::GetVertexPoolManager  (2 insns)
// 0x10009078  nVertexPool::GetCoordPtr  (2 insns)
// 0x1000907c  nVertexPool::GetUvPtr  (3 insns)
// 0x1000908f  nVertexPool::IsEmpty  (4 insns)
// 0x10009099  nVertexPool::nVertexPool()  (59 insns)
// 0x1000911f  nVertexPool::operator=  (64 insns)
// 0x100091ac  nVertexPool::vfunc_00  (41 insns)
//   calls:   -> nVertexPool::~nVertexPool()
// 0x10009527  nVertexPool::GetColorPtr  (2 insns)
// 0x10009832  nVertexPool::GetNormPtr  (2 insns)
// 0x1000b62b  nVertexPool::~nVertexPool()  (38 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1000b689  nVertexPool::Initialize  (65 insns)
//   calls:   IAT: nkernel.dll!nn_malloc
//   strings: 'gfx/nvertexpool.cc'
// 0x1000b724  nVertexPool::NewBubble  (71 insns)
// 0x1000b7cd  nVertexPool::ReleaseBubble  (117 insns)
//   calls:   -> nGfxServer::SetStats
// 0x1000b8fc  nVertexPool::LockBubble  (51 insns)
// 0x1000b97a  nVertexPool::UnlockBubble  (14 insns)
// 0x1000b997  nVertexPool::RenderBubble  (4 insns)
//   calls:   IAT: nkernel.dll!n_printf

} // namespace re_nnebula
