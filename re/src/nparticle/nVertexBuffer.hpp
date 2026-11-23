#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nVertexBuffer.asm
// Class: nVertexBuffer

#include <cstdint>

namespace re_nparticle {

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
    float field_0x0014;
    // +0x0038
    float field_0x0038;
    // +0x003c
    float field_0x003c;
    // +0x0040
    float field_0x0040;
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
    // +0x00ac
    uint32_t field_0x00ac;
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
    uint32_t field_0x0134;
    // +0x0138
    uint32_t field_0x0138;
    // +0x013c
    uint32_t field_0x013c;
    // +0x0140
    uint32_t field_0x0140;
    // +0x0144
    uint32_t field_0x0144;
    // +0x0148
    uint32_t field_0x0148;
    // +0x014c
    uint32_t field_0x014c;
    // +0x0168
    uint32_t field_0x0168;
    // +0x016c
    uint32_t field_0x016c;
};

// Methods (21):
// 0x100053ac  nVertexBuffer::nVertexBuffer()  (46 insns)
// 0x1000542f  nVertexBuffer::Render  (9 insns)
// 0x1000544a  nVertexBuffer::Truncate  (4 insns)
// 0x10005457  nVertexBuffer::Untruncate  (4 insns)
// 0x10005461  nVertexBuffer::Initialize  (16 insns)
// 0x1000548e  nVertexBuffer::Coord  (12 insns)
// 0x100054b6  nVertexBuffer::Norm  (12 insns)
// 0x100054de  nVertexBuffer::Color  (6 insns)
// 0x100054f9  nVertexBuffer::Uv  (11 insns)
// 0x10005523  nVertexBuffer::JointWeight1  (22 insns)
// 0x10005568  nVertexBuffer::JointWeight2  (29 insns)
//   consts:  f32=1
// 0x100055c2  nVertexBuffer::JointWeight3  (32 insns)
//   consts:  f32=1
// 0x10005624  nVertexBuffer::JointWeight4  (35 insns)
//   consts:  f32=1
// 0x1000568e  nVertexBuffer::SetBBox  (10 insns)
// 0x100056a1  nVertexBuffer::GetBBox  (2 insns)
// 0x100056a5  nVertexBuffer::GetVertexType  (4 insns)
// 0x100056af  nVertexBuffer::GetVBufType  (4 insns)
// 0x100056b9  nVertexBuffer::GetColorFormat  (5 insns)
// 0x100056c8  nVertexBuffer::nVertexBuffer()  (66 insns)
//   calls:   -> nRoot::nRoot()
// 0x10005792  nVertexBuffer::operator=  (54 insns)
//   calls:   -> nRoot::operator=
// 0x10005834  nVertexBuffer::vfunc_00  (126 insns)
//   strings: '/sys/servers/gfx', '/sys/servers/math'

} // namespace re_nparticle
