#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nislanddrive.asm
// Class: nislanddrive : public nhouse  (sizeof = 0xf48 = 3912 bytes)

#include <cstdint>

namespace re_nnomads {

struct nislanddrive_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint8_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x001c
    uint32_t field_0x001c;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0304
    uint32_t field_0x0304;
    // +0x0564
    float field_0x0564;
    // +0x0568
    float field_0x0568;
    // +0x056c
    float field_0x056c;
    // +0x0570
    uint8_t field_0x0570;
    // +0x0594
    float field_0x0594;
    // +0x0598
    float field_0x0598;
    // +0x059c
    float field_0x059c;
    // +0x05a0
    uint8_t field_0x05a0;
    // +0x05a4
    float field_0x05a4;
    // +0x05a8
    float field_0x05a8;
    // +0x05ac
    float field_0x05ac;
    // +0x05b0
    uint8_t field_0x05b0;
    // +0x05b4
    float field_0x05b4;
    // +0x05b8
    float field_0x05b8;
    // +0x05bc
    float field_0x05bc;
    // +0x05c0
    uint8_t field_0x05c0;
    // +0x0634
    float field_0x0634;
    // +0x0704
    float field_0x0704;
    // +0x0e64
    uint8_t field_0x0e64;
    // +0x0ebc
    float field_0x0ebc;
    // +0x0ec0
    float field_0x0ec0;
    // +0x0ec4
    float field_0x0ec4;
    // +0x0ec8
    float field_0x0ec8;
    // +0x0ecc
    float field_0x0ecc;
    // +0x0ed0
    float field_0x0ed0;
    // +0x0ed4
    float field_0x0ed4;
    // +0x0ed8
    float field_0x0ed8;
    // +0x0edc
    float field_0x0edc;
    // +0x0ee0
    float field_0x0ee0;
    // +0x0ee4
    float field_0x0ee4;
    // +0x0ee8
    float field_0x0ee8;
    // +0x0f30
    uint32_t field_0x0f30;
    // +0x0f34
    uint32_t field_0x0f34;
    // +0x0f38
    float field_0x0f38;
    // +0x0f3c
    uint32_t field_0x0f3c;
    // +0x0f44
    uint8_t field_0x0f44;
    // +0x0f4c
    uint32_t field_0x0f4c;
};

// Script AddCmds (2):
//   c_house/nislanddrive_head.cc
//   v_switchoffengine_v

// Methods (10):
// 0x1002f83d  nislanddrive::vfunc_00  (41 insns)
//   calls:   -> nHouse::~nHouse()
// 0x1002f8bc  nislanddrive::vfunc_15  (29 insns)
//   calls:   -> nHouse::Trigger
// 0x1002f906  nislanddrive::vfunc_44  (51 insns)
// 0x1002f9a2  nislanddrive::n_init_nislanddrive  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nhouse', 'cannot initialize islanddrive class', 'c_house/nislanddrive_head.cc'
// 0x1002f9fd  nislanddrive::n_fini_nislanddrive  (14 insns)
// 0x1002fa20  nislanddrive::n_new_nislanddrive  (10 insns)
// 0x1002fa3a  nislanddrive::n_version_nislanddrive  (15 insns)
//   strings: 'v_switchoffengine_v'
// 0x1002fa6b  nislanddrive::cmd_switchoffengine (v_switchoffengine_v)  (3 insns)
// 0x1002fa77  nislanddrive::vfunc_11  (107 insns)
//   calls:   -> nHouse::SaveCmds, -> nRealWorld::GetViewerCarrier, IAT: MSVCRT.dll!sprintf, -> nStateNode::GetPrototype, IAT: nkernel.dll!n_printf, -> nStateNode::GetSymbolicName
//   strings: 'vislinky/vislinkz/vislink', 'visual/%s', 'no symbolic name'
// 0x1002fbd1  nislanddrive::vfunc_18  (383 insns)
//   calls:   -> nContainer::GetDirection, -> nContainer::GetPosition, -> nHouse::UpdateChannels, -> nHouse::nHouse()
//   consts:  f32=1, f32=-1, f64=0, f32=6.283185, f32=0.1591549, f32=0.02, f32=0, f32=180, f32=0.3183099, f32=90, f32=360, f32=2
//   strings: 'nstation'

} // namespace re_nnomads
