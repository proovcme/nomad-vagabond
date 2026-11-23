#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nClass.asm
// Class: nClass

#include <cstdint>

namespace re_nnature {

struct nClass_Layout {
    // +0x0030
    uint32_t field_0x0030;
};

// Methods (34):
// 0x1000151c  nClass::AddRef  (3 insns)
// 0x10001523  nClass::RemRef  (3 insns)
// 0x1000152a  nClass::GetRef  (2 insns)
// 0x1000152e  nClass::GetCmdList  (2 insns)
// 0x10001532  nClass::nClass()  (42 insns)
// 0x1000159f  nClass::operator=  (41 insns)
// 0x10001606  nClass::vfunc_00  (41 insns)
// 0x100017e4  nClass::vfunc_01  (41 insns)
// 0x10001939  nClass::vfunc_25  (41 insns)
// 0x1000dd6e  nClass::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Trigger
// 0x1000dd74  nClass::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddModule
// 0x1000dd7a  nClass::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::ReadTocFiles
// 0x1000dd80  nClass::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PopCwd
// 0x1000dd86  nClass::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PushCwd
// 0x1000dd8c  nClass::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetCwd
// 0x1000dd92  nClass::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwd
// 0x1000dd98  nClass::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwdObject
// 0x1000dd9e  nClass::vfunc_16  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FlushLog
// 0x1000dda4  nClass::vfunc_15  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Log
// 0x1000ddaa  nClass::vfunc_14  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetLineBuffer
// 0x1000ddb0  nClass::vfunc_13  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::VPrintF
// 0x1000ddb6  nClass::vfunc_12  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PrintF
// 0x1000ddbc  nClass::vfunc_11  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Lookup
// 0x1000ddc2  nClass::vfunc_10  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Load
// 0x1000ddc8  nClass::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::NewNoFail
// 0x1000ddce  nClass::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::New
// 0x1000ddd4  nClass::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetClassList
// 0x1000ddda  nClass::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FindClass
// 0x1000dde0  nClass::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::CloseClass
// 0x1000dde6  nClass::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::OpenClass
// 0x1000ddec  nClass::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::RemClass
// 0x1000ddf2  nClass::vfunc_02  (6 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddClass, IAT: nkernel.dll!nKernelServer::~nKernelServer(), IAT: nkernel.dll!nRoot::AddObjectRef, IAT: nkernel.dll!nRoot::RemObjectRef, IAT: nkernel.dll!nRoot::nRoot(), IAT: nkernel.dll!nRoot::GetFullName
// 0x1000df00  nClass::vfunc_43  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::AttachChannels
// 0x1000df1e  nClass::vfunc_36  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::SaveCmds

} // namespace re_nnature
