#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncritterengine2.asm
// Class: ncritterengine2 : public nengine3  (sizeof = 0x64 = 100 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncritterengine2_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0b44
    float field_0x0b44;
    // +0x0b48
    float field_0x0b48;
    // +0x0b4c
    float field_0x0b4c;
    // +0x0d9c
    float field_0x0d9c;
    // +0x128c
    uint32_t field_0x128c;
    // +0x1298
    uint32_t field_0x1298;
    // +0x129c
    uint32_t field_0x129c;
    // +0x12a0
    uint32_t field_0x12a0;
};

// Script AddCmds (2):
//   v_setmaxspeed_f
//   f_getmaxspeed_v

// Methods (13):
// 0x1004ec33  ncritterengine2::vfunc_16  (63 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord, -> nContainer::GetPosition, -> nContainer::SetPosition
//   strings: 'nvehicle'
// 0x1006034a  ncritterengine2::n_init_ncritterengine2  (15 insns)
//   strings: 'nengine3'
// 0x10060375  ncritterengine2::n_fini_ncritterengine2  (5 insns)
// 0x10060387  ncritterengine2::n_new_ncritterengine2  (18 insns)
// 0x100603b9  ncritterengine2::vfunc_00  (12 insns)
// 0x100603db  ncritterengine2::vfunc_30  (22 insns)
// 0x10060416  ncritterengine2::vfunc_21  (620 insns)
//   calls:   -> nContainer::GetActualCommand, -> nContainer::GetPosition, -> nContainer::GetDirection, -> nContainer::GetMatrix44, -> nContainer::SetMatrix44
//   consts:  f32=-1, f32=0, f64=0.5, f32=0.01, f32=-0.984, f32=4, f32=0.25, f32=-0.5, f32=2, f32=0.5, f32=1.1, f32=-0.6666667
// 0x10060bcb  ncritterengine2::vfunc_31  (115 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::IsVehicleClass
//   strings: 'concret.nature.island'
// 0x10060cfe  ncritterengine2::vfunc_28  (3 insns)
// 0x10060d08  ncritterengine2::vfunc_29  (20 insns)
//   strings: 'v_setmaxspeed_f', 'f_getmaxspeed_v'
// 0x10060d4d  ncritterengine2::cmd_getmaxspeed (f_getmaxspeed_v)  (14 insns)
// 0x10060d78  ncritterengine2::vfunc_11  (40 insns)
//   calls:   -> ncharcinematicplayer::vfunc_11
// 0x10078230  ncritterengine2::cmd_setmaxspeed (v_setmaxspeed_f)  (13 insns)

} // namespace re_nnomads
