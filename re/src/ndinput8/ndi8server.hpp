#pragma once
// Auto-lifted C++ layout & method spec from ndinput8.dll
// Source ASM: re/disasm/ndinput8/ndi8server.asm
// Class: ndi8server : public ninputserver  (sizeof = 0x198 = 408 bytes)

#include <cstdint>

namespace re_ndinput8 {

struct ndi8server_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0018
    uint32_t field_0x0018;
    // +0x0128
    uint32_t field_0x0128;
    // +0x012c
    uint32_t field_0x012c;
    // +0x0130
    uint32_t field_0x0130;
    // +0x0134
    uint32_t field_0x0134;
    // +0x0138
    uint32_t field_0x0138;
    // +0x013c
    uint32_t field_0x013c;
    // +0x0140
    uint32_t field_0x0140;
    // +0x0144
    uint32_t field_0x0144;
    // +0x0148
    uint32_t field_0x0148;
    // +0x014c
    uint32_t field_0x014c;
    // +0x0150
    uint32_t field_0x0150;
    // +0x0154
    uint32_t field_0x0154;
    // +0x0158
    uint32_t field_0x0158;
    // +0x015c
    uint32_t field_0x015c;
    // +0x0168
    uint32_t field_0x0168;
    // +0x0174
    uint32_t field_0x0174;
    // +0x0178
    uint32_t field_0x0178;
    // +0x017c
    uint32_t field_0x017c;
    // +0x0180
    uint32_t field_0x0180;
    // +0x0184
    uint32_t field_0x0184;
    // +0x0188
    uint32_t field_0x0188;
    // +0x0190
    double field_0x0190;
};

// Methods (6):
// 0x10001000  ndi8server::n_init_ndi8server  (10 insns)
//   strings: 'ninputserver'
// 0x10001021  ndi8server::n_fini_ndi8server  (5 insns)
// 0x10001033  ndi8server::n_new_ndi8server  (10 insns)
// 0x1000104d  ndi8server::n_version_ndi8server  (66 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'unknown', '/sys/share/input/devs', '/sys/env/hwnd', 'input/ndi8server_main.cc'
// 0x10001166  ndi8server::vfunc_00  (41 insns)
// 0x10002704  ndi8server::vfunc_14  (393 insns)
//   calls:   -> nClass::vfunc_39
//   consts:  f32=0.0001, f32=2
//   strings: 'DIERR_GENERIC', 'E_POINTER', 'DIERR_NOINTERFACE', 'DIERR_UNSUPPORTED', 'E_PENDING', 'DIERR_NOAGGREGATION', 'DIERR_NOTDOWNLOADED', 'DIERR_MOREDATA'

} // namespace re_ndinput8
