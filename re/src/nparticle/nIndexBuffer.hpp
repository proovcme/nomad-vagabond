#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nIndexBuffer.asm
// Class: nIndexBuffer

#include <cstdint>

namespace re_nparticle {

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
    // +0x0080
    uint32_t field_0x0080;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00bc
    float field_0x00bc;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x00c4
    uint32_t field_0x00c4;
    // +0x00c8
    float field_0x00c8;
    // +0x00cc
    float field_0x00cc;
    // +0x00d0
    uint8_t field_0x00d0;
    // +0x00dc
    uint32_t field_0x00dc;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00f0
    uint32_t field_0x00f0;
    // +0x0108
    uint32_t field_0x0108;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0118
    uint32_t field_0x0118;
    // +0x011c
    uint32_t field_0x011c;
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
    float field_0x0134;
    // +0x0138
    float field_0x0138;
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
    // +0x0174
    uint8_t field_0x0174;
    // +0x0175
    uint8_t field_0x0175;
    // +0x0188
    uint32_t field_0x0188;
    // +0x018c
    uint32_t field_0x018c;
};

// Methods (22):
// 0x1000674d  nIndexBuffer::vfunc_39  (36 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!nn_malloc
//   strings: 'particle/nprender_main.cc'
// 0x100067b5  nIndexBuffer::vfunc_40  (64 insns)
//   consts:  f32=255
// 0x10006884  nIndexBuffer::vfunc_42  (2 insns)
// 0x1000688b  nIndexBuffer::vfunc_43  (30 insns)
// 0x100068f1  nIndexBuffer::vfunc_44  (65 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'particle/nprender_main.cc', 'npemitter'
// 0x100069b7  nIndexBuffer::vfunc_45  (71 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Aborting.', 'c:/nomads/code/inc\\kernel/nref.h'
// 0x100073aa  nIndexBuffer::nIndexBuffer()  (27 insns)
//   calls:   -> nRoot::nRoot()
// 0x100073f5  nIndexBuffer::operator=  (26 insns)
//   calls:   -> nRoot::operator=
// 0x1000743a  nIndexBuffer::vfunc_00  (41 insns)
// 0x10007496  nIndexBuffer::nIndexBuffer()  (16 insns)
// 0x100074c2  nIndexBuffer::Index  (5 insns)
// 0x100074d5  nIndexBuffer::Truncate  (3 insns)
// 0x100074df  nIndexBuffer::Untruncate  (3 insns)
// 0x100074e6  nIndexBuffer::GetPrimType  (2 insns)
// 0x100074ea  nIndexBuffer::GetIndexBufferType  (2 insns)
// 0x10007638  nIndexBuffer::vfunc_18  (345 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f32=0.1591549, f32=64
//   strings: 'nspriterender_ibuf', 'Aborting.', 'c:/nomads/code/inc\\kernel/nref.h', 'NOT INITIALIZED', 'c:/nomads/code/inc\\kernel/nautoref.h'
// 0x10007ac0  nIndexBuffer::vfunc_32  (787 insns)
//   calls:   -> nAnimNode::vfunc_14, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f32=1, f64=1.030792151e+11, f32=256, f32=0, f32=0.5
//   strings: 'Aborting.', 'c:/nomads/code/inc\\kernel/nref.h', 'NOT INITIALIZED', 'c:/nomads/code/inc\\kernel/nautoref.h'
// 0x100085d0  nIndexBuffer::vfunc_33  (416 insns)
//   calls:   -> nAnimNode::vfunc_15, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'c:/nomads/code/inc\\gfx/nchannelset.h', 'Aborting.', 'c:/nomads/code/inc\\kernel/nref.h', 'dm_', 'u0', 'u1', 'u2', 'u3'
// 0x10009a4c  nIndexBuffer::vfunc_17  (1 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::Unlock
// 0x10009a52  nIndexBuffer::vfunc_16  (1 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::Lock
// 0x10009a58  nIndexBuffer::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::End
// 0x10009a5e  nIndexBuffer::vfunc_14  (152 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::Begin, IAT: nnebula.dll!nIndexBuffer::~nIndexBuffer(), IAT: MSVCRT.dll!??2@YAPAXI@Z, IAT: MSVCRT.dll!??3@YAXPAX@Z, IAT: MSVCRT.dll!_ftol, IAT: MSVCRT.dll!_adjust_fdiv, IAT: MSVCRT.dll!malloc, IAT: MSVCRT.dll!free, IAT: MSVCRT.dll!_initterm, IAT: KERNEL32.dll!DisableThreadLibraryCalls

} // namespace re_nparticle
