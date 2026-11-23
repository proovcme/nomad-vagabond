#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nJoystickDevice.asm
// Class: nJoystickDevice

#include <cstdint>

namespace re_nnebula {

struct nJoystickDevice_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x0014
    uint32_t field_0x0014;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0038
    uint32_t field_0x0038;
    // +0x003c
    uint32_t field_0x003c;
    // +0x0040
    uint32_t field_0x0040;
    // +0x0050
    uint32_t field_0x0050;
};

// Methods (12):
// 0x10012970  nJoystickDevice::nJoystickDevice()  (49 insns)
//   calls:   -> nInputDevice::nInputDevice(), -> nInputDevice::SetStoreSize
// 0x100129f0  nJoystickDevice::~nJoystickDevice()  (2 insns)
//   calls:   -> nInputDevice::~nInputDevice()
// 0x100129fb  nJoystickDevice::Export  (326 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: 'joy%d', 'nroot', 'channels', '-%s', '+%s', '-%sbtn', '+%sbtn', 'btn%d'
// 0x10012d76  nJoystickDevice::BeginEmitEvents  (11 insns)
//   calls:   -> nInputDevice::BeginEmitEvents
// 0x10012d8f  nJoystickDevice::ProcessAnalogAxis  (126 insns)
//   calls:   -> nInputDevice::GetStoreValue, -> nInputDevice::SetStoreValue
//   consts:  f32=0, f32=1
// 0x10012ebf  nJoystickDevice::EmitAxisMovedEvents  (75 insns)
//   calls:   -> nJoystickDevice::ProcessAnalogAxis
//   consts:  f32=1, f32=-0.01, f32=0.01
// 0x10012f72  nJoystickDevice::EmitButtonEvents  (13 insns)
// 0x10012f9b  nJoystickDevice::nJoystickDevice()  (20 insns)
//   calls:   -> nInputDevice::nInputDevice()
// 0x10012fc9  nJoystickDevice::EmitPovMovedEvents  (223 insns)
//   calls:   -> nInputDevice::GetStoreValue, -> nInputDevice::SetStoreValue
//   consts:  f32=-1, f32=0
// 0x1001320c  nJoystickDevice::operator=  (36 insns)
//   calls:   -> nInputDevice::operator=
// 0x10013252  nJoystickDevice::vfunc_00  (43 insns)
//   calls:   -> nInputDevice::~nInputDevice()
// 0x100132bf  nJoystickDevice::EndEmitEvents  (36 insns)
//   calls:   -> nJoystickDevice::ProcessAnalogAxis

} // namespace re_nnebula
