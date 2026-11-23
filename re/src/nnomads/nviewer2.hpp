#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nviewer2.asm
// Class: nviewer2 : public nroot  (sizeof = 0xac = 172 bytes)

#include <cstdint>

namespace re_nnomads {

struct nviewer2_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    double field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    float field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0030
    float field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x0050
    uint32_t field_0x0050;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x010c
    uint8_t field_0x010c;
    // +0x0110
    float field_0x0110;
    // +0x0114
    float field_0x0114;
    // +0x0118
    float field_0x0118;
    // +0x011c
    float field_0x011c;
    // +0x0120
    float field_0x0120;
    // +0x0124
    float field_0x0124;
    // +0x014c
    uint32_t field_0x014c;
    // +0x01f4
    uint32_t field_0x01f4;
    // +0x01f8
    uint32_t field_0x01f8;
    // +0x01fc
    uint32_t field_0x01fc;
    // +0x0200
    float field_0x0200;
    // +0x0204
    float field_0x0204;
    // +0x0208
    float field_0x0208;
    // +0x0268
    double field_0x0268;
    // +0x0270
    double field_0x0270;
    // +0x0278
    double field_0x0278;
    // +0x0288
    uint8_t field_0x0288;
    // +0x0289
    uint8_t field_0x0289;
    // +0x0290
    double field_0x0290;
    // +0x0298
    double field_0x0298;
    // +0x02a0
    double field_0x02a0;
    // +0x0368
    uint8_t field_0x0368;
    // +0x036c
    float field_0x036c;
    // +0x0370
    float field_0x0370;
    // +0x0374
    float field_0x0374;
    // +0x0378
    float field_0x0378;
    // +0x037c
    float field_0x037c;
    // +0x0380
    double field_0x0380;
    // +0x0388
    double field_0x0388;
    // +0x0390
    double field_0x0390;
    // +0x0398
    double field_0x0398;
    // +0x04a0
    uint32_t field_0x04a0;
    // +0x0df0
    uint8_t field_0x0df0;
    // +0x0e64
    uint8_t field_0x0e64;
};

// Methods (13):
// 0x10068bb7  nviewer2::n_init_nviewer2  (10 insns)
//   strings: 'nroot'
// 0x10068bd8  nviewer2::n_fini_nviewer2  (5 insns)
// 0x10068bea  nviewer2::n_new_nviewer2  (45 insns)
//   strings: '/world'
// 0x10068c64  nviewer2::vfunc_00  (30 insns)
// 0x10068cb5  nviewer2::vfunc_17  (2 insns)
// 0x10068cc0  nviewer2::vfunc_15  (4 insns)
// 0x10068cd2  nviewer2::vfunc_16  (6 insns)
// 0x10068ce9  nviewer2::vfunc_18  (2 insns)
// 0x10068f80  nviewer2::vfunc_19  (32 insns)
// 0x10068fe5  nviewer2::vfunc_36  (19 insns)
//   calls:   -> nviewer2::vfunc_17
// 0x1006901b  nviewer2::vfunc_37  (2 insns)
// 0x10069022  nviewer2::vfunc_33  (489 insns)
//   calls:   -> nRealWorld::GetGlobalTime, -> nContainer::GetCurrentViewerNode
//   consts:  f64=0, f64=1, f64=0.009999999776, f64=0.2, f32=3.141593, f32=0.005555556, f64=0.05000000075
// 0x100695ee  nviewer2::vfunc_34  (2705 insns)
//   calls:   -> nviewer2::vfunc_15, -> nContainer::GetViewerNode, -> nContainer::SetCurrentViewerNode, -> nContainer::GetCurrentViewerNode, -> nContainer::GetMatrix44, -> nContainer::IsVehicleClass
//   consts:  f32=0, f32=5, f64=0, f64=0.015625, f32=1, f32=2, f32=0.5, f32=-0.0001, f32=0.0001, f32=0.2
//   strings: 'viewer_cycle', 'viewer_lookleft', 'viewer_lookright', 'viewer_lookup', 'viewer_lookdown', 'mouse_viewer_lookup', 'mouse_viewer_lookdown', 'concret.technical.dynamic'

} // namespace re_nnomads
