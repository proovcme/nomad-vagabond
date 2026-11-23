#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nGuiBar.asm
// Class: nGuiBar : public nroot  (sizeof = 0x1ac = 428 bytes)

#include <cstdint>

namespace re_nnomads {

struct nGuiBar_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0068
    uint32_t field_0x0068;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0084
    uint32_t field_0x0084;
    // +0x0098
    uint32_t field_0x0098;
    // +0x00bc
    uint32_t field_0x00bc;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x0104
    uint32_t field_0x0104;
    // +0x011c
    uint8_t field_0x011c;
    // +0x0120
    float field_0x0120;
    // +0x0124
    float field_0x0124;
    // +0x0128
    float field_0x0128;
    // +0x012c
    float field_0x012c;
    // +0x0130
    float field_0x0130;
    // +0x0134
    uint32_t field_0x0134;
    // +0x0138
    uint32_t field_0x0138;
    // +0x013c
    uint32_t field_0x013c;
    // +0x0140
    uint32_t field_0x0140;
    // +0x0144
    uint32_t field_0x0144;
    // +0x0148
    uint32_t field_0x0148;
    // +0x014c
    uint32_t field_0x014c;
    // +0x0164
    uint32_t field_0x0164;
    // +0x0168
    uint32_t field_0x0168;
    // +0x016c
    uint32_t field_0x016c;
    // +0x0170
    uint32_t field_0x0170;
    // +0x0174
    uint32_t field_0x0174;
    // +0x0178
    uint32_t field_0x0178;
    // +0x017c
    float field_0x017c;
    // +0x0180
    float field_0x0180;
    // +0x0184
    float field_0x0184;
    // +0x0188
    float field_0x0188;
    // +0x018c
    float field_0x018c;
    // +0x0190
    float field_0x0190;
    // +0x0194
    float field_0x0194;
    // +0x0198
    float field_0x0198;
    // +0x019c
    float field_0x019c;
    // +0x01a0
    float field_0x01a0;
    // +0x01a4
    float field_0x01a4;
    // +0x01a8
    float field_0x01a8;
};

// Script AddCmds (19):
//   v_openmenu_s
//   v_closemenu_v
//   v_cancelmenu_v
//   v_reset_v
//   b_menuopen_v
//   v_showinfoscreen_s
//   v_updateinfoscreen_f
//   v_hideinfoscreen_v
//   v_showbar_s
//   v_hidebar_s
//   v_showallbars_v
//   v_hideallbars_v
//   v_showtextmessage_s
//   v_showuserinfo_v
//   v_hideuserinfo_v
//   v_showcredits_sf
//   b_creditsshown_v
//   v_showhelpscreen_v
//   v_hidehelpscreen_v

// Methods (74):
// 0x10064847  nGuiBar::nGuiBar()  (137 insns)
//   calls:   -> nRoot::nRoot()
// 0x10064a8d  nGuiBar::operator=  (114 insns)
//   calls:   -> nRoot::operator=
// 0x10064bf1  nGuiBar::vfunc_00  (144 insns)
//   calls:   -> nGuiBar::~nGuiBar()
//   strings: 'v_openmenu_s', 'v_closemenu_v', 'v_cancelmenu_v', 'v_reset_v', 'b_menuopen_v', 'v_showinfoscreen_s', 'v_updateinfoscreen_f', 'v_hideinfoscreen_v'
// 0x10064fac  nGuiBar::cmd_show (v_show_v)  (3 insns)
// 0x10077487  nGuiBar::n_init_nguibar  (15 insns)
//   strings: 'nroot'
// 0x100774b2  nGuiBar::n_fini_nguibar  (5 insns)
// 0x100774c4  nGuiBar::n_new_nguibar  (10 insns)
//   calls:   -> nGuiBar::nGuiBar()
// 0x100774de  nGuiBar::nGuiBar()  (200 insns)
//   strings: '/sys/servers/sgraph2', '/sys/servers/channel', '/sys/servers/gfx'
// 0x100777a7  nGuiBar::~nGuiBar()  (33 insns)
// 0x10077818  nGuiBar::SetVisual  (4 insns)
// 0x1007782a  nGuiBar::GetVisual  (6 insns)
// 0x10077841  nGuiBar::SetLeftVisual  (4 insns)
// 0x10077853  nGuiBar::GetLeftVisual  (6 insns)
// 0x1007786a  nGuiBar::SetMiddleVisual  (4 insns)
// 0x1007787c  nGuiBar::GetMiddleVisual  (6 insns)
// 0x10077893  nGuiBar::SetRightVisual  (4 insns)
// 0x100778a5  nGuiBar::GetRightVisual  (6 insns)
// 0x100778bc  nGuiBar::Show  (2 insns)
// 0x100778c4  nGuiBar::Hide  (2 insns)
// 0x100778cc  nGuiBar::Visible  (2 insns)
// 0x100778d3  nGuiBar::Render  (302 insns)
// 0x10077c83  nGuiBar::SetCurrent  (3 insns)
// 0x10077c90  nGuiBar::GetCurrent  (2 insns)
// 0x10077c97  nGuiBar::SetMax  (35 insns)
//   consts:  f32=0, f32=1
// 0x10077cf3  nGuiBar::GetMax  (2 insns)
// 0x10077cfa  nGuiBar::SetOptional  (3 insns)
// 0x10077d07  nGuiBar::GetOptional  (2 insns)
// 0x10077d0e  nGuiBar::SetBaseMax  (3 insns)
// 0x10077d1b  nGuiBar::GetBaseMax  (2 insns)
// 0x10077d22  nGuiBar::SetExtension  (3 insns)
// 0x10077d2f  nGuiBar::GetExtension  (2 insns)
// 0x10077d36  nGuiBar::SetPos  (10 insns)
// 0x10077d4a  nGuiBar::GetPos  (2 insns)
// 0x10077d51  nGuiBar::SetLeftPos  (10 insns)
// 0x10077d65  nGuiBar::GetLeftPos  (2 insns)
// 0x10077d6c  nGuiBar::SetMiddlePos  (10 insns)
// 0x10077d80  nGuiBar::GetMiddlePos  (2 insns)
// 0x10077d87  nGuiBar::SetMiddleOffset  (10 insns)
// 0x10077d9b  nGuiBar::GetMiddleOffset  (2 insns)
// 0x10077da2  nGuiBar::SetRightPos  (10 insns)
// 0x10077db6  nGuiBar::GetRightPos  (2 insns)
// 0x10077dbd  nGuiBar::SetScale  (10 insns)
// 0x10077dd1  nGuiBar::GetScale  (2 insns)
// 0x10077dd8  nGuiBar::SetLeftScale  (10 insns)
// 0x10077dec  nGuiBar::GetLeftScale  (2 insns)
// 0x10077df3  nGuiBar::SetMiddleScale  (10 insns)
// 0x10077e07  nGuiBar::GetMiddleScale  (2 insns)
// 0x10077e0e  nGuiBar::SetRightScale  (10 insns)
// 0x10077e22  nGuiBar::GetRightScale  (2 insns)
// 0x100781a0  nGuiBar::cmd_getvisual (o_getvisual_v)  (14 insns)
// 0x100781cb  nGuiBar::cmd_hide (v_hide_v)  (3 insns)
// 0x100781d4  nGuiBar::cmd_visible (b_visible_v)  (3 insns)
// 0x100781dd  nGuiBar::cmd_setcurrent (v_setcurrent_f)  (13 insns)
// 0x10078205  nGuiBar::cmd_getcurrent (f_getcurrent_v)  (14 insns)
// 0x10078258  nGuiBar::cmd_setbasemax (v_setbasemax_f)  (13 insns)
// 0x10078283  nGuiBar::cmd_getbasemax (f_getbasemax_v)  (14 insns)
// 0x100782b1  nGuiBar::cmd_setextension (v_setextension_f)  (13 insns)
// 0x100782dc  nGuiBar::cmd_getextension (f_getextension_v)  (14 insns)
// 0x1007830a  nGuiBar::cmd_setoptional (v_setoptional_f)  (13 insns)
// 0x10078332  nGuiBar::cmd_getoptional (f_getoptional_v)  (14 insns)
// 0x10078381  nGuiBar::cmd_getleftvisual (o_getleftvisual_v)  (14 insns)
// 0x100783ac  nGuiBar::cmd_setmiddlevisual (v_setmiddlevisual_s)  (11 insns)
// 0x100783d0  nGuiBar::cmd_getmiddleviusal (o_getmiddleviusal_v)  (14 insns)
// 0x100783fb  nGuiBar::cmd_setrightvisual (v_setrightvisual_s)  (11 insns)
// 0x1007841f  nGuiBar::cmd_getrightvisual (o_getrightvisual_v)  (14 insns)
// 0x1007844a  nGuiBar::cmd_setpos (v_setpos_fff)  (69 insns)
// 0x10078513  nGuiBar::cmd_setleftpos (v_setleftpos_fff)  (69 insns)
// 0x100785dc  nGuiBar::cmd_setmiddlepos (v_setmiddlepos_fff)  (69 insns)
// 0x100786a5  nGuiBar::cmd_setmiddleoffset (v_setmiddleoffset_fff)  (69 insns)
// 0x1007876e  nGuiBar::cmd_setrightpos (v_setrightpos_fff)  (69 insns)
// 0x10078837  nGuiBar::cmd_setscale (v_setscale_fff)  (69 insns)
// 0x10078900  nGuiBar::cmd_setleftscale (v_setleftscale_fff)  (69 insns)
// 0x100789c9  nGuiBar::cmd_setmiddlescale (v_setmiddlescale_fff)  (69 insns)
// 0x10078a92  nGuiBar::cmd_setrightscale (v_setrightscale_fff)  (69 insns)

} // namespace re_nnomads
