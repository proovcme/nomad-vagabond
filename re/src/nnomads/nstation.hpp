#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nstation.asm
// Class: nstation : public ncontainer  (sizeof = 0xf90 = 3984 bytes)

#include <cstdint>

namespace re_nnomads {

struct nstation_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0eb0
    float field_0x0eb0;
    // +0x0eb4
    float field_0x0eb4;
    // +0x0eb8
    float field_0x0eb8;
    // +0x0ebc
    float field_0x0ebc;
    // +0x0ec0
    float field_0x0ec0;
    // +0x0ec4
    float field_0x0ec4;
    // +0x0ecc
    float field_0x0ecc;
    // +0x0ed0
    float field_0x0ed0;
    // +0x0ed4
    float field_0x0ed4;
    // +0x0edc
    uint32_t field_0x0edc;
    // +0x0ee4
    float field_0x0ee4;
    // +0x0ee8
    float field_0x0ee8;
    // +0x0eec
    float field_0x0eec;
    // +0x0ef4
    uint32_t field_0x0ef4;
    // +0x0efc
    uint8_t field_0x0efc;
    // +0x0efd
    uint8_t field_0x0efd;
    // +0x0efe
    uint8_t field_0x0efe;
    // +0x0eff
    uint8_t field_0x0eff;
    // +0x0f00
    uint32_t field_0x0f00;
    // +0x0f04
    float field_0x0f04;
    // +0x0f14
    float field_0x0f14;
    // +0x0f18
    uint32_t field_0x0f18;
    // +0x0f1c
    float field_0x0f1c;
    // +0x0f70
    uint8_t field_0x0f70;
    // +0x0f71
    uint8_t field_0x0f71;
    // +0x0f74
    uint32_t field_0x0f74;
    // +0x0f88
    uint8_t field_0x0f88;
};

// Script AddCmds (34):
//   b_islocked_v
//   v_lockstation_v
//   v_unlockstation_v
//   i_getbuildowner_v
//   v_setislanddriveworking_b
//   b_isislanddriveworking_v
//   v_forceclearbuildarea_v
//   v_forceaddbuilding_ss
//   v_addbuildslot_s
//   v_selectbuildslotat_sfff
//   v_forceremovebuilding_v
//   v_forcemovebuildingto_fff
//   v_forcerotatebuildingto_fff
//   v_movebuildslotto_fff
//   v_rotatebuildslotto_fff
//   b_hasbuilding_o
//   v_clearbuildarea_v
//   v_addbuilding_s
//   v_removebuilding_v
//   v_selectbuilding_o
//   v_movebuildingforth_v
//   v_movebuildingback_v
//   v_setislandtarget_s
//   o_getislandtarget_v
//   v_setrestingplace_s
//   o_getrestingplace_v
//   b_isbuildareaavailable_s
//   v_printbuildslots_v
//   v_setswingparamsx_fff
//   v_setswingparamsy_fff
//   v_setswingparamsz_fff
//   v_setcharstartposition_fff
//   v_setmaxdistancetonavpoint_f
//   f_getmaxdistancetonavpoint_v

// Methods (42):
// 0x1001c917  nstation::n_init_nstation  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'ncontainer', 'container/nstation_head.cc'
// 0x1001c972  nstation::n_fini_nstation  (14 insns)
// 0x1001c995  nstation::n_new_nstation  (10 insns)
// 0x1001c9af  nstation::n_version_nstation  (67 insns)
//   calls:   -> nContainer::nContainer(), -> nBuildArea::nBuildArea()
// 0x1001ca98  nstation::vfunc_00  (30 insns)
//   calls:   -> nBuildArea::~nBuildArea(), -> nContainer::~nContainer()
// 0x1001caf6  nstation::vfunc_16  (3 insns)
//   calls:   -> nContainer::Activate
// 0x1001cb02  nstation::vfunc_15  (328 insns)
//   calls:   -> nContainer::Trigger, -> nStateNode::GetWorld, -> nRealWorld::GetGlobalTime
//   consts:  f32=0.01, f32=0, f64=1e-07
// 0x1001cf1f  nstation::vfunc_53  (5 insns)
//   calls:   -> nContainer::GetCustomDataSize
// 0x1001cf2f  nstation::vfunc_54  (10 insns)
//   calls:   -> nContainer::WriteCustomData
// 0x1001cf50  nstation::vfunc_55  (11 insns)
//   calls:   -> nContainer::ReadCustomData
// 0x1001cf74  nstation::vfunc_34  (314 insns)
//   calls:   -> nContainer::GetLastRecordTime, -> nContainer::GetPosition, -> nAnimSequence::AddTranslate, -> nContainer::GetDirection, -> nAnimSequence::AddRotate, -> nContainer::SetLastRecordTime, -> nStateNode::GetClan, -> nRoot::GetHead, -> nContainer::IsVehicleClass
//   consts:  f64=0.25
//   strings: 'abstract.odetector', 'b_islocked_v', 'v_lockstation_v', 'v_unlockstation_v', 'i_getbuildowner_v', 'v_setislanddriveworking_b', 'b_isislanddriveworking_v', 'v_forceclearbuildarea_v'
// 0x1001d3fd  nstation::cmd_islocked (b_islocked_v)  (13 insns)
// 0x1001d428  nstation::cmd_lockstation (v_lockstation_v)  (2 insns)
// 0x1001d431  nstation::cmd_unlockstation (v_unlockstation_v)  (2 insns)
// 0x1001d43a  nstation::cmd_getbuildowner (i_getbuildowner_v)  (13 insns)
// 0x1001d465  nstation::cmd_setislanddriveworking (v_setislanddriveworking_b)  (12 insns)
// 0x1001d48c  nstation::cmd_isislanddriveworking (b_isislanddriveworking_v)  (14 insns)
// 0x1001d4ba  nstation::cmd_setislandtarget (v_setislandtarget_s)  (11 insns)
// 0x1001d4e1  nstation::cmd_setrestingplace (v_setrestingplace_s)  (11 insns)
// 0x1001d508  nstation::cmd_setswingparamsx (v_setswingparamsx_fff)  (80 insns)
//   consts:  f32=0.1, f32=6.283185, f32=0.01745329, f32=57.29578
// 0x1001d5f4  nstation::cmd_setswingparamsy (v_setswingparamsy_fff)  (78 insns)
//   consts:  f32=0.1, f32=6.283185
// 0x1001d6d4  nstation::cmd_setswingparamsz (v_setswingparamsz_fff)  (80 insns)
//   consts:  f32=0.1, f32=6.283185, f32=0.01745329, f32=57.29578
// 0x1001d7c0  nstation::cmd_getislandtarget (o_getislandtarget_v)  (14 insns)
// 0x1001d7ee  nstation::cmd_getrestingplace (o_getrestingplace_v)  (14 insns)
// 0x1001d81c  nstation::cmd_forceclearbuildarea (v_forceclearbuildarea_v)  (3 insns)
// 0x1001d828  nstation::cmd_forceaddbuilding (v_forceaddbuilding_ss)  (17 insns)
// 0x1001d858  nstation::cmd_addbuildslot (v_addbuildslot_s)  (11 insns)
// 0x1001d87f  nstation::cmd_selectbuildslotat (v_selectbuildslotat_sfff)  (52 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x1001d90f  nstation::cmd_forceremovebuilding (v_forceremovebuilding_v)  (3 insns)
// 0x1001d91b  nstation::cmd_forcemovebuildingto (v_forcemovebuildingto_fff)  (31 insns)
// 0x1001d976  nstation::cmd_forcerotatebuildingto (v_forcerotatebuildingto_fff)  (41 insns)
//   consts:  f32=0.005555556, f32=3.141593
// 0x1001da48  nstation::cmd_rotatebuildslotto (v_rotatebuildslotto_fff)  (41 insns)
//   consts:  f32=0.005555556, f32=3.141593
// 0x1001db05  nstation::cmd_clearbuildarea (v_clearbuildarea_v)  (3 insns)
// 0x1001db11  nstation::cmd_addbuilding (v_addbuilding_s)  (14 insns)
// 0x1001db3c  nstation::cmd_removebuilding (v_removebuilding_v)  (3 insns)
// 0x1001db48  nstation::cmd_selectbuilding (v_selectbuilding_o)  (36 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x1001dbb7  nstation::cmd_isbuildareaavailable (b_isbuildareaavailable_s)  (23 insns)
// 0x1001dbfd  nstation::cmd_printbuildslots (v_printbuildslots_v)  (20 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x1001dc31  nstation::cmd_setcharstartposition (v_setcharstartposition_fff)  (70 insns)
// 0x1001dcf3  nstation::cmd_setmaxdistancetonavpoint (v_setmaxdistancetonavpoint_f)  (13 insns)
// 0x1001dd1e  nstation::cmd_getmaxdistancetonavpoint (f_getmaxdistancetonavpoint_v)  (14 insns)
// 0x1001dd4c  nstation::vfunc_11  (712 insns)
//   calls:   -> nContainer::SaveCmds
//   consts:  f32=57.29578, f32=6.283185, f32=0.3183099, f32=180

} // namespace re_nnomads
