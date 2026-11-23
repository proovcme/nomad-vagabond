#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nprender.asm
// Class: nprender : public nanimnode  (sizeof = 0xe4 = 228 bytes)

#include <cstdint>

namespace re_nparticle {

struct nprender_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x00d0
    uint8_t field_0x00d0;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Methods (15):
// 0x100066b6  nprender::n_init_nprender  (15 insns)
//   strings: 'nanimnode'
// 0x100066e1  nprender::n_fini_nprender  (5 insns)
// 0x100066f3  nprender::n_new_nprender  (10 insns)
// 0x10006bf8  nprender::cmd_setstretch (v_setstretch_b)  (10 insns)
// 0x10006c1c  nprender::cmd_getstretch (b_getstretch_v)  (13 insns)
// 0x10006c48  nprender::cmd_setspin (v_setspin_f)  (12 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x10006c79  nprender::cmd_getspin (f_getspin_v)  (13 insns)
//   consts:  f32=180, f32=0.3183099
// 0x10006caf  nprender::cmd_setspinaccel (v_setspinaccel_f)  (12 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x10006ce0  nprender::cmd_getspinaccel (f_getspinaccel_v)  (13 insns)
//   consts:  f32=180, f32=0.3183099
// 0x10006d16  nprender::cmd_setemitter (v_setemitter_s)  (11 insns)
// 0x10006d3a  nprender::cmd_getemitter (s_getemitter_v)  (22 insns)
// 0x10006d78  nprender::cmd_beginkeys (v_beginkeys_i)  (11 insns)
// 0x10006d9c  nprender::cmd_setkey (v_setkey_iffffff)  (43 insns)
// 0x10006e1a  nprender::cmd_endkeys (v_endkeys_v)  (3 insns)
// 0x10006e23  nprender::cmd_getnumkeys (i_getnumkeys_v)  (89 insns)

} // namespace re_nparticle
