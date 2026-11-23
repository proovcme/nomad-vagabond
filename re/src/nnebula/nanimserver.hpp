#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nanimserver.asm
// Class: nanimserver : public nroot  (sizeof = 0x54 = 84 bytes)

#include <cstdint>

namespace re_nnebula {

struct nanimserver_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
};

// Methods (4):
// 0x10001000  nanimserver::n_init_nanimserver  (10 insns)
//   strings: 'nroot'
// 0x10001021  nanimserver::n_fini_nanimserver  (5 insns)
// 0x10001033  nanimserver::n_new_nanimserver  (33 insns)
//   strings: '/sys/share/animcurves', 'nroot'
// 0x1000108b  nanimserver::vfunc_00  (89 insns)
//   calls:   -> nAudioServer2::GetResourceId
//   strings: 'nanimcurvearray'

} // namespace re_nnebula
