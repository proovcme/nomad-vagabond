#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nnavpoint.asm
// Class: nnavpoint : public ncontainer  (sizeof = 0xed8 = 3800 bytes)

#include <cstdint>

namespace re_nnomads {

struct nnavpoint_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0eb0
    uint8_t field_0x0eb0;
    // +0x0eb1
    uint8_t field_0x0eb1;
};

// Script AddCmds (5):
//   v_enable_v
//   v_disable_v
//   b_isenabled_v
//   v_setvisualization_s
//   s_getvisualization_v

// Methods (13):
// 0x10030f0e  nnavpoint::n_init_nnavpoint  (15 insns)
//   strings: 'ncontainer'
// 0x10030f39  nnavpoint::n_fini_nnavpoint  (5 insns)
// 0x10030f4b  nnavpoint::n_new_nnavpoint  (18 insns)
//   calls:   -> nContainer::nContainer()
// 0x10030f80  nnavpoint::vfunc_00  (44 insns)
//   calls:   -> nContainer::~nContainer()
// 0x10030ff6  nnavpoint::vfunc_53  (5 insns)
//   calls:   -> nContainer::GetCustomDataSize
// 0x10031006  nnavpoint::vfunc_54  (20 insns)
//   calls:   -> nContainer::WriteCustomData
// 0x1003103b  nnavpoint::vfunc_55  (56 insns)
//   calls:   -> nContainer::ReadCustomData
//   strings: 'v_enable_v', 'v_disable_v', 'b_isenabled_v', 'v_setvisualization_s', 's_getvisualization_v'
// 0x100310fc  nnavpoint::cmd_enable (v_enable_v)  (2 insns)
// 0x10031105  nnavpoint::cmd_disable (v_disable_v)  (2 insns)
// 0x1003110e  nnavpoint::cmd_isenabled (b_isenabled_v)  (13 insns)
// 0x10031139  nnavpoint::cmd_setvisualization (v_setvisualization_s)  (10 insns)
// 0x1003115c  nnavpoint::cmd_getvisualization (s_getvisualization_v)  (14 insns)
// 0x10031186  nnavpoint::vfunc_11  (63 insns)
//   calls:   -> nContainer::SaveCmds

} // namespace re_nnomads
