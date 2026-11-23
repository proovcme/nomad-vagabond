#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nsimplespell.asm
// Class: nsimplespell : public nuseartefact  (sizeof = 0x5c = 92 bytes)

#include <cstdint>

namespace re_nnomads {

struct nsimplespell_Layout {
    // +0x0058
    uint32_t field_0x0058;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0e78
    float field_0x0e78;
};

// Script AddCmds (2):
//   v_setspellcommand_s
//   s_getspellcommand_v

// Methods (9):
// 0x1004cbfe  nsimplespell::n_init_nsimplespell  (15 insns)
//   strings: 'nuseartefact'
// 0x1004cc29  nsimplespell::n_fini_nsimplespell  (5 insns)
// 0x1004cc3b  nsimplespell::n_new_nsimplespell  (10 insns)
// 0x1004cc52  nsimplespell::n_version_nsimplespell  (10 insns)
// 0x1004cc6e  nsimplespell::vfunc_00  (24 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1004ccab  nsimplespell::vfunc_23  (8 insns)
//   calls:   IAT: nkernel.dll!n_strdup
// 0x1004ccc0  nsimplespell::vfunc_19  (79 insns)
//   calls:   -> nStateNode::GetClan, -> nContainer::GetArtefactOwner, -> nuseartefact::vfunc_19
//   strings: 'v_setspellcommand_s', 's_getspellcommand_v'
// 0x1004cdd5  nsimplespell::vfunc_11  (49 insns)
//   calls:   -> nbehaviour::vfunc_11
// 0x1006d588  nsimplespell::vfunc_24  (2 insns)

} // namespace re_nnomads
