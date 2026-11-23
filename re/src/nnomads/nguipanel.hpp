#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nguipanel.asm
// Class: nguipanel : public nguimenu  (sizeof = 0x148 = 328 bytes)

#include <cstdint>

namespace re_nnomads {

struct nguipanel_Layout {
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
    // +0x00b8
    uint8_t field_0x00b8;
    // +0x00fc
    uint32_t field_0x00fc;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0120
    uint32_t field_0x0120;
    // +0x0124
    float field_0x0124;
    // +0x0128
    float field_0x0128;
    // +0x012c
    float field_0x012c;
    // +0x0130
    float field_0x0130;
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
};

// Methods (17):
// 0x1005f753  nguipanel::vfunc_21  (58 insns)
//   calls:   -> nRoot::GetHead
//   strings: 'entries', 'nguimenuentry', 'background', 'title', 'submenu'
// 0x10061ab7  nguipanel::n_init_nguipanel  (15 insns)
//   strings: 'nguimenu'
// 0x10061ae2  nguipanel::n_fini_nguipanel  (5 insns)
// 0x10061af4  nguipanel::n_new_nguipanel  (69 insns)
//   consts:  f32=-0.9, f32=0.05
//   strings: '/sys/servers/file', '/sys/servers/script'
// 0x10061bf4  nguipanel::vfunc_00  (75 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x10061d18  nguipanel::vfunc_20  (1 insns)
//   calls:   -> nguistandardmenu::vfunc_20
// 0x10061d1d  nguipanel::vfunc_27  (76 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: 'cursor', 'n3dnode', 'cursor/mesh', 'nmeshnode', 'data:if_menu.n/plane_1x1.nvx', 'cursor/tex', 'ntexarraynode', 'data:if_menu.n/%s'
// 0x10062116  nguipanel::vfunc_15  (8 insns)
//   calls:   -> nguistandardmenu::vfunc_15
// 0x100622a3  nguipanel::cmd_setrect (v_setrect_ffff)  (74 insns)
// 0x10062381  nguipanel::cmd_setspacing (v_setspacing_ff)  (46 insns)
// 0x10062404  nguipanel::cmd_setnumentriesx (v_setnumentriesx_i)  (11 insns)
// 0x10062428  nguipanel::cmd_getnumentriesx (i_getnumentriesx_v)  (14 insns)
// 0x10062453  nguipanel::cmd_setnumentriesy (v_setnumentriesy_i)  (11 insns)
// 0x1006247a  nguipanel::cmd_getnumentriesy (i_getnumentriesy_v)  (14 insns)
// 0x100624a8  nguipanel::cmd_setcommand (v_setcommand_s)  (11 insns)
// 0x100624cf  nguipanel::cmd_setmaxentries (v_setmaxentries_i)  (11 insns)
// 0x100624f6  nguipanel::cmd_getmaxentries (i_getmaxentries_v)  (14 insns)

} // namespace re_nnomads
