#pragma once
// Auto-lifted C++ layout & method spec from ncollide.dll
// Source ASM: re/disasm/ncollide/nClass.asm
// Class: nClass

#include <cstdint>

namespace re_ncollide {

struct nClass_Layout {
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
};

// Methods (36):
// 0x10001275  nClass::AddRef  (3 insns)
// 0x1000127c  nClass::RemRef  (3 insns)
// 0x10001283  nClass::GetRef  (2 insns)
// 0x10001287  nClass::GetCmdList  (2 insns)
// 0x1000128b  nClass::GetSuperClass  (2 insns)
// 0x1000128f  nClass::nClass()  (42 insns)
// 0x100012fc  nClass::operator=  (41 insns)
// 0x10001363  nClass::vfunc_00  (41 insns)
// 0x10001466  nClass::vfunc_01  (41 insns)
// 0x100016b5  nClass::vfunc_15  (41 insns)
// 0x10001822  nClass::vfunc_39  (41 insns)
//   calls:   -> nCollideContext::~nCollideContext()
// 0x10001a0a  nClass::vfunc_50  (41 insns)
//   calls:   -> nCollideShape::~nCollideShape()
// 0x10001c51  nClass::vfunc_60  (41 insns)
//   calls:   -> nCollideServer::~nCollideServer()
// 0x10007312  nClass::vfunc_38  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Trigger
// 0x10007318  nClass::vfunc_37  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddModule
// 0x1000731e  nClass::vfunc_36  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::ReadTocFiles
// 0x10007324  nClass::vfunc_35  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PopCwd
// 0x1000732a  nClass::vfunc_34  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PushCwd
// 0x10007330  nClass::vfunc_33  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetCwd
// 0x10007336  nClass::vfunc_32  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwd
// 0x1000733c  nClass::vfunc_31  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwdObject
// 0x10007342  nClass::vfunc_30  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FlushLog
// 0x10007348  nClass::vfunc_29  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Log
// 0x1000734e  nClass::vfunc_28  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetLineBuffer
// 0x10007354  nClass::vfunc_27  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::VPrintF
// 0x1000735a  nClass::vfunc_26  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PrintF
// 0x10007360  nClass::vfunc_25  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Lookup
// 0x10007366  nClass::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Load
// 0x1000736c  nClass::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::NewNoFail
// 0x10007372  nClass::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::New
// 0x10007378  nClass::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetClassList
// 0x1000737e  nClass::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FindClass
// 0x10007384  nClass::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::CloseClass
// 0x1000738a  nClass::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::OpenClass
// 0x10007390  nClass::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::RemClass
// 0x10007396  nClass::vfunc_16  (6 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddClass, IAT: nkernel.dll!nKernelServer::~nKernelServer(), IAT: nkernel.dll!nRoot::nRoot(), IAT: nkernel.dll!nClass::EndCmds, IAT: nkernel.dll!nClass::AddCmd, IAT: nkernel.dll!nClass::BeginCmds

} // namespace re_ncollide
