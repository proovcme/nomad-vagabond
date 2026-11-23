#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncharaudio.asm
// Class: ncharaudio : public naudio  (sizeof = 0x84 = 132 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncharaudio_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0070
    float field_0x0070;
    // +0x0074
    float field_0x0074;
    // +0x0078
    float field_0x0078;
    // +0x007c
    float field_0x007c;
    // +0x0080
    uint8_t field_0x0080;
    // +0x0140
    double field_0x0140;
    // +0x0394
    float field_0x0394;
    // +0x0734
    float field_0x0734;
    // +0x0738
    float field_0x0738;
    // +0x073c
    float field_0x073c;
    // +0x0740
    uint8_t field_0x0740;
    // +0x13c4
    float field_0x13c4;
};

// Script AddCmds (9):
//   v_setdelay_f
//   v_setfirstdelay_f
//   f_getdelay_v
//   f_getfirstdelay_v
//   v_setbackdelay_f
//   v_setfirstbackdelay_f
//   f_getbackdelay_v
//   f_getfirstbackdelay_v
//   v_setturnstep_b

// Methods (8):
// 0x10078e9a  ncharaudio::n_init_ncharaudio  (15 insns)
//   strings: 'naudio'
// 0x10078ec5  ncharaudio::n_fini_ncharaudio  (5 insns)
// 0x10078ed7  ncharaudio::n_new_ncharaudio  (26 insns)
// 0x10078f1e  ncharaudio::vfunc_00  (12 insns)
// 0x10078f40  ncharaudio::vfunc_16  (38 insns)
//   calls:   -> naudio::vfunc_16
//   consts:  f32=0
//   strings: 'walk_back'
// 0x10078fb0  ncharaudio::vfunc_18  (157 insns)
//   calls:   -> naudio::vfunc_18
//   consts:  f32=0.7, f32=0.3, f32=0, f32=1
//   strings: 'v_setdelay_f', 'v_setfirstdelay_f', 'f_getdelay_v', 'f_getfirstdelay_v', 'v_setbackdelay_f', 'v_setfirstbackdelay_f', 'f_getbackdelay_v', 'f_getfirstbackdelay_v'
// 0x100791d9  ncharaudio::cmd_setturnstep (v_setturnstep_b)  (10 insns)
// 0x1007921f  ncharaudio::vfunc_11  (110 insns)
//   calls:   -> naudio::vfunc_11

} // namespace re_nnomads
