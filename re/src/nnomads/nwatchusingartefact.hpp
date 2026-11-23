#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nwatchusingartefact.asm
// Class: nwatchusingartefact : public nservice  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnomads {

struct nwatchusingartefact_Layout {
    // +0x0020
    uint32_t field_0x0020;
    // +0x0e64
    uint8_t field_0x0e64;
    // +0x0e65
    uint8_t field_0x0e65;
};

// Script AddCmds (2):
//   v_setconsumption_f
//   f_getconsumption_v

// Methods (6):
// 0x10041817  nwatchusingartefact::n_init_nwatchusingartefact  (10 insns)
//   strings: 'nservice'
// 0x10041838  nwatchusingartefact::n_fini_nwatchusingartefact  (5 insns)
// 0x1004184a  nwatchusingartefact::n_new_nwatchusingartefact  (10 insns)
// 0x10041861  nwatchusingartefact::n_version_nwatchusingartefact  (9 insns)
// 0x10041879  nwatchusingartefact::vfunc_00  (12 insns)
// 0x1004189b  nwatchusingartefact::vfunc_18  (51 insns)
//   calls:   -> nconsumption::vfunc_37
//   strings: 'v_setconsumption_f', 'f_getconsumption_v'

} // namespace re_nnomads
