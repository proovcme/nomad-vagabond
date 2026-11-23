#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nspawnpoint.asm
// Class: nspawnpoint : public ncontainer  (sizeof = 0xeb8 = 3768 bytes)

#include <cstdint>

namespace re_nnomads {

struct nspawnpoint_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0eb0
    uint32_t field_0x0eb0;
    // +0x0eb2
    uint8_t field_0x0eb2;
    // +0x0eb4
    uint32_t field_0x0eb4;
};

// Script AddCmds (4):
//   v_setclientid_i
//   i_getclientid_v
//   v_setlocked_b
//   b_islocked_v

// Methods (12):
// 0x10055933  nspawnpoint::vfunc_00  (17 insns)
//   calls:   -> nContainer::~nContainer()
// 0x1005596c  nspawnpoint::vfunc_53  (5 insns)
//   calls:   -> nContainer::GetCustomDataSize
// 0x1005597c  nspawnpoint::vfunc_54  (20 insns)
//   calls:   -> nContainer::WriteCustomData
// 0x100559b3  nspawnpoint::vfunc_55  (26 insns)
//   calls:   -> nContainer::ReadCustomData
// 0x10055a0f  nspawnpoint::n_init_nspawnpoint  (15 insns)
//   strings: 'ncontainer'
// 0x10055a3a  nspawnpoint::n_fini_nspawnpoint  (5 insns)
// 0x10055a4c  nspawnpoint::n_new_nspawnpoint  (10 insns)
// 0x10055a66  nspawnpoint::n_version_nspawnpoint  (30 insns)
//   strings: 'v_setclientid_i', 'i_getclientid_v', 'v_setlocked_b', 'b_islocked_v'
// 0x10055ad9  nspawnpoint::cmd_setclientid (v_setclientid_i)  (10 insns)
// 0x10055afc  nspawnpoint::cmd_getclientid (i_getclientid_v)  (14 insns)
// 0x10055b2a  nspawnpoint::cmd_setlocked (v_setlocked_b)  (12 insns)
// 0x10055b50  nspawnpoint::cmd_islocked (b_islocked_v)  (20 insns)

} // namespace re_nnomads
