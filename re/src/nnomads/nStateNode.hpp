#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nStateNode.asm
// Class: nStateNode : public nnetnode  (sizeof = 0x210 = 528 bytes)

#include <cstdint>

namespace re_nnomads {

struct nStateNode_Layout {
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
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0038
    uint32_t field_0x0038;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0078
    uint32_t field_0x0078;
    // +0x007c
    uint32_t field_0x007c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0084
    uint32_t field_0x0084;
    // +0x0088
    uint32_t field_0x0088;
    // +0x008c
    uint32_t field_0x008c;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0140
    double field_0x0140;
    // +0x0148
    double field_0x0148;
    // +0x0150
    double field_0x0150;
    // +0x0158
    uint8_t field_0x0158;
    // +0x0178
    uint8_t field_0x0178;
    // +0x0179
    uint8_t field_0x0179;
    // +0x0180
    double field_0x0180;
    // +0x0188
    uint8_t field_0x0188;
    // +0x0190
    double field_0x0190;
    // +0x0198
    double field_0x0198;
    // +0x01a0
    float field_0x01a0;
    // +0x01a4
    uint8_t field_0x01a4;
    // +0x01a5
    uint8_t field_0x01a5;
    // +0x01a6
    uint8_t field_0x01a6;
    // +0x01a8
    uint32_t field_0x01a8;
    // +0x01b8
    uint32_t field_0x01b8;
    // +0x01c0
    double field_0x01c0;
    // +0x01c8
    uint8_t field_0x01c8;
    // +0x01cc
    uint32_t field_0x01cc;
    // +0x01d0
    uint8_t field_0x01d0;
    // +0x0208
    uint32_t field_0x0208;
};

// Methods (114):
// 0x10007927  nStateNode::nStateNode()  (127 insns)
//   calls:   -> nNetNode::nNetNode()
// 0x10007af9  nStateNode::operator=  (147 insns)
//   calls:   -> nNetNode::operator=, IAT: nkernel.dll!n_free
// 0x10007d4f  nStateNode::SetPaused  (3 insns)
// 0x10007d5c  nStateNode::IsPaused  (2 insns)
// 0x10007d63  nStateNode::SetShowStateSwitch  (3 insns)
// 0x10007d70  nStateNode::GetShowStateSwitch  (2 insns)
// 0x10007d77  nStateNode::GetStateStarted  (2 insns)
// 0x10007d7e  nStateNode::SetVisualStateStarted  (3 insns)
// 0x10007d8b  nStateNode::GetVisualStateStarted  (2 insns)
// 0x10007d92  nStateNode::SetAudioStateStarted  (3 insns)
// 0x10007d9f  nStateNode::GetAudioStateStarted  (2 insns)
// 0x10007da6  nStateNode::SetClan  (4 insns)
// 0x10007db8  nStateNode::GetClan  (6 insns)
// 0x10007dce  nStateNode::SetPrototype  (4 insns)
// 0x10007ddd  nStateNode::GetPrototype  (6 insns)
// 0x10007ded  nStateNode::SetVehiclePrototype  (4 insns)
// 0x10007dfc  nStateNode::GetVehiclePrototype  (31 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Aborting.', 'c:/nomads/code/inc\\kernel/nref.h'
// 0x10007e65  nStateNode::SetClanID  (3 insns)
// 0x10007e74  nStateNode::GetClanID  (2 insns)
// 0x10007e7c  nStateNode::GetWorld  (6 insns)
// 0x10007e8c  nStateNode::SetRemoveable  (5 insns)
// 0x10007e9f  nStateNode::IsRemoveable  (2 insns)
// 0x10007ea6  nStateNode::SetStateTimeOver  (3 insns)
// 0x10007eb3  nStateNode::IsStateTimeOver  (2 insns)
// 0x10007eba  nStateNode::SetFirstFrame  (3 insns)
// 0x10007ec7  nStateNode::IsFirstFrame  (2 insns)
// 0x10007ece  nStateNode::SetCinematicFinished  (3 insns)
// 0x10007edb  nStateNode::IsCinematicFinished  (2 insns)
// 0x10007ee2  nStateNode::GetCommServer  (2 insns)
// 0x10007eed  nStateNode::SetObjectId  (3 insns)
// 0x10007efa  nStateNode::GetObjectId  (2 insns)
// 0x1000d695  nStateNode::n_init_nstatenode  (15 insns)
//   strings: 'nnetnode'
// 0x1000d6c0  nStateNode::n_fini_nstatenode  (5 insns)
// 0x1000d6d2  nStateNode::n_new_nstatenode  (10 insns)
//   calls:   -> nStateNode::nStateNode()
// 0x1000d6ec  nStateNode::nStateNode()  (91 insns)
//   strings: '/sys/servers/comm'
// 0x1000d844  nStateNode::~nStateNode()  (77 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1000d91e  nStateNode::Initialize  (5 insns)
// 0x1000d930  nStateNode::Activate  (67 insns)
//   calls:   -> nRoot::GetHead, -> nStateNode::GetPrototype
//   strings: 'visual'
// 0x1000d9d7  nStateNode::Deactivate  (65 insns)
//   calls:   -> nRoot::GetHead, -> nStateNode::GetPrototype
//   strings: 'visual'
// 0x1000da7a  nStateNode::Trigger  (42 insns)
//   calls:   -> nRealWorld::IsNetSession, -> nStateNode::GetNetworkObject
// 0x1000daea  nStateNode::StartRecord  (13 insns)
//   calls:   -> nRealWorld::GetGlobalTime
// 0x1000db1c  nStateNode::StopRecord  (2 insns)
// 0x1000db24  nStateNode::GetRecord  (6 insns)
// 0x1000db3b  nStateNode::IsRecording  (2 insns)
// 0x1000db42  nStateNode::SetRecordStartTime  (3 insns)
// 0x1000db4f  nStateNode::GetRecordStartTime  (2 insns)
// 0x1000db56  nStateNode::SetThrowEvents  (3 insns)
// 0x1000db63  nStateNode::GetThrowEvents  (2 insns)
// 0x1000db6a  nStateNode::SetSymbolicName  (19 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1000dbab  nStateNode::GetSymbolicName  (13 insns)
// 0x1000dbcb  nStateNode::SetEventSlot  (20 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1000dc05  nStateNode::GetEventSlot  (4 insns)
// 0x1000dc18  nStateNode::ThrowEvent  (25 insns)
// 0x1000dc62  nStateNode::ThrowStateTransitionEvent  (80 insns)
//   calls:   -> nStateNode::ThrowEvent
// 0x1000dd1b  nStateNode::SetLifeTime  (3 insns)
// 0x1000dd28  nStateNode::GetLifeTime  (2 insns)
// 0x1000dd2f  nStateNode::SetCreationTime  (3 insns)
// 0x1000dd3c  nStateNode::GetCreationTime  (2 insns)
// 0x1000dd43  nStateNode::IsLifeTimeOver  (322 insns)
//   calls:   -> nRealWorld::GetGlobalTime
//   consts:  f64=0
// 0x1000e4b3  nStateNode::cmd_setstate (v_setstate_s)  (15 insns)
// 0x1000e4dd  nStateNode::cmd_getstate (s_getstate_v)  (14 insns)
//   calls:   -> nStateNode::GetState
// 0x1000e507  nStateNode::cmd_announcestatewithtimeoffset (v_announcestatewithtimeoffset_sf)  (20 insns)
// 0x1000e564  nStateNode::cmd_setremoveable (v_setremoveable_b)  (12 insns)
// 0x1000e58e  nStateNode::cmd_isremoveable (b_isremoveable_v)  (13 insns)
// 0x1000e5ba  nStateNode::cmd_getclanid (i_getclanid_v)  (14 insns)
// 0x1000e5ea  nStateNode::cmd_getprototype (o_getprototype_v)  (13 insns)
//   calls:   -> nStateNode::GetPrototype
// 0x1000e615  nStateNode::cmd_getclan (o_getclan_v)  (13 insns)
//   calls:   -> nStateNode::GetClan
// 0x1000e640  nStateNode::cmd_isstatetimeover (b_isstatetimeover_v)  (13 insns)
// 0x1000e66c  nStateNode::cmd_isfirstframe (b_isfirstframe_v)  (13 insns)
// 0x1000e698  nStateNode::cmd_setpaused (v_setpaused_b)  (10 insns)
// 0x1000e6bc  nStateNode::cmd_ispaused (b_ispaused_v)  (13 insns)
// 0x1000e6e8  nStateNode::cmd_iscinematicfinished (b_iscinematicfinished_v)  (13 insns)
// 0x1000e714  nStateNode::cmd_setcinematicfinished (v_setcinematicfinished_b)  (10 insns)
// 0x1000e738  nStateNode::cmd_setshowstateswitch (v_setshowstateswitch_b)  (10 insns)
// 0x1000e75c  nStateNode::cmd_getshowstateswitch (b_getshowstateswitch_v)  (13 insns)
// 0x1000e788  nStateNode::cmd_setrecordstarttime (v_setrecordstarttime_f)  (14 insns)
// 0x1000e7b4  nStateNode::cmd_getrecordstarttime (f_getrecordstarttime_v)  (14 insns)
// 0x1000e7e2  nStateNode::cmd_setsymbolicname (v_setsymbolicname_s)  (10 insns)
//   calls:   -> nStateNode::SetSymbolicName
// 0x1000e805  nStateNode::cmd_getsymbolicname (s_getsymbolicname_v)  (14 insns)
//   calls:   -> nStateNode::GetSymbolicName
// 0x1000e82f  nStateNode::cmd_setthrowevents (v_setthrowevents_b)  (12 insns)
//   calls:   -> nStateNode::SetThrowEvents
// 0x1000e855  nStateNode::cmd_getthrowevents (b_getthrowevents_v)  (13 insns)
//   calls:   -> nStateNode::GetThrowEvents
// 0x1000e880  nStateNode::cmd_seteventslot (v_seteventslot_ss)  (19 insns)
//   calls:   -> nStateNode::SetEventSlot
// 0x1000e8bd  nStateNode::cmd_geteventslot (s_geteventslot_s)  (23 insns)
//   calls:   -> nStateNode::GetEventSlot
// 0x1000e903  nStateNode::cmd_throwevent (b_throwevent_s)  (22 insns)
//   calls:   -> nStateNode::ThrowEvent
// 0x1000e94a  nStateNode::cmd_getmachineid (i_getmachineid_v)  (13 insns)
//   calls:   -> nStateNode::GetMachineID
// 0x1000e975  nStateNode::cmd_setcreationtime (v_setcreationtime_f)  (13 insns)
//   calls:   -> nStateNode::SetCreationTime
// 0x1000e99d  nStateNode::cmd_getcreationtime (f_getcreationtime_v)  (13 insns)
//   calls:   -> nStateNode::GetCreationTime
// 0x1000e9c8  nStateNode::cmd_setlifetime (v_setlifetime_f)  (13 insns)
//   calls:   -> nStateNode::SetLifeTime
// 0x1000e9f0  nStateNode::cmd_getlifetime (f_getlifetime_v)  (13 insns)
//   calls:   -> nStateNode::GetLifeTime
// 0x1000ea1b  nStateNode::cmd_islifetimeover (b_islifetimeover_v)  (13 insns)
//   calls:   -> nStateNode::IsLifeTimeOver
// 0x1000ea46  nStateNode::SaveCmds  (602 insns)
//   calls:   -> nNetNode::vfunc_11, -> nStateNode::GetState, -> nRealWorld::GetGlobalTime, -> nStateNode::GetCreationTime, -> nStateNode::GetLifeTime, -> nStateNode::GetSymbolicName, -> nStateNode::GetThrowEvents, -> nStateNode::GetEventSlot, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
//   strings: 'created', 'collected', 'destroyed', 'built', 'walkover', 'timer', 'cinematic', 'used'
// 0x1000f086  nStateNode::NetRelease  (8 insns)
// 0x1000f09b  nStateNode::SetNetworkObject  (12 insns)
// 0x1000f0bc  nStateNode::GetNetworkObject  (2 insns)
// 0x1000f0c3  nStateNode::GetNetworkID  (6 insns)
// 0x1000f0d5  nStateNode::GetMachineID  (4 insns)
// 0x1000f0e4  nStateNode::NewServiceData  (26 insns)
// 0x1000f12d  nStateNode::GetServiceData  (3 insns)
// 0x1000f13b  nStateNode::AttachService  (5 insns)
// 0x1000f151  nStateNode::ActivateServices  (37 insns)
//   calls:   -> nRoot::GetHead
// 0x1000f1a5  nStateNode::SetState  (99 insns)
//   calls:   -> nStateNode::GetState, IAT: nkernel.dll!n_printf, -> nStateNode::ThrowStateTransitionEvent, -> nRealWorld::GetGlobalTime, IAT: MSVCRT.dll!abort, -> nStateNode::ActivateServices
//   strings: 'container/nsn_states.cc'
// 0x1000f2fe  nStateNode::GetState  (8 insns)
// 0x1000f319  nStateNode::AnnounceState  (12 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2
// 0x1000f33e  nStateNode::AnnounceStateWithTimeOffset  (12 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2
// 0x1000f365  nStateNode::GetAnnouncedState  (6 insns)
// 0x1000f374  nStateNode::SetAnnouncedState  (14 insns)
// 0x1000f39a  nStateNode::GetIndexOfState  (59 insns)
//   calls:   -> nRoot::GetHead
// 0x1000f416  nStateNode::GetStateOfIndex  (23 insns)
//   calls:   -> nRoot::GetHead
// 0x1000f451  nStateNode::HasState  (9 insns)
// 0x1000f46d  nStateNode::SetStateProgress  (3 insns)
// 0x1000f47a  nStateNode::GetStateProgress  (165 insns)
//   calls:   -> nStateNode::nStateNode()
//   strings: 'Anton Guenther'
// 0x10013dcf  nStateNode::IsNetworkObjectValid  (165 insns)
//   consts:  f32=0, f64=1.907348633e-06
// 0x10031dae  nStateNode::NetImport  (1 insns)
// 0x100415ce  nStateNode::TriggerRecord  (1 insns)

} // namespace re_nnomads
