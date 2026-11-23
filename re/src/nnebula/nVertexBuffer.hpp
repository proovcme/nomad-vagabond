#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nVertexBuffer.asm
// Class: nVertexBuffer : public nroot  (sizeof = 0xa4 = 164 bytes)

#include <cstdint>

namespace re_nnebula {

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
    // +0x002c
    uint32_t field_0x002c;
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
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
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

// Methods (28):
// 0x10009207  nVertexBuffer::nVertexBuffer()  (46 insns)
// 0x1000928a  nVertexBuffer::Render  (9 insns)
// 0x100092a5  nVertexBuffer::Truncate  (4 insns)
// 0x100092b2  nVertexBuffer::Untruncate  (4 insns)
// 0x100092bc  nVertexBuffer::Initialize  (16 insns)
// 0x100092e9  nVertexBuffer::Coord  (12 insns)
// 0x10009311  nVertexBuffer::Norm  (12 insns)
// 0x10009339  nVertexBuffer::Color  (6 insns)
// 0x10009354  nVertexBuffer::Uv  (11 insns)
// 0x1000937e  nVertexBuffer::JointWeight1  (22 insns)
// 0x100093c3  nVertexBuffer::JointWeight2  (29 insns)
//   consts:  f32=1
// 0x1000941d  nVertexBuffer::JointWeight3  (32 insns)
//   consts:  f32=1
// 0x1000947f  nVertexBuffer::JointWeight4  (35 insns)
//   consts:  f32=1
// 0x100094e9  nVertexBuffer::SetBBox  (10 insns)
// 0x100094fc  nVertexBuffer::GetBBox  (2 insns)
// 0x10009500  nVertexBuffer::GetVertexType  (4 insns)
// 0x1000950e  nVertexBuffer::GetVBufType  (4 insns)
// 0x10009518  nVertexBuffer::GetColorFormat  (5 insns)
// 0x1000952b  nVertexBuffer::nVertexBuffer()  (66 insns)
//   calls:   -> nRoot::nRoot()
// 0x100095f5  nVertexBuffer::operator=  (54 insns)
//   calls:   -> nRoot::operator=
// 0x10009697  nVertexBuffer::vfunc_00  (41 insns)
//   calls:   -> nVertexBuffer::~nVertexBuffer()
// 0x100106f4  nVertexBuffer::n_init_nvertexbuffer  (10 insns)
//   strings: 'nroot'
// 0x10010715  nVertexBuffer::n_fini_nvertexbuffer  (5 insns)
// 0x10010727  nVertexBuffer::n_new_nvertexbuffer  (10 insns)
//   calls:   -> nVertexBuffer::nVertexBuffer()
// 0x10010741  nVertexBuffer::n_version_nvertexbuffer  (2 insns)
// 0x10010747  nVertexBuffer::~nVertexBuffer()  (21 insns)
//   calls:   -> nVertexPoolManager::ReleaseVertexBubble
// 0x10010780  nVertexBuffer::LockVertices  (69 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'gfx/nvertexbuffer_main.cc'
// 0x1001084f  nVertexBuffer::UnlockVertices  (26 insns)

} // namespace re_nnebula
