#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nlinknode.asm
// Class: nlinknode : public nvisnode  (sizeof = 0xb4 = 180 bytes)

#include <cstdint>

namespace re_nnebula {

struct nlinknode_Layout {
    // +0x00ac
    uint32_t field_0x00ac;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (2):
//   v_settarget_s
//   s_gettarget_v

// Methods (12):
// 0x10028a13  nlinknode::n_init_nlinknode  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nvisnode', 'node/nlink_init.cc'
// 0x10028a6e  nlinknode::n_fini_nlinknode  (14 insns)
// 0x10028a91  nlinknode::n_new_nlinknode  (10 insns)
// 0x10028aab  nlinknode::n_version_nlinknode  (18 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x10028ae2  nlinknode::vfunc_00  (20 insns)
//   calls:   -> nVisNode::~nVisNode()
// 0x10028b1b  nlinknode::vfunc_17  (14 insns)
// 0x10028b3f  nlinknode::vfunc_18  (14 insns)
// 0x10028b67  nlinknode::vfunc_16  (18 insns)
//   calls:   -> nVisNode::Preload
// 0x10028b94  nlinknode::vfunc_14  (34 insns)
//   strings: 'v_settarget_s', 's_gettarget_v'
// 0x10028c01  nlinknode::cmd_settarget (v_settarget_s)  (10 insns)
// 0x10028c24  nlinknode::cmd_gettarget (s_gettarget_v)  (13 insns)
// 0x10028c4d  nlinknode::vfunc_11  (56 insns)
//   calls:   -> nVisNode::SaveCmds, -> nVisNode::NotifyChannelSetDirty

} // namespace re_nnebula
