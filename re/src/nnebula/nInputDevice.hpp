#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nInputDevice.asm
// Class: nInputDevice

#include <cstdint>

namespace re_nnebula {

struct nInputDevice_Layout {
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x0020
    double field_0x0020;
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
};

// Methods (23):
// 0x100125f7  nInputDevice::nInputDevice()  (29 insns)
// 0x1001264d  nInputDevice::~nInputDevice()  (12 insns)
// 0x1001266a  nInputDevice::SetAxisRange  (5 insns)
// 0x1001267b  nInputDevice::GetMinAxisRange  (2 insns)
// 0x1001267f  nInputDevice::GetMaxAxisRange  (2 insns)
// 0x10012683  nInputDevice::GetDeviceNum  (2 insns)
// 0x10012687  nInputDevice::GetNumAxes  (2 insns)
// 0x1001268b  nInputDevice::GetNumButtons  (2 insns)
// 0x1001268f  nInputDevice::GetNumPovs  (2 insns)
// 0x10012693  nInputDevice::ExportAxis  (26 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: 'devid=%d type=%d axis=%d', 'nenv'
// 0x100126d6  nInputDevice::ExportButton  (26 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: 'devid=%d type=%d btn=%d', 'nenv'
// 0x10012719  nInputDevice::PutAxisEvent  (16 insns)
//   calls:   -> nInputServer::NewEvent, -> nInputServer::LinkEvent
// 0x1001274d  nInputDevice::PutButtonDownEvent  (14 insns)
//   calls:   -> nInputServer::NewEvent, -> nInputServer::LinkEvent
// 0x1001277a  nInputDevice::PutButtonUpEvent  (14 insns)
//   calls:   -> nInputServer::NewEvent, -> nInputServer::LinkEvent
// 0x100127a7  nInputDevice::nInputDevice()  (41 insns)
// 0x10012813  nInputDevice::PutAxisButtonEvents  (25 insns)
//   consts:  f32=0
// 0x10012851  nInputDevice::operator=  (40 insns)
// 0x100128b7  nInputDevice::BeginEmitEvents  (3 insns)
// 0x100128c1  nInputDevice::EmitAxisMovedEvents  (1 insns)
// 0x100128c4  nInputDevice::SetStoreSize  (23 insns)
// 0x100128f6  nInputDevice::vfunc_00  (41 insns)
//   calls:   -> nInputDevice::~nInputDevice()
// 0x10012952  nInputDevice::SetStoreValue  (5 insns)
// 0x10012963  nInputDevice::GetStoreValue  (4 insns)

} // namespace re_nnebula
