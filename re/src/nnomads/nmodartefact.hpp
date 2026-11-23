#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nmodartefact.asm
// Class: nmodartefact : public ncontainer  (sizeof = 0xec0 = 3776 bytes)

#include <cstdint>

namespace re_nnomads {

struct nmodartefact_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0eb0
    uint32_t field_0x0eb0;
    // +0x0eb4
    uint32_t field_0x0eb4;
    // +0x0eb8
    uint32_t field_0x0eb8;
};

// Methods (11):
// 0x1003158d  nmodartefact::n_init_nmodartefact  (15 insns)
//   strings: 'ncontainer'
// 0x100315b8  nmodartefact::n_fini_nmodartefact  (5 insns)
// 0x100315ca  nmodartefact::n_new_nmodartefact  (21 insns)
//   calls:   -> nContainer::nContainer()
// 0x1003160a  nmodartefact::vfunc_00  (17 insns)
//   calls:   -> nContainer::~nContainer()
// 0x10031afe  nmodartefact::cmd_setmodnumber (v_setmodnumber_i)  (10 insns)
// 0x10031b21  nmodartefact::cmd_getmodnumber (i_getmodnumber_v)  (13 insns)
// 0x10031b4c  nmodartefact::cmd_setmodmaximum (v_setmodmaximum_i)  (10 insns)
// 0x10031b6f  nmodartefact::cmd_getmodmaximum (i_getmodmaximum_v)  (13 insns)
//   calls:   -> nHouse::GetBuildState
// 0x10031b9a  nmodartefact::cmd_setmodparameter (v_setmodparameter_s)  (13 insns)
// 0x10031bc4  nmodartefact::cmd_getmodparameter (s_getmodparameter_v)  (17 insns)
// 0x10031bf5  nmodartefact::vfunc_11  (84 insns)
//   calls:   -> nContainer::SaveCmds, -> nHouse::GetBuildState

} // namespace re_nnomads
