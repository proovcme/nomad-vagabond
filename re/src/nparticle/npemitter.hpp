#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/npemitter.asm
// Class: npemitter : public nanimnode  (sizeof = 0xfc = 252 bytes)

#include <cstdint>

namespace re_nparticle {

struct npemitter_Layout {
    // +0x0004
    float field_0x0004;
    // +0x00b8
    float field_0x00b8;
    // +0x00bc
    float field_0x00bc;
    // +0x00c0
    float field_0x00c0;
    // +0x00c4
    float field_0x00c4;
    // +0x00c8
    float field_0x00c8;
    // +0x00d0
    float field_0x00d0;
    // +0x00d4
    float field_0x00d4;
    // +0x00d8
    float field_0x00d8;
    // +0x00dc
    float field_0x00dc;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00e8
    float field_0x00e8;
    // +0x00ec
    float field_0x00ec;
    // +0x00f0
    float field_0x00f0;
    // +0x00f4
    float field_0x00f4;
};

// Script AddCmds (12):
//   v_settimes_fff
//   v_setlifetime_f
//   f_getlifetime_v
//   v_setfreq_f
//   f_getfreq_v
//   v_setspeed_f
//   f_getspeed_v
//   v_setaccel_fff
//   v_setinnercone_f
//   f_getinnercone_v
//   v_setoutercone_f
//   f_getoutercone_v

// Methods (20):
// 0x10001e62  npemitter::n_init_npemitter  (15 insns)
//   strings: 'nanimnode'
// 0x10001e8d  npemitter::n_fini_npemitter  (5 insns)
// 0x10001e9f  npemitter::n_new_npemitter  (12 insns)
// 0x10001eff  npemitter::vfunc_21  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'particle/npemit_main.cc'
// 0x10001f1f  npemitter::vfunc_22  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'particle/npemit_main.cc'
// 0x10001f3f  npemitter::vfunc_23  (47 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort, IAT: MSVCRT.dll!ceil
//   consts:  f32=0
//   strings: 'particle/npemit_main.cc'
// 0x1000233e  npemitter::vfunc_00  (90 insns)
//   strings: 'v_settimes_fff', 'fff_gettimes_v', 'v_setlifetime_f', 'f_getlifetime_v', 'v_setfreq_f', 'f_getfreq_v', 'v_setspeed_f', 'f_getspeed_v'
// 0x100024a9  npemitter::cmd_settimes (v_settimes_fff)  (60 insns)
// 0x10002567  npemitter::cmd_setlifetime (v_setlifetime_f)  (16 insns)
// 0x1000259f  npemitter::cmd_getlifetime (f_getlifetime_v)  (11 insns)
// 0x100025c9  npemitter::cmd_setfreq (v_setfreq_f)  (20 insns)
// 0x1000260d  npemitter::cmd_getfreq (f_getfreq_v)  (11 insns)
// 0x10002637  npemitter::cmd_setspeed (v_setspeed_f)  (10 insns)
// 0x1000265c  npemitter::cmd_getspeed (f_getspeed_v)  (11 insns)
// 0x10002686  npemitter::cmd_setaccel (v_setaccel_fff)  (62 insns)
// 0x10002742  npemitter::cmd_setinnercone (v_setinnercone_f)  (12 insns)
// 0x10002769  npemitter::cmd_getinnercone (f_getinnercone_v)  (11 insns)
// 0x10002793  npemitter::cmd_setoutercone (v_setoutercone_f)  (12 insns)
// 0x100027ba  npemitter::cmd_getoutercone (f_getoutercone_v)  (11 insns)
// 0x100027e4  npemitter::vfunc_11  (218 insns)
//   calls:   -> nAnimNode::vfunc_11
//   consts:  f32=3.141593, f32=0.005555556, f32=180

} // namespace re_nparticle
