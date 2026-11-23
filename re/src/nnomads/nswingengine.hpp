#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nswingengine.asm
// Class: nswingengine : public nservice  (sizeof = 0x5c = 92 bytes)

#include <cstdint>

namespace re_nnomads {

struct nswingengine_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0058
    uint8_t field_0x0058;
    // +0x0114
    uint32_t field_0x0114;
    // +0x01e8
    uint32_t field_0x01e8;
    // +0x0b43
    uint8_t field_0x0b43;
    // +0x0b44
    uint32_t field_0x0b44;
    // +0x0c70
    uint8_t field_0x0c70;
    // +0x0c72
    uint32_t field_0x0c72;
    // +0x0c90
    float field_0x0c90;
    // +0x0c9c
    uint8_t field_0x0c9c;
    // +0x0c9e
    uint32_t field_0x0c9e;
    // +0x0cbc
    float field_0x0cbc;
};

// Methods (10):
// 0x1006290f  nswingengine::n_init_nswingengine  (15 insns)
//   strings: 'nservice'
// 0x1006293a  nswingengine::n_fini_nswingengine  (5 insns)
// 0x1006294c  nswingengine::n_new_nswingengine  (17 insns)
// 0x10062974  nswingengine::vfunc_00  (12 insns)
// 0x10062996  nswingengine::vfunc_16  (35 insns)
//   calls:   -> nRealWorld::GetGlobalTime, -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x10062a0b  nswingengine::vfunc_18  (71 insns)
//   calls:   -> nRealWorld::GetGlobalTime, -> nconsumption::vfunc_37
// 0x10062ad4  nswingengine::vfunc_19  (3 insns)
// 0x10062b23  nswingengine::vfunc_11  (42 insns)
//   calls:   -> ncollidedata::vfunc_11
// 0x1006ca88  nswingengine::cmd_setenableswing (v_setenableswing_b)  (12 insns)
// 0x1006caac  nswingengine::cmd_getenableswing (b_getenableswing_v)  (14 insns)

} // namespace re_nnomads
