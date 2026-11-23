#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nweather.asm
// Class: nweather : public nservice  (sizeof = 0x70 = 112 bytes)

#include <cstdint>

namespace re_nnomads {

struct nweather_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
};

// Methods (8):
// 0x10035f62  nweather::n_init_nweather  (10 insns)
//   strings: 'nservice'
// 0x10035f83  nweather::n_fini_nweather  (5 insns)
// 0x10035f95  nweather::n_new_nweather  (10 insns)
// 0x10035fac  nweather::n_version_nweather  (23 insns)
//   strings: '/game/handler/weather'
// 0x10035fef  nweather::vfunc_00  (24 insns)
// 0x1003602d  nweather::vfunc_16  (30 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord, -> nStateNode::GetPrototype
//   strings: 'visual'
// 0x1003607b  nweather::vfunc_17  (13 insns)
//   calls:   -> nStateNode::NetImport
// 0x100360a0  nweather::vfunc_18  (9 insns)
//   calls:   -> nconsumption::vfunc_37

} // namespace re_nnomads
