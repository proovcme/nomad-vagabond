#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncollidedata.asm
// Class: ncollidedata : public nservicedata  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncollidedata_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    float field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    uint8_t field_0x0064;
    // +0x0065
    uint8_t field_0x0065;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0df4
    float field_0x0df4;
    // +0x0df8
    float field_0x0df8;
};

// Script AddCmds (4):
//   v_setrepairfillrate_f
//   f_getreoairfillrate_v
//   v_setrepaircost_f
//   f_getrepaircost_v

// Methods (10):
// 0x10031db1  ncollidedata::vfunc_11  (3 insns)
//   calls:   -> nAnimSequence::vfunc_31
// 0x10031e53  ncollidedata::n_init_ncollidedata  (10 insns)
//   strings: 'nservicedata'
// 0x10031e74  ncollidedata::n_fini_ncollidedata  (5 insns)
// 0x10031e86  ncollidedata::n_new_ncollidedata  (29 insns)
// 0x10031ed1  ncollidedata::vfunc_00  (23 insns)
// 0x10031f85  ncollidedata::vfunc_14  (12 insns)
// 0x10031fa7  ncollidedata::vfunc_28  (13 insns)
//   calls:   -> nSoundNode::vfunc_35
//   strings: 'nmaennel'
// 0x10031fd0  ncollidedata::vfunc_30  (20 insns)
//   calls:   -> nContainer::SetTurnBack, -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x10032013  ncollidedata::vfunc_32  (98 insns)
//   calls:   -> nStateNode::GetClan, -> nContainer::AddEnergy, -> nContainer::SetReplenished, -> nconsumption::vfunc_37
//   strings: 'v_setrepairfillrate_f', 'f_getreoairfillrate_v', 'v_setrepaircost_f', 'f_getrepaircost_v'
// 0x1003215d  ncollidedata::vfunc_25  (62 insns)
//   calls:   -> ncollidedata::vfunc_11, -> nattack::vfunc_25, -> nattack::vfunc_27

} // namespace re_nnomads
