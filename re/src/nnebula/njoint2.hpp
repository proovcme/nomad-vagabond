#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/njoint2.asm
// Class: njoint2 : public n3dnode  (sizeof = 0x270 = 624 bytes)

#include <cstdint>

namespace re_nnebula {

struct njoint2_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0018
    uint32_t field_0x0018;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0120
    uint8_t field_0x0120;
    // +0x0124
    float field_0x0124;
    // +0x0128
    uint32_t field_0x0128;
    // +0x012c
    uint32_t field_0x012c;
    // +0x0130
    float field_0x0130;
    // +0x0134
    uint32_t field_0x0134;
    // +0x0138
    uint32_t field_0x0138;
    // +0x013c
    float field_0x013c;
    // +0x0140
    uint32_t field_0x0140;
    // +0x0144
    uint32_t field_0x0144;
    // +0x0148
    uint32_t field_0x0148;
    // +0x020c
    float field_0x020c;
    // +0x0210
    uint32_t field_0x0210;
    // +0x0214
    float field_0x0214;
    // +0x021c
    float field_0x021c;
    // +0x0220
    float field_0x0220;
    // +0x0224
    float field_0x0224;
    // +0x022c
    float field_0x022c;
    // +0x0230
    float field_0x0230;
    // +0x0234
    float field_0x0234;
    // +0x024c
    float field_0x024c;
    // +0x0250
    uint32_t field_0x0250;
    // +0x0254
    float field_0x0254;
    // +0x0258
    float field_0x0258;
    // +0x025c
    float field_0x025c;
    // +0x0260
    float field_0x0260;
    // +0x0264
    float field_0x0264;
    // +0x0268
    float field_0x0268;
    // +0x026c
    float field_0x026c;
};

// Script AddCmds (3):
//   v_otxyz_fff
//   v_osxyz_fff
//   v_oqxyzw_ffff

// Methods (6):
// 0x100205f3  njoint2::n_init_njoint2  (15 insns)
//   strings: 'n3dnode'
// 0x1002061e  njoint2::n_fini_njoint2  (5 insns)
// 0x10020630  njoint2::n_new_njoint2  (244 insns)
//   calls:   -> n3DNode::n3DNode(), -> nVisNode::~nVisNode(), -> n3DNode::Compute
//   strings: 'v_otxyz_fff', 'fff_getot_v', 'v_osxyz_fff', 'fff_getos_v', 'v_oqxyzw_ffff', 'ffff_getoq_v'
// 0x10020940  njoint2::cmd_otxyz (v_otxyz_fff)  (63 insns)
// 0x10020a08  njoint2::cmd_osxyz (v_osxyz_fff)  (63 insns)
// 0x10020ad0  njoint2::cmd_oqxyzw (v_oqxyzw_ffff)  (266 insns)
//   calls:   -> n3DNode::SaveCmds
//   consts:  f32=0, f32=1

} // namespace re_nnebula
