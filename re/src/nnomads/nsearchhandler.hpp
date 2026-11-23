#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nsearchhandler.asm
// Class: nsearchhandler : public nroot  (sizeof = 0xec = 236 bytes)

#include <cstdint>

namespace re_nnomads {

struct nsearchhandler_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0050
    uint32_t field_0x0050;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0078
    uint32_t field_0x0078;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00bc
    uint8_t field_0x00bc;
    // +0x00d8
    float field_0x00d8;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00e8
    uint32_t field_0x00e8;
};

// Methods (12):
// 0x1005bd6c  nsearchhandler::n_init_nsearchhandler  (15 insns)
//   strings: 'nroot'
// 0x1005bd97  nsearchhandler::n_fini_nsearchhandler  (5 insns)
// 0x1005bda9  nsearchhandler::n_new_nsearchhandler  (137 insns)
//   strings: '/world', '/game/handler/coll2'
// 0x1005d0f4  nsearchhandler::cmd_setmaxwatchangle (v_setmaxwatchangle_f)  (14 insns)
//   calls:   -> nfreesteer::vfunc_31
//   consts:  f32=3.141593, f32=0.005555556
// 0x1005d127  nsearchhandler::cmd_getmaxwatchangle (f_getmaxwatchangle_v)  (15 insns)
//   calls:   -> nfreesteer::vfunc_32
//   consts:  f32=180, f32=0.3183099
// 0x1005d15e  nsearchhandler::cmd_getwatched (o_getwatched_v)  (13 insns)
// 0x1005d189  nsearchhandler::cmd_setcursor (v_setcursor_s)  (10 insns)
// 0x1005d1ac  nsearchhandler::cmd_getcursor (o_getcursor_v)  (13 insns)
// 0x1005d1d7  nsearchhandler::cmd_sethaircross (v_sethaircross_s)  (10 insns)
// 0x1005d1fa  nsearchhandler::cmd_gethaircross (o_gethaircross_v)  (13 insns)
// 0x1005d225  nsearchhandler::cmd_sethaircrossowner (v_sethaircrossowner_o)  (10 insns)
// 0x1005d248  nsearchhandler::cmd_gethaircrossowner (o_gethaircrossowner_v)  (13 insns)

} // namespace re_nnomads
