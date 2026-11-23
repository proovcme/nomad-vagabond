#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nsbufshadowserver.asm
// Class: nsbufshadowserver : public nshadowserver

#include <cstdint>

namespace re_nnebula {

struct nsbufshadowserver_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
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
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0039
    uint8_t field_0x0039;
    // +0x0040
    uint32_t field_0x0040;
    // +0x0044
    uint8_t field_0x0044;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint8_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    float field_0x0064;
    // +0x0068
    float field_0x0068;
    // +0x0078
    uint32_t field_0x0078;
    // +0x007c
    uint32_t field_0x007c;
    // +0x0090
    uint32_t field_0x0090;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00f8
    uint32_t field_0x00f8;
    // +0x015c
    uint32_t field_0x015c;
    // +0x0294
    uint8_t field_0x0294;
    // +0x0295
    uint8_t field_0x0295;
    // +0x0296
    uint8_t field_0x0296;
    // +0x0297
    uint8_t field_0x0297;
    // +0x0298
    uint8_t field_0x0298;
    // +0x029c
    uint32_t field_0x029c;
    // +0x02a0
    uint32_t field_0x02a0;
    // +0x02a4
    uint32_t field_0x02a4;
    // +0x02a8
    uint32_t field_0x02a8;
    // +0x0328
    uint8_t field_0x0328;
    // +0x03f0
    uint8_t field_0x03f0;
    // +0x03f1
    uint8_t field_0x03f1;
    // +0x03f2
    uint8_t field_0x03f2;
    // +0x03f3
    uint8_t field_0x03f3;
    // +0x03f4
    uint8_t field_0x03f4;
    // +0x0400
    uint32_t field_0x0400;
    // +0x0404
    uint32_t field_0x0404;
    // +0x0484
    uint8_t field_0x0484;
    // +0x048c
    uint32_t field_0x048c;
    // +0x0720
    uint8_t field_0x0720;
    // +0x0721
    uint8_t field_0x0721;
    // +0x0722
    uint8_t field_0x0722;
    // +0x0723
    uint8_t field_0x0723;
    // +0x0724
    uint8_t field_0x0724;
    // +0x0730
    uint32_t field_0x0730;
    // +0x0734
    uint32_t field_0x0734;
    // +0x07b4
    uint8_t field_0x07b4;
    // +0x0aec
    uint8_t field_0x0aec;
    // +0x0afc
    uint32_t field_0x0afc;
};

// Methods (4):
// 0x100361db  nsbufshadowserver::n_init_nsbufshadowserver  (10 insns)
//   strings: 'nshadowserver'
// 0x100361fc  nsbufshadowserver::n_fini_nsbufshadowserver  (5 insns)
// 0x1003620e  nsbufshadowserver::n_new_nsbufshadowserver  (10 insns)
// 0x10036228  nsbufshadowserver::n_version_nsbufshadowserver  (1422 insns)
//   calls:   -> nShadowServer::nShadowServer(), -> nShadowServer::~nShadowServer(), -> nVertexBuffer::Coord, -> nVertexBuffer::Color, -> nVertexBuffer::UnlockVertices, -> nVertexBuffer::LockVertices
//   consts:  f32=0.001, f32=100000, f32=0.02, f32=0.5, f32=255, f32=-1
//   strings: '/sys/servers/gfx'

} // namespace re_nnebula
