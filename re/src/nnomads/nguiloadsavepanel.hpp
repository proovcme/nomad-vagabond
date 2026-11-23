#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nguiloadsavepanel.asm
// Class: nguiloadsavepanel : public nguipanel  (sizeof = 0x190 = 400 bytes)

#include <cstdint>

namespace re_nnomads {

struct nguiloadsavepanel_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0068
    uint32_t field_0x0068;
    // +0x008c
    uint32_t field_0x008c;
    // +0x0090
    uint32_t field_0x0090;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00b4
    uint32_t field_0x00b4;
    // +0x00b9
    uint8_t field_0x00b9;
    // +0x00bc
    uint32_t field_0x00bc;
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
    uint32_t field_0x00dc;
    // +0x00e4
    float field_0x00e4;
    // +0x00ec
    uint8_t field_0x00ec;
    // +0x0120
    uint32_t field_0x0120;
    // +0x0124
    float field_0x0124;
    // +0x0128
    float field_0x0128;
    // +0x012c
    float field_0x012c;
    // +0x0130
    uint32_t field_0x0130;
    // +0x0134
    float field_0x0134;
    // +0x0138
    float field_0x0138;
    // +0x013c
    uint8_t field_0x013c;
    // +0x0140
    uint8_t field_0x0140;
    // +0x0144
    uint32_t field_0x0144;
    // +0x0148
    uint32_t field_0x0148;
    // +0x014c
    uint32_t field_0x014c;
    // +0x0150
    uint32_t field_0x0150;
    // +0x0154
    uint32_t field_0x0154;
    // +0x0158
    uint32_t field_0x0158;
    // +0x015c
    uint32_t field_0x015c;
    // +0x016c
    uint32_t field_0x016c;
    // +0x0174
    uint32_t field_0x0174;
    // +0x0178
    uint32_t field_0x0178;
    // +0x0188
    uint32_t field_0x0188;
    // +0x018c
    uint32_t field_0x018c;
};

// Script AddCmds (30):
//   v_up_v
//   v_down_v
//   v_left_v
//   v_right_v
//   v_open_v
//   v_close_v
//   v_settitle_s
//   s_gettitle_v
//   v_settitlerect_ffff
//   v_setmouseoverselect_b
//   b_getmouseoverselect_v
//   v_setabortable_b
//   b_isabortable_v
//   v_setbackground_s
//   s_getbackground_v
//   v_setcancelselects_b
//   b_getcancelselects_v
//   v_setrect_ffff
//   v_setspacing_ff
//   v_setnumentriesx_i
//   i_getnumentriesx_v
//   v_setnumentriesy_i
//   i_getnumentriesy_v
//   v_setcommand_s
//   v_setmaxentries_i
//   i_getmaxentries_v
//   v_setdirectory_s
//   s_getdirectory_v
//   v_setlastsavedslot_i
//   i_getlastsavedslot_v

// Methods (34):
// 0x1005f053  nguiloadsavepanel::vfunc_14  (23 insns)
//   calls:   -> nRoot::GetHead
//   strings: 'entries'
// 0x1005f410  nguiloadsavepanel::vfunc_18  (100 insns)
//   calls:   -> nRoot::GetHead
//   strings: 'entries', 'nguimenuentry', 'submenu', 'nguimenu'
// 0x1005f554  nguiloadsavepanel::vfunc_19  (77 insns)
//   calls:   -> nRoot::GetHead, -> nRoot::GetPred
//   strings: 'entries', 'submenu', 'nguimenu', 'nguimenuentry'
// 0x1005f80d  nguiloadsavepanel::vfunc_24  (3 insns)
// 0x1005f81a  nguiloadsavepanel::vfunc_25  (217 insns)
//   calls:   -> nRoot::GetHead, IAT: MSVCRT.dll!sprintf
//   strings: 'nguimenuentry', 'cursor', 'title', 'n3dnode', 'title/mesh', 'nmeshnode', 'data:if_menu.n/plane_1x1.nvx', 'title/tex'
// 0x1005fadf  nguiloadsavepanel::vfunc_28  (19 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1005fb20  nguiloadsavepanel::vfunc_29  (450 insns)
//   calls:   -> nRoot::GetHead, IAT: nkernel.dll!n_free
//   consts:  f32=0.5
//   strings: 'entries', 'submenu', 'v_up_v', 'v_down_v', 'v_left_v', 'v_right_v', 'v_open_v', 'v_close_v'
// 0x10061cf0  nguiloadsavepanel::vfunc_30  (3 insns)
// 0x10061cfd  nguiloadsavepanel::vfunc_31  (2 insns)
// 0x10061d04  nguiloadsavepanel::vfunc_32  (3 insns)
// 0x10061d11  nguiloadsavepanel::vfunc_33  (2 insns)
// 0x10061e19  nguiloadsavepanel::vfunc_16  (53 insns)
//   calls:   -> nRoot::GetHead, -> nRoot::GetPred
//   strings: 'entries', 'nguimenuentry'
// 0x10061ea8  nguiloadsavepanel::vfunc_17  (70 insns)
//   calls:   -> nRoot::GetHead
//   strings: 'entries', 'nguimenuentry'
// 0x10061f59  nguiloadsavepanel::vfunc_36  (19 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x10061f9a  nguiloadsavepanel::vfunc_26  (13 insns)
// 0x10061fb9  nguiloadsavepanel::vfunc_37  (13 insns)
// 0x10061fd9  nguiloadsavepanel::vfunc_38  (107 insns)
//   calls:   -> nRoot::GetHead, -> nGuiMenuEntry::SetRect
//   consts:  f32=0.5
//   strings: 'entries'
// 0x1006212a  nguiloadsavepanel::vfunc_23  (31 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: '%s %s'
// 0x10062188  nguiloadsavepanel::vfunc_34  (3 insns)
// 0x10062195  nguiloadsavepanel::vfunc_35  (65 insns)
//   strings: 'v_setrect_ffff', 'ffff_getrect_v', 'v_setspacing_ff', 'ff_getspacing_v', 'v_setnumentriesx_i', 'i_getnumentriesx_v', 'v_setnumentriesy_i', 'i_getnumentriesy_v'
// 0x10062b87  nguiloadsavepanel::n_init_nguiloadsavepanel  (15 insns)
//   strings: 'nguipanel'
// 0x10062bb2  nguiloadsavepanel::n_fini_nguiloadsavepanel  (5 insns)
// 0x10062bc4  nguiloadsavepanel::n_new_nguiloadsavepanel  (51 insns)
//   strings: '/sys/servers/file2', '/sys/servers/script'
// 0x10062c7d  nguiloadsavepanel::vfunc_00  (46 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x10062d07  nguiloadsavepanel::vfunc_39  (19 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x10062d48  nguiloadsavepanel::vfunc_40  (18 insns)
// 0x10062d7c  nguiloadsavepanel::vfunc_20  (118 insns)
//   calls:   IAT: MSVCRT.dll!sprintf, IAT: MSVCRT.dll!atoi, -> nguistandardmenu::vfunc_20
//   strings: 'entries', 'nguimenuentry', 'nroot', 'slot%d', 'nguiloadsaveentry', 'home:save/lastsave.dat'
// 0x10062ec4  nguiloadsavepanel::vfunc_27  (124 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: 'cursor', 'n3dnode', 'cursor/mesh', 'nmeshnode', 'data:if_menu.n/plane_1x1.nvx', 'cursor/tex', 'ntexarraynode', 'data:if_menu.n/%s'
// 0x10063074  nguiloadsavepanel::vfunc_21  (13 insns)
//   calls:   -> nguipanel::vfunc_21
// 0x1006309b  nguiloadsavepanel::vfunc_15  (117 insns)
//   calls:   -> nguipanel::vfunc_15, -> nRoot::GetHead
//   strings: 'entries', 'v_setdirectory_s', 's_getdirectory_v', 'v_setlastsavedslot_i', 'i_getlastsavedslot_v'
// 0x10063212  nguiloadsavepanel::cmd_setdirectory (v_setdirectory_s)  (11 insns)
// 0x10063239  nguiloadsavepanel::cmd_getdirectory (s_getdirectory_v)  (15 insns)
// 0x10063266  nguiloadsavepanel::cmd_setlastsavedslot (v_setlastsavedslot_i)  (10 insns)
// 0x10063289  nguiloadsavepanel::cmd_getlastsavedslot (i_getlastsavedslot_v)  (13 insns)

} // namespace re_nnomads
