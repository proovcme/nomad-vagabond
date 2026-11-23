#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nstatewatch.asm
// Class: nstatewatch : public nservice  (sizeof = 0x90 = 144 bytes)

#include <cstdint>

namespace re_nnomads {

struct nstatewatch_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0058
    uint32_t field_0x0058;
    // +0x0064
    uint32_t field_0x0064;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0078
    double field_0x0078;
    // +0x0080
    float field_0x0080;
    // +0x0084
    uint32_t field_0x0084;
    // +0x0088
    uint32_t field_0x0088;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0140
    double field_0x0140;
    // +0x0179
    uint8_t field_0x0179;
    // +0x030c
    uint32_t field_0x030c;
    // +0x0e38
    uint8_t field_0x0e38;
};

// Script AddCmds (12):
//   v_settimeout_f
//   f_gettimeout_v
//   v_addactivatecommand_s
//   v_deleteactivatecommands_v
//   v_adddeactivatecommand_s
//   v_deletedeactivatecommands_v
//   v_setwatchcommand_s
//   s_getwatchcommand_v
//   v_setrandomtimemodifier_f
//   f_gettimemodifierpercentage_v
//   v_setcommandlistpath_s
//   s_getcommandlistpath_v

// Methods (26):
// 0x10041c73  nstatewatch::n_init_nstatewatch  (15 insns)
//   strings: 'nservice'
// 0x10041c9e  nstatewatch::n_fini_nstatewatch  (5 insns)
// 0x10041cb0  nstatewatch::n_new_nstatewatch  (10 insns)
// 0x10041cca  nstatewatch::n_version_nstatewatch  (27 insns)
//   consts:  f64=-1
// 0x10041d1f  nstatewatch::vfunc_00  (69 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x10041dba  nstatewatch::vfunc_16  (79 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord, -> nContainer::ClearCommandList
//   strings: 'nautonom'
// 0x10041e91  nstatewatch::vfunc_17  (48 insns)
//   calls:   -> nStateNode::NetImport
// 0x10041f04  nstatewatch::vfunc_19  (27 insns)
//   calls:   IAT: nkernel.dll!n_strdup
// 0x10041f46  nstatewatch::vfunc_20  (27 insns)
//   calls:   IAT: nkernel.dll!n_strdup
// 0x10041f88  nstatewatch::vfunc_21  (21 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x10041fb5  nstatewatch::vfunc_22  (21 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x10041fe2  nstatewatch::vfunc_24  (15 insns)
// 0x1004201a  nstatewatch::vfunc_25  (32 insns)
//   consts:  f64=0
// 0x10042064  nstatewatch::vfunc_23  (42 insns)
//   calls:   IAT: MSVCRT.dll!rand
//   consts:  f64=0, f32=3.051851e-05, f32=-1
// 0x100420ce  nstatewatch::vfunc_26  (21 insns)
// 0x1004210c  nstatewatch::vfunc_27  (25 insns)
//   calls:   -> nStateNode::SetStateProgress
// 0x10042150  nstatewatch::vfunc_18  (136 insns)
//   calls:   -> nconsumption::vfunc_37
//   strings: 'v_settimeout_f', 'f_gettimeout_v', 'v_addactivatecommand_s', 'v_deleteactivatecommands_v', 'v_adddeactivatecommand_s', 'v_deletedeactivatecommands_v', 'v_setwatchcommand_s', 's_getwatchcommand_v'
// 0x10042304  nstatewatch::cmd_settimeout (v_settimeout_f)  (10 insns)
// 0x10042326  nstatewatch::cmd_gettimeout (f_gettimeout_v)  (11 insns)
// 0x1004234d  nstatewatch::cmd_setrandomtimemodifier (v_setrandomtimemodifier_f)  (11 insns)
//   consts:  f32=0.01
// 0x10042378  nstatewatch::cmd_gettimemodifierpercentage (f_gettimemodifierpercentage_v)  (12 insns)
//   consts:  f32=100
// 0x100423a8  nstatewatch::cmd_setwatchcommand (v_setwatchcommand_s)  (12 insns)
//   calls:   IAT: nkernel.dll!n_strdup
// 0x100423d0  nstatewatch::cmd_getwatchcommand (s_getwatchcommand_v)  (13 insns)
// 0x100423f6  nstatewatch::cmd_setcommandlistpath (v_setcommandlistpath_s)  (24 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x10042436  nstatewatch::cmd_getcommandlistpath (s_getcommandlistpath_v)  (13 insns)
// 0x1004245f  nstatewatch::vfunc_11  (229 insns)
//   calls:   -> ncollidedata::vfunc_11
//   consts:  f32=100
//   strings: '/sys/servers/script'

} // namespace re_nnomads
