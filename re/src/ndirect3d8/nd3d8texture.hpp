#pragma once
// Auto-lifted C++ layout & method spec from ndirect3d8.dll
// Source ASM: re/disasm/ndirect3d8/nd3d8texture.asm
// Class: nd3d8texture : public ntexture  (sizeof = 0xfc = 252 bytes)

#include <cstdint>

namespace re_ndirect3d8 {

struct nd3d8texture_Layout {
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
    // +0x003c
    uint32_t field_0x003c;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0078
    uint8_t field_0x0078;
    // +0x0079
    uint8_t field_0x0079;
    // +0x0080
    uint32_t field_0x0080;
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00d8
    uint32_t field_0x00d8;
    // +0x00e8
    uint32_t field_0x00e8;
    // +0x00f4
    uint32_t field_0x00f4;
    // +0x00f8
    uint32_t field_0x00f8;
};

// Methods (7):
// 0x10007d90  nd3d8texture::n_init_nd3d8texture  (10 insns)
//   strings: 'ntexture'
// 0x10007db1  nd3d8texture::n_fini_nd3d8texture  (5 insns)
// 0x10007dc3  nd3d8texture::n_new_nd3d8texture  (10 insns)
// 0x10007ddd  nd3d8texture::n_version_nd3d8texture  (25 insns)
//   strings: '/sys/servers/gfx'
// 0x10007e2f  nd3d8texture::vfunc_00  (25 insns)
//   calls:   -> nd3d8texture::vfunc_15
// 0x10007e78  nd3d8texture::vfunc_15  (11 insns)
// 0x10007e94  nd3d8texture::vfunc_14  (636 insns)
//   calls:   IAT: MSVCRT.dll!strstr, IAT: nkernel.dll!n_printf, IAT: DevIL.dll!ilGenImages, IAT: DevIL.dll!ilBindImage, IAT: DevIL.dll!ilLoadImage, IAT: DevIL.dll!ilGetError, IAT: ILU.dll!iluErrorString, IAT: DevIL.dll!ilGetInteger, IAT: ILU.dll!iluBuildMipmaps, IAT: DevIL.dll!ilConvertImage, IAT: DevIL.dll!ilActiveMipmap, IAT: DevIL.dll!ilGetData
//   strings: '.ntx', '<none>', 'NOT INITIALIZED', 'Aborting.', 'c:/nomads/code/inc\\kernel/nautoref.h', 'gfx/nd3d8tex_old.cc'

} // namespace re_ndirect3d8
