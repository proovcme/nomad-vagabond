#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nVertexBuffer.asm
// Class: nVertexBuffer

#include <cstdint>

namespace re_nnature {

struct nVertexBuffer_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
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
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    uint32_t field_0x00a0;
};

// Methods (20):
// 0x10002b7b  nVertexBuffer::nVertexBuffer()  (46 insns)
// 0x10002bfe  nVertexBuffer::Render  (9 insns)
// 0x10002c19  nVertexBuffer::Truncate  (4 insns)
// 0x10002c26  nVertexBuffer::Untruncate  (4 insns)
// 0x10002c30  nVertexBuffer::Initialize  (16 insns)
// 0x10002c5d  nVertexBuffer::Coord  (12 insns)
// 0x10002c85  nVertexBuffer::Norm  (12 insns)
// 0x10002cad  nVertexBuffer::Color  (6 insns)
// 0x10002cc8  nVertexBuffer::Uv  (11 insns)
// 0x10002cf2  nVertexBuffer::JointWeight1  (22 insns)
// 0x10002d37  nVertexBuffer::JointWeight2  (29 insns)
//   consts:  f32=1
// 0x10002d91  nVertexBuffer::JointWeight3  (32 insns)
//   consts:  f32=1
// 0x10002df3  nVertexBuffer::JointWeight4  (35 insns)
//   consts:  f32=1
// 0x10002e5d  nVertexBuffer::SetBBox  (10 insns)
// 0x10002e70  nVertexBuffer::GetBBox  (2 insns)
// 0x10002e74  nVertexBuffer::GetVertexType  (4 insns)
// 0x10002e7e  nVertexBuffer::GetVBufType  (4 insns)
// 0x10002e88  nVertexBuffer::GetColorFormat  (5 insns)
// 0x10002e9b  nVertexBuffer::nVertexBuffer()  (66 insns)
//   calls:   -> nRoot::nRoot()
// 0x10002f65  nVertexBuffer::operator=  (54 insns)
//   calls:   -> nRoot::operator=

} // namespace re_nnature
