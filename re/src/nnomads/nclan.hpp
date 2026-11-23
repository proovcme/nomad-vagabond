#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nclan.asm
// Class: nclan : public nstatenode  (sizeof = 0x1520 = 5408 bytes)

#include <cstdint>

namespace re_nnomads {

struct nclan_Layout {
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
    // +0x0044
    uint8_t field_0x0044;
    // +0x004c
    uint32_t field_0x004c;
    // +0x004e
    uint8_t field_0x004e;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0140
    double field_0x0140;
    // +0x0178
    uint8_t field_0x0178;
    // +0x01a4
    uint8_t field_0x01a4;
    // +0x0208
    uint32_t field_0x0208;
    // +0x0df4
    float field_0x0df4;
    // +0x0df8
    float field_0x0df8;
    // +0x0e64
    uint8_t field_0x0e64;
    // +0x0e84
    uint8_t field_0x0e84;
    // +0x1270
    uint8_t field_0x1270;
    // +0x1472
    uint8_t field_0x1472;
    // +0x1474
    float field_0x1474;
    // +0x1478
    float field_0x1478;
    // +0x147c
    float field_0x147c;
    // +0x1480
    uint8_t field_0x1480;
    // +0x14ac
    float field_0x14ac;
    // +0x14b0
    float field_0x14b0;
    // +0x14b4
    float field_0x14b4;
    // +0x14b8
    uint8_t field_0x14b8;
    // +0x14bc
    float field_0x14bc;
    // +0x14c0
    uint32_t field_0x14c0;
    // +0x14c4
    uint32_t field_0x14c4;
    // +0x14cc
    uint32_t field_0x14cc;
    // +0x14d0
    uint32_t field_0x14d0;
    // +0x14d4
    uint32_t field_0x14d4;
    // +0x14dc
    uint32_t field_0x14dc;
    // +0x14e0
    uint32_t field_0x14e0;
    // +0x14e4
    uint32_t field_0x14e4;
    // +0x14ec
    float field_0x14ec;
    // +0x14f0
    uint32_t field_0x14f0;
    // +0x14f4
    uint32_t field_0x14f4;
    // +0x14fc
    uint32_t field_0x14fc;
    // +0x1500
    float field_0x1500;
    // +0x1504
    float field_0x1504;
    // +0x1508
    float field_0x1508;
    // +0x1518
    uint32_t field_0x1518;
};

// Script AddCmds (35):
//   o_createvehicle_s
//   o_createandselvehicle_s
//   o_createvehiclewithname_ss
//   o_createandselvehiclewithname_ss
//   v_releasevehicle_o
//   o_moveobjecttoclan_oi
//   i_getnetname_v
//   v_setrealname_s
//   s_getrealname_v
//   v_setclancolor_fff
//   o_getmaennel_v
//   v_setbasemaximum_f
//   f_getbasemaximum_v
//   f_getcurrentmaximum_v
//   v_setcurrentenergy_f
//   f_getcurrentenergy_v
//   b_hasenergy_v
//   v_setasuser_b
//   b_isuser_v
//   v_setenvironment_b
//   b_isenvironment_v
//   v_importclan_o
//   v_setposition_fff
//   v_setorientation_fff
//   o_getplayerisland_v
//   v_setnoticeenergy_b
//   b_getnoticeenergy_v
//   v_setfaction_i
//   i_getfaction_v
//   v_setzoneradius_f
//   f_getzoneradius_v
//   v_setzoneheight_f
//   f_getzoneheight_v
//   v_setdangerzone_f
//   f_getdangerzone_v

// Methods (74):
// 0x1000f6b5  nclan::vfunc_00  (34 insns)
//   calls:   -> nRoot::GetHead, -> nStateNode::~nStateNode()
// 0x1000f719  nclan::vfunc_41  (7 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2
// 0x1000f735  nclan::vfunc_42  (2 insns)
// 0x1000f73c  nclan::vfunc_43  (6 insns)
// 0x1000f758  nclan::vfunc_44  (4 insns)
// 0x1000f764  nclan::vfunc_38  (21 insns)
//   calls:   -> nRoot::GetHead
// 0x1000f79f  nclan::vfunc_15  (127 insns)
//   calls:   -> nRoot::GetHead, -> nStateNode::GetNetworkObject, -> nStateNode::Trigger
//   strings: 'nstatenode'
// 0x1000f8ef  nclan::vfunc_59  (11 insns)
// 0x1000f913  nclan::vfunc_60  (42 insns)
//   calls:   -> nRoot::GetHead, -> nContainer::IsVehicleClass
//   strings: 'concret.technical.static.building.towncenter', 'concret.nature.island'
// 0x1000f97c  nclan::vfunc_52  (10 insns)
// 0x1000f992  nclan::vfunc_53  (2 insns)
// 0x1000f999  nclan::vfunc_54  (8 insns)
// 0x1000f9ba  nclan::vfunc_55  (8 insns)
// 0x1000f9d9  nclan::vfunc_56  (20 insns)
// 0x1000fa30  nclan::vfunc_57  (20 insns)
// 0x1000fa87  nclan::vfunc_58  (8 insns)
// 0x1000faa5  nclan::vfunc_31  (97 insns)
//   calls:   -> nStateNode::StartRecord, -> nRoot::GetHead, -> nStateNode::HasState, IAT: MSVCRT.dll!sprintf, -> nStateNode::GetPrototype, -> nDataHandler::GetProtoName, IAT: nkernel.dll!n_printf
//   strings: 'cinematic', '%s/%s', 'nanimsequence'
// 0x1000fbca  nclan::vfunc_32  (30 insns)
//   calls:   -> nStateNode::StopRecord, -> nRoot::GetHead
// 0x1000fc13  nclan::vfunc_34  (46 insns)
//   calls:   -> nRoot::GetHead
// 0x1000fc9a  nclan::vfunc_39  (123 insns)
//   calls:   -> nDataHandler::GetProtoByIndex, -> nDataHandler::GetProtoName, IAT: MSVCRT.dll!sprintf, IAT: nkernel.dll!n_printf
//   strings: 'nstatenode', '%s%d'
// 0x1000fe0a  nclan::vfunc_40  (452 insns)
//   calls:   -> nRoot::GetHead, -> nStateNode::GetNetworkObject, -> nContainer::SetPosition, -> nStateNode::GetClan, IAT: nkernel.dll!n_printf, IAT: nkernel.dll!n_free
//   consts:  f32=0.43, f32=0.001
//   strings: 'nstatenode', '/data/if_menu/dots/gelb', '/data/if_menu/dots/blau', '/data/if_menu/dots/orange', '/data/if_menu/dots/rot', '/data/if_menu/dots/gruen', '/data/if_menu/dots/hellblau', '/data/if_menu/dots/dunkelgruen'
// 0x10011092  nclan::n_init_nclan  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nstatenode', "Could not open superclass 'nstatenode'!", 'container/nclan_head.cc'
// 0x100110ed  nclan::n_fini_nclan  (14 insns)
// 0x10011110  nclan::n_new_nclan  (10 insns)
// 0x1001112a  nclan::n_version_nclan  (2 insns)
// 0x10011130  nclan::vfunc_24  (77 insns)
//   calls:   -> nStateNode::SetNetworkObject, -> nRoot::GetHead
// 0x1001120d  nclan::vfunc_27  (41 insns)
//   calls:   -> nStateNode::GetNetworkObject
// 0x10011292  nclan::vfunc_28  (336 insns)
//   calls:   -> nStateNode::GetNetworkObject, -> nDataHandler::Load, IAT: nkernel.dll!n_printf, -> nRealWorld::GetUniqueId, -> nRealWorld::GetGlobalTime, -> nStateNode::SetCreationTime, -> nRealWorld::IsNetSession, -> nStateNode::HasState, IAT: MSVCRT.dll!sprintf, -> nStateNode::GetPrototype, -> nDataHandler::GetProtoName, -> nRoot::GetHead
//   strings: 'vhcl', 'normal', 'cinematic', '%s/%s', 'nanimsequence', '%s%d'
// 0x10011674  nclan::vfunc_45  (30 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x100116c0  nclan::vfunc_46  (17 insns)
// 0x100116f1  nclan::vfunc_47  (21 insns)
//   calls:   -> nStateNode::GetNetworkObject
// 0x1001172e  nclan::vfunc_51  (37 insns)
//   calls:   -> nRoot::GetHead
//   strings: 'nmaennel'
// 0x10011780  nclan::vfunc_49  (162 insns)
//   calls:   -> nStateNode::GetClan, IAT: nkernel.dll!n_printf, -> nStateNode::GetPrototype, -> nStateNode::GetState, -> nRealWorld::GetGlobalTime, -> nContainer::IsVehicleClass, -> nStateNode::GetNetworkObject
//   strings: 'concret.technical.dynamic.maennel'
// 0x1001196c  nclan::vfunc_48  (14 insns)
//   calls:   -> nRealWorld::GetClanById
// 0x10011995  nclan::vfunc_50  (215 insns)
//   calls:   -> nRoot::GetHead
//   strings: 'o_createvehicle_s', 'o_createandselvehicle_s', 'o_createvehiclewithname_ss', 'o_createandselvehiclewithname_ss', 'v_releasevehicle_o', 'o_moveobjecttoclan_oi', 'i_getnetname_v', 'v_setrealname_s'
// 0x10011d14  nclan::cmd_createvehicle (o_createvehicle_s)  (21 insns)
// 0x10011d58  nclan::cmd_createandselvehicle (o_createandselvehicle_s)  (25 insns)
// 0x10011da8  nclan::cmd_createvehiclewithname (o_createvehiclewithname_ss)  (27 insns)
// 0x10011df6  nclan::cmd_createandselvehiclewithname (o_createandselvehiclewithname_ss)  (31 insns)
// 0x10011e50  nclan::cmd_releasevehicle (v_releasevehicle_o)  (11 insns)
// 0x10011e77  nclan::cmd_moveobjecttoclan (o_moveobjecttoclan_oi)  (49 insns)
//   calls:   -> nStateNode::GetWorld, -> nRealWorld::GetClanById, IAT: nkernel.dll!n_printf
// 0x10011ef9  nclan::cmd_setrealname (v_setrealname_s)  (11 insns)
// 0x10011f20  nclan::cmd_getrealname (s_getrealname_v)  (15 insns)
// 0x10011f4d  nclan::cmd_setclancolor (v_setclancolor_fff)  (61 insns)
// 0x10012012  nclan::cmd_getmaennel (o_getmaennel_v)  (14 insns)
// 0x10012040  nclan::cmd_setbasemaximum (v_setbasemaximum_f)  (10 insns)
// 0x10012065  nclan::cmd_getbasemaximum (f_getbasemaximum_v)  (11 insns)
// 0x1001208f  nclan::cmd_getcurrentmaximum (f_getcurrentmaximum_v)  (14 insns)
// 0x100120bd  nclan::cmd_setcurrentenergy (v_setcurrentenergy_f)  (10 insns)
// 0x100120e2  nclan::cmd_getcurrentenergy (f_getcurrentenergy_v)  (11 insns)
// 0x1001210c  nclan::cmd_hasenergy (b_hasenergy_v)  (14 insns)
// 0x1001213a  nclan::cmd_getnetname (i_getnetname_v)  (14 insns)
// 0x10012167  nclan::cmd_setasuser (v_setasuser_b)  (12 insns)
// 0x1001218e  nclan::cmd_isuser (b_isuser_v)  (14 insns)
// 0x100121bc  nclan::cmd_setenvironment (v_setenvironment_b)  (10 insns)
// 0x100121e0  nclan::cmd_isenvironment (b_isenvironment_v)  (13 insns)
// 0x1001220c  nclan::cmd_importclan (v_importclan_o)  (22 insns)
//   calls:   -> nStateNode::GetWorld, -> nRealWorld::ReleaseClan
// 0x10012248  nclan::cmd_setposition (v_setposition_fff)  (73 insns)
// 0x1001231b  nclan::cmd_setorientation (v_setorientation_fff)  (105 insns)
//   consts:  f32=0.005555556, f32=3.141593, f32=0.3183099, f32=180
// 0x1001244c  nclan::cmd_getplayerisland (o_getplayerisland_v)  (14 insns)
// 0x1001247a  nclan::cmd_setnoticeenergy (v_setnoticeenergy_b)  (12 insns)
// 0x100124a1  nclan::cmd_getnoticeenergy (b_getnoticeenergy_v)  (14 insns)
// 0x100124cf  nclan::cmd_setfaction (v_setfaction_i)  (11 insns)
// 0x100124fa  nclan::cmd_getfaction (i_getfaction_v)  (13 insns)
// 0x10012526  nclan::cmd_setzoneradius (v_setzoneradius_f)  (13 insns)
// 0x10012551  nclan::cmd_getzoneradius (f_getzoneradius_v)  (14 insns)
// 0x1001257f  nclan::cmd_setzoneheight (v_setzoneheight_f)  (13 insns)
// 0x100125aa  nclan::cmd_getzoneheight (f_getzoneheight_v)  (14 insns)
// 0x100125d8  nclan::cmd_setdangerzone (v_setdangerzone_f)  (13 insns)
// 0x10012603  nclan::cmd_getdangerzone (f_getdangerzone_v)  (14 insns)
// 0x10012631  nclan::vfunc_11  (515 insns)
//   calls:   -> nStateNode::SaveCmds
//   consts:  f32=0.3183099, f32=180, f64=1.907348633e-06
// 0x10012ea5  nclan::vfunc_61  (23 insns)
// 0x10012ef5  nclan::vfunc_62  (50 insns)
// 0x10012f83  nclan::vfunc_63  (178 insns)
//   calls:   -> nRoot::GetHead, IAT: nkernel.dll!n_printf
//   consts:  f32=0, f64=0
//   strings: 'container/nclan_loadsave.cc'

} // namespace re_nnomads
