#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nbuild.asm
// Class: nbuild : public nservice  (sizeof = 0x94 = 148 bytes)

#include <cstdint>

namespace re_nnomads {

struct nbuild_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0014
    float field_0x0014;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    float field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    uint8_t field_0x0060;
    // +0x0080
    float field_0x0080;
    // +0x008c
    uint32_t field_0x008c;
    // +0x0090
    uint32_t field_0x0090;
    // +0x0092
    uint32_t field_0x0092;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0f40
    uint8_t field_0x0f40;
};

// Script AddCmds (13):
//   v_setbuildtime_f
//   f_getbuildtime_v
//   v_setbuildenergy_f
//   f_getbuildenergy_v
//   v_setbuildproduct_s
//   s_getbuildproduct_v
//   v_setmaxproducts_i
//   i_getmaxproducts_v
//   v_setbuildrelpos_fff
//   v_setinitcommand_s
//   s_getinitcommand_v
//   v_setslotid_i
//   i_getslotid_v

// Methods (25):
// 0x10036431  nbuild::cmd_setbuildtime (v_setbuildtime_f)  (10 insns)
// 0x1003f52d  nbuild::n_init_nbuild  (15 insns)
//   strings: 'nservice'
// 0x1003f558  nbuild::n_fini_nbuild  (5 insns)
// 0x1003f56a  nbuild::n_new_nbuild  (10 insns)
// 0x1003f584  nbuild::n_version_nbuild  (25 insns)
// 0x1003f5d7  nbuild::vfunc_00  (24 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1003f617  nbuild::vfunc_19  (8 insns)
//   calls:   IAT: nkernel.dll!n_strdup
// 0x1003f62f  nbuild::vfunc_22  (27 insns)
// 0x1003f682  nbuild::vfunc_21  (116 insns)
//   calls:   -> nStateNode::GetClan, IAT: nkernel.dll!n_printf, -> nContainer::GetPosition, -> nContainer::GetDirection, -> nContainer::SetPosition
//   strings: 'normal'
// 0x1003f7bb  nbuild::vfunc_23  (55 insns)
//   calls:   -> nStateNode::GetClan
// 0x1003f84a  nbuild::vfunc_25  (40 insns)
// 0x1003f8ba  nbuild::vfunc_24  (26 insns)
// 0x1003f8f9  nbuild::vfunc_18  (94 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nconsumption::vfunc_37
// 0x1003fa00  nbuild::vfunc_20  (88 insns)
//   strings: 'v_setbuildtime_f', 'f_getbuildtime_v', 'v_setbuildenergy_f', 'f_getbuildenergy_v', 'v_setbuildproduct_s', 's_getbuildproduct_v', 'v_setmaxproducts_i', 'i_getmaxproducts_v'
// 0x1003fb5d  nbuild::cmd_setslotid (v_setslotid_i)  (10 insns)
// 0x1003fb82  nbuild::cmd_getslotid (i_getslotid_v)  (14 insns)
// 0x1003fbb2  nbuild::cmd_setbuildproduct (v_setbuildproduct_s)  (14 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2
// 0x1003fbdf  nbuild::cmd_getbuildproduct (s_getbuildproduct_v)  (18 insns)
// 0x1003fc10  nbuild::cmd_setmaxproducts (v_setmaxproducts_i)  (10 insns)
// 0x1003fc35  nbuild::cmd_getmaxproducts (i_getmaxproducts_v)  (14 insns)
// 0x1003fc65  nbuild::cmd_setbuildrelpos (v_setbuildrelpos_fff)  (70 insns)
// 0x1003fd26  nbuild::cmd_setinitcommand (v_setinitcommand_s)  (11 insns)
// 0x1003fd4a  nbuild::cmd_getinitcommand (s_getinitcommand_v)  (13 insns)
// 0x1003fd73  nbuild::vfunc_11  (195 insns)
//   calls:   -> ncollidedata::vfunc_11
// 0x10043f8d  nbuild::cmd_getbuildtime (f_getbuildtime_v)  (11 insns)

} // namespace re_nnomads
