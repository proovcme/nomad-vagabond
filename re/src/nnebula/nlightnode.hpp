#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nlightnode.asm
// Class: nlightnode : public nvisnode  (sizeof = 0x108 = 264 bytes)

#include <cstdint>

namespace re_nnebula {

struct nlightnode_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0044
    float field_0x0044;
    // +0x0048
    float field_0x0048;
    // +0x004c
    float field_0x004c;
    // +0x0050
    float field_0x0050;
    // +0x0054
    float field_0x0054;
    // +0x0058
    float field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00dc
    uint32_t field_0x00dc;
    // +0x00fc
    uint32_t field_0x00fc;
    // +0x0100
    float field_0x0100;
    // +0x0104
    uint8_t field_0x0104;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (11):
//   v_settype_s
//   v_setcolor_ffff
//   v_setr_f
//   v_setg_f
//   v_setb_f
//   v_seta_f
//   v_setattenuation_fff
//   v_setspot_ff
//   s_gettype_v
//   v_setcastshadows_b
//   b_getcastshadows_v

// Methods (18):
// 0x10020e0c  nlightnode::n_init_nlightnode  (15 insns)
//   strings: 'nvisnode'
// 0x10020e37  nlightnode::n_fini_nlightnode  (5 insns)
// 0x10020e49  nlightnode::n_new_nlightnode  (18 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x10020e7b  nlightnode::vfunc_14  (17 insns)
//   calls:   -> nVisNode::Attach
// 0x10020ea9  nlightnode::vfunc_15  (23 insns)
//   calls:   -> nVisNode::Compute
// 0x10020eef  nlightnode::vfunc_00  (89 insns)
//   calls:   -> nVisNode::~nVisNode()
//   strings: 'v_settype_s', 'v_setcolor_ffff', 'v_setr_f', 'v_setg_f', 'v_setb_f', 'v_seta_f', 'v_setattenuation_fff', 'v_setspot_ff'
// 0x10021054  nlightnode::cmd_settype (v_settype_s)  (122 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   strings: 'ambient', 'point', 'spot', 'directional'
// 0x10021189  nlightnode::cmd_setcolor (v_setcolor_ffff)  (33 insns)
// 0x100211ed  nlightnode::cmd_setr (v_setr_f)  (10 insns)
// 0x10021212  nlightnode::cmd_setg (v_setg_f)  (10 insns)
// 0x10021237  nlightnode::cmd_setb (v_setb_f)  (10 insns)
// 0x1002125c  nlightnode::cmd_seta (v_seta_f)  (10 insns)
// 0x10021281  nlightnode::cmd_setattenuation (v_setattenuation_fff)  (26 insns)
// 0x100212d0  nlightnode::cmd_setspot (v_setspot_ff)  (18 insns)
// 0x1002130b  nlightnode::cmd_gettype (s_gettype_v)  (161 insns)
//   strings: '<error>', 'directional', 'spot', 'point', 'ambient'
// 0x100214f3  nlightnode::cmd_setcastshadows (v_setcastshadows_b)  (10 insns)
// 0x10021517  nlightnode::cmd_getcastshadows (b_getcastshadows_v)  (13 insns)
// 0x10021543  nlightnode::vfunc_11  (226 insns)
//   calls:   -> nVisNode::SaveCmds
//   strings: '<error>', 'directional', 'spot', 'point', 'ambient'

} // namespace re_nnebula
