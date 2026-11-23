#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/npservemitter.asm
// Class: npservemitter : public npemitter  (sizeof = 0x120 = 288 bytes)

#include <cstdint>

namespace re_nparticle {

struct npservemitter_Layout {
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
    // +0x0114
    uint32_t field_0x0114;
    // +0x0118
    uint32_t field_0x0118;
    // +0x011c
    uint32_t field_0x011c;
};

// Methods (4):
// 0x10002a9e  npservemitter::n_init_npservemitter  (10 insns)
//   strings: 'npemitter'
// 0x10002abf  npservemitter::n_fini_npservemitter  (5 insns)
// 0x10002ad1  npservemitter::n_new_npservemitter  (36 insns)
//   strings: '/sys/servers/particle'
// 0x10002b3f  npservemitter::vfunc_00  (24 insns)

} // namespace re_nparticle
