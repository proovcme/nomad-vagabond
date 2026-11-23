#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nlenseflare.asm
// Class: nlenseflare : public nvisnode  (sizeof = 0x220 = 544 bytes)

#include <cstdint>

namespace re_nnebula {

struct nlenseflare_Layout {
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
    // +0x0018
    float field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0030
    float field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x003c
    float field_0x003c;
    // +0x0058
    uint32_t field_0x0058;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00d8
    uint32_t field_0x00d8;
    // +0x0104
    uint32_t field_0x0104;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0120
    uint32_t field_0x0120;
    // +0x0154
    float field_0x0154;
    // +0x0158
    float field_0x0158;
    // +0x015c
    float field_0x015c;
    // +0x01e4
    uint32_t field_0x01e4;
    // +0x01e8
    uint32_t field_0x01e8;
    // +0x01ec
    float field_0x01ec;
    // +0x01f0
    float field_0x01f0;
    // +0x01f4
    float field_0x01f4;
    // +0x01f8
    float field_0x01f8;
    // +0x01fc
    uint8_t field_0x01fc;
    // +0x01fd
    uint8_t field_0x01fd;
    // +0x01fe
    uint8_t field_0x01fe;
    // +0x0200
    float field_0x0200;
    // +0x0204
    float field_0x0204;
    // +0x0208
    float field_0x0208;
    // +0x020c
    float field_0x020c;
    // +0x0210
    float field_0x0210;
    // +0x0214
    float field_0x0214;
    // +0x0218
    float field_0x0218;
    // +0x021c
    float field_0x021c;
};

// Methods (12):
// 0x1002ec4b  nlenseflare::n_init_nlenseflare  (15 insns)
//   strings: 'nvisnode'
// 0x1002ec76  nlenseflare::n_fini_nlenseflare  (5 insns)
// 0x1002ec88  nlenseflare::n_new_nlenseflare  (10 insns)
// 0x1002eca2  nlenseflare::n_version_nlenseflare  (1011 insns)
//   calls:   -> nVisNode::nVisNode(), -> nVisNode::~nVisNode(), -> nVisNode::Attach, -> nVisNode::Compute
//   consts:  f32=0.5, f32=-1, f32=1, f32=0.75, f32=255, f32=0, f32=0.25, f32=4
//   strings: '/sys/servers/gfx', '/sys/servers/specialfx', 'nlenseflare_ibuf'
// 0x1002fac8  nlenseflare::cmd_setblindcolor (v_setblindcolor_ffff)  (35 insns)
// 0x1002fb31  nlenseflare::cmd_setflaresizeat (v_setflaresizeat_if)  (19 insns)
// 0x1002fb63  nlenseflare::cmd_setflareposat (v_setflareposat_if)  (19 insns)
// 0x1002fb95  nlenseflare::cmd_setflarecolorat (v_setflarecolorat_iffff)  (33 insns)
// 0x1002fbf5  nlenseflare::cmd_endflares (v_endflares_v)  (111 insns)
// 0x1002fd26  nlenseflare::cmd_getnumberofflares (i_getnumberofflares_v)  (14 insns)
// 0x1002fd51  nlenseflare::cmd_getflaresizeat (f_getflaresizeat_i)  (23 insns)
// 0x1002fd94  nlenseflare::cmd_getflareposat (f_getflareposat_i)  (307 insns)
//   calls:   -> nVisNode::SaveCmds

} // namespace re_nnebula
