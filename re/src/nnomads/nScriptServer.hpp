#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nScriptServer.asm
// Class: nScriptServer

#include <cstdint>

namespace re_nnomads {

struct nScriptServer_Layout {
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint8_t field_0x004c;
    // +0x004d
    uint8_t field_0x004d;
    // +0x004e
    uint8_t field_0x004e;
    // +0x004f
    uint8_t field_0x004f;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint8_t field_0x005c;
};

// Script AddCmds (33):
//   v_setstate_s
//   s_getstate_v
//   v_announcestate_s
//   v_announcestatewithtimeoffset_sf
//   s_getannouncedstate_v
//   v_setremoveable_b
//   b_isremoveable_v
//   i_getclanid_v
//   o_getprototype_v
//   o_getclan_v
//   b_isstatetimeover_v
//   b_isfirstframe_v
//   v_setpaused_b
//   b_ispaused_v
//   b_iscinematicfinished_v
//   v_setcinematicfinished_b
//   v_setshowstateswitch_b
//   b_getshowstateswitch_v
//   v_setrecordstarttime_f
//   f_getrecordstarttime_v
//   v_setsymbolicname_s
//   s_getsymbolicname_v
//   v_setthrowevents_b
//   b_getthrowevents_v
//   v_seteventslot_ss
//   s_geteventslot_s
//   b_throwevent_s
//   i_getmachineid_v
//   v_setcreationtime_f
//   f_getcreationtime_v
//   v_setlifetime_f
//   f_getlifetime_v
//   b_islifetimeover_v

// Methods (27):
// 0x1000e079  nScriptServer::nScriptServer()  (18 insns)
// 0x1000e0ac  nScriptServer::SetSelectMethod  (3 insns)
// 0x1000e0b6  nScriptServer::nScriptServer()  (31 insns)
//   calls:   -> nRoot::nRoot()
// 0x1000e10d  nScriptServer::operator=  (30 insns)
//   calls:   -> nRoot::operator=
// 0x1000e15e  nScriptServer::vfunc_00  (41 insns)
// 0x1000e1ba  nScriptServer::SetFailOnError  (3 insns)
// 0x1000e1c4  nScriptServer::GetFailOnError  (175 insns)
//   strings: 'v_setstate_s', 's_getstate_v', 'v_announcestate_s', 'v_announcestatewithtimeoffset_sf', 's_getannouncedstate_v', 'v_setremoveable_b', 'b_isremoveable_v', 'i_getclanid_v'
// 0x10079618  nScriptServer::vfunc_33  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::Trigger
// 0x1007961e  nScriptServer::vfunc_32  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::EndWrite
// 0x10079624  nScriptServer::vfunc_31  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WriteEndObject
// 0x1007962a  nScriptServer::vfunc_30  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WriteCmd
// 0x10079630  nScriptServer::vfunc_29  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WriteBeginSelObject
// 0x10079636  nScriptServer::vfunc_28  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WriteBeginNewObjectCmd
// 0x1007963c  nScriptServer::vfunc_27  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WriteBeginNewObject
// 0x10079642  nScriptServer::vfunc_26  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::BeginWrite
// 0x10079648  nScriptServer::vfunc_25  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::FlushIpc
// 0x1007964e  nScriptServer::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WaitIpc
// 0x10079654  nScriptServer::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::KillIpc
// 0x1007965a  nScriptServer::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::InitIpc
// 0x10079660  nScriptServer::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::SendMsg
// 0x10079666  nScriptServer::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::Disconnect
// 0x1007966c  nScriptServer::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::Connect
// 0x10079672  nScriptServer::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::Prompt
// 0x10079678  nScriptServer::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::RunServer
// 0x1007967e  nScriptServer::vfunc_16  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::RunInteractive
// 0x10079684  nScriptServer::vfunc_15  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::RunScript
// 0x1007968a  nScriptServer::vfunc_14  (16 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::Run, IAT: nkernel.dll!nScriptServer::~nScriptServer(), IAT: nkernel.dll!nClass::AddSubClass, IAT: nkernel.dll!nClass::RemSubClass, IAT: nkernel.dll!nRoot::UnsetFlags, IAT: nkernel.dll!nRoot::AddTail, IAT: nkernel.dll!nRoot::Remove, IAT: nkernel.dll!nRoot::SetName, IAT: nkernel.dll!nHardRefServer::RegisterHardRef, IAT: nkernel.dll!nClass::FindCmdByName, IAT: nkernel.dll!nClass::AddCmd, IAT: nkernel.dll!nRoot::Sort

} // namespace re_nnomads
