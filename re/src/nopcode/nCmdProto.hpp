#pragma once
// Auto-lifted C++ layout & method spec from nopcode.dll
// Source ASM: re/disasm/nopcode/nCmdProto.asm
// Class: nCmdProto

#include <cstdint>

namespace re_nopcode {

struct nCmdProto_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0018
    uint32_t field_0x0018;
    // +0x0020
    uint32_t field_0x0020;
    // +0x00c4
    uint32_t field_0x00c4;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00cc
    uint32_t field_0x00cc;
    // +0x00d0
    uint8_t field_0x00d0;
    // +0x0108
    uint32_t field_0x0108;
    // +0x010c
    uint32_t field_0x010c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Methods (8):
// 0x100011c7  nCmdProto::~nCmdProto()  (46 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1000122d  nCmdProto::GetID  (2 insns)
// 0x10001231  nCmdProto::GetProtoDef  (2 insns)
// 0x10001235  nCmdProto::NewCmd  (116 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1000136c  nCmdProto::RelCmd  (15 insns)
// 0x10001398  nCmdProto::GetNumInArgs  (2 insns)
// 0x1000139f  nCmdProto::GetNumOutArgs  (2 insns)
// 0x100013a6  nCmdProto::operator=  (11 insns)

} // namespace re_nopcode
