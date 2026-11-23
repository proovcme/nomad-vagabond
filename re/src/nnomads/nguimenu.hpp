#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nguimenu.asm
// Class: nguimenu : public nroot  (sizeof = 0xf0 = 240 bytes)

#include <cstdint>

namespace re_nnomads {

struct nguimenu_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0084
    uint32_t field_0x0084;
    // +0x0088
    uint32_t field_0x0088;
    // +0x008c
    uint32_t field_0x008c;
    // +0x0090
    uint32_t field_0x0090;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00ac
    uint32_t field_0x00ac;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00b4
    uint32_t field_0x00b4;
    // +0x00b8
    uint8_t field_0x00b8;
    // +0x00b9
    uint8_t field_0x00b9;
    // +0x00bc
    uint32_t field_0x00bc;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x00c4
    float field_0x00c4;
    // +0x00ec
    uint8_t field_0x00ec;
    // +0x00ed
    uint8_t field_0x00ed;
};

// Methods (19):
// 0x1005ec7d  nguimenu::n_init_nguimenu  (15 insns)
//   strings: 'nroot'
// 0x1005eca8  nguimenu::n_fini_nguimenu  (5 insns)
// 0x1005ecba  nguimenu::n_new_nguimenu  (293 insns)
//   calls:   IAT: nkernel.dll!n_strdup, IAT: nkernel.dll!n_free
//   consts:  f32=0.65, f32=0.95, f32=0.4, f32=-0.4
//   strings: 'texturenone.ntx', 'if_bar', 'if_standard', '/sys/servers/gfx', '/sys/servers/sgraph2', '/game/handler/feedback'
// 0x10060089  nguimenu::cmd_up (v_up_v)  (3 insns)
// 0x10060092  nguimenu::cmd_down (v_down_v)  (3 insns)
// 0x100600a4  nguimenu::cmd_right (v_right_v)  (3 insns)
// 0x100600ad  nguimenu::cmd_open (v_open_v)  (12 insns)
// 0x100600c6  nguimenu::cmd_close (v_close_v)  (12 insns)
// 0x100600df  nguimenu::cmd_settitle (v_settitle_s)  (10 insns)
// 0x10060102  nguimenu::cmd_gettitle (s_gettitle_v)  (14 insns)
// 0x1006012c  nguimenu::cmd_settitlerect (v_settitlerect_ffff)  (74 insns)
// 0x1006020a  nguimenu::cmd_setmouseoverselect (v_setmouseoverselect_b)  (12 insns)
// 0x10060230  nguimenu::cmd_getmouseoverselect (b_getmouseoverselect_v)  (13 insns)
// 0x1006025b  nguimenu::cmd_setabortable (v_setabortable_b)  (12 insns)
// 0x10060281  nguimenu::cmd_isabortable (b_isabortable_v)  (13 insns)
// 0x100602ac  nguimenu::cmd_setbackground (v_setbackground_s)  (10 insns)
// 0x100602cf  nguimenu::cmd_getbackground (s_getbackground_v)  (14 insns)
// 0x100602f9  nguimenu::cmd_setcancelselects (v_setcancelselects_b)  (12 insns)
// 0x1006031f  nguimenu::cmd_getcancelselects (b_getcancelselects_v)  (13 insns)

} // namespace re_nnomads
