#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nmeshsway.asm
// Class: nmeshsway : public nanimnode  (sizeof = 0x120 = 288 bytes)

#include <cstdint>

namespace re_nnature {

struct nmeshsway_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    float field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    float field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0078
    uint32_t field_0x0078;
    // +0x007c
    uint32_t field_0x007c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00f4
    uint32_t field_0x00f4;
    // +0x0109
    uint8_t field_0x0109;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    float field_0x0114;
    // +0x0118
    float field_0x0118;
    // +0x011c
    float field_0x011c;
};

// Script AddCmds (10):
//   v_setreadonly_b
//   b_getreadonly_v
//   v_setmeshnode_s
//   s_getmeshnode_v
//   v_setwinddir_f
//   f_getwinddir_v
//   v_setwindstrength_f
//   f_getwindstrength_v
//   v_setflex_f
//   f_getflex_v

// Methods (18):
// 0x10006a76  nmeshsway::n_init_nmeshsway  (15 insns)
//   strings: 'nanimnode'
// 0x10006aa1  nmeshsway::n_fini_nmeshsway  (5 insns)
// 0x10006ab3  nmeshsway::n_new_nmeshsway  (10 insns)
// 0x10006acd  nmeshsway::n_version_nmeshsway  (26 insns)
//   consts:  f32=0.5
// 0x10006b2f  nmeshsway::vfunc_00  (22 insns)
// 0x10006b73  nmeshsway::vfunc_14  (511 insns)
//   calls:   -> nAnimNode::vfunc_14, IAT: MSVCRT.dll!floor
//   consts:  f64=1.570796371, f32=0.7853982, f32=-2.9999, f32=3, f32=6.283185, f32=0.25, f32=1, f32=0.5, f32=0.1745329
// 0x100072b0  nmeshsway::vfunc_15  (471 insns)
//   calls:   -> nAnimNode::vfunc_15, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'dm_', 'u0', 'u1', 'u2', 'u3', 'c:/nomads/code/inc\\gfx/nchannelset.h', 'v_setreadonly_b', 'b_getreadonly_v'
// 0x100077e4  nmeshsway::cmd_setreadonly (v_setreadonly_b)  (10 insns)
// 0x10007808  nmeshsway::cmd_getreadonly (b_getreadonly_v)  (13 insns)
// 0x10007834  nmeshsway::cmd_setmeshnode (v_setmeshnode_s)  (11 insns)
// 0x1000785e  nmeshsway::cmd_getmeshnode (s_getmeshnode_v)  (13 insns)
// 0x10007887  nmeshsway::cmd_setwinddir (v_setwinddir_f)  (12 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x100078b8  nmeshsway::cmd_getwinddir (f_getwinddir_v)  (13 insns)
//   consts:  f32=180, f32=0.3183099
// 0x100078ee  nmeshsway::cmd_setwindstrength (v_setwindstrength_f)  (10 insns)
// 0x10007913  nmeshsway::cmd_getwindstrength (f_getwindstrength_v)  (11 insns)
// 0x1000793d  nmeshsway::cmd_setflex (v_setflex_f)  (10 insns)
// 0x10007962  nmeshsway::cmd_getflex (f_getflex_v)  (11 insns)
// 0x1000798c  nmeshsway::vfunc_11  (114 insns)
//   calls:   -> nAnimNode::vfunc_11
//   consts:  f32=180, f32=0.3183099

} // namespace re_nnature
