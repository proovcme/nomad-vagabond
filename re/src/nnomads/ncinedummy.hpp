#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncinedummy.asm
// Class: ncinedummy : public ncontainer  (sizeof = 0xeb8 = 3768 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncinedummy_Layout {
    // +0x0114
    uint32_t field_0x0114;
    // +0x0eb0
    uint32_t field_0x0eb0;
};

// Script AddCmds (2):
//   v_settargetsymbolicname_s
//   s_gettargetsymbolicname_v

// Methods (7):
// 0x1006d0cc  ncinedummy::n_init_ncinedummy  (15 insns)
//   strings: 'ncontainer'
// 0x1006d0f7  ncinedummy::n_fini_ncinedummy  (5 insns)
// 0x1006d109  ncinedummy::n_new_ncinedummy  (17 insns)
//   calls:   -> nContainer::nContainer()
// 0x1006d137  ncinedummy::vfunc_00  (46 insns)
//   calls:   IAT: nkernel.dll!n_free, -> nContainer::~nContainer()
//   strings: 'v_settargetsymbolicname_s', 's_gettargetsymbolicname_v'
// 0x1006d1bf  ncinedummy::cmd_settargetsymbolicname (v_settargetsymbolicname_s)  (10 insns)
// 0x1006d1e2  ncinedummy::cmd_gettargetsymbolicname (s_gettargetsymbolicname_v)  (14 insns)
// 0x1006d20c  ncinedummy::vfunc_11  (78 insns)
//   calls:   -> nContainer::SaveCmds, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup

} // namespace re_nnomads
