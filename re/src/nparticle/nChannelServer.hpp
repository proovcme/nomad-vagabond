#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nChannelServer.asm
// Class: nChannelServer

#include <cstdint>

namespace re_nparticle {

struct nChannelServer_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    float field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    float field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint8_t field_0x0034;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
};

// Methods (3):
// 0x100049e4  nChannelServer::nChannelServer()  (54 insns)
//   calls:   -> nRoot::nRoot()
// 0x10004a78  nChannelServer::operator=  (70 insns)
//   calls:   -> nRoot::operator=, IAT: nkernel.dll!n_free
// 0x10004b18  nChannelServer::vfunc_00  (169 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'c:/nomads/code/inc\\gfx/nchannelset.h'

} // namespace re_nparticle
