#pragma once
// Auto-lifted C++ layout & method spec from ndinput8.dll
// Source ASM: re/disasm/ndinput8/nClass.asm
// Class: nClass

#include <cstdint>

namespace re_ndinput8 {

struct nClass_Layout {
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
};

// Methods (47):
// 0x10001542  nClass::AddRef  (3 insns)
// 0x10001549  nClass::RemRef  (3 insns)
// 0x10001550  nClass::GetRef  (2 insns)
// 0x10001554  nClass::GetCmdList  (2 insns)
// 0x10001558  nClass::GetSuperClass  (2 insns)
// 0x1000155c  nClass::nClass()  (42 insns)
// 0x100015c9  nClass::operator=  (41 insns)
// 0x10001630  nClass::vfunc_00  (41 insns)
// 0x1000180e  nClass::vfunc_01  (41 insns)
// 0x10001a3a  nClass::vfunc_25  (41 insns)
// 0x10002c30  nClass::vfunc_38  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Dispatch
// 0x10002c36  nClass::vfunc_37  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Import
// 0x10002c3c  nClass::vfunc_36  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveCmds
// 0x10002c42  nClass::vfunc_35  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Parse
// 0x10002c48  nClass::vfunc_34  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Clone
// 0x10002c4e  nClass::vfunc_33  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveAs
// 0x10002c54  nClass::vfunc_32  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Save
// 0x10002c5a  nClass::vfunc_31  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsInstanceOf
// 0x10002c60  nClass::vfunc_30  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsA
// 0x10002c66  nClass::vfunc_29  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::GetClass
// 0x10002c6c  nClass::vfunc_28  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SetClass
// 0x10002c72  nClass::vfunc_27  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Release
// 0x10002c78  nClass::vfunc_26  (4 insns)
//   calls:   IAT: nkernel.dll!nRoot::Initialize, IAT: nkernel.dll!nRoot::RemObjectRef, IAT: nkernel.dll!nRoot::~nRoot(), IAT: nkernel.dll!nClass::~nClass()
// 0x10002c90  nClass::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Trigger
// 0x10002c96  nClass::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddModule
// 0x10002c9c  nClass::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::ReadTocFiles
// 0x10002ca2  nClass::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PopCwd
// 0x10002ca8  nClass::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PushCwd
// 0x10002cae  nClass::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetCwd
// 0x10002cb4  nClass::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwd
// 0x10002cba  nClass::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwdObject
// 0x10002cc0  nClass::vfunc_16  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FlushLog
// 0x10002cc6  nClass::vfunc_15  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Log
// 0x10002ccc  nClass::vfunc_14  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetLineBuffer
// 0x10002cd2  nClass::vfunc_13  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::VPrintF
// 0x10002cd8  nClass::vfunc_12  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PrintF
// 0x10002cde  nClass::vfunc_11  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Lookup
// 0x10002ce4  nClass::vfunc_10  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Load
// 0x10002cea  nClass::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::NewNoFail
// 0x10002cf0  nClass::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::New
// 0x10002cf6  nClass::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetClassList
// 0x10002cfc  nClass::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FindClass
// 0x10002d02  nClass::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::CloseClass
// 0x10002d08  nClass::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::OpenClass
// 0x10002d0e  nClass::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::RemClass
// 0x10002d14  nClass::vfunc_02  (6 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddClass, IAT: nkernel.dll!nKernelServer::~nKernelServer(), IAT: nkernel.dll!nRoot::GetFullName, IAT: nkernel.dll!nRoot::AddObjectRef, IAT: nnebula.dll!nInputServer::nInputServer(), IAT: nnebula.dll!nInputServer::~nInputServer()
// 0x10002d38  nClass::vfunc_39  (1 insns)
//   calls:   IAT: nnebula.dll!nInputServer::Trigger

} // namespace re_ndinput8
