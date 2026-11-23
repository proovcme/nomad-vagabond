#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nDirectory.asm
// Class: nDirectory

#include <cstdint>

namespace re_nparticle {

struct nDirectory_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0008
    uint8_t field_0x0008;
    // +0x00c8
    float field_0x00c8;
    // +0x00cc
    float field_0x00cc;
    // +0x00d0
    uint8_t field_0x00d0;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0208
    uint8_t field_0x0208;
    // +0x020c
    uint32_t field_0x020c;
    // +0x0410
    uint32_t field_0x0410;
};

// Script AddCmds (12):
//   v_setstretch_b
//   b_getstretch_v
//   v_setspin_f
//   f_getspin_v
//   v_setspinaccel_f
//   f_getspinaccel_v
//   v_setemitter_s
//   s_getemitter_v
//   v_beginkeys_i
//   v_setkey_iffffff
//   v_endkeys_v
//   i_getnumkeys_v

// Methods (7):
// 0x1000615d  nDirectory::nDirectory()  (29 insns)
// 0x100061cb  nDirectory::operator=  (48 insns)
// 0x100062bd  nDirectory::IsOpen  (3 insns)
// 0x100062c5  nDirectory::GetPathName  (2 insns)
// 0x10006aa9  nDirectory::vfunc_52  (84 insns)
//   strings: 'v_setstretch_b', 'b_getstretch_v', 'v_setspin_f', 'f_getspin_v', 'v_setspinaccel_f', 'f_getspinaccel_v', 'v_setemitter_s', 's_getemitter_v'
// 0x10006f2d  nDirectory::vfunc_63  (247 insns)
//   calls:   -> nAnimNode::vfunc_11
//   consts:  f32=180, f32=0.3183099
// 0x10009818  nDirectory::vfunc_49  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::AttachChannels

} // namespace re_nparticle
