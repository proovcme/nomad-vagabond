#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nVertexBuffer.asm
// Class: nVertexBuffer

#include <cstdint>

namespace re_nnomads {

struct nVertexBuffer_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
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

// Methods (21):
// 0x1000ce9f  nVertexBuffer::nVertexBuffer()  (32 insns)
// 0x1000cf02  nVertexBuffer::Render  (9 insns)
// 0x1000cf1d  nVertexBuffer::Truncate  (4 insns)
// 0x1000cf2a  nVertexBuffer::Untruncate  (4 insns)
// 0x1000cf34  nVertexBuffer::Initialize  (16 insns)
// 0x1000cf61  nVertexBuffer::Coord  (12 insns)
// 0x1000cf89  nVertexBuffer::Norm  (12 insns)
// 0x1000cfb1  nVertexBuffer::Color  (6 insns)
// 0x1000cfcc  nVertexBuffer::Uv  (11 insns)
// 0x1000cff6  nVertexBuffer::JointWeight1  (22 insns)
// 0x1000d03b  nVertexBuffer::JointWeight2  (29 insns)
//   consts:  f32=1
// 0x1000d095  nVertexBuffer::JointWeight3  (32 insns)
//   consts:  f32=1
// 0x1000d0f7  nVertexBuffer::JointWeight4  (35 insns)
//   consts:  f32=1
// 0x1000d161  nVertexBuffer::SetBBox  (10 insns)
// 0x1000d174  nVertexBuffer::GetBBox  (2 insns)
// 0x1000d178  nVertexBuffer::GetVertexType  (4 insns)
// 0x1000d186  nVertexBuffer::GetVBufType  (4 insns)
// 0x1000d190  nVertexBuffer::GetColorFormat  (5 insns)
// 0x1000d19f  nVertexBuffer::nVertexBuffer()  (51 insns)
//   calls:   -> nRoot::nRoot()
// 0x1000d23e  nVertexBuffer::operator=  (54 insns)
//   calls:   -> nRoot::operator=
// 0x1000d2e0  nVertexBuffer::vfunc_00  (41 insns)

} // namespace re_nnomads
