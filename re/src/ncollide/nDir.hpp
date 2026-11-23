#pragma once
// Auto-lifted C++ layout & method spec from ncollide.dll
// Source ASM: re/disasm/ncollide/nDir.asm
// Class: nDir

#include <cstdint>

namespace re_ncollide {

struct nDir_Layout {
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00ac
    uint32_t field_0x00ac;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00b4
    uint32_t field_0x00b4;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00bc
    uint32_t field_0x00bc;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x00c4
    uint32_t field_0x00c4;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00cc
    uint32_t field_0x00cc;
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00d4
    uint32_t field_0x00d4;
    // +0x00d8
    uint32_t field_0x00d8;
    // +0x00dc
    uint32_t field_0x00dc;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00e8
    uint32_t field_0x00e8;
    // +0x00ec
    uint32_t field_0x00ec;
    // +0x00f0
    uint8_t field_0x00f0;
    // +0x00fc
    uint32_t field_0x00fc;
    // +0x0204
    uint32_t field_0x0204;
};

// Methods (7):
// 0x1000639f  nDir::nDir()  (19 insns)
// 0x100063dc  nDir::operator=  (28 insns)
// 0x10006425  nDir::vfunc_00  (105 insns)
//   strings: '/sys/servers/file2', '/sys/servers/collide', '/sys/servers/gfx'
// 0x1000745c  nDir::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nDir::IsSubDir
// 0x10007462  nDir::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nDir::Rewind
// 0x10007468  nDir::vfunc_02  (1 insns)
//   calls:   IAT: nkernel.dll!nDir::Read
// 0x1000746e  nDir::vfunc_01  (5 insns)
//   calls:   IAT: nkernel.dll!nDir::Open, IAT: nkernel.dll!nDir::~nDir(), IAT: nkernel.dll!nRoot::RemObjectRef, IAT: nkernel.dll!nRoot::GetFullName, IAT: nkernel.dll!nRoot::AddObjectRef

} // namespace re_ncollide
