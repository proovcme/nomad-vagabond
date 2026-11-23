#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nmissilecollhandle.asm
// Class: nmissilecollhandle : public nservice  (sizeof = 0x58 = 88 bytes)

#include <cstdint>

namespace re_nnomads {

struct nmissilecollhandle_Layout {
    // +0x0014
    uint32_t field_0x0014;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0064
    uint8_t field_0x0064;
    // +0x0065
    uint8_t field_0x0065;
};

// Methods (5):
// 0x100467c5  nmissilecollhandle::n_init_nmissilecollhandle  (10 insns)
//   strings: 'nservice'
// 0x100467e6  nmissilecollhandle::n_fini_nmissilecollhandle  (5 insns)
// 0x100467f8  nmissilecollhandle::n_new_nmissilecollhandle  (16 insns)
// 0x1004681c  nmissilecollhandle::vfunc_00  (12 insns)
// 0x1004683e  nmissilecollhandle::vfunc_18  (98 insns)
//   calls:   -> nStateNode::GetServiceData, -> nContainer::IsVehicleClass, -> nRealWorld::GetUserClan, -> nRealWorld::GetHandControlVehicle, -> nContainer::SetPosition, -> nconsumption::vfunc_37
//   strings: 'concret.technical.static.flak'

} // namespace re_nnomads
