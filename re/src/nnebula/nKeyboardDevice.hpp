#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nKeyboardDevice.asm
// Class: nKeyboardDevice

#include <cstdint>

namespace re_nnebula {

struct nKeyboardDevice_Layout {
    // (no direct [this+offset] fields detected)
};

// Methods (5):
// 0x10013914  nKeyboardDevice::nKeyboardDevice()  (16 insns)
//   calls:   -> nInputDevice::nInputDevice()
// 0x1001393e  nKeyboardDevice::~nKeyboardDevice()  (2 insns)
//   calls:   -> nInputDevice::~nInputDevice()
// 0x1001394c  nKeyboardDevice::nKeyboardDevice()  (8 insns)
//   calls:   -> nInputDevice::nInputDevice()
// 0x10013964  nKeyboardDevice::operator=  (7 insns)
//   calls:   -> nInputDevice::operator=
// 0x10013976  nKeyboardDevice::vfunc_00  (43 insns)
//   calls:   -> nInputDevice::~nInputDevice()

} // namespace re_nnebula
