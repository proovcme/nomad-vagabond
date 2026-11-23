#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nparticleserver.asm
// Class: nparticleserver : public nroot  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nparticle {

struct nparticleserver_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
};

// Methods (10):
// 0x10001000  nparticleserver::n_init_nparticleserver  (10 insns)
//   strings: 'nroot'
// 0x10001021  nparticleserver::n_fini_nparticleserver  (5 insns)
// 0x10001033  nparticleserver::n_new_nparticleserver  (24 insns)
// 0x10001076  nparticleserver::vfunc_00  (79 insns)
//   calls:   -> nparticleserver::vfunc_18
// 0x1000113e  nparticleserver::vfunc_18  (33 insns)
// 0x10001187  nparticleserver::vfunc_15  (10 insns)
// 0x100011aa  nparticleserver::vfunc_16  (13 insns)
// 0x100011cf  nparticleserver::vfunc_17  (6 insns)
// 0x100011e6  nparticleserver::vfunc_19  (4 insns)
// 0x100011f0  nparticleserver::vfunc_14  (173 insns)
//   calls:   IAT: MSVCRT.dll!memmove

} // namespace re_nparticle
