#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nIndexBuffer.asm
// Class: nIndexBuffer : public nroot  (sizeof = 0x60 = 96 bytes)

#include <cstdint>

namespace re_nnebula {

struct nIndexBuffer_Layout {
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
    // +0x005c
    uint8_t field_0x005c;
    // +0x005d
    uint8_t field_0x005d;
};

// Methods (17):
// 0x100096f8  nIndexBuffer::nIndexBuffer()  (27 insns)
//   calls:   -> nRoot::nRoot()
// 0x10009743  nIndexBuffer::operator=  (26 insns)
//   calls:   -> nRoot::operator=
// 0x10009788  nIndexBuffer::vfunc_00  (41 insns)
//   calls:   -> nIndexBuffer::~nIndexBuffer()
// 0x100097e4  nIndexBuffer::nIndexBuffer()  (16 insns)
// 0x10009810  nIndexBuffer::Index  (5 insns)
// 0x10009823  nIndexBuffer::Untruncate  (3 insns)
// 0x1000982a  nIndexBuffer::GetPrimType  (2 insns)
// 0x1000982e  nIndexBuffer::GetIndexBufferType  (2 insns)
// 0x10010897  nIndexBuffer::n_init_nindexbuffer  (10 insns)
//   strings: 'nroot'
// 0x100108b8  nIndexBuffer::n_fini_nindexbuffer  (5 insns)
// 0x100108ca  nIndexBuffer::n_new_nindexbuffer  (10 insns)
//   calls:   -> nIndexBuffer::nIndexBuffer()
// 0x100108e1  nIndexBuffer::n_version_nindexbuffer  (2 insns)
// 0x100108e7  nIndexBuffer::~nIndexBuffer()  (14 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1001090c  nIndexBuffer::Begin  (20 insns)
//   calls:   IAT: nkernel.dll!nn_malloc
//   strings: 'gfx/nindexbuffer_main.cc'
// 0x10010948  nIndexBuffer::End  (3 insns)
// 0x10010951  nIndexBuffer::Lock  (5 insns)
// 0x1001095e  nIndexBuffer::Unlock  (3 insns)

} // namespace re_nnebula
