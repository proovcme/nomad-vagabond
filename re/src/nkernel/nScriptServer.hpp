#pragma once
// Auto-lifted C++ layout & method spec from nkernel.dll
// Source ASM: re/disasm/nkernel/nScriptServer.asm
// Class: nScriptServer

#include <cstdint>

namespace re_nkernel {

struct nScriptServer_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
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
    // +0x008c
    uint32_t field_0x008c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0290
    uint32_t field_0x0290;
    // +0x0298
    uint32_t field_0x0298;
    // +0x029c
    uint32_t field_0x029c;
};

// Script AddCmds (9):
//   b_setsavemode_s
//   s_getsavemode_v
//   b_setassign_ss
//   s_getassign_s
//   v_setsavelevel_i
//   i_getsavelevel_v
//   s_manglepath_s
//   v_setsaverclass_s
//   s_getsaverclass_v

// Methods (26):
// 0x1000249a  nScriptServer::nScriptServer()  (18 insns)
//   calls:   -> nRoot::nRoot()
// 0x100024cd  nScriptServer::SetSelectMethod  (3 insns)
// 0x100024d7  nScriptServer::GetSelectMethod  (2 insns)
// 0x100024db  nScriptServer::nScriptServer()  (31 insns)
//   calls:   -> nRoot::nRoot()
// 0x10002532  nScriptServer::operator=  (30 insns)
//   calls:   -> nRoot::operator=
// 0x10002583  nScriptServer::vfunc_00  (41 insns)
//   calls:   -> nScriptServer::~nScriptServer()
// 0x100025df  nScriptServer::SetFailOnError  (3 insns)
// 0x100025e9  nScriptServer::GetFailOnError  (571 insns)
//   calls:   IAT: MSVCRT.dll!remove, IAT: MSVCRT.dll!_rmdir, IAT: MSVCRT.dll!sprintf, -> n_printf, IAT: MSVCRT.dll!_mkdir, -> nRoot::GetFullName, IAT: MSVCRT.dll!abort, -> nRoot::AddObjectRef
//   strings: '..', '%s.n', 'Could not open file for writing!', 'kernel/nfile_beginend.cc', 'mkdir() failed!', '.n', '_main.n', 'NOT INITIALIZED'
// 0x10003405  nScriptServer::~nScriptServer()  (27 insns)
//   calls:   -> nScriptServer::FlushIpc, -> nScriptServer::Disconnect, -> nRoot::~nRoot()
// 0x1000344b  nScriptServer::Run  (7 insns)
//   calls:   -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'pure virtual function called!', 'kernel/nscript_init.cc'
// 0x1000346a  nScriptServer::RunScript  (7 insns)
//   calls:   -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'pure virtual function called!', 'kernel/nscript_init.cc'
// 0x10003489  nScriptServer::BeginWrite  (7 insns)
//   calls:   -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'pure virtual function called!', 'kernel/nscript_init.cc'
// 0x100034a8  nScriptServer::WriteBeginNewObject  (7 insns)
//   calls:   -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'pure virtual function called!', 'kernel/nscript_init.cc'
// 0x100034c7  nScriptServer::WriteBeginNewObjectCmd  (7 insns)
//   calls:   -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'pure virtual function called!', 'kernel/nscript_init.cc'
// 0x100034e6  nScriptServer::WriteBeginSelObject  (7 insns)
//   calls:   -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'pure virtual function called!', 'kernel/nscript_init.cc'
// 0x10003508  nScriptServer::WriteCmd  (7 insns)
//   calls:   -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'pure virtual function called!', 'kernel/nscript_init.cc'
// 0x1000352a  nScriptServer::WriteEndObject  (7 insns)
//   calls:   -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'pure virtual function called!', 'kernel/nscript_init.cc'
// 0x1000354c  nScriptServer::EndWrite  (7 insns)
//   calls:   -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'pure virtual function called!', 'kernel/nscript_init.cc'
// 0x1000356e  nScriptServer::RunInteractive  (7 insns)
//   calls:   -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nScriptServer::RunInteractive(): pure virtual function called!', 'kernel/nscriptrun.cc'
// 0x1000358d  nScriptServer::Prompt  (7 insns)
//   calls:   -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'pure virtual function called!', 'kernel/nscriptrun.cc'
// 0x100035ac  nScriptServer::RunServer  (35 insns)
//   calls:   -> n_printf
// 0x10003601  nScriptServer::Connect  (2 insns)
// 0x10003606  nScriptServer::FlushIpc  (1 insns)
// 0x10003607  nScriptServer::Disconnect  (1 insns)
// 0x1000360a  nScriptServer::SendMsg  (2 insns)
// 0x10003612  nScriptServer::Trigger  (1148 insns)
//   calls:   -> nClass::BeginCmds, -> nClass::AddCmd, -> nClass::EndCmds, -> n_free, -> n_strdup, IAT: MSVCRT.dll!strchr, -> n_printf, -> n_strncpy2, IAT: MSVCRT.dll!strstr, IAT: MSVCRT.dll!_stricmp, IAT: MSVCRT.dll!strrchr, -> nRoot::AddRef
//   strings: 'b_setsavemode_s', 's_getsavemode_v', 'b_setassign_ss', 's_getassign_s', 'v_setsavelevel_i', 'i_getsavelevel_v', 's_manglepath_s', 'v_setsaverclass_s'

} // namespace re_nkernel
