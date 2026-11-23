#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nfiremachinegun.asm
// Class: nfiremachinegun : public nfireweapon  (sizeof = 0xb8 = 184 bytes)

#include <cstdint>

namespace re_nnomads {

struct nfiremachinegun_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0074
    float field_0x0074;
    // +0x0078
    float field_0x0078;
    // +0x007c
    float field_0x007c;
    // +0x0080
    float field_0x0080;
    // +0x0084
    float field_0x0084;
    // +0x0088
    float field_0x0088;
    // +0x008c
    float field_0x008c;
    // +0x0090
    uint8_t field_0x0090;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00b4
    uint32_t field_0x00b4;
    // +0x0110
    uint32_t field_0x0110;
    // +0x1168
    double field_0x1168;
};

// Script AddCmds (18):
//   v_setmgradius_f
//   f_getmgradius_v
//   v_setmgendradius_f
//   f_getmgendradius_v
//   f_getchangemgradius_v
//   v_setshotdistance_f
//   f_getshotdistance_v
//   v_setmgspeed_f
//   f_getmgspeed_v
//   v_setdamage_f
//   f_getdamage_v
//   s_getdamagetype_v
//   v_setdamagetype_s
//   v_setreach_f
//   f_getreach_v
//   v_beginbarrels_i
//   v_setbarrelpos_ifff
//   v_endbarrels_v

// Methods (18):
// 0x100324ac  nfiremachinegun::vfunc_19  (20 insns)
//   calls:   -> nContainer::IsHandControl
//   strings: 'fire'
// 0x10033e38  nfiremachinegun::n_init_nfiremachinegun  (15 insns)
//   strings: 'nfireweapon'
// 0x10033e63  nfiremachinegun::n_fini_nfiremachinegun  (5 insns)
// 0x10033e75  nfiremachinegun::n_new_nfiremachinegun  (10 insns)
// 0x10033e8f  nfiremachinegun::n_version_nfiremachinegun  (42 insns)
//   strings: '/sys/servers/math'
// 0x10033f1a  nfiremachinegun::vfunc_00  (30 insns)
// 0x10033f69  nfiremachinegun::vfunc_16  (67 insns)
//   calls:   -> nfireweapon::vfunc_16
// 0x10034045  nfiremachinegun::vfunc_17  (10 insns)
//   calls:   -> nfiremissile::vfunc_17
// 0x10034062  nfiremachinegun::vfunc_20  (281 insns)
//   calls:   -> nfiremissile::vfunc_20, -> nContainer::GetMatrix44
//   consts:  f32=1
// 0x10034393  nfiremachinegun::vfunc_18  (231 insns)
//   calls:   -> nfireweapon::vfunc_18
//   strings: 'v_setmgradius_f', 'f_getmgradius_v', 'v_setmgendradius_f', 'f_getmgendradius_v', 'f_getchangemgradius_v', 'v_setshotdistance_f', 'f_getshotdistance_v', 'v_setmgspeed_f'
// 0x100346d5  nfiremachinegun::cmd_setdamagetype (v_setdamagetype_s)  (14 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2
// 0x10034704  nfiremachinegun::cmd_getdamagetype (s_getdamagetype_v)  (11 insns)
// 0x1003472a  nfiremachinegun::cmd_setreach (v_setreach_f)  (10 insns)
// 0x1003474f  nfiremachinegun::cmd_getreach (f_getreach_v)  (11 insns)
// 0x10034779  nfiremachinegun::cmd_beginbarrels (v_beginbarrels_i)  (10 insns)
// 0x1003479c  nfiremachinegun::cmd_setbarrelpos (v_setbarrelpos_ifff)  (33 insns)
// 0x100347fe  nfiremachinegun::cmd_endbarrels (v_endbarrels_v)  (1 insns)
// 0x100347ff  nfiremachinegun::vfunc_11  (274 insns)
//   calls:   -> ndistancechecker::vfunc_11

} // namespace re_nnomads
