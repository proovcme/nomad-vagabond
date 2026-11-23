#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncollectartefact.asm
// Class: ncollectartefact : public nservice  (sizeof = 0x60 = 96 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncollectartefact_Layout {
    // +0x0004
    float field_0x0004;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    float field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x0188
    uint8_t field_0x0188;
    // +0x0e08
    uint8_t field_0x0e08;
    // +0x0e64
    uint8_t field_0x0e64;
    // +0x0e84
    uint8_t field_0x0e84;
};

// Script AddCmds (2):
//   v_setcollectdistance_f
//   f_getcollectdistance_v

// Methods (7):
// 0x1003f0eb  ncollectartefact::n_init_ncollectartefact  (15 insns)
//   strings: 'nservice'
// 0x1003f116  ncollectartefact::n_fini_ncollectartefact  (5 insns)
// 0x1003f128  ncollectartefact::n_new_ncollectartefact  (10 insns)
// 0x1003f13f  ncollectartefact::n_version_ncollectartefact  (11 insns)
// 0x1003f162  ncollectartefact::vfunc_00  (12 insns)
// 0x1003f184  ncollectartefact::vfunc_18  (288 insns)
//   calls:   -> nStateNode::GetClan, -> nRealWorld::GetUserClan, -> nContainer::GetPosition, IAT: nkernel.dll!n_printf, -> nContainer::GetArtefactOwner, -> nconsumption::vfunc_37, -> nContainer::IsVehicleClass
//   strings: 'generic', 'concret.artefact.modifier', 'v_setcollectdistance_f', 'f_getcollectdistance_v'
// 0x1003f4d7  ncollectartefact::vfunc_11  (35 insns)
//   calls:   -> ncollidedata::vfunc_11

} // namespace re_nnomads
