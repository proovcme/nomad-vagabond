#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nthreshnode.asm
// Class: nthreshnode : public nanimnode  (sizeof = 0xc0 = 192 bytes)

#include <cstdint>

namespace re_nnebula {

struct nthreshnode_Layout {
    // +0x0004
    float field_0x0004;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    float field_0x00b8;
    // +0x00bc
    float field_0x00bc;
};

// Script AddCmds (4):
//   v_setlowerbound_f
//   f_getlowerbound_v
//   v_setupperbound_f
//   f_getupperbound_v

// Methods (7):
// 0x100332e5  nthreshnode::n_init_nthreshnode  (15 insns)
//   strings: 'nanimnode'
// 0x10033310  nthreshnode::n_fini_nthreshnode  (5 insns)
// 0x10033322  nthreshnode::n_new_nthreshnode  (20 insns)
//   calls:   -> nAnimNode::nAnimNode()
// 0x10033359  nthreshnode::n_version_nthreshnode  (2 insns)
// 0x1003335f  nthreshnode::vfunc_00  (13 insns)
//   calls:   -> nAnimNode::~nAnimNode()
// 0x10033386  nthreshnode::vfunc_14  (60 insns)
//   calls:   -> nVisNode::Attach
//   strings: 'v_setlowerbound_f', 'f_getlowerbound_v', 'v_setupperbound_f', 'f_getupperbound_v'
// 0x100334a1  nthreshnode::vfunc_11  (54 insns)
//   calls:   -> nAnimNode::SaveCmds

} // namespace re_nnebula
