#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nautonom.asm
// Class: nautonom : public ncontainer  (sizeof = 0x1138 = 4408 bytes)

#include <cstdint>

namespace re_nnomads {

struct nautonom_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x000e
    uint32_t field_0x000e;
    // +0x0010
    double field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    double field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0030
    uint8_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0044
    uint8_t field_0x0044;
    // +0x005c
    uint32_t field_0x005c;
    // +0x005e
    uint32_t field_0x005e;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0134
    uint32_t field_0x0134;
    // +0x02b8
    uint8_t field_0x02b8;
    // +0x0b5c
    uint32_t field_0x0b5c;
    // +0x0e2c
    uint32_t field_0x0e2c;
    // +0x0e34
    uint32_t field_0x0e34;
    // +0x0e64
    uint8_t field_0x0e64;
    // +0x0eb0
    uint8_t field_0x0eb0;
    // +0x0eb4
    uint32_t field_0x0eb4;
    // +0x0eb8
    uint32_t field_0x0eb8;
    // +0x0ebc
    uint8_t field_0x0ebc;
    // +0x0ec0
    uint32_t field_0x0ec0;
    // +0x0ec4
    uint32_t field_0x0ec4;
    // +0x0ec8
    uint32_t field_0x0ec8;
    // +0x0ed8
    uint8_t field_0x0ed8;
    // +0x0ee0
    double field_0x0ee0;
    // +0x0ef4
    uint32_t field_0x0ef4;
    // +0x0ef8
    uint32_t field_0x0ef8;
    // +0x0f00
    uint32_t field_0x0f00;
    // +0x0f0c
    uint32_t field_0x0f0c;
    // +0x0f10
    uint32_t field_0x0f10;
    // +0x0f14
    float field_0x0f14;
    // +0x0f18
    uint8_t field_0x0f18;
    // +0x0f1c
    uint32_t field_0x0f1c;
    // +0x0f20
    uint32_t field_0x0f20;
    // +0x0f2c
    uint32_t field_0x0f2c;
    // +0x0f30
    uint8_t field_0x0f30;
    // +0x1130
    uint8_t field_0x1130;
    // +0x1138
    uint8_t field_0x1138;
    // +0x1139
    uint8_t field_0x1139;
    // +0x1140
    double field_0x1140;
    // +0x1148
    float field_0x1148;
    // +0x1154
    uint32_t field_0x1154;
    // +0x1158
    uint32_t field_0x1158;
    // +0x115c
    uint32_t field_0x115c;
    // +0x1160
    uint32_t field_0x1160;
    // +0x1168
    double field_0x1168;
    // +0x1170
    float field_0x1170;
    // +0x1174
    float field_0x1174;
    // +0x1198
    float field_0x1198;
    // +0x119c
    uint8_t field_0x119c;
    // +0x11a0
    uint32_t field_0x11a0;
    // +0x11a8
    double field_0x11a8;
    // +0x11b0
    uint32_t field_0x11b0;
    // +0x11b4
    uint32_t field_0x11b4;
    // +0x11b8
    uint8_t field_0x11b8;
    // +0x11b9
    uint8_t field_0x11b9;
    // +0x11ba
    uint8_t field_0x11ba;
    // +0x11bb
    uint8_t field_0x11bb;
    // +0x11bc
    uint8_t field_0x11bc;
    // +0x11f0
    uint32_t field_0x11f0;
    // +0x11f4
    float field_0x11f4;
    // +0x120c
    uint32_t field_0x120c;
    // +0x1218
    uint32_t field_0x1218;
    // +0x121c
    uint32_t field_0x121c;
    // +0x1220
    uint32_t field_0x1220;
    // +0x1224
    uint32_t field_0x1224;
    // +0x1228
    uint32_t field_0x1228;
    // +0x122c
    uint32_t field_0x122c;
    // +0x1230
    uint32_t field_0x1230;
    // +0x1234
    uint32_t field_0x1234;
    // +0x1238
    uint32_t field_0x1238;
    // +0x123c
    uint32_t field_0x123c;
    // +0x1240
    uint32_t field_0x1240;
    // +0x1244
    uint32_t field_0x1244;
    // +0x1248
    uint32_t field_0x1248;
    // +0x124c
    uint32_t field_0x124c;
    // +0x1250
    uint32_t field_0x1250;
};

// Script AddCmds (51):
//   o_searchtarget_v
//   v_setvehicletarget_sfb
//   v_setvehicletarget2_sfbfff
//   v_setpositiontarget_ffff
//   v_setgaragetarget_v
//   v_setremovepostarget_v
//   v_deletetarget_v
//   s_gettarget_v
//   s_gettargetstate_v
//   f_gettargetdistance_v
//   f_gethorizontaltargetdistance_v
//   f_getverticaltargetdistance_v
//   f_gettargetangle_v
//   f_gethorizontaltargetangle_v
//   f_getverticaltargetangle_v
//   v_clearsearchtargetclasses_v
//   v_addsearchtargetclass_s
//   s_getfirstsearchtargetclass_v
//   s_getnextsearchtargetclass_s
//   v_setsearchtargetdist_f
//   f_getsearchtargetdist_v
//   v_setsearchtargetkind_s
//   s_getsearchtargetkind_v
//   v_setsearchtargetbyangle_b
//   b_getsearchtargetbyangle_v
//   b_selectnewcommandlist_s
//   o_getcurrentcommandlist_v
//   v_pushtarget_v
//   v_poptarget_v
//   v_putvehicletargetonstack_s
//   v_putvehicletargetonstack2_sfff
//   v_putpositiontargetonstack_fff
//   v_pushstate_v
//   v_popstate_v
//   v_putstateonstack_s
//   b_testvehicleastarget_s
//   b_hastarget_v
//   b_haspositiontarget_v
//   b_hasvehicletarget_v
//   b_hastargetchanged_v
//   b_hasenemytarget_v
//   b_hasguidetarget_v
//   b_reachedtarget_v
//   b_istargetreachable_v
//   b_istargetofclass_s
//   v_settask_ss
//   v_deletetask_v
//   v_setcurrentpatrolpoint_i
//   v_setlastpatrolpoint_i
//   b_iscommandlistfinished_v
//   b_doinrun_v

// Methods (59):
// 0x1001dbab  nautonom::cmd_pushstate (v_pushstate_v)  (3 insns)
// 0x1001fef0  nautonom::vfunc_00  (67 insns)
//   calls:   -> nContainer::~nContainer()
// 0x1001ffe4  nautonom::n_init_nautonom  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'ncontainer', 'cannot initialize autonom class', 'container/naut_head.cc'
// 0x1002003f  nautonom::n_fini_nautonom  (14 insns)
// 0x10020062  nautonom::n_new_nautonom  (10 insns)
// 0x1002007c  nautonom::n_version_nautonom  (275 insns)
//   strings: 'o_searchtarget_v', 'v_setvehicletarget_sfb', 'v_setvehicletarget2_sfbfff', 'v_setpositiontarget_ffff', 'v_setgaragetarget_v', 'v_setremovepostarget_v', 'v_deletetarget_v', 's_gettarget_v'
// 0x10020525  nautonom::cmd_searchtarget (o_searchtarget_v)  (14 insns)
// 0x10020553  nautonom::cmd_setvehicletarget (v_setvehicletarget_sfb)  (76 insns)
//   calls:   -> nStateNode::GetWorld, -> nRealWorld::FilterClanAtLoad
// 0x1002062f  nautonom::cmd_setvehicletarget2 (v_setvehicletarget2_sfbfff)  (94 insns)
//   calls:   -> nStateNode::GetWorld, -> nRealWorld::FilterClanAtLoad
// 0x1002074f  nautonom::cmd_setpositiontarget (v_setpositiontarget_ffff)  (48 insns)
// 0x100207eb  nautonom::cmd_setgaragetarget (v_setgaragetarget_v)  (53 insns)
// 0x1002087d  nautonom::cmd_setremovepostarget (v_setremovepostarget_v)  (53 insns)
// 0x1002090f  nautonom::cmd_gettarget (s_gettarget_v)  (33 insns)
//   strings: 'no_target'
// 0x10020975  nautonom::cmd_deletetarget (v_deletetarget_v)  (3 insns)
// 0x10020981  nautonom::cmd_gettargetstate (s_gettargetstate_v)  (112 insns)
//   strings: 'target_state:', '_reached', '_notreached', 'no_target'
// 0x10020abd  nautonom::cmd_gettargetdistance (f_gettargetdistance_v)  (18 insns)
// 0x10020af2  nautonom::cmd_gethorizontaltargetdistance (f_gethorizontaltargetdistance_v)  (18 insns)
// 0x10020b27  nautonom::cmd_getverticaltargetdistance (f_getverticaltargetdistance_v)  (18 insns)
// 0x10020b5c  nautonom::cmd_gettargetangle (f_gettargetangle_v)  (20 insns)
//   consts:  f32=180, f32=0.3183099
// 0x10020b9d  nautonom::cmd_gethorizontaltargetangle (f_gethorizontaltargetangle_v)  (20 insns)
//   consts:  f32=180, f32=0.3183099
// 0x10020bde  nautonom::cmd_getverticaltargetangle (f_getverticaltargetangle_v)  (20 insns)
//   consts:  f32=180, f32=0.3183099
// 0x10020c1f  nautonom::cmd_clearsearchtargetclasses (v_clearsearchtargetclasses_v)  (3 insns)
// 0x10020c2b  nautonom::cmd_addsearchtargetclass (v_addsearchtargetclass_s)  (11 insns)
// 0x10020c52  nautonom::cmd_getfirstsearchtargetclass (s_getfirstsearchtargetclass_v)  (22 insns)
//   strings: 'null'
// 0x10020c94  nautonom::cmd_getnextsearchtargetclass (s_getnextsearchtargetclass_s)  (34 insns)
//   strings: 'null'
// 0x10020cf3  nautonom::cmd_setsearchtargetdist (v_setsearchtargetdist_f)  (10 insns)
// 0x10020d18  nautonom::cmd_getsearchtargetdist (f_getsearchtargetdist_v)  (11 insns)
// 0x10020d42  nautonom::cmd_setsearchtargetkind (v_setsearchtargetkind_s)  (12 insns)
//   calls:   -> nRealWorld::GetSearchKindID
// 0x10020d6c  nautonom::cmd_getsearchtargetkind (s_getsearchtargetkind_v)  (15 insns)
//   calls:   -> nRealWorld::GetSearchKindName
// 0x10020d9b  nautonom::cmd_setsearchtargetbyangle (v_setsearchtargetbyangle_b)  (10 insns)
// 0x10020dbf  nautonom::cmd_getsearchtargetbyangle (b_getsearchtargetbyangle_v)  (13 insns)
// 0x10020deb  nautonom::cmd_selectnewcommandlist (b_selectnewcommandlist_s)  (23 insns)
// 0x10020e31  nautonom::cmd_getcurrentcommandlist (o_getcurrentcommandlist_v)  (13 insns)
// 0x10020e5d  nautonom::cmd_pushtarget (v_pushtarget_v)  (3 insns)
// 0x10020e69  nautonom::cmd_poptarget (v_poptarget_v)  (3 insns)
// 0x10020e75  nautonom::cmd_putvehicletargetonstack (v_putvehicletargetonstack_s)  (67 insns)
//   calls:   -> nStateNode::GetWorld, -> nRealWorld::FilterClanAtLoad
// 0x10020f34  nautonom::cmd_putvehicletargetonstack2 (v_putvehicletargetonstack2_sfff)  (84 insns)
//   calls:   -> nStateNode::GetWorld, -> nRealWorld::FilterClanAtLoad
// 0x10021030  nautonom::cmd_putpositiontargetonstack (v_putpositiontargetonstack_fff)  (43 insns)
// 0x100210b9  nautonom::cmd_popstate (v_popstate_v)  (3 insns)
// 0x100210c5  nautonom::cmd_putstateonstack (v_putstateonstack_s)  (45 insns)
// 0x1002113a  nautonom::cmd_testvehicleastarget (b_testvehicleastarget_s)  (48 insns)
// 0x100211c7  nautonom::cmd_hastarget (b_hastarget_v)  (16 insns)
// 0x100211fa  nautonom::cmd_hastargetchanged (b_hastargetchanged_v)  (14 insns)
// 0x10021228  nautonom::cmd_hasenemytarget (b_hasenemytarget_v)  (14 insns)
// 0x10021256  nautonom::cmd_hasguidetarget (b_hasguidetarget_v)  (14 insns)
// 0x10021284  nautonom::cmd_hasvehicletarget (b_hasvehicletarget_v)  (25 insns)
// 0x100212dd  nautonom::cmd_haspositiontarget (b_haspositiontarget_v)  (25 insns)
// 0x10021336  nautonom::cmd_reachedtarget (b_reachedtarget_v)  (27 insns)
// 0x1002138e  nautonom::cmd_istargetreachable (b_istargetreachable_v)  (14 insns)
// 0x100213bc  nautonom::cmd_istargetofclass (b_istargetofclass_s)  (34 insns)
//   calls:   -> nContainer::IsVehicleClass
// 0x10021423  nautonom::cmd_settask (v_settask_ss)  (26 insns)
// 0x10021461  nautonom::cmd_deletetask (v_deletetask_v)  (49 insns)
//   strings: 'nothing', 'null'
// 0x100214fe  nautonom::cmd_setcurrentpatrolpoint (v_setcurrentpatrolpoint_i)  (11 insns)
// 0x10021525  nautonom::cmd_setlastpatrolpoint (v_setlastpatrolpoint_i)  (11 insns)
// 0x1002154c  nautonom::cmd_iscommandlistfinished (b_iscommandlistfinished_v)  (13 insns)
// 0x10021577  nautonom::cmd_doinrun (b_doinrun_v)  (13 insns)
// 0x100215a2  nautonom::vfunc_11  (846 insns)
//   calls:   -> nContainer::SaveCmds, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort, -> nRealWorld::FilterClanAtSave, -> nRealWorld::GetSearchKindName, IAT: MSVCRT.dll!sprintf
//   strings: 'SaveTarget: unknown target type', 'container/naut_script.cc', 'SaveTargetStack: unknown target type', 'unknown target', 'position %2.2f %2.2f %2.2f %2.2f', 'vehicle %s %2.2f %s', 'task type not supported', 'c:/nomads/code/inc\\m_tasks/ntask.h'
// 0x10021f24  nautonom::vfunc_18  (6 insns)
//   calls:   -> nContainer::UpdateChannels
// 0x10021f35  nautonom::vfunc_63  (2963 insns)
//   calls:   -> nContainer::GetMatrix44, -> nContainer::GetPosition, -> nContainer::DrawLine, -> nContainer::Visualize, -> nContainer::GetDirection, -> nRealWorld::IsEnemy, -> nContainer::IsVehicleClass, -> nContainer::GetCorrectRadius, IAT: nkernel.dll!n_strdup, IAT: nkernel.dll!n_free, -> nRealWorld::GetGlobalTime, -> nRealWorld::FindVehicleMultipleClasses
//   consts:  f32=0.5, f32=3, f32=1, f32=-1, f64=0.5, f32=25, f32=0, f32=300, f64=0, f64=1e-07, f32=0.02, f64=-10000
//   strings: 'concret.technical.static.building', 'container/naut_ki.cc', 'ncommandlist', 'nAutonom::GlobalizeCommandList with unknown AdjustType %d', 'null', '/sys/servers/collide'

} // namespace re_nnomads
