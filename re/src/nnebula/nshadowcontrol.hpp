#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nshadowcontrol.asm
// Class: nshadowcontrol : public nvisnode  (sizeof = 0xc4 = 196 bytes)

#include <cstdint>

namespace re_nnebula {

struct nshadowcontrol_Layout {
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
    // +0x0034
    uint32_t field_0x0034;
    // +0x00b4
    float field_0x00b4;
    // +0x00b8
    float field_0x00b8;
    // +0x00bc
    float field_0x00bc;
    // +0x00c0
    float field_0x00c0;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (1):
//   v_setcolor_ffff

// Methods (9):
// 0x1003749b  nshadowcontrol::n_init_nshadowcontrol  (15 insns)
//   strings: 'nvisnode'
// 0x100374c6  nshadowcontrol::n_fini_nshadowcontrol  (5 insns)
// 0x100374d8  nshadowcontrol::n_new_nshadowcontrol  (10 insns)
// 0x100374f2  nshadowcontrol::n_version_nshadowcontrol  (32 insns)
//   calls:   -> nVisNode::nVisNode()
//   strings: '/sys/servers/shadow'
// 0x10037555  nshadowcontrol::vfunc_00  (24 insns)
//   calls:   -> nVisNode::~nVisNode()
// 0x10037596  nshadowcontrol::vfunc_01  (49 insns)
//   calls:   -> nVisNode::DependsOn, -> nVisNode::Initialize
//   strings: 'nvisnode'
// 0x10037628  nshadowcontrol::vfunc_15  (40 insns)
//   calls:   -> nVisNode::Compute, -> nShadowServer::SetShadowColor
//   strings: 'v_setcolor_ffff', 'ffff_getcolor_v'
// 0x100376b3  nshadowcontrol::cmd_setcolor (v_setcolor_ffff)  (74 insns)
// 0x10037791  nshadowcontrol::vfunc_11  (70 insns)
//   calls:   -> nVisNode::SaveCmds

} // namespace re_nnebula
