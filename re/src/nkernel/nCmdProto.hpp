#pragma once
// Auto-lifted C++ layout & method spec from nkernel.dll
// Source ASM: re/disasm/nkernel/nCmdProto.asm
// Class: nCmdProto

#include <cstdint>

namespace re_nkernel {

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
    // +0x00d4
    uint32_t field_0x00d4;
    // +0x0108
    uint32_t field_0x0108;
    // +0x010c
    uint32_t field_0x010c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Methods (10):
// 0x100010de  nCmdProto::~nCmdProto()  (35 insns)
//   calls:   -> n_free
// 0x1000112b  nCmdProto::GetID  (2 insns)
// 0x1000112f  nCmdProto::GetProtoDef  (2 insns)
// 0x10001133  nCmdProto::NewCmd  (116 insns)
//   calls:   -> n_free, -> n_strdup
// 0x10001268  nCmdProto::RelCmd  (15 insns)
// 0x10001294  nCmdProto::GetNumInArgs  (2 insns)
// 0x1000129b  nCmdProto::GetNumOutArgs  (2 insns)
// 0x100012a2  nCmdProto::operator=  (22 insns)
//   calls:   -> n_free
// 0x10006ea9  nCmdProto::nCmdProto()  (321 insns)
//   calls:   IAT: MSVCRT.dll!strtok, -> n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nCmdProto::nCmdProto(): invalid input arg!', 'kernel/ncmdproto.cc', 'nCmdProto::nCmdProto(): invalid output arg!', 'nCmdProto::nCmdProto(): invalid prototype definition!'
// 0x100072ea  nCmdProto::nCmdProto()  (85 insns)

} // namespace re_nkernel
