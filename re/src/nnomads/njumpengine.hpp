#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/njumpengine.asm
// Class: njumpengine : public nservice  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnomads {

struct njumpengine_Layout {
    // +0x0044
    uint8_t field_0x0044;
    // +0x0140
    double field_0x0140;
};

// Methods (6):
// 0x100457be  njumpengine::n_init_njumpengine  (15 insns)
//   strings: 'nservice'
// 0x100457e9  njumpengine::n_fini_njumpengine  (5 insns)
// 0x100457fb  njumpengine::n_new_njumpengine  (16 insns)
// 0x1004581f  njumpengine::vfunc_00  (12 insns)
// 0x10045841  njumpengine::vfunc_16  (30 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x1004588d  njumpengine::vfunc_18  (78 insns)
//   calls:   -> nRealWorld::GetGlobalTime, -> nconsumption::vfunc_37
//   consts:  f32=0, f64=0.5
//   strings: 'move_forward'

} // namespace re_nnomads
