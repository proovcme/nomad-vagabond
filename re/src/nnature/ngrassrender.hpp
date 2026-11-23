#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/ngrassrender.asm
// Class: ngrassrender : public nanimnode  (sizeof = 0x178 = 376 bytes)

#include <cstdint>

namespace re_nnature {

struct ngrassrender_Layout {
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
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
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
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
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
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00dc
    uint32_t field_0x00dc;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00e8
    uint32_t field_0x00e8;
    // +0x00fc
    uint32_t field_0x00fc;
    // +0x0104
    uint32_t field_0x0104;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
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
    uint8_t field_0x013c;
    // +0x013d
    uint8_t field_0x013d;
    // +0x0148
    uint32_t field_0x0148;
    // +0x014c
    uint32_t field_0x014c;
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
    // +0x0174
    uint32_t field_0x0174;
};

// Script AddCmds (8):
//   v_setmeshnode_s
//   s_getmeshnode_v
//   v_setwindstrength_f
//   f_getwindstrength_v
//   v_setwinddir_f
//   f_getwinddir_v
//   v_setsize_f
//   f_getsize_v

// Methods (10):
// 0x100053ac  ngrassrender::cmd_setwinddir (v_setwinddir_f)  (10 insns)
// 0x100053d1  ngrassrender::cmd_setwindstrength (v_setwindstrength_f)  (10 insns)
// 0x100053f6  ngrassrender::cmd_getmeshnode (s_getmeshnode_v)  (154 insns)
//   calls:   -> nAnimNode::vfunc_11, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1000574f  ngrassrender::n_init_ngrassrender  (200 insns)
//   consts:  f32=-0.5, f32=0.5, f32=0.015625, f32=6.283185, f32=0.1745329, f32=0.08726647
//   strings: 'nanimnode'
// 0x10005963  ngrassrender::n_fini_ngrassrender  (5 insns)
// 0x10005975  ngrassrender::n_new_ngrassrender  (10 insns)
// 0x1000598f  ngrassrender::n_version_ngrassrender  (1061 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort, IAT: MSVCRT.dll!floor, -> nAnimNode::vfunc_14, -> nAnimNode::vfunc_15
//   consts:  f64=1e-07, f32=-4, f32=5, f32=64
//   strings: '/sys/servers/gfx', 'ngrassrender_ibuf', 'Aborting.', 'c:/nomads/code/inc\\kernel/nref.h', 'c:/nomads/code/inc\\gfx/nchannelset.h', 'NOT INITIALIZED', 'c:/nomads/code/inc\\kernel/nautoref.h', 'v_setmeshnode_s'
// 0x100068fb  ngrassrender::cmd_setsize (v_setsize_f)  (10 insns)
// 0x10006920  ngrassrender::cmd_setmeshnode (v_setmeshnode_s)  (11 insns)
// 0x1000694a  ngrassrender::cmd_getsize (f_getsize_v)  (106 insns)
//   calls:   -> nAnimNode::vfunc_11

} // namespace re_nnature
