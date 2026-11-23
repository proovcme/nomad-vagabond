#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/ntclserver.asm
// Class: ntclserver : public nscriptserver  (sizeof = 0x288 = 648 bytes)

#include <cstdint>

namespace re_nnebula {

struct ntclserver_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0038
    uint32_t field_0x0038;
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
    // +0x005c
    uint8_t field_0x005c;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0078
    uint32_t field_0x0078;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0084
    uint8_t field_0x0084;
    // +0x0108
    uint32_t field_0x0108;
    // +0x010c
    uint32_t field_0x010c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0284
    uint8_t field_0x0284;
    // +0x0285
    uint8_t field_0x0285;
};

// Methods (17):
// 0x100139de  ntclserver::n_init_ntclserver  (10 insns)
//   strings: 'nscriptserver'
// 0x100139ff  ntclserver::n_fini_ntclserver  (5 insns)
// 0x10013a11  ntclserver::n_new_ntclserver  (264 insns)
//   calls:   IAT: tcl84.dll!Tcl_EvalEx, IAT: tcl84.dll!Tcl_CreateObjCommand, IAT: MSVCRT.dll!strchr, IAT: nkernel.dll!n_printf, IAT: tcl84.dll!Tcl_SetVar, IAT: tcl84.dll!Tcl_Init, IAT: tcl84.dll!Tcl_DeleteCommand, -> nScriptServer::nScriptServer(), IAT: tcl84.dll!Tcl_CreateInterp
//   strings: 'home:bin/tcl/tcl8.4', 'rename puts tcl_puts', 'puts', 'tcl_library', 'rename unknown tcl_unknown', 'unknown', 'new', 'delete'
// 0x10013d2c  ntclserver::vfunc_00  (37 insns)
//   calls:   IAT: tcl84.dll!Tcl_DeleteInterp
// 0x10013d92  ntclserver::vfunc_34  (22 insns)
//   calls:   IAT: tcl84.dll!Tcl_DeleteInterp
// 0x10013dd9  ntclserver::vfunc_26  (61 insns)
//   calls:   IAT: MSVCRT.dll!sprintf, IAT: nkernel.dll!n_printf
// 0x10013e7d  ntclserver::vfunc_32  (92 insns)
//   strings: 'sel '
// 0x10013f76  ntclserver::vfunc_27  (79 insns)
//   strings: 'new '
// 0x10014042  ntclserver::vfunc_28  (17 insns)
// 0x1001406a  ntclserver::vfunc_29  (6 insns)
// 0x10014080  ntclserver::vfunc_31  (64 insns)
//   strings: 'sel '
// 0x1001412e  ntclserver::vfunc_30  (115 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: ' ???', ' { %s }', ' %s', ' null', ' "%s"', ' %.6f', ' %d'
// 0x10014284  ntclserver::vfunc_18  (75 insns)
//   calls:   IAT: MSVCRT.dll!sprintf, IAT: nkernel.dll!n_strncpy2
//   strings: '%s:', 'psel'
// 0x10014348  ntclserver::vfunc_14  (50 insns)
//   calls:   IAT: tcl84.dll!Tcl_EvalEx, IAT: tcl84.dll!Tcl_GetObjResult, IAT: tcl84.dll!Tcl_GetString, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Aborting.', 'script/ntclrun.cc'
// 0x100143cf  ntclserver::vfunc_15  (58 insns)
//   calls:   IAT: tcl84.dll!Tcl_EvalFile, IAT: tcl84.dll!Tcl_GetObjResult, IAT: tcl84.dll!Tcl_GetString, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Aborting.', 'script/ntclrun.cc'
// 0x10014485  ntclserver::vfunc_16  (292 insns)
//   calls:   IAT: tcl84.dll!Tcl_NewObj, IAT: tcl84.dll!Tcl_NewStringObj, IAT: tcl84.dll!Tcl_GetStdChannel, IAT: tcl84.dll!Tcl_ObjGetVar2, IAT: tcl84.dll!Tcl_EvalObjEx, IAT: tcl84.dll!Tcl_GetObjResult, IAT: tcl84.dll!Tcl_GetStringFromObj, IAT: tcl84.dll!Tcl_Write, IAT: tcl84.dll!Tcl_AddErrorInfo, IAT: MSVCRT.dll!sprintf, IAT: tcl84.dll!Tcl_Flush, IAT: tcl84.dll!Tcl_GetsObj
//   strings: 'tcl_prompt1', 'tcl_prompt2', '%s:', 'psel'
// 0x100147fb  ntclserver::vfunc_33  (1682 insns)
//   calls:   IAT: tcl84.dll!Tcl_DoOneEvent, -> nScriptServer::vfunc_33, IAT: tcl84.dll!Tcl_SetResult, IAT: nkernel.dll!n_printf, IAT: tcl84.dll!Tcl_GetString, IAT: tcl84.dll!Tcl_ConcatObj, IAT: tcl84.dll!TclFreeObj, IAT: MSVCRT.dll!sprintf, IAT: tcl84.dll!Tcl_ResetResult, IAT: tcl84.dll!Tcl_GetObjResult, -> nRoot::GetHead, IAT: tcl84.dll!Tcl_AppendToObj
//   strings: "Syntax is 'name = new class name'", "Syntax is 'delete name'", "Object '%s' does not exist.", "Syntax is 'name = sel name'", "Syntax is 'name = psel'", 'No object selected.', "Syntax is 'dir'", 'No selected object.'

} // namespace re_nnebula
