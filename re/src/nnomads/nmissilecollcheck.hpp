#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nmissilecollcheck.asm
// Class: nmissilecollcheck : public nservice  (sizeof = 0x90 = 144 bytes)

#include <cstdint>

namespace re_nnomads {

struct nmissilecollcheck_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0080
    uint32_t field_0x0080;
    // +0x008c
    uint32_t field_0x008c;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0d9c
    float field_0x0d9c;
};

// Methods (11):
// 0x1006d432  nmissilecollcheck::n_init_nmissilecollcheck  (15 insns)
//   strings: 'nservice'
// 0x1006d45d  nmissilecollcheck::n_fini_nmissilecollcheck  (5 insns)
// 0x1006d46f  nmissilecollcheck::n_new_nmissilecollcheck  (46 insns)
//   strings: '/game/handler/coll2', '/sys/servers/collide'
// 0x1006d4fc  nmissilecollcheck::vfunc_00  (52 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1006d58c  nmissilecollcheck::vfunc_16  (28 insns)
//   calls:   -> nStateNode::GetServiceData, -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x1006d5e0  nmissilecollcheck::vfunc_14  (32 insns)
//   calls:   -> nSoundNode::vfunc_35, -> nStateNode::NewServiceData
//   strings: 'collide', 'ncollidedata'
// 0x1006d64a  nmissilecollcheck::vfunc_18  (65 insns)
//   calls:   -> nStateNode::GetServiceData, -> nContainer::GetPosition, -> nContainer::GetPreMovePosition, -> nconsumption::vfunc_37
// 0x1006d6ee  nmissilecollcheck::vfunc_17  (10 insns)
//   calls:   -> nStateNode::GetServiceData, -> nStateNode::NetImport
// 0x1006d796  nmissilecollcheck::cmd_setcollclass (v_setcollclass_s)  (10 insns)
// 0x1006d7b9  nmissilecollcheck::cmd_getcollclass (s_getcollclass_v)  (14 insns)
//   calls:   -> nsimplespell::vfunc_24
// 0x1006d7e3  nmissilecollcheck::vfunc_11  (40 insns)
//   calls:   -> ncollidedata::vfunc_11, -> nsimplespell::vfunc_24

} // namespace re_nnomads
