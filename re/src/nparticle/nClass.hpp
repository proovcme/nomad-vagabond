#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nClass.asm
// Class: nClass

#include <cstdint>

namespace re_nparticle {

struct nClass_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
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
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint8_t field_0x0034;
};

// Methods (32):
// 0x10001570  nClass::AddRef  (3 insns)
// 0x10001577  nClass::RemRef  (3 insns)
// 0x1000157e  nClass::GetRef  (2 insns)
// 0x10001582  nClass::GetCmdList  (2 insns)
// 0x1000158a  nClass::nClass()  (42 insns)
// 0x100015f7  nClass::operator=  (41 insns)
// 0x1000165e  nClass::vfunc_00  (41 insns)
// 0x10001761  nClass::vfunc_01  (41 insns)
// 0x100019b0  nClass::vfunc_15  (387 insns)
//   calls:   IAT: MSVCRT.dll!memmove
// 0x1000965c  nClass::vfunc_38  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Trigger
// 0x10009662  nClass::vfunc_37  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddModule
// 0x10009668  nClass::vfunc_36  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::ReadTocFiles
// 0x1000966e  nClass::vfunc_35  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PopCwd
// 0x10009674  nClass::vfunc_34  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PushCwd
// 0x1000967a  nClass::vfunc_33  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetCwd
// 0x10009680  nClass::vfunc_32  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwd
// 0x10009686  nClass::vfunc_31  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwdObject
// 0x1000968c  nClass::vfunc_30  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FlushLog
// 0x10009692  nClass::vfunc_29  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Log
// 0x10009698  nClass::vfunc_28  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetLineBuffer
// 0x1000969e  nClass::vfunc_27  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::VPrintF
// 0x100096a4  nClass::vfunc_26  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PrintF
// 0x100096aa  nClass::vfunc_25  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Lookup
// 0x100096b0  nClass::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Load
// 0x100096b6  nClass::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::NewNoFail
// 0x100096bc  nClass::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::New
// 0x100096c2  nClass::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetClassList
// 0x100096c8  nClass::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FindClass
// 0x100096ce  nClass::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::CloseClass
// 0x100096d4  nClass::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::OpenClass
// 0x100096da  nClass::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::RemClass
// 0x100096e0  nClass::vfunc_16  (8 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddClass, IAT: nkernel.dll!nKernelServer::~nKernelServer(), IAT: nkernel.dll!nClass::EndCmds, IAT: nkernel.dll!nClass::AddCmd, IAT: nkernel.dll!nClass::BeginCmds, IAT: nkernel.dll!nRoot::RemObjectRef, IAT: nkernel.dll!nRoot::GetFullName, IAT: nkernel.dll!nRoot::AddObjectRef

} // namespace re_nparticle
