#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nspriterender.asm
// Class: nspriterender : public nprender  (sizeof = 0x190 = 400 bytes)

#include <cstdint>

namespace re_nparticle {

struct nspriterender_Layout {
    // (no direct [this+offset] fields detected)
};

// Methods (4):
// 0x1000721f  nspriterender::n_init_nspriterender  (106 insns)
//   consts:  f32=-0.5, f32=0.5, f32=0.015625, f32=6.283185
//   strings: 'nprender'
// 0x10007338  nspriterender::n_fini_nspriterender  (5 insns)
// 0x1000734a  nspriterender::n_new_nspriterender  (10 insns)
// 0x10007364  nspriterender::n_version_nspriterender  (31 insns)

} // namespace re_nparticle
