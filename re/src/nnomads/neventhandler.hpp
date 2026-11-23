#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/neventhandler.asm
// Class: neventhandler : public nroot  (sizeof = 0x80 = 128 bytes)

#include <cstdint>

namespace re_nnomads {

struct neventhandler_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    uint8_t field_0x001c;
    // +0x001d
    uint8_t field_0x001d;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint8_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0078
    uint32_t field_0x0078;
    // +0x007c
    uint8_t field_0x007c;
};

// Script AddCmds (6):
//   v_clear_v
//   v_addhandler_ss
//   v_addhandler2_ssss
//   v_putevent_s
//   v_setlogging_b
//   b_getlogging_v

// Methods (10):
// 0x10058feb  neventhandler::n_init_neventhandler  (15 insns)
//   strings: 'nroot'
// 0x10059016  neventhandler::n_fini_neventhandler  (5 insns)
// 0x10059028  neventhandler::n_new_neventhandler  (44 insns)
//   strings: '/sys/servers/script'
// 0x100590a3  neventhandler::vfunc_00  (655 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: MSVCRT.dll!sprintf, IAT: nkernel.dll!nn_malloc, IAT: nkernel.dll!n_printf, IAT: nkernel.dll!n_strdup
//   strings: 'event_handler_%d', 'gamehandler/neventhandler_main.cc', 'proc %s {} { %s }', 'and', 'or', 'v_clear_v', 'v_addhandler_ss', 'v_addhandler2_ssss'
// 0x10059744  neventhandler::cmd_clear (v_clear_v)  (2 insns)
// 0x1005974d  neventhandler::cmd_addhandler (v_addhandler_ss)  (16 insns)
// 0x1005977a  neventhandler::cmd_addhandler2 (v_addhandler2_ssss)  (27 insns)
// 0x100597c5  neventhandler::cmd_putevent (v_putevent_s)  (10 insns)
// 0x100597e8  neventhandler::cmd_setlogging (v_setlogging_b)  (12 insns)
// 0x1005980e  neventhandler::cmd_getlogging (b_getlogging_v)  (13 insns)

} // namespace re_nnomads
