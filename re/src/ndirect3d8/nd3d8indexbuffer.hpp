#pragma once
// Auto-lifted C++ layout & method spec from ndirect3d8.dll
// Source ASM: re/disasm/ndirect3d8/nd3d8indexbuffer.asm
// Class: nd3d8indexbuffer : public nindexbuffer  (sizeof = 0x7c = 124 bytes)

#include <cstdint>

namespace re_ndirect3d8 {

struct nd3d8indexbuffer_Layout {
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
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0044
    uint32_t field_0x0044;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint8_t field_0x005c;
    // +0x005d
    uint8_t field_0x005d;
    // +0x0060
    uint32_t field_0x0060;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0078
    uint32_t field_0x0078;
};

// Methods (9):
// 0x10008971  nd3d8indexbuffer::n_init_nd3d8indexbuffer  (10 insns)
//   strings: 'nindexbuffer'
// 0x10008992  nd3d8indexbuffer::n_fini_nd3d8indexbuffer  (5 insns)
// 0x100089a4  nd3d8indexbuffer::n_new_nd3d8indexbuffer  (10 insns)
// 0x100089bb  nd3d8indexbuffer::n_version_nd3d8indexbuffer  (24 insns)
//   calls:   -> nIndexBuffer::nIndexBuffer()
//   strings: '/sys/servers/gfx'
// 0x10008a01  nd3d8indexbuffer::vfunc_00  (31 insns)
// 0x10008a50  nd3d8indexbuffer::vfunc_14  (79 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Aborting!', 'gfx/nd3d8indexbuffer_main.cc'
// 0x10008b29  nd3d8indexbuffer::vfunc_15  (17 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10008b54  nd3d8indexbuffer::vfunc_16  (31 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10008b98  nd3d8indexbuffer::vfunc_17  (22 insns)
//   calls:   IAT: nkernel.dll!n_printf

} // namespace re_ndirect3d8
