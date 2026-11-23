#pragma once
// Auto-lifted C++ layout & method spec from ndinput8.dll
// Source ASM: re/disasm/ndinput8/nRelMouseDevice.asm
// Class: nRelMouseDevice

#include <cstdint>

namespace re_ndinput8 {

struct nRelMouseDevice_Layout {
    // +0x0050
    uint8_t field_0x0050;
    // +0x0051
    uint8_t field_0x0051;
};

// Methods (2):
// 0x10001cf9  nRelMouseDevice::nRelMouseDevice()  (22 insns)
//   calls:   -> nInputDevice::nInputDevice()
// 0x10001d2d  nRelMouseDevice::operator=  (31 insns)
//   calls:   -> nInputDevice::operator=

} // namespace re_ndinput8
