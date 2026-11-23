#pragma once
// Auto-lifted C++ layout & method spec from ndirect3d8.dll
// Source ASM: re/disasm/ndirect3d8/nVertexPool.asm
// Class: nVertexPool

#include <cstdint>

namespace re_ndirect3d8 {

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

// Methods (20):
// 0x1000125c  nVertexPool::GetStride4  (2 insns)
// 0x10002ede  nVertexPool::nVertexPool()  (53 insns)
// 0x10002f67  nVertexPool::GetVertexType  (2 insns)
// 0x10002f6b  nVertexPool::GetNumVertices  (2 insns)
// 0x10002f6f  nVertexPool::GetVertexPoolManager  (2 insns)
// 0x10002f73  nVertexPool::GetCoordPtr  (2 insns)
// 0x10002f77  nVertexPool::GetUvPtr  (3 insns)
// 0x10002f82  nVertexPool::GetWeightPtr  (2 insns)
// 0x10002f8a  nVertexPool::IsEmpty  (4 insns)
// 0x10002f94  nVertexPool::nVertexPool()  (59 insns)
// 0x1000301a  nVertexPool::operator=  (64 insns)
// 0x100030a7  nVertexPool::vfunc_00  (41 insns)
// 0x10006fa3  nVertexPool::GetNormPtr  (2 insns)
// 0x10006fa7  nVertexPool::GetColorPtr  (2 insns)
// 0x1000a598  nVertexPool::vfunc_06  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::ReleaseBubble
// 0x1000a59e  nVertexPool::vfunc_05  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::NewBubble
// 0x1000a5a4  nVertexPool::vfunc_04  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::RenderBubble
// 0x1000a5aa  nVertexPool::vfunc_03  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::UnlockBubble
// 0x1000a5b0  nVertexPool::vfunc_02  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::LockBubble
// 0x1000a5b6  nVertexPool::vfunc_01  (7 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::Initialize, IAT: nnebula.dll!nVertexPool::~nVertexPool(), IAT: nnebula.dll!nVertexBuffer::~nVertexBuffer(), IAT: nnebula.dll!nInputServer::LinkEvent, IAT: nnebula.dll!nInputServer::NewEvent, IAT: nnebula.dll!nInputServer::ObtainFocus, IAT: nnebula.dll!nInputServer::LoseFocus

} // namespace re_ndirect3d8
