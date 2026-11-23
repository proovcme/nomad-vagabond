#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncommandlist.asm
// Class: ncommandlist : public nroot  (sizeof = 0x70 = 112 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncommandlist_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0018
    double field_0x0018;
    // +0x0024
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0040
    float field_0x0040;
    // +0x0044
    float field_0x0044;
    // +0x0048
    float field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x006c
    uint32_t field_0x006c;
    // +0x010c
    uint32_t field_0x010c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (6):
//   v_addcommand_bfffbfffsf
//   s_showcommand_i
//   v_settestcommand_s
//   s_gettestcommand_v
//   v_setadjusttype_s
//   s_getadjusttype_v

// Methods (14):
// 0x100426c6  ncommandlist::vfunc_00  (41 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1004272c  ncommandlist::vfunc_14  (12 insns)
// 0x10042746  ncommandlist::vfunc_16  (8 insns)
// 0x1004275d  ncommandlist::vfunc_15  (46 insns)
// 0x100427bf  ncommandlist::vfunc_20  (14 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x100427e3  ncommandlist::vfunc_19  (28 insns)
//   calls:   IAT: MSVCRT.dll!atof
// 0x1004282e  ncommandlist::vfunc_17  (27 insns)
//   strings: 'unknown', 'guide', 'reach', 'approach', 'follow', 'horimaneuver', 'maneuver'
// 0x10042877  ncommandlist::vfunc_18  (157 insns)
//   strings: 'maneuver', 'horimaneuver', 'follow', 'reach', 'approach', 'guide'
// 0x100429de  ncommandlist::n_init_ncommandlist  (51 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nroot', 'v_addcommand_bfffbfffsf', 's_showcommand_i', 'v_settestcommand_s', 's_gettestcommand_v', 'v_setadjusttype_s', 's_getadjusttype_v', 'cannot initialize commandlist class'
// 0x10042aaa  ncommandlist::n_fini_ncommandlist  (14 insns)
// 0x10042acd  ncommandlist::n_new_ncommandlist  (10 insns)
// 0x10042ae4  ncommandlist::n_version_ncommandlist  (2 insns)
// 0x10042aea  ncommandlist::vfunc_13  (176 insns)
//   calls:   -> n3DNode::vfunc_13, IAT: MSVCRT.dll!sprintf
//   consts:  f32=0
//   strings: 'shot', 'nothing'
// 0x10042ceb  ncommandlist::vfunc_11  (10 insns)
//   calls:   -> nAnimSequence::vfunc_31

} // namespace re_nnomads
