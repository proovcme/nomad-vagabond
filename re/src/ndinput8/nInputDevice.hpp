#pragma once
// Auto-lifted C++ layout & method spec from ndinput8.dll
// Source ASM: re/disasm/ndinput8/nInputDevice.asm
// Class: nInputDevice

#include <cstdint>

namespace re_ndinput8 {

struct nInputDevice_Layout {
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
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    double field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
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
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x0158
    uint32_t field_0x0158;
    // +0x015c
    uint32_t field_0x015c;
    // +0x0164
    uint32_t field_0x0164;
    // +0x0170
    uint32_t field_0x0170;
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
};

// Methods (31):
// 0x10001af6  nInputDevice::nInputDevice()  (41 insns)
// 0x10001b62  nInputDevice::operator=  (40 insns)
// 0x10001bc8  nInputDevice::vfunc_00  (41 insns)
// 0x10001c98  nInputDevice::vfunc_13  (41 insns)
// 0x10001d6c  nInputDevice::vfunc_26  (41 insns)
// 0x10001df7  nInputDevice::vfunc_39  (862 insns)
//   calls:   IAT: KERNEL32.dll!GetModuleHandleA, IAT: nkernel.dll!n_printf, IAT: nkernel.dll!n_strdup, IAT: MSVCRT.dll!abort, IAT: nkernel.dll!n_free
//   strings: 'NOT INITIALIZED', 'UNKNOWN', 'Aborting.', 'c:/nomads/code/inc\\kernel/nautoref.h'
// 0x10002d3e  nInputDevice::vfunc_12  (1 insns)
//   calls:   IAT: nnebula.dll!nInputDevice::PutAxisButtonEvents
// 0x10002d44  nInputDevice::vfunc_11  (1 insns)
//   calls:   IAT: nnebula.dll!nInputDevice::PutButtonUpEvent
// 0x10002d4a  nInputDevice::vfunc_10  (1 insns)
//   calls:   IAT: nnebula.dll!nInputDevice::PutButtonDownEvent
// 0x10002d50  nInputDevice::vfunc_09  (1 insns)
//   calls:   IAT: nnebula.dll!nInputDevice::PutAxisEvent
// 0x10002d56  nInputDevice::vfunc_08  (1 insns)
//   calls:   IAT: nnebula.dll!nInputDevice::ExportButton
// 0x10002d5c  nInputDevice::vfunc_07  (1 insns)
//   calls:   IAT: nnebula.dll!nInputDevice::ExportAxis
// 0x10002d62  nInputDevice::vfunc_06  (1 insns)
//   calls:   IAT: nnebula.dll!nInputDevice::EndEmitEvents
// 0x10002d68  nInputDevice::vfunc_05  (1 insns)
//   calls:   IAT: nnebula.dll!nInputDevice::EmitPovMovedEvents
// 0x10002d6e  nInputDevice::vfunc_04  (1 insns)
//   calls:   IAT: nnebula.dll!nInputDevice::EmitButtonEvents
// 0x10002d74  nInputDevice::vfunc_03  (1 insns)
//   calls:   IAT: nnebula.dll!nInputDevice::EmitAxisMovedEvents
// 0x10002d7a  nInputDevice::vfunc_02  (1 insns)
//   calls:   IAT: nnebula.dll!nInputDevice::BeginEmitEvents
// 0x10002d80  nInputDevice::vfunc_01  (2 insns)
//   calls:   IAT: nnebula.dll!nInputDevice::Export, IAT: nnebula.dll!nInputDevice::~nInputDevice()
// 0x10002d8c  nInputDevice::vfunc_19  (1 insns)
//   calls:   IAT: nnebula.dll!nJoystickDevice::EndEmitEvents
// 0x10002d92  nInputDevice::vfunc_18  (1 insns)
//   calls:   IAT: nnebula.dll!nJoystickDevice::EmitPovMovedEvents
// 0x10002d98  nInputDevice::vfunc_17  (1 insns)
//   calls:   IAT: nnebula.dll!nJoystickDevice::EmitButtonEvents
// 0x10002d9e  nInputDevice::vfunc_16  (1 insns)
//   calls:   IAT: nnebula.dll!nJoystickDevice::EmitAxisMovedEvents
// 0x10002da4  nInputDevice::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nJoystickDevice::BeginEmitEvents
// 0x10002daa  nInputDevice::vfunc_14  (2 insns)
//   calls:   IAT: nnebula.dll!nJoystickDevice::Export, IAT: nnebula.dll!nJoystickDevice::~nJoystickDevice()
// 0x10002db6  nInputDevice::vfunc_32  (1 insns)
//   calls:   IAT: nnebula.dll!nRelMouseDevice::EndEmitEvents
// 0x10002dbc  nInputDevice::vfunc_30  (1 insns)
//   calls:   IAT: nnebula.dll!nRelMouseDevice::EmitButtonEvents
// 0x10002dc2  nInputDevice::vfunc_29  (1 insns)
//   calls:   IAT: nnebula.dll!nRelMouseDevice::EmitAxisMovedEvents
// 0x10002dc8  nInputDevice::vfunc_28  (1 insns)
//   calls:   IAT: nnebula.dll!nRelMouseDevice::BeginEmitEvents
// 0x10002dce  nInputDevice::vfunc_27  (2 insns)
//   calls:   IAT: nnebula.dll!nRelMouseDevice::Export, IAT: nnebula.dll!nRelMouseDevice::~nRelMouseDevice()
// 0x10002dda  nInputDevice::vfunc_43  (1 insns)
//   calls:   IAT: nnebula.dll!nKeyboardDevice::EmitButtonEvents
// 0x10002de0  nInputDevice::vfunc_40  (1977 insns)
//   calls:   IAT: nnebula.dll!nKeyboardDevice::Export, IAT: nnebula.dll!nKeyboardDevice::~nKeyboardDevice(), IAT: nnebula.dll!nKeyboardDevice::nKeyboardDevice(), IAT: nnebula.dll!nRelMouseDevice::nRelMouseDevice(), IAT: nnebula.dll!nInputDevice::SetAxisRange, IAT: nnebula.dll!nInputDevice::SetSourceDevice, IAT: nnebula.dll!nJoystickDevice::nJoystickDevice(), IAT: nnebula.dll!nInputDevice::GetSourceDevice, IAT: DINPUT8.dll!DirectInput8Create, IAT: MSVCRT.dll!??2@YAPAXI@Z, IAT: MSVCRT.dll!??3@YAXPAX@Z, IAT: MSVCRT.dll!_adjust_fdiv

} // namespace re_ndinput8
