#pragma once
// Auto-lifted C++ layout & method spec from ndinput8.dll
// Source ASM: re/disasm/ndinput8/nKeyboardDevice.asm
// Class: nKeyboardDevice

#include <cstdint>

namespace re_ndinput8 {

struct nKeyboardDevice_Layout {
    // (no direct [this+offset] fields detected)
};

// Methods (2):
// 0x10001dcd  nKeyboardDevice::nKeyboardDevice()  (8 insns)
//   calls:   -> nInputDevice::nInputDevice()
// 0x10001de5  nKeyboardDevice::operator=  (7 insns)
//   calls:   -> nInputDevice::operator=

} // namespace re_ndinput8
