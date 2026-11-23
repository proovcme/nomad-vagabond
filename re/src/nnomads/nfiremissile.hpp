#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nfiremissile.asm
// Class: nfiremissile : public nfireweapon  (sizeof = 0x2c8 = 712 bytes)

#include <cstdint>

namespace re_nnomads {

struct nfiremissile_Layout {
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
    uint32_t field_0x0024;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    uint8_t field_0x0058;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0258
    double field_0x0258;
    // +0x0260
    float field_0x0260;
    // +0x0268
    uint32_t field_0x0268;
    // +0x0278
    float field_0x0278;
    // +0x027c
    uint32_t field_0x027c;
    // +0x0280
    float field_0x0280;
    // +0x0b44
    float field_0x0b44;
    // +0x0b48
    float field_0x0b48;
    // +0x0b4c
    float field_0x0b4c;
    // +0x0b5c
    float field_0x0b5c;
    // +0x0eb0
    uint8_t field_0x0eb0;
    // +0x0eb4
    float field_0x0eb4;
    // +0x1138
    uint8_t field_0x1138;
    // +0x1139
    uint8_t field_0x1139;
    // +0x1140
    double field_0x1140;
};

// Script AddCmds (15):
//   v_setshotdelay_f
//   f_getshotdelay_v
//   v_setstartspeed_f
//   f_getstartspeed_v
//   v_setshotdirection_fff
//   v_setweaponproto_s
//   s_getweaponproto_v
//   b_addweapon_fff
//   v_deleteweapons_v
//   v_setnummissiles_i
//   i_getnummissiles_v
//   v_setspreadangle_f
//   f_getspreadangle_v
//   v_setvirtualorigin_fff
//   v_getvirtualorigin_fff

// Methods (27):
// 0x1003245b  nfiremissile::vfunc_17  (28 insns)
//   calls:   -> nStateNode::NetImport
// 0x100324e7  nfiremissile::vfunc_20  (30 insns)
//   calls:   -> nContainer::IsHandControl
// 0x10032715  nfiremissile::n_init_nfiremissile  (15 insns)
//   strings: 'nfireweapon'
// 0x10032740  nfiremissile::n_fini_nfiremissile  (5 insns)
// 0x10032752  nfiremissile::n_new_nfiremissile  (10 insns)
// 0x1003276c  nfiremissile::n_version_nfiremissile  (51 insns)
// 0x1003280c  nfiremissile::vfunc_00  (12 insns)
// 0x1003282e  nfiremissile::vfunc_16  (15 insns)
//   calls:   -> nfireweapon::vfunc_16
// 0x1003285c  nfiremissile::vfunc_21  (8 insns)
// 0x1003286f  nfiremissile::vfunc_22  (25 insns)
// 0x100328b1  nfiremissile::vfunc_18  (1209 insns)
//   calls:   -> nStateNode::GetClan, -> nContainer::GetDirection, -> nContainer::GetPosition, -> nContainer::SetPosition, -> nContainer::SetDirection, -> nContainer::IsHandControl, -> nStateNode::ThrowEvent, -> nfireweapon::vfunc_18, IAT: nkernel.dll!n_printf
//   consts:  f32=-1, f32=100000, f32=6.283185
//   strings: 'normal', 'v_setshotdelay_f', 'f_getshotdelay_v', 'v_setstartspeed_f', 'f_getstartspeed_v', 'v_setshotdirection_fff', 'fff_getshotdirection_v', 'v_setweaponproto_s'
// 0x1003378a  nfiremissile::cmd_setshotdelay (v_setshotdelay_f)  (10 insns)
// 0x100337af  nfiremissile::cmd_getshotdelay (f_getshotdelay_v)  (11 insns)
// 0x100337d9  nfiremissile::cmd_setnummissiles (v_setnummissiles_i)  (10 insns)
// 0x100337fd  nfiremissile::cmd_getnummissiles (i_getnummissiles_v)  (13 insns)
// 0x10033829  nfiremissile::cmd_setspreadangle (v_setspreadangle_f)  (12 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x1003385a  nfiremissile::cmd_getspreadangle (f_getspreadangle_v)  (13 insns)
//   consts:  f32=180, f32=0.3183099
// 0x10033890  nfiremissile::cmd_setstartspeed (v_setstartspeed_f)  (10 insns)
// 0x100338b5  nfiremissile::cmd_getstartspeed (f_getstartspeed_v)  (11 insns)
// 0x100338df  nfiremissile::cmd_setshotdirection (v_setshotdirection_fff)  (30 insns)
// 0x1003392f  nfiremissile::cmd_setvirtualorigin (v_setvirtualorigin_fff)  (69 insns)
// 0x100339e8  nfiremissile::cmd_getvirtualorigin (v_getvirtualorigin_fff)  (39 insns)
// 0x10033a51  nfiremissile::cmd_setweaponproto (v_setweaponproto_s)  (29 insns)
// 0x10033a99  nfiremissile::cmd_getweaponproto (s_getweaponproto_v)  (11 insns)
// 0x10033abd  nfiremissile::cmd_addweapon (b_addweapon_fff)  (40 insns)
// 0x10033b32  nfiremissile::cmd_deleteweapons (v_deleteweapons_v)  (3 insns)
// 0x10033b3b  nfiremissile::vfunc_11  (262 insns)
//   calls:   -> ndistancechecker::vfunc_11
//   consts:  f32=180, f32=0.3183099

} // namespace re_nnomads
