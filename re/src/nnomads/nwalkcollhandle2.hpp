#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nwalkcollhandle2.asm
// Class: nwalkcollhandle2 : public nmnlcollhandle2  (sizeof = 0xdc = 220 bytes)

#include <cstdint>

namespace re_nnomads {

struct nwalkcollhandle2_Layout {
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00cc
    float field_0x00cc;
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00d4
    float field_0x00d4;
    // +0x00d8
    uint32_t field_0x00d8;
};

// Methods (8):
// 0x100481fc  nwalkcollhandle2::n_init_nwalkcollhandle2  (15 insns)
//   strings: 'nmnlcollhandle2'
// 0x10048227  nwalkcollhandle2::n_fini_nwalkcollhandle2  (5 insns)
// 0x10048239  nwalkcollhandle2::n_new_nwalkcollhandle2  (25 insns)
//   consts:  f64=0.7853981853
// 0x10049245  nwalkcollhandle2::cmd_setmaxwalkableangle (v_setmaxwalkableangle_f)  (12 insns)
// 0x1004926c  nwalkcollhandle2::cmd_setjumpcheckheight (v_setjumpcheckheight_f)  (10 insns)
// 0x10049291  nwalkcollhandle2::cmd_getjumpcheckheight (f_getjumpcheckheight_v)  (11 insns)
// 0x100492bb  nwalkcollhandle2::cmd_setjumpchecklen (v_setjumpchecklen_f)  (10 insns)
// 0x100492e0  nwalkcollhandle2::cmd_getjumpchecklen (f_getjumpchecklen_v)  (11 insns)

} // namespace re_nnomads
