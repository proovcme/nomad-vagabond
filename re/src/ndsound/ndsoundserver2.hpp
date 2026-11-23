#pragma once
// Auto-lifted C++ layout & method spec from ndsound.dll
// Source ASM: re/disasm/ndsound/ndsoundserver2.asm
// Class: ndsoundserver2 : public naudioserver2  (sizeof = 0x128 = 296 bytes)

#include <cstdint>

namespace re_ndsound {

struct ndsoundserver2_Layout {
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
    // +0x0030
    uint32_t field_0x0030;
    // +0x0038
    uint32_t field_0x0038;
    // +0x003c
    uint32_t field_0x003c;
    // +0x0044
    uint32_t field_0x0044;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x006c
    uint8_t field_0x006c;
    // +0x0070
    float field_0x0070;
    // +0x0074
    float field_0x0074;
    // +0x00d0
    double field_0x00d0;
    // +0x00d8
    double field_0x00d8;
    // +0x00e0
    uint8_t field_0x00e0;
    // +0x00e1
    uint8_t field_0x00e1;
    // +0x00e8
    double field_0x00e8;
    // +0x00f0
    double field_0x00f0;
    // +0x0104
    uint32_t field_0x0104;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0118
    uint32_t field_0x0118;
    // +0x011c
    uint32_t field_0x011c;
    // +0x0120
    uint32_t field_0x0120;
};

// Methods (15):
// 0x10001000  ndsoundserver2::n_init_ndsoundserver2  (10 insns)
//   strings: 'naudioserver2'
// 0x10001021  ndsoundserver2::n_fini_ndsoundserver2  (5 insns)
// 0x10001033  ndsoundserver2::n_new_ndsoundserver2  (10 insns)
// 0x1000104d  ndsoundserver2::n_version_ndsoundserver2  (28 insns)
//   strings: 'unknown', '/sys/env/hwnd'
// 0x100010b2  ndsoundserver2::vfunc_00  (41 insns)
//   calls:   -> ndsoundserver2::vfunc_19
//   consts:  f32=10000
// 0x1000112a  ndsoundserver2::vfunc_16  (23 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nAudioServer2::vfunc_16
// 0x1000116e  ndsoundserver2::vfunc_18  (201 insns)
//   calls:   -> nAudioServer2::vfunc_18, IAT: nkernel.dll!n_printf
// 0x1000135f  ndsoundserver2::vfunc_19  (122 insns)
//   calls:   -> nAudioServer2::vfunc_19, IAT: nkernel.dll!n_printf
// 0x100014d5  ndsoundserver2::vfunc_21  (13 insns)
//   calls:   -> nAudioServer2::vfunc_21
// 0x10001500  ndsoundserver2::vfunc_23  (18 insns)
// 0x10001530  ndsoundserver2::vfunc_24  (18 insns)
// 0x10001560  ndsoundserver2::vfunc_25  (110 insns)
//   calls:   -> nAudioServer2::vfunc_28, IAT: nkernel.dll!n_printf
//   consts:  f32=0, f32=1
// 0x100016bc  ndsoundserver2::vfunc_26  (29 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nAudioServer2::vfunc_26
// 0x10001716  ndsoundserver2::vfunc_28  (12 insns)
//   calls:   -> nAudioServer2::vfunc_28
// 0x10001737  ndsoundserver2::vfunc_27  (109 insns)
//   calls:   -> nAudioServer2::vfunc_27, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f32=0.01
//   strings: 'NOT INITIALIZED', 'UNKNOWN', 'Aborting.', 'c:/nomads/code/inc\\kernel/nautoref.h'

} // namespace re_ndsound
