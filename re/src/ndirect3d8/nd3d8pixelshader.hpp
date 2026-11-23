#pragma once
// Auto-lifted C++ layout & method spec from ndirect3d8.dll
// Source ASM: re/disasm/ndirect3d8/nd3d8pixelshader.asm
// Class: nd3d8pixelshader : public npixelshader  (sizeof = 0xa4 = 164 bytes)

#include <cstdint>

namespace re_ndirect3d8 {

struct nd3d8pixelshader_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    float field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    float field_0x0018;
    // +0x0020
    float field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x0030
    float field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x0054
    uint8_t field_0x0054;
    // +0x0055
    uint8_t field_0x0055;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    float field_0x0064;
    // +0x0068
    float field_0x0068;
    // +0x006c
    float field_0x006c;
    // +0x0090
    uint8_t field_0x0090;
    // +0x0091
    uint8_t field_0x0091;
    // +0x0094
    uint32_t field_0x0094;
    // +0x009c
    uint8_t field_0x009c;
    // +0x00a0
    uint8_t field_0x00a0;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00f4
    uint32_t field_0x00f4;
    // +0x00fc
    uint32_t field_0x00fc;
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
    // +0x02ac
    uint32_t field_0x02ac;
    // +0x02b0
    uint32_t field_0x02b0;
    // +0x02b4
    float field_0x02b4;
    // +0x02c4
    float field_0x02c4;
    // +0x0328
    uint8_t field_0x0328;
    // +0x0329
    uint8_t field_0x0329;
    // +0x032a
    uint8_t field_0x032a;
    // +0x032b
    uint8_t field_0x032b;
    // +0x032c
    uint8_t field_0x032c;
    // +0x0aa0
    uint32_t field_0x0aa0;
    // +0x0cb0
    uint32_t field_0x0cb0;
};

// Methods (9):
// 0x10008bc9  nd3d8pixelshader::n_init_nd3d8pixelshader  (10 insns)
//   strings: 'npixelshader'
// 0x10008bea  nd3d8pixelshader::n_fini_nd3d8pixelshader  (5 insns)
// 0x10008bfc  nd3d8pixelshader::n_new_nd3d8pixelshader  (10 insns)
// 0x10008c16  nd3d8pixelshader::n_version_nd3d8pixelshader  (35 insns)
// 0x10008c62  nd3d8pixelshader::vfunc_00  (1195 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nGfxServer::SetCurrentTexture
//   consts:  f32=255
// 0x10009859  nd3d8pixelshader::vfunc_14  (82 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10009934  nd3d8pixelshader::vfunc_15  (64 insns)
// 0x100099d4  nd3d8pixelshader::vfunc_16  (366 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   consts:  f32=255, f32=0.5, f32=-1
// 0x10009e22  nd3d8pixelshader::vfunc_17  (481 insns)
//   calls:   IAT: nkernel.dll!nClass::~nClass()
//   consts:  f32=0

} // namespace re_ndirect3d8
