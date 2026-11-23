#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nIndexBuffer.asm
// Class: nIndexBuffer

#include <cstdint>

namespace re_nnature {

struct nIndexBuffer_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
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
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0038
    uint8_t field_0x0038;
    // +0x0039
    uint8_t field_0x0039;
    // +0x003c
    uint32_t field_0x003c;
    // +0x0040
    uint32_t field_0x0040;
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
    // +0x0078
    uint32_t field_0x0078;
    // +0x007c
    uint32_t field_0x007c;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    float field_0x00b8;
    // +0x00bc
    float field_0x00bc;
    // +0x00c0
    float field_0x00c0;
    // +0x00c4
    uint32_t field_0x00c4;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00d8
    uint32_t field_0x00d8;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00e8
    uint32_t field_0x00e8;
    // +0x00ec
    uint32_t field_0x00ec;
    // +0x00f0
    uint32_t field_0x00f0;
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
    uint8_t field_0x0144;
    // +0x0145
    uint8_t field_0x0145;
    // +0x0150
    uint32_t field_0x0150;
    // +0x0154
    uint32_t field_0x0154;
    // +0x0158
    uint32_t field_0x0158;
    // +0x015c
    uint32_t field_0x015c;
    // +0x0160
    uint32_t field_0x0160;
    // +0x0164
    uint32_t field_0x0164;
    // +0x0168
    uint32_t field_0x0168;
    // +0x016c
    uint32_t field_0x016c;
    // +0x0170
    uint32_t field_0x0170;
};

// Methods (13):
// 0x10003068  nIndexBuffer::nIndexBuffer()  (27 insns)
//   calls:   -> nRoot::nRoot()
// 0x100030b3  nIndexBuffer::operator=  (26 insns)
//   calls:   -> nRoot::operator=
// 0x100030f8  nIndexBuffer::vfunc_00  (41 insns)
// 0x10003154  nIndexBuffer::nIndexBuffer()  (16 insns)
// 0x10003180  nIndexBuffer::Index  (5 insns)
// 0x10003193  nIndexBuffer::Truncate  (3 insns)
// 0x1000319d  nIndexBuffer::Untruncate  (3 insns)
// 0x100031a4  nIndexBuffer::GetPrimType  (2 insns)
// 0x100031a8  nIndexBuffer::GetIndexBufferType  (1496 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort, IAT: MSVCRT.dll!floor, -> nAnimNode::vfunc_14, -> nAnimNode::vfunc_15, IAT: nkernel.dll!n_free
//   consts:  f32=-3.9, f32=4, f32=64
//   strings: '/sys/servers/gfx', 'nleafrender_ibuf', 'Aborting.', 'c:/nomads/code/inc\\kernel/nref.h', 'NOT INITIALIZED', 'c:/nomads/code/inc\\kernel/nautoref.h', 'c:/nomads/code/inc\\gfx/nchannelset.h', 'dm_'
// 0x1000e122  nIndexBuffer::vfunc_17  (1 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::Unlock
// 0x1000e128  nIndexBuffer::vfunc_16  (1 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::Lock
// 0x1000e12e  nIndexBuffer::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::End
// 0x1000e134  nIndexBuffer::vfunc_14  (7 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::Begin, IAT: nnebula.dll!nIndexBuffer::~nIndexBuffer(), IAT: nnebula.dll!nAnimNode::nAnimNode(), IAT: nnebula.dll!nVertexBuffer::LockVertices, IAT: nnebula.dll!nVertexBuffer::UnlockVertices, IAT: nnebula.dll!nSceneGraph2::~nSceneGraph2(), IAT: nnebula.dll!nChannelServer::~nChannelServer()

} // namespace re_nnature
