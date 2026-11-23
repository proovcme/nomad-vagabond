#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nbinscriptserver.asm
// Class: nbinscriptserver : public nscriptserver  (sizeof = 0x78 = 120 bytes)

#include <cstdint>

namespace re_nnebula {

struct nbinscriptserver_Layout {
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
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0108
    uint32_t field_0x0108;
    // +0x010c
    uint32_t field_0x010c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Methods (12):
// 0x10015a22  nbinscriptserver::n_init_nbinscriptserver  (10 insns)
//   strings: 'nscriptserver'
// 0x10015a43  nbinscriptserver::n_fini_nbinscriptserver  (5 insns)
// 0x10015a55  nbinscriptserver::n_new_nbinscriptserver  (31 insns)
//   calls:   -> nScriptServer::nScriptServer()
//   strings: '/sys/servers/file2'
// 0x10015aa9  nbinscriptserver::vfunc_00  (24 insns)
// 0x10015ae7  nbinscriptserver::vfunc_26  (59 insns)
//   calls:   IAT: MSVCRT.dll!sprintf, IAT: nkernel.dll!n_printf
//   strings: 'wb', '$parser:nbinscriptserver$ $class:%s$'
// 0x10015b86  nbinscriptserver::vfunc_32  (14 insns)
// 0x10015ba4  nbinscriptserver::vfunc_27  (35 insns)
// 0x10015bf3  nbinscriptserver::vfunc_28  (6 insns)
// 0x10015c05  nbinscriptserver::vfunc_29  (32 insns)
// 0x10015c5d  nbinscriptserver::vfunc_31  (89 insns)
// 0x10015d4a  nbinscriptserver::vfunc_30  (659 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort, -> nCmdProto::NewCmd, -> nCmdProto::RelCmd
//   strings: 'null', 'script/nbinscriptserver_main.cc'
// 0x10016419  nbinscriptserver::vfunc_15  (75 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   strings: 'rb'

} // namespace re_nnebula
