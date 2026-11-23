#pragma once
// Auto-lifted C++ layout & method spec from ndirect3d8.dll
// Source ASM: re/disasm/ndirect3d8/nVertexBuffer.asm
// Class: nVertexBuffer

#include <cstdint>

namespace re_ndirect3d8 {

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
    // +0x0018
    uint32_t field_0x0018;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    float field_0x002c;
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
    // +0x0cb0
    uint32_t field_0x0cb0;
    // +0x0de8
    uint32_t field_0x0de8;
    // +0x0dec
    uint32_t field_0x0dec;
    // +0x0df2
    uint8_t field_0x0df2;
    // +0x0df3
    uint8_t field_0x0df3;
    // +0x0df6
    uint8_t field_0x0df6;
    // +0x10b8
    uint8_t field_0x10b8;
    // +0x10b9
    uint8_t field_0x10b9;
};

// Methods (21):
// 0x10003102  nVertexBuffer::nVertexBuffer()  (46 insns)
// 0x10003185  nVertexBuffer::Render  (9 insns)
// 0x100031a0  nVertexBuffer::Truncate  (4 insns)
// 0x100031ad  nVertexBuffer::Untruncate  (4 insns)
// 0x100031b7  nVertexBuffer::Initialize  (16 insns)
// 0x100031e4  nVertexBuffer::Coord  (12 insns)
// 0x1000320c  nVertexBuffer::Norm  (12 insns)
// 0x10003234  nVertexBuffer::Color  (6 insns)
// 0x1000324f  nVertexBuffer::Uv  (11 insns)
// 0x10003279  nVertexBuffer::JointWeight1  (22 insns)
// 0x100032be  nVertexBuffer::JointWeight2  (29 insns)
//   consts:  f32=1
// 0x10003318  nVertexBuffer::JointWeight3  (32 insns)
//   consts:  f32=1
// 0x1000337a  nVertexBuffer::JointWeight4  (35 insns)
//   consts:  f32=1
// 0x100033e4  nVertexBuffer::SetBBox  (10 insns)
// 0x100033f7  nVertexBuffer::GetBBox  (2 insns)
// 0x100033fb  nVertexBuffer::GetVertexType  (4 insns)
// 0x10003409  nVertexBuffer::GetVBufType  (4 insns)
// 0x10003413  nVertexBuffer::GetColorFormat  (5 insns)
// 0x10003422  nVertexBuffer::nVertexBuffer()  (66 insns)
//   calls:   -> nRoot::nRoot()
// 0x100034ec  nVertexBuffer::operator=  (54 insns)
//   calls:   -> nRoot::operator=
// 0x1000358e  nVertexBuffer::vfunc_00  (372 insns)
//   calls:   IAT: USER32.dll!GetWindowLongA, IAT: USER32.dll!SetCursor, IAT: USER32.dll!SetCapture, IAT: USER32.dll!ReleaseCapture, IAT: USER32.dll!DefWindowProcA

} // namespace re_ndirect3d8
