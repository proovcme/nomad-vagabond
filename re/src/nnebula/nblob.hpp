#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nblob.asm
// Class: nblob : public nroot  (sizeof = 0x4c = 76 bytes)

#include <cstdint>

namespace re_nnebula {

struct nblob_Layout {
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
};

// Methods (6):
// 0x100181e8  nblob::n_init_nblob  (21 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nroot', 'Could not open superclass nroot!', 'misc/nblob.cc'
// 0x10018239  nblob::n_fini_nblob  (14 insns)
// 0x1001825c  nblob::n_new_nblob  (18 insns)
// 0x10018288  nblob::n_version_nblob  (2 insns)
// 0x1001828e  nblob::vfunc_00  (24 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x100182cb  nblob::vfunc_14  (38 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!nn_malloc
//   strings: 'misc/nblob.cc'

} // namespace re_nnebula
