#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nScriptServer.asm
// Class: nScriptServer

#include <cstdint>

namespace re_nnebula {

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

// Methods (27):
// 0x10011040  nScriptServer::nScriptServer()  (18 insns)
// 0x10011073  nScriptServer::SetSelectMethod  (3 insns)
// 0x1001107d  nScriptServer::nScriptServer()  (31 insns)
//   calls:   -> nRoot::nRoot()
// 0x100110d4  nScriptServer::operator=  (30 insns)
//   calls:   -> nRoot::operator=
// 0x10011125  nScriptServer::vfunc_00  (41 insns)
// 0x10011181  nScriptServer::SetFailOnError  (3 insns)
// 0x1001118b  nScriptServer::GetFailOnError  (2 insns)
// 0x10037c2a  nScriptServer::vfunc_33  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::Trigger
// 0x10037c30  nScriptServer::vfunc_32  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::EndWrite
// 0x10037c36  nScriptServer::vfunc_31  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WriteEndObject
// 0x10037c3c  nScriptServer::vfunc_30  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WriteCmd
// 0x10037c42  nScriptServer::vfunc_29  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WriteBeginSelObject
// 0x10037c48  nScriptServer::vfunc_28  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WriteBeginNewObjectCmd
// 0x10037c4e  nScriptServer::vfunc_27  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WriteBeginNewObject
// 0x10037c54  nScriptServer::vfunc_26  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::BeginWrite
// 0x10037c5a  nScriptServer::vfunc_25  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::FlushIpc
// 0x10037c60  nScriptServer::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::WaitIpc
// 0x10037c66  nScriptServer::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::KillIpc
// 0x10037c6c  nScriptServer::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::InitIpc
// 0x10037c72  nScriptServer::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::SendMsg
// 0x10037c78  nScriptServer::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::Disconnect
// 0x10037c7e  nScriptServer::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::Connect
// 0x10037c84  nScriptServer::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::Prompt
// 0x10037c8a  nScriptServer::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::RunServer
// 0x10037c90  nScriptServer::vfunc_16  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::RunInteractive
// 0x10037c96  nScriptServer::vfunc_15  (1 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::RunScript
// 0x10037c9c  nScriptServer::vfunc_14  (162 insns)
//   calls:   IAT: nkernel.dll!nScriptServer::Run, IAT: nkernel.dll!nScriptServer::~nScriptServer(), IAT: nkernel.dll!nRoot::GetRelPath, IAT: nkernel.dll!nClass::FindCmdByName, IAT: nkernel.dll!nClass::FindCmdById, IAT: nkernel.dll!nRoot::GetRefs, IAT: nkernel.dll!nRoot::SetFlags, IAT: MSVCRT.dll!??2@YAPAXI@Z, IAT: MSVCRT.dll!??3@YAXPAX@Z, IAT: MSVCRT.dll!_CIacos, IAT: MSVCRT.dll!_ftol, IAT: MSVCRT.dll!_adjust_fdiv

} // namespace re_nnebula
