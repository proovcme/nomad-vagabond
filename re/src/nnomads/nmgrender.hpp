#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nmgrender.asm
// Class: nmgrender : public nanimnode  (sizeof = 0x1d4 = 468 bytes)

#include <cstdint>

namespace re_nnomads {

struct nmgrender_Layout {
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
    // +0x003c
    uint32_t field_0x003c;
    // +0x0040
    float field_0x0040;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0045
    uint8_t field_0x0045;
    // +0x0058
    uint32_t field_0x0058;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00bc
    float field_0x00bc;
    // +0x00c0
    float field_0x00c0;
    // +0x00c4
    float field_0x00c4;
    // +0x00c8
    float field_0x00c8;
    // +0x00cc
    float field_0x00cc;
    // +0x00d0
    float field_0x00d0;
    // +0x00d4
    float field_0x00d4;
    // +0x00d8
    float field_0x00d8;
    // +0x00dc
    float field_0x00dc;
    // +0x00e0
    float field_0x00e0;
    // +0x00e4
    float field_0x00e4;
    // +0x00e8
    float field_0x00e8;
    // +0x00ec
    float field_0x00ec;
    // +0x00f0
    float field_0x00f0;
    // +0x0100
    uint32_t field_0x0100;
    // +0x0118
    uint32_t field_0x0118;
    // +0x0130
    uint32_t field_0x0130;
    // +0x0158
    uint32_t field_0x0158;
    // +0x0180
    float field_0x0180;
    // +0x01b8
    uint32_t field_0x01b8;
    // +0x01bc
    uint32_t field_0x01bc;
    // +0x01c0
    uint32_t field_0x01c0;
    // +0x01c4
    uint32_t field_0x01c4;
    // +0x01c8
    uint32_t field_0x01c8;
    // +0x01cc
    uint32_t field_0x01cc;
    // +0x01d0
    uint32_t field_0x01d0;
};

// Methods (17):
// 0x10039b32  nmgrender::n_init_nmgrender  (15 insns)
//   strings: 'nanimnode'
// 0x10039b5d  nmgrender::n_fini_nmgrender  (5 insns)
// 0x10039b6f  nmgrender::n_new_nmgrender  (1529 insns)
//   calls:   -> nAnimNode::vfunc_18, -> nAnimNode::vfunc_14, -> nAnimNode::vfunc_15
//   consts:  f32=0.6, f32=255, f32=0.0001
//   strings: '/sys/servers/gfx', '/sys/servers/math', 'mgshotarray', 'nmgrender_ibuf'
// 0x1003b49e  nmgrender::cmd_settracerlen (v_settracerlen_f)  (10 insns)
// 0x1003b4c3  nmgrender::cmd_gettracerlen (f_gettracerlen_v)  (11 insns)
// 0x1003b4ed  nmgrender::cmd_settracerradius (v_settracerradius_f)  (10 insns)
// 0x1003b512  nmgrender::cmd_gettracerradius (f_gettracerradius_v)  (11 insns)
// 0x1003b53c  nmgrender::cmd_setglowradius (v_setglowradius_f)  (10 insns)
// 0x1003b561  nmgrender::cmd_getglowradius (f_getglowradius_v)  (11 insns)
// 0x1003b58b  nmgrender::cmd_settracercolor (v_settracercolor_ffff)  (79 insns)
// 0x1003b67f  nmgrender::cmd_setsplattersize (v_setsplattersize_f)  (10 insns)
// 0x1003b6a4  nmgrender::cmd_getsplattersize (f_getsplattersize_v)  (11 insns)
// 0x1003b6ce  nmgrender::cmd_setsplattertime (v_setsplattertime_f)  (10 insns)
// 0x1003b6f3  nmgrender::cmd_getsplattertime (f_getsplattertime_v)  (11 insns)
// 0x1003b71d  nmgrender::cmd_setsplatterspeed (v_setsplatterspeed_f)  (10 insns)
// 0x1003b742  nmgrender::cmd_getsplatterspeed (f_getsplatterspeed_v)  (11 insns)
// 0x1003b76c  nmgrender::cmd_setsplattercolor (v_setsplattercolor_ffff)  (295 insns)
//   calls:   -> nAnimNode::vfunc_11

} // namespace re_nnomads
