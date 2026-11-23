#pragma once
// Auto-lifted C++ layout & method spec from ndsound.dll
// Source ASM: re/disasm/ndsound/nClass.asm
// Class: nClass

#include <cstdint>

namespace re_ndsound {

struct nClass_Layout {
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
};

// Methods (38):
// 0x10001bcd  nClass::AddRef  (3 insns)
// 0x10001bd4  nClass::RemRef  (3 insns)
// 0x10001bdb  nClass::GetRef  (2 insns)
// 0x10001bdf  nClass::GetCmdList  (2 insns)
// 0x10001be3  nClass::GetSuperClass  (2 insns)
// 0x10001be7  nClass::nClass()  (42 insns)
// 0x10001c54  nClass::operator=  (41 insns)
// 0x10001cbb  nClass::vfunc_00  (41 insns)
// 0x10001e99  nClass::vfunc_01  (41 insns)
// 0x10002032  nClass::vfunc_25  (41 insns)
// 0x10003184  nClass::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Trigger
// 0x1000318a  nClass::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddModule
// 0x10003190  nClass::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::ReadTocFiles
// 0x10003196  nClass::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PopCwd
// 0x1000319c  nClass::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PushCwd
// 0x100031a2  nClass::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetCwd
// 0x100031a8  nClass::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwd
// 0x100031ae  nClass::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwdObject
// 0x100031b4  nClass::vfunc_16  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FlushLog
// 0x100031ba  nClass::vfunc_15  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Log
// 0x100031c0  nClass::vfunc_14  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetLineBuffer
// 0x100031c6  nClass::vfunc_13  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::VPrintF
// 0x100031cc  nClass::vfunc_12  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PrintF
// 0x100031d2  nClass::vfunc_11  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Lookup
// 0x100031d8  nClass::vfunc_10  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Load
// 0x100031de  nClass::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::NewNoFail
// 0x100031e4  nClass::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::New
// 0x100031ea  nClass::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetClassList
// 0x100031f0  nClass::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FindClass
// 0x100031f6  nClass::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::CloseClass
// 0x100031fc  nClass::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::OpenClass
// 0x10003202  nClass::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::RemClass
// 0x10003208  nClass::vfunc_02  (3 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddClass, IAT: nkernel.dll!nKernelServer::~nKernelServer(), IAT: nkernel.dll!nRoot::AddRef
// 0x10003274  nClass::vfunc_43  (1 insns)
//   calls:   IAT: nnebula.dll!nStream::Close
// 0x1000327a  nClass::vfunc_42  (1 insns)
//   calls:   IAT: nnebula.dll!nStream::Seek
// 0x10003280  nClass::vfunc_41  (1 insns)
//   calls:   IAT: nnebula.dll!nStream::Tell
// 0x10003286  nClass::vfunc_40  (1 insns)
//   calls:   IAT: nnebula.dll!nStream::Read
// 0x1000328c  nClass::vfunc_39  (2 insns)
//   calls:   IAT: nnebula.dll!nStream::Open, IAT: nnebula.dll!nStream::~nStream()

} // namespace re_ndsound
