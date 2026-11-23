#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nfreeviewer.asm
// Class: nfreeviewer : public nviewer2  (sizeof = 0x1c0 = 448 bytes)

#include <cstdint>

namespace re_nnomads {

struct nfreeviewer_Layout {
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x01a8
    double field_0x01a8;
    // +0x01b0
    float field_0x01b0;
    // +0x01b4
    float field_0x01b4;
    // +0x01b8
    float field_0x01b8;
};

// Script AddCmds (1):
//   v_overview_v

// Methods (4):
// 0x1006009b  nfreeviewer::cmd_overview (v_overview_v)  (3 insns)
// 0x1006b3bb  nfreeviewer::n_init_nfreeviewer  (15 insns)
//   strings: 'nviewer2'
// 0x1006b3e6  nfreeviewer::n_fini_nfreeviewer  (5 insns)
// 0x1006b3f8  nfreeviewer::n_new_nfreeviewer  (428 insns)
//   calls:   -> nRealWorld::GetViewer2
//   consts:  f32=500, f32=-0.785, f32=0, f32=50, f32=5, f32=-50, f32=4.363323, f64=0, f32=1
//   strings: '/sys/servers/input', '/world', 'viewer_forward', 'viewer_backward', 'viewer_strafeleft', 'viewer_straferight', 'viewer_left', 'viewer_right'

} // namespace re_nnomads
