#pragma once
// Auto-lifted C++ layout & method spec from ndirect3d8.dll
// Source ASM: re/disasm/ndirect3d8/nClass.asm
// Class: nClass

#include <cstdint>

namespace re_ndirect3d8 {

struct nClass_Layout {
    // +0x0030
    uint32_t field_0x0030;
};

// Methods (37):
// 0x10001246  nClass::AddRef  (3 insns)
// 0x1000124d  nClass::RemRef  (3 insns)
// 0x10001254  nClass::GetRef  (2 insns)
// 0x10001258  nClass::GetCmdList  (2 insns)
// 0x10001260  nClass::nClass()  (42 insns)
// 0x100012cd  nClass::operator=  (41 insns)
// 0x10001334  nClass::vfunc_00  (41 insns)
// 0x10001437  nClass::vfunc_01  (41 insns)
// 0x10001686  nClass::vfunc_15  (41 insns)
// 0x1000185b  nClass::vfunc_39  (41 insns)
// 0x1000a304  nClass::vfunc_38  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Trigger
// 0x1000a30a  nClass::vfunc_37  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddModule
// 0x1000a310  nClass::vfunc_36  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::ReadTocFiles
// 0x1000a316  nClass::vfunc_35  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PopCwd
// 0x1000a31c  nClass::vfunc_34  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PushCwd
// 0x1000a322  nClass::vfunc_33  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetCwd
// 0x1000a328  nClass::vfunc_32  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwd
// 0x1000a32e  nClass::vfunc_31  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwdObject
// 0x1000a334  nClass::vfunc_30  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FlushLog
// 0x1000a33a  nClass::vfunc_29  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Log
// 0x1000a340  nClass::vfunc_28  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetLineBuffer
// 0x1000a346  nClass::vfunc_27  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::VPrintF
// 0x1000a34c  nClass::vfunc_26  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PrintF
// 0x1000a352  nClass::vfunc_25  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Lookup
// 0x1000a358  nClass::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Load
// 0x1000a35e  nClass::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::NewNoFail
// 0x1000a364  nClass::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::New
// 0x1000a36a  nClass::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetClassList
// 0x1000a370  nClass::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FindClass
// 0x1000a376  nClass::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::CloseClass
// 0x1000a37c  nClass::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::OpenClass
// 0x1000a382  nClass::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::RemClass
// 0x1000a388  nClass::vfunc_16  (7 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddClass, IAT: nkernel.dll!nKernelServer::~nKernelServer(), IAT: nkernel.dll!nRoot::RemObjectRef, IAT: nkernel.dll!nRoot::GetFullName, IAT: nkernel.dll!nRoot::AddObjectRef, IAT: nkernel.dll!nRoot::nRoot(), IAT: nkernel.dll!nRoot::Find
// 0x1000a3b2  nClass::vfunc_51  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::WriteLine
// 0x1000a3d0  nClass::vfunc_46  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::ReadLine
// 0x1000a3ee  nClass::vfunc_41  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::Close
// 0x1000a3f4  nClass::vfunc_40  (2 insns)
//   calls:   IAT: nnebula.dll!nImageFile::Open, IAT: nnebula.dll!nImageFile::~nImageFile()

} // namespace re_ndirect3d8
