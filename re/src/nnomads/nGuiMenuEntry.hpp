#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nGuiMenuEntry.asm
// Class: nGuiMenuEntry : public nroot  (sizeof = 0xd0 = 208 bytes)

#include <cstdint>

namespace re_nnomads {

struct nGuiMenuEntry_Layout {
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
    // +0x0068
    uint32_t field_0x0068;
    // +0x007c
    uint32_t field_0x007c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0088
    uint32_t field_0x0088;
    // +0x008c
    uint32_t field_0x008c;
    // +0x0090
    uint32_t field_0x0090;
    // +0x0094
    float field_0x0094;
    // +0x0098
    float field_0x0098;
    // +0x009c
    float field_0x009c;
    // +0x00a0
    float field_0x00a0;
    // +0x00a4
    float field_0x00a4;
    // +0x00a8
    float field_0x00a8;
    // +0x00ac
    uint32_t field_0x00ac;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00b4
    uint32_t field_0x00b4;
    // +0x00bc
    uint8_t field_0x00bc;
    // +0x00c0
    float field_0x00c0;
    // +0x00c4
    float field_0x00c4;
    // +0x00c8
    float field_0x00c8;
    // +0x00cc
    float field_0x00cc;
};

// Script AddCmds (34):
//   v_setcommand_s
//   s_getcommand_v
//   v_execute_v
//   v_setrect_ffff
//   v_show_v
//   v_hide_v
//   v_setvisual_s
//   o_getvisual_v
//   v_setleftvisual_s
//   o_getleftvisual_v
//   v_setmiddlevisual_s
//   o_getmiddleviusal_v
//   v_setrightvisual_s
//   o_getrightvisual_v
//   b_visible_v
//   v_setcurrent_f
//   f_getcurrent_v
//   v_setmax_f
//   f_getmax_v
//   v_setbasemax_f
//   f_getbasemax_v
//   v_setextension_f
//   f_getextension_v
//   v_setoptional_f
//   f_getoptional_v
//   v_setpos_fff
//   v_setleftpos_fff
//   v_setmiddlepos_fff
//   v_setmiddleoffset_fff
//   v_setrightpos_fff
//   v_setscale_fff
//   v_setleftscale_fff
//   v_setmiddlescale_fff
//   v_setrightscale_fff

// Methods (29):
// 0x1005d273  nGuiMenuEntry::n_init_nguimenuentry  (15 insns)
//   strings: 'nroot'
// 0x1005d29e  nGuiMenuEntry::n_fini_nguimenuentry  (5 insns)
// 0x1005d2b0  nGuiMenuEntry::n_new_nguimenuentry  (10 insns)
//   calls:   -> nGuiMenuEntry::nGuiMenuEntry()
// 0x1005d2ca  nGuiMenuEntry::nGuiMenuEntry()  (94 insns)
//   calls:   -> nGuiMenuEntry::SetRect
//   consts:  f32=-0.5, f32=0.5
//   strings: '/sys/servers/script', '/sys/servers/sgraph2', '/sys/servers/gfx'
// 0x1005d405  nGuiMenuEntry::~nGuiMenuEntry()  (35 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1005d463  nGuiMenuEntry::SetCommand  (19 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1005d4a4  nGuiMenuEntry::GetCommand  (13 insns)
// 0x1005d4c4  nGuiMenuEntry::HasCommand  (4 insns)
//   calls:   -> nGuiMenuEntry::GetCommand
// 0x1005d4cf  nGuiMenuEntry::Execute  (27 insns)
//   calls:   -> nGuiMenuEntry::GetCommand
// 0x1005d50d  nGuiMenuEntry::SetRect  (61 insns)
//   consts:  f32=0.5, f32=1
// 0x1005d5e0  nGuiMenuEntry::GetRect  (13 insns)
// 0x1005d613  nGuiMenuEntry::Show  (12 insns)
// 0x1005d62f  nGuiMenuEntry::Hide  (12 insns)
//   strings: 'entry'
// 0x1005d650  nGuiMenuEntry::Exists  (2 insns)
// 0x1005d653  nGuiMenuEntry::IsVisible  (2 insns)
// 0x1005d65a  nGuiMenuEntry::Render  (29 insns)
//   strings: 'submenu', 'nguimenu'
// 0x1005d6a2  nGuiMenuEntry::GetSceneGraph  (2 insns)
// 0x1005d6aa  nGuiMenuEntry::SetVisible  (3 insns)
// 0x1005d6b7  nGuiMenuEntry::InSensitiveArea  (44 insns)
//   strings: 'submenu'
// 0x1005d727  nGuiMenuEntry::nGuiMenuEntry()  (73 insns)
//   calls:   -> nRoot::nRoot()
// 0x1005d858  nGuiMenuEntry::operator=  (69 insns)
//   calls:   -> nRoot::operator=, IAT: nkernel.dll!n_free
// 0x1005d931  nGuiMenuEntry::vfunc_00  (84 insns)
//   calls:   -> nGuiMenuEntry::~nGuiMenuEntry()
//   strings: 'v_setcommand_s', 's_getcommand_v', 'v_execute_v', 'v_setrect_ffff', 'ffff_getrect_v', 'v_show_v', 'v_hide_v'
// 0x1005da41  nGuiMenuEntry::cmd_setcommand (v_setcommand_s)  (10 insns)
//   calls:   -> nGuiMenuEntry::SetCommand
// 0x1005da64  nGuiMenuEntry::cmd_getcommand (s_getcommand_v)  (14 insns)
//   calls:   -> nGuiMenuEntry::GetCommand
// 0x1005da8e  nGuiMenuEntry::cmd_execute (v_execute_v)  (2 insns)
//   calls:   -> nGuiMenuEntry::Execute
// 0x1005da97  nGuiMenuEntry::cmd_setrect (v_setrect_ffff)  (74 insns)
//   calls:   -> nGuiMenuEntry::SetRect, -> nGuiMenuEntry::GetRect
// 0x1005db75  nGuiMenuEntry::cmd_hide (v_hide_v)  (3 insns)
// 0x10064fd7  nGuiMenuEntry::cmd_show (v_show_v)  (3 insns)
// 0x10077e29  nGuiMenuEntry::GetGfxServer  (205 insns)
//   strings: 'v_setvisual_s', 'o_getvisual_v', 'v_setleftvisual_s', 'o_getleftvisual_v', 'v_setmiddlevisual_s', 'o_getmiddleviusal_v', 'v_setrightvisual_s', 'o_getrightvisual_v'

} // namespace re_nnomads
