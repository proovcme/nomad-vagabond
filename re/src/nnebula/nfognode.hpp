#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nfognode.asm
// Class: nfognode : public nvisnode  (sizeof = 0xd4 = 212 bytes)

#include <cstdint>

namespace re_nnebula {

struct nfognode_Layout {
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
    // +0x00ac
    uint32_t field_0x00ac;
    // +0x00b4
    uint32_t field_0x00b4;
    // +0x00b8
    float field_0x00b8;
    // +0x00bc
    float field_0x00bc;
    // +0x00c0
    float field_0x00c0;
    // +0x00c4
    float field_0x00c4;
    // +0x00c8
    float field_0x00c8;
    // +0x00cc
    float field_0x00cc;
    // +0x00d0
    float field_0x00d0;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (6):
//   v_setmode_s
//   s_getmode_v
//   v_setrange_ff
//   v_setdensity_f
//   f_getdensity_v
//   v_setcolor_ffff

// Methods (22):
// 0x10028ce1  nfognode::n_init_nfognode  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nvisnode', 'node/nfog_init.cc'
// 0x10028d3c  nfognode::n_fini_nfognode  (14 insns)
// 0x10028d5f  nfognode::n_new_nfognode  (10 insns)
// 0x10028d79  nfognode::n_version_nfognode  (38 insns)
//   calls:   -> nVisNode::nVisNode()
//   strings: '/sys/servers/gfx'
// 0x10028e01  nfognode::vfunc_00  (24 insns)
//   calls:   -> nVisNode::~nVisNode()
// 0x10028e42  nfognode::vfunc_21  (3 insns)
// 0x10028e4f  nfognode::vfunc_25  (2 insns)
// 0x10028e56  nfognode::vfunc_22  (5 insns)
// 0x10028e6d  nfognode::vfunc_26  (7 insns)
// 0x10028e88  nfognode::vfunc_23  (3 insns)
// 0x10028e95  nfognode::vfunc_27  (2 insns)
// 0x10028e9c  nfognode::vfunc_24  (9 insns)
// 0x10028ec7  nfognode::vfunc_28  (13 insns)
// 0x10028efa  nfognode::vfunc_14  (17 insns)
//   calls:   -> nVisNode::Attach
// 0x10028f2b  nfognode::vfunc_15  (104 insns)
//   calls:   -> nVisNode::Compute
//   strings: 'v_setmode_s', 's_getmode_v', 'v_setrange_ff', 'ff_getrange_v', 'v_setdensity_f', 'f_getdensity_v', 'v_setcolor_ffff', 'ffff_getcolor_v'
// 0x100290aa  nfognode::cmd_setmode (v_setmode_s)  (105 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'linear', 'exp', 'exp2', 'node/nfog_cmds.cc'
// 0x100291a4  nfognode::cmd_getmode (s_getmode_v)  (34 insns)
//   strings: 'exp2', 'exp', 'linear'
// 0x10029211  nfognode::cmd_setrange (v_setrange_ff)  (48 insns)
// 0x10029294  nfognode::cmd_setdensity (v_setdensity_f)  (13 insns)
// 0x100292bc  nfognode::cmd_getdensity (f_getdensity_v)  (14 insns)
// 0x100292e7  nfognode::cmd_setcolor (v_setcolor_ffff)  (76 insns)
// 0x100293c5  nfognode::vfunc_11  (172 insns)
//   calls:   -> nVisNode::SaveCmds
//   strings: 'exp2', 'exp', 'linear'

} // namespace re_nnebula
