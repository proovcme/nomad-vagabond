#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nClass.asm
// Class: nClass

#include <cstdint>

namespace re_nnetwork {

struct nClass_Layout {
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
};

// Methods (67):
// 0x10001402  nClass::AddRef  (3 insns)
// 0x10001409  nClass::RemRef  (3 insns)
// 0x10001410  nClass::GetRef  (2 insns)
// 0x10001414  nClass::GetCmdList  (2 insns)
// 0x10001418  nClass::GetSuperClass  (2 insns)
// 0x1000141c  nClass::nClass()  (42 insns)
// 0x10001489  nClass::operator=  (41 insns)
// 0x100014f0  nClass::vfunc_00  (41 insns)
// 0x100016ce  nClass::vfunc_01  (41 insns)
// 0x10001818  nClass::vfunc_25  (41 insns)
// 0x10001913  nClass::vfunc_59  (41 insns)
//   calls:   -> nNetNode::~nNetNode()
// 0x1000bf58  nClass::vfunc_38  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Dispatch
// 0x1000bf5e  nClass::vfunc_37  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Import
// 0x1000bf64  nClass::vfunc_36  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveCmds
// 0x1000bf6a  nClass::vfunc_35  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Parse
// 0x1000bf70  nClass::vfunc_34  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Clone
// 0x1000bf76  nClass::vfunc_33  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveAs
// 0x1000bf7c  nClass::vfunc_32  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Save
// 0x1000bf82  nClass::vfunc_31  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsInstanceOf
// 0x1000bf88  nClass::vfunc_30  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsA
// 0x1000bf8e  nClass::vfunc_29  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::GetClass
// 0x1000bf94  nClass::vfunc_28  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SetClass
// 0x1000bf9a  nClass::vfunc_27  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Release
// 0x1000bfa0  nClass::vfunc_26  (3 insns)
//   calls:   IAT: nkernel.dll!nRoot::Initialize, IAT: nkernel.dll!nRoot::~nRoot(), IAT: nkernel.dll!nClass::~nClass()
// 0x1000bfb2  nClass::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Trigger
// 0x1000bfb8  nClass::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddModule
// 0x1000bfbe  nClass::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::ReadTocFiles
// 0x1000bfc4  nClass::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PopCwd
// 0x1000bfca  nClass::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PushCwd
// 0x1000bfd0  nClass::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetCwd
// 0x1000bfd6  nClass::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwd
// 0x1000bfdc  nClass::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwdObject
// 0x1000bfe2  nClass::vfunc_16  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FlushLog
// 0x1000bfe8  nClass::vfunc_15  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Log
// 0x1000bfee  nClass::vfunc_14  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetLineBuffer
// 0x1000bff4  nClass::vfunc_13  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::VPrintF
// 0x1000bffa  nClass::vfunc_12  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PrintF
// 0x1000c000  nClass::vfunc_11  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Lookup
// 0x1000c006  nClass::vfunc_10  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Load
// 0x1000c00c  nClass::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::NewNoFail
// 0x1000c012  nClass::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::New
// 0x1000c018  nClass::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetClassList
// 0x1000c01e  nClass::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FindClass
// 0x1000c024  nClass::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::CloseClass
// 0x1000c02a  nClass::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::OpenClass
// 0x1000c030  nClass::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::RemClass
// 0x1000c036  nClass::vfunc_02  (2 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddClass, IAT: nkernel.dll!nKernelServer::~nKernelServer()
// 0x1000c042  nClass::vfunc_58  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::Trigger
// 0x1000c048  nClass::vfunc_57  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::EndWrite
// 0x1000c04e  nClass::vfunc_56  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WriteEndObject
// 0x1000c054  nClass::vfunc_55  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WriteCmd
// 0x1000c05a  nClass::vfunc_54  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WriteBeginSelObject
// 0x1000c060  nClass::vfunc_53  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WriteBeginNewObjectCmd
// 0x1000c066  nClass::vfunc_52  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WriteBeginNewObject
// 0x1000c06c  nClass::vfunc_51  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::BeginWrite
// 0x1000c072  nClass::vfunc_50  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::FlushIpc
// 0x1000c078  nClass::vfunc_49  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WaitIpc
// 0x1000c07e  nClass::vfunc_48  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::KillIpc
// 0x1000c084  nClass::vfunc_47  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::InitIpc
// 0x1000c08a  nClass::vfunc_46  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::SendMsg
// 0x1000c090  nClass::vfunc_45  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::Disconnect
// 0x1000c096  nClass::vfunc_44  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::Connect
// 0x1000c09c  nClass::vfunc_43  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::Prompt
// 0x1000c0a2  nClass::vfunc_42  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::RunServer
// 0x1000c0a8  nClass::vfunc_41  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::RunInteractive
// 0x1000c0ae  nClass::vfunc_40  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::RunScript
// 0x1000c0b4  nClass::vfunc_39  (7 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::Run, IAT: nkernel.dll!nRoot::nRoot(), IAT: nkernel.dll!nScriptServer::~nScriptServer(), IAT: nkernel.dll!nClass::EndCmds, IAT: nkernel.dll!nClass::AddCmd, IAT: nkernel.dll!nClass::BeginCmds

} // namespace re_nnetwork
