#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nenergycollector.asm
// Class: nenergycollector : public nservice  (sizeof = 0x60 = 96 bytes)

#include <cstdint>

namespace re_nnomads {

struct nenergycollector_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
};

// Methods (5):
// 0x10066a69  nenergycollector::n_init_nenergycollector  (15 insns)
//   strings: 'nservice'
// 0x10066a94  nenergycollector::n_fini_nenergycollector  (5 insns)
// 0x10066aa6  nenergycollector::n_new_nenergycollector  (18 insns)
// 0x10066d49  nenergycollector::cmd_setcollectdistance (v_setcollectdistance_f)  (12 insns)
//   calls:   -> nattack::vfunc_24
// 0x10066d70  nenergycollector::cmd_getcollectdistance (f_getcollectdistance_v)  (13 insns)
//   calls:   -> nattack::vfunc_25

} // namespace re_nnomads
