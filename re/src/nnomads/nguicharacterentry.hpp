#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nguicharacterentry.asm
// Class: nguicharacterentry : public nguistandardmenuentry  (sizeof = 0x108 = 264 bytes)

#include <cstdint>

namespace re_nnomads {

struct nguicharacterentry_Layout {
    // +0x001c
    uint32_t field_0x001c;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00ac
    uint32_t field_0x00ac;
    // +0x00dc
    float field_0x00dc;
    // +0x00f0
    uint32_t field_0x00f0;
    // +0x00f4
    float field_0x00f4;
    // +0x00f8
    uint32_t field_0x00f8;
    // +0x00fc
    float field_0x00fc;
    // +0x0100
    float field_0x0100;
    // +0x0104
    float field_0x0104;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (2):
//   v_setposition_fff
//   v_setorientation_fff

// Methods (11):
// 0x1005e353  nguicharacterentry::n_init_nguicharacterentry  (15 insns)
//   strings: 'nguistandardmenuentry'
// 0x1005e37e  nguicharacterentry::n_fini_nguicharacterentry  (5 insns)
// 0x1005e390  nguicharacterentry::n_new_nguicharacterentry  (10 insns)
// 0x1005e41f  nguicharacterentry::vfunc_00  (78 insns)
//   calls:   -> nGuiStandardMenuEntry::~nGuiStandardMenuEntry()
//   consts:  f32=0.005555556, f32=3.141593, f32=180, f32=0.3183099
// 0x1005e509  nguicharacterentry::vfunc_14  (62 insns)
//   calls:   -> nGuiMenuEntry::Show, -> n3DNode::Rxyz
//   strings: 'entry/link'
// 0x1005e5cb  nguicharacterentry::vfunc_15  (13 insns)
//   calls:   -> nGuiMenuEntry::Hide
// 0x1005e5ea  nguicharacterentry::vfunc_19  (18 insns)
//   strings: 'entry'
// 0x1005e61b  nguicharacterentry::vfunc_20  (50 insns)
//   calls:   IAT: MSVCRT.dll!sprintf, -> nDataHandler::Load
//   strings: 'char_%s', 'entry', 'n3dnode', 'entry/link', 'nlinknode', '/data/char_%s/visual/character'
// 0x1005e6b5  nguicharacterentry::vfunc_17  (108 insns)
//   calls:   -> nGuiMenuEntry::Render
//   strings: 'entry', 'v_setposition_fff', 'fff_getposition_v', 'v_setorientation_fff', 'fff_getorientation_v'
// 0x1005e822  nguicharacterentry::cmd_setposition (v_setposition_fff)  (67 insns)
// 0x1005e8e5  nguicharacterentry::cmd_setorientation (v_setorientation_fff)  (65 insns)

} // namespace re_nnomads
