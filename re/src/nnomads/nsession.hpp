#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nsession.asm
// Class: nsession : public nroot  (sizeof = 0x60 = 96 bytes)

#include <cstdint>

namespace re_nnomads {

struct nsession_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint8_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    double field_0x0050;
    // +0x0058
    uint8_t field_0x0058;
};

// Script AddCmds (5):
//   v_setenableswing_b
//   b_getenableswing_v
//   v_makeuser_i
//   v_setstarted_b
//   b_isstarted_v

// Methods (21):
// 0x10062ade  nsession::vfunc_25  (20 insns)
//   strings: 'v_setenableswing_b', 'b_getenableswing_v'
// 0x1006c896  nsession::vfunc_17  (3 insns)
// 0x1006cb75  nsession::vfunc_11  (5 insns)
//   calls:   -> nAnimSequence::vfunc_31
// 0x1006cb86  nsession::n_init_nsession  (15 insns)
//   strings: 'nroot'
// 0x1006cbb1  nsession::n_fini_nsession  (5 insns)
// 0x1006cbc3  nsession::n_new_nsession  (24 insns)
// 0x1006cc03  nsession::vfunc_00  (27 insns)
// 0x1006cc4d  nsession::vfunc_14  (156 insns)
//   calls:   IAT: MSVCRT.dll!sprintf, IAT: nkernel.dll!n_printf, -> nRoot::GetHead
//   strings: '/sys/servers/comm', 'nuser', '%d'
// 0x1006ce0c  nsession::vfunc_15  (48 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nRoot::GetHead
//   strings: '/sys/servers/comm'
// 0x1006ce8e  nsession::vfunc_16  (9 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x1006cea8  nsession::vfunc_18  (2 insns)
// 0x1006ceac  nsession::vfunc_19  (42 insns)
//   calls:   IAT: MSVCRT.dll!sprintf, IAT: nkernel.dll!n_printf
//   strings: '%d', 'nuser'
// 0x1006cf1f  nsession::vfunc_20  (27 insns)
//   calls:   -> nRoot::GetHead, IAT: MSVCRT.dll!atoi
// 0x1006cf60  nsession::vfunc_21  (30 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: '%d'
// 0x1006cfb0  nsession::vfunc_22  (3 insns)
// 0x1006cfba  nsession::vfunc_23  (2 insns)
// 0x1006cfbe  nsession::vfunc_24  (6 insns)
// 0x1006cfd2  nsession::vfunc_26  (25 insns)
//   strings: 'v_makeuser_i', 'v_setstarted_b', 'b_isstarted_v'
// 0x1006d02d  nsession::cmd_makeuser (v_makeuser_i)  (31 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x1006d07d  nsession::cmd_setstarted (v_setstarted_b)  (12 insns)
// 0x1006d0a1  nsession::cmd_isstarted (b_isstarted_v)  (14 insns)

} // namespace re_nnomads
