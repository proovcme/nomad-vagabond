#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nClass.asm
// Class: nClass

#include <cstdint>

namespace re_nnomads {

struct nClass_Layout {
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
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0030
    float field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
};

// Methods (31):
// 0x100015ec  nClass::AddRef  (3 insns)
// 0x100015f3  nClass::RemRef  (3 insns)
// 0x100015fa  nClass::GetRef  (2 insns)
// 0x100015fe  nClass::GetCmdList  (2 insns)
// 0x10001606  nClass::nClass()  (42 insns)
// 0x10001673  nClass::operator=  (41 insns)
// 0x100016da  nClass::vfunc_00  (41 insns)
// 0x100018b8  nClass::vfunc_01  (388 insns)
//   consts:  f64=0, f64=1, f32=0, f32=1
// 0x1007944a  nClass::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Trigger
// 0x10079450  nClass::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddModule
// 0x10079456  nClass::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::ReadTocFiles
// 0x1007945c  nClass::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PopCwd
// 0x10079462  nClass::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PushCwd
// 0x10079468  nClass::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetCwd
// 0x1007946e  nClass::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwd
// 0x10079474  nClass::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwdObject
// 0x1007947a  nClass::vfunc_16  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FlushLog
// 0x10079480  nClass::vfunc_15  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Log
// 0x10079486  nClass::vfunc_14  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetLineBuffer
// 0x1007948c  nClass::vfunc_13  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::VPrintF
// 0x10079492  nClass::vfunc_12  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PrintF
// 0x10079498  nClass::vfunc_11  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Lookup
// 0x1007949e  nClass::vfunc_10  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Load
// 0x100794a4  nClass::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::NewNoFail
// 0x100794aa  nClass::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::New
// 0x100794b0  nClass::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetClassList
// 0x100794b6  nClass::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FindClass
// 0x100794bc  nClass::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::CloseClass
// 0x100794c2  nClass::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::OpenClass
// 0x100794c8  nClass::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::RemClass
// 0x100794ce  nClass::vfunc_02  (9 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddClass, IAT: nkernel.dll!nKernelServer::~nKernelServer(), IAT: nkernel.dll!nClass::EndCmds, IAT: nkernel.dll!nClass::AddCmd, IAT: nkernel.dll!nClass::BeginCmds, IAT: nkernel.dll!nRoot::GetFullName, IAT: nkernel.dll!nRoot::RemObjectRef, IAT: nkernel.dll!nRoot::AddObjectRef, IAT: nkernel.dll!nBitStream::~nBitStream()

} // namespace re_nnomads
