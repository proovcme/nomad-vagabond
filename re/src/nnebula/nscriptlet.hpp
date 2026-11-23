#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nscriptlet.asm
// Class: nscriptlet : public nroot  (sizeof = 0x7c = 124 bytes)

#include <cstdint>

namespace re_nnebula {

struct nscriptlet_Layout {
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
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x0068
    uint32_t field_0x0068;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0078
    uint8_t field_0x0078;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (6):
//   v_setautorun_b
//   b_getautorun_v
//   b_parsefile_s
//   v_setscript_c
//   c_getscript_v
//   s_run_v

// Methods (12):
// 0x100350ae  nscriptlet::n_init_nscriptlet  (15 insns)
//   strings: 'nroot'
// 0x100350d9  nscriptlet::n_fini_nscriptlet  (5 insns)
// 0x100350eb  nscriptlet::n_new_nscriptlet  (10 insns)
// 0x10035102  nscriptlet::n_version_nscriptlet  (38 insns)
//   strings: '/sys/servers/script', '/sys/servers/file'
// 0x10035177  nscriptlet::vfunc_00  (75 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x10035237  nscriptlet::vfunc_15  (21 insns)
// 0x10035264  nscriptlet::vfunc_14  (45 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'script/nscriptlet_main.cc', 'v_setautorun_b', 'b_getautorun_v', 'b_parsefile_s', 'v_setscript_c', 'c_getscript_v', 's_run_v'
// 0x10035320  nscriptlet::cmd_setautorun (v_setautorun_b)  (12 insns)
// 0x10035346  nscriptlet::cmd_getautorun (b_getautorun_v)  (13 insns)
// 0x10035371  nscriptlet::cmd_setscript (v_setscript_c)  (10 insns)
// 0x10035394  nscriptlet::cmd_getscript (c_getscript_v)  (16 insns)
// 0x100353f1  nscriptlet::vfunc_11  (64 insns)
//   calls:   -> nAnimCurveArray::vfunc_11

} // namespace re_nnebula
