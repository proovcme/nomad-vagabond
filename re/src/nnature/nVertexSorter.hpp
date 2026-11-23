#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nVertexSorter.asm
// Class: nVertexSorter

#include <cstdint>

namespace re_nnature {

struct nVertexSorter_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x00e8
    float field_0x00e8;
    // +0x00ec
    float field_0x00ec;
    // +0x00f0
    float field_0x00f0;
    // +0x00f4
    float field_0x00f4;
};

// Script AddCmds (10):
//   v_setmeshnode_s
//   s_getmeshnode_v
//   v_setdiffuse_ffff
//   v_setambient_ffff
//   v_setemissive_ffff
//   v_setabsorb_ffff
//   v_setradius_f
//   f_getradius_v
//   v_setalpha_f
//   f_getalpha_v

// Methods (1):
// 0x10009033  nVertexSorter::operator=  (241 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f32=0, f32=0.1, f32=1
//   strings: 'c:/nomads/code/inc\\gfx/nchannelset.h', 'v_setmeshnode_s', 's_getmeshnode_v', 'v_setdiffuse_ffff', 'ffff_getdiffuse_v', 'v_setambient_ffff', 'ffff_getambient_v', 'v_setemissive_ffff'

} // namespace re_nnature
