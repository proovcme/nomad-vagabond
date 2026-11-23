#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nClass.asm
// Class: nClass

#include <cstdint>

namespace re_nnebula {

struct nClass_Layout {
    // +0x0030
    uint32_t field_0x0030;
};

// Methods (31):
// 0x100014f5  nClass::AddRef  (3 insns)
// 0x100014fc  nClass::RemRef  (3 insns)
// 0x10001503  nClass::GetRef  (2 insns)
// 0x10001507  nClass::GetCmdList  (2 insns)
// 0x1000150f  nClass::nClass()  (42 insns)
// 0x1000157c  nClass::operator=  (41 insns)
// 0x100015e3  nClass::vfunc_00  (41 insns)
// 0x100017c1  nClass::vfunc_01  (41 insns)
// 0x10037aaa  nClass::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Trigger
// 0x10037ab0  nClass::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddModule
// 0x10037ab6  nClass::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::ReadTocFiles
// 0x10037abc  nClass::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PopCwd
// 0x10037ac2  nClass::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PushCwd
// 0x10037ac8  nClass::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetCwd
// 0x10037ace  nClass::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwd
// 0x10037ad4  nClass::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwdObject
// 0x10037ada  nClass::vfunc_16  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FlushLog
// 0x10037ae0  nClass::vfunc_15  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Log
// 0x10037ae6  nClass::vfunc_14  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetLineBuffer
// 0x10037aec  nClass::vfunc_13  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::VPrintF
// 0x10037af2  nClass::vfunc_12  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PrintF
// 0x10037af8  nClass::vfunc_11  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Lookup
// 0x10037afe  nClass::vfunc_10  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Load
// 0x10037b04  nClass::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::NewNoFail
// 0x10037b0a  nClass::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::New
// 0x10037b10  nClass::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetClassList
// 0x10037b16  nClass::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FindClass
// 0x10037b1c  nClass::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::CloseClass
// 0x10037b22  nClass::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::OpenClass
// 0x10037b28  nClass::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::RemClass
// 0x10037b2e  nClass::vfunc_02  (2 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddClass, IAT: nkernel.dll!nKernelServer::~nKernelServer()

} // namespace re_nnebula
