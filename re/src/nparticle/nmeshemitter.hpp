#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nmeshemitter.asm
// Class: nmeshemitter : public npservemitter  (sizeof = 0x170 = 368 bytes)

#include <cstdint>

namespace re_nparticle {

struct nmeshemitter_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x001c
    float field_0x001c;
    // +0x002c
    float field_0x002c;
    // +0x0030
    float field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x003c
    float field_0x003c;
    // +0x0078
    uint32_t field_0x0078;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00ac
    uint32_t field_0x00ac;
    // +0x00b8
    float field_0x00b8;
    // +0x00bc
    float field_0x00bc;
    // +0x00c0
    float field_0x00c0;
    // +0x00c4
    uint32_t field_0x00c4;
    // +0x00cc
    float field_0x00cc;
    // +0x00d0
    float field_0x00d0;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00f8
    uint8_t field_0x00f8;
    // +0x00f9
    uint8_t field_0x00f9;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0118
    uint32_t field_0x0118;
    // +0x011c
    uint32_t field_0x011c;
    // +0x0130
    uint32_t field_0x0130;
    // +0x0144
    uint32_t field_0x0144;
    // +0x0168
    uint32_t field_0x0168;
    // +0x016c
    uint32_t field_0x016c;
};

// Script AddCmds (2):
//   v_setmeshnode_s
//   s_getmeshnode_v

// Methods (14):
// 0x10001ec4  nmeshemitter::vfunc_01  (26 insns)
//   calls:   -> nAnimNode::vfunc_01
//   strings: 'nvisnode'
// 0x10002b80  nmeshemitter::vfunc_24  (55 insns)
// 0x10002c33  nmeshemitter::vfunc_21  (22 insns)
// 0x10002c7a  nmeshemitter::vfunc_22  (71 insns)
// 0x10002d35  nmeshemitter::vfunc_23  (49 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'NOT INITIALIZED', 'Aborting.', 'c:/nomads/code/inc\\kernel/nautoref.h'
// 0x10004cbe  nmeshemitter::n_init_nmeshemitter  (15 insns)
//   strings: 'npservemitter'
// 0x10004ce9  nmeshemitter::n_fini_nmeshemitter  (5 insns)
// 0x10004cfb  nmeshemitter::n_new_nmeshemitter  (31 insns)
// 0x10004d5b  nmeshemitter::vfunc_15  (357 insns)
//   calls:   -> nAnimNode::vfunc_15, IAT: MSVCRT.dll!floor, IAT: nkernel.dll!n_free
//   consts:  f32=0, f32=1, f32=0.5
// 0x100059be  nmeshemitter::vfunc_00  (29 insns)
//   strings: 'v_setmeshnode_s', 's_getmeshnode_v'
// 0x10005a1b  nmeshemitter::cmd_setmeshnode (v_setmeshnode_s)  (11 insns)
// 0x10005a45  nmeshemitter::cmd_getmeshnode (s_getmeshnode_v)  (13 insns)
// 0x10005a6e  nmeshemitter::vfunc_11  (58 insns)
//   calls:   -> npemitter::vfunc_11, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1000670d  nmeshemitter::n_version_nmeshemitter  (21 insns)
//   calls:   IAT: nkernel.dll!n_free
//   strings: 'unknown'

} // namespace re_nparticle
