#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nIndexBuffer.asm
// Class: nIndexBuffer

#include <cstdint>

namespace re_nnomads {

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

// Methods (12):
// 0x1000d341  nIndexBuffer::nIndexBuffer()  (27 insns)
//   calls:   -> nRoot::nRoot()
// 0x1000d38c  nIndexBuffer::operator=  (26 insns)
//   calls:   -> nRoot::operator=
// 0x1000d3d1  nIndexBuffer::vfunc_00  (41 insns)
// 0x1000d42d  nIndexBuffer::nIndexBuffer()  (16 insns)
// 0x1000d459  nIndexBuffer::Index  (5 insns)
// 0x1000d46c  nIndexBuffer::Untruncate  (3 insns)
// 0x1000d473  nIndexBuffer::GetPrimType  (2 insns)
// 0x1000d477  nIndexBuffer::GetIndexBufferType  (2 insns)
// 0x1007997e  nIndexBuffer::vfunc_17  (1 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::Unlock
// 0x10079984  nIndexBuffer::vfunc_16  (1 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::Lock
// 0x1007998a  nIndexBuffer::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::End
// 0x10079990  nIndexBuffer::vfunc_14  (2 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::Begin, IAT: nnebula.dll!nIndexBuffer::~nIndexBuffer()

} // namespace re_nnomads
