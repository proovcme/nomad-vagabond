#pragma once
// Auto-lifted C++ layout & method spec from ndinput8.dll
// Source ASM: re/disasm/ndinput8/nJoystickDevice.asm
// Class: nJoystickDevice

#include <cstdint>

namespace re_ndinput8 {

struct nJoystickDevice_Layout {
    // +0x0050
    uint32_t field_0x0050;
};

// Methods (2):
// 0x10001c24  nJoystickDevice::nJoystickDevice()  (20 insns)
//   calls:   -> nInputDevice::nInputDevice()
// 0x10001c52  nJoystickDevice::operator=  (36 insns)
//   calls:   -> nInputDevice::operator=

} // namespace re_ndinput8
