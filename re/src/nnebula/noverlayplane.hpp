#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/noverlayplane.asm
// Class: noverlayplane : public nvisnode  (sizeof = 0x170 = 368 bytes)

#include <cstdint>

namespace re_nnebula {

struct noverlayplane_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0058
    uint32_t field_0x0058;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00ac
    uint32_t field_0x00ac;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x00d8
    uint32_t field_0x00d8;
    // +0x0100
    uint32_t field_0x0100;
    // +0x0160
    float field_0x0160;
    // +0x0164
    float field_0x0164;
    // +0x0168
    float field_0x0168;
    // +0x016c
    float field_0x016c;
};

// Script AddCmds (1):
//   v_setcolor_ffff

// Methods (5):
// 0x100283fd  noverlayplane::n_init_noverlayplane  (15 insns)
//   strings: 'nvisnode'
// 0x10028428  noverlayplane::n_fini_noverlayplane  (5 insns)
// 0x1002843a  noverlayplane::n_new_noverlayplane  (10 insns)
// 0x10028454  noverlayplane::n_version_noverlayplane  (398 insns)
//   calls:   -> nVisNode::nVisNode(), -> nVisNode::~nVisNode(), -> nVisNode::Attach, -> nVisNode::Compute
//   consts:  f32=255, f32=-1
//   strings: '/sys/servers/gfx', '/sys/servers/specialfx', 'noverlayplane_ibuf', 'v_setcolor_ffff', 'ffff_getcolor_v'
// 0x1002891f  noverlayplane::cmd_setcolor (v_setcolor_ffff)  (79 insns)

} // namespace re_nnebula
