#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nlistenernode.asm
// Class: nlistenernode : public nvisnode  (sizeof = 0x12c = 300 bytes)

#include <cstdint>

namespace re_nnebula {

struct nlistenernode_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00b6
    uint32_t field_0x00b6;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0118
    float field_0x0118;
    // +0x011c
    float field_0x011c;
    // +0x0120
    uint32_t field_0x0120;
    // +0x0124
    uint32_t field_0x0124;
    // +0x0128
    float field_0x0128;
};

// Script AddCmds (8):
//   v_setvelocitychannel_s
//   s_getvelocitychannel_v
//   v_setdopplerfactor_f
//   f_getdopplerfactor_v
//   v_setrollofffactor_f
//   f_getrollofffactor_v
//   v_setvelocitycap_f
//   f_getvelocitycap_v

// Methods (16):
// 0x10032c46  nlistenernode::n_init_nlistenernode  (15 insns)
//   strings: 'nvisnode'
// 0x10032c71  nlistenernode::n_fini_nlistenernode  (5 insns)
// 0x10032c83  nlistenernode::n_new_nlistenernode  (68 insns)
//   calls:   -> nVisNode::nVisNode(), IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
//   strings: '/sys/servers/audio', '/sys/servers/gfx', 'lvelocity'
// 0x10032d65  nlistenernode::vfunc_00  (74 insns)
//   calls:   IAT: nkernel.dll!n_free, -> nVisNode::~nVisNode(), IAT: nkernel.dll!n_strdup, -> nVisNode::NotifyChannelSetDirty
// 0x10032e40  nlistenernode::vfunc_18  (18 insns)
//   calls:   -> nVisNode::AttachChannels
// 0x10032e7a  nlistenernode::vfunc_14  (17 insns)
//   calls:   -> nVisNode::Attach
// 0x10032eab  nlistenernode::vfunc_15  (164 insns)
//   calls:   -> nVisNode::Compute
//   strings: 'v_setvelocitychannel_s', 's_getvelocitychannel_v', 'v_setdopplerfactor_f', 'f_getdopplerfactor_v', 'v_setrollofffactor_f', 'f_getrollofffactor_v', 'v_setvelocitycap_f', 'f_getvelocitycap_v'
// 0x100330a6  nlistenernode::cmd_setvelocitychannel (v_setvelocitychannel_s)  (10 insns)
// 0x100330c9  nlistenernode::cmd_getvelocitychannel (s_getvelocitychannel_v)  (14 insns)
// 0x100330f3  nlistenernode::cmd_setdopplerfactor (v_setdopplerfactor_f)  (10 insns)
// 0x10033118  nlistenernode::cmd_getdopplerfactor (f_getdopplerfactor_v)  (11 insns)
// 0x10033142  nlistenernode::cmd_setrollofffactor (v_setrollofffactor_f)  (10 insns)
// 0x10033167  nlistenernode::cmd_getrollofffactor (f_getrollofffactor_v)  (11 insns)
// 0x10033191  nlistenernode::cmd_setvelocitycap (v_setvelocitycap_f)  (10 insns)
// 0x100331b6  nlistenernode::cmd_getvelocitycap (f_getvelocitycap_v)  (11 insns)
// 0x100331e0  nlistenernode::vfunc_11  (95 insns)
//   calls:   -> nVisNode::SaveCmds

} // namespace re_nnebula
