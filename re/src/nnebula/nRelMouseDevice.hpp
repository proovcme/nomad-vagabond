#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nRelMouseDevice.asm
// Class: nRelMouseDevice

#include <cstdint>

namespace re_nnebula {

struct nRelMouseDevice_Layout {
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0038
    uint32_t field_0x0038;
    // +0x003c
    uint32_t field_0x003c;
    // +0x0050
    uint8_t field_0x0050;
    // +0x0051
    uint8_t field_0x0051;
};

// Methods (11):
// 0x10013308  nRelMouseDevice::nRelMouseDevice()  (46 insns)
//   calls:   -> nInputDevice::nInputDevice(), -> nInputDevice::SetStoreSize
// 0x1001337e  nRelMouseDevice::~nRelMouseDevice()  (2 insns)
//   calls:   -> nInputDevice::~nInputDevice()
// 0x10013389  nRelMouseDevice::Export  (180 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: 'relmouse%d', 'nroot', 'channels', '-%s', '+%s', '-%sbtn', '+%sbtn', 'btn%d'
// 0x1001357d  nRelMouseDevice::BeginEmitEvents  (8 insns)
//   calls:   -> nInputDevice::BeginEmitEvents
// 0x10013596  nRelMouseDevice::EmitAxisMovedEvents  (150 insns)
//   calls:   -> nInputDevice::GetStoreValue, -> nInputDevice::SetStoreValue
//   consts:  f32=0.1, f32=0
// 0x1001370f  nRelMouseDevice::EmitButtonEvents  (13 insns)
// 0x10013738  nRelMouseDevice::ResetAxis  (80 insns)
//   calls:   -> nInputDevice::GetStoreValue, -> nInputDevice::SetStoreValue
// 0x100137e9  nRelMouseDevice::EndEmitEvents  (28 insns)
//   calls:   -> nRelMouseDevice::ResetAxis
// 0x10013834  nRelMouseDevice::nRelMouseDevice()  (22 insns)
//   calls:   -> nInputDevice::nInputDevice()
// 0x10013868  nRelMouseDevice::operator=  (31 insns)
//   calls:   -> nInputDevice::operator=
// 0x100138a7  nRelMouseDevice::vfunc_00  (43 insns)
//   calls:   -> nInputDevice::~nInputDevice()

} // namespace re_nnebula
