#pragma once
// Auto-lifted C++ layout & method spec from ndirect3d8.dll
// Source ASM: re/disasm/ndirect3d8/nIndexBuffer.asm
// Class: nIndexBuffer

#include <cstdint>

namespace re_ndirect3d8 {

struct nIndexBuffer_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0005
    uint8_t field_0x0005;
    // +0x0006
    uint8_t field_0x0006;
    // +0x0007
    uint8_t field_0x0007;
    // +0x0008
    float field_0x0008;
    // +0x000a
    uint8_t field_0x000a;
    // +0x000c
    float field_0x000c;
    // +0x0010
    float field_0x0010;
    // +0x0012
    uint8_t field_0x0012;
    // +0x0013
    uint8_t field_0x0013;
    // +0x0014
    float field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
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
    // +0x0040
    uint32_t field_0x0040;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint8_t field_0x005c;
    // +0x005d
    uint8_t field_0x005d;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    float field_0x006c;
    // +0x0074
    float field_0x0074;
    // +0x007c
    float field_0x007c;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00d4
    uint32_t field_0x00d4;
    // +0x00d8
    uint32_t field_0x00d8;
    // +0x00dc
    uint32_t field_0x00dc;
    // +0x00f4
    uint32_t field_0x00f4;
    // +0x00fc
    uint32_t field_0x00fc;
    // +0x0118
    uint32_t field_0x0118;
    // +0x0130
    uint32_t field_0x0130;
    // +0x014c
    uint32_t field_0x014c;
    // +0x0670
    uint32_t field_0x0670;
    // +0x0674
    uint32_t field_0x0674;
    // +0x0cb0
    uint32_t field_0x0cb0;
    // +0x0cb4
    uint32_t field_0x0cb4;
    // +0x0de8
    uint32_t field_0x0de8;
    // +0x0dec
    uint32_t field_0x0dec;
    // +0x1030
    uint32_t field_0x1030;
    // +0x1034
    uint32_t field_0x1034;
    // +0x1038
    uint32_t field_0x1038;
    // +0x103c
    uint32_t field_0x103c;
    // +0x1040
    uint32_t field_0x1040;
    // +0x1044
    uint32_t field_0x1044;
    // +0x1048
    uint32_t field_0x1048;
    // +0x104c
    uint32_t field_0x104c;
    // +0x1050
    uint32_t field_0x1050;
    // +0x1054
    uint32_t field_0x1054;
    // +0x1058
    uint32_t field_0x1058;
    // +0x105c
    uint32_t field_0x105c;
    // +0x1060
    uint32_t field_0x1060;
    // +0x1064
    uint32_t field_0x1064;
    // +0x1068
    uint32_t field_0x1068;
    // +0x106c
    uint32_t field_0x106c;
    // +0x1070
    uint32_t field_0x1070;
    // +0x1074
    uint32_t field_0x1074;
    // +0x1078
    uint32_t field_0x1078;
    // +0x107c
    uint32_t field_0x107c;
    // +0x1080
    uint32_t field_0x1080;
    // +0x1084
    uint32_t field_0x1084;
    // +0x1088
    uint32_t field_0x1088;
    // +0x108c
    uint32_t field_0x108c;
    // +0x1090
    uint32_t field_0x1090;
    // +0x1094
    uint32_t field_0x1094;
    // +0x1098
    uint32_t field_0x1098;
    // +0x109c
    uint32_t field_0x109c;
    // +0x10a0
    uint32_t field_0x10a0;
    // +0x10a4
    uint32_t field_0x10a4;
    // +0x10ac
    uint32_t field_0x10ac;
    // +0x10b0
    float field_0x10b0;
    // +0x10b4
    float field_0x10b4;
};

// Methods (18):
// 0x10006e5f  nIndexBuffer::nIndexBuffer()  (27 insns)
//   calls:   -> nRoot::nRoot()
// 0x10006eaa  nIndexBuffer::operator=  (26 insns)
//   calls:   -> nRoot::operator=
// 0x10006eef  nIndexBuffer::vfunc_00  (41 insns)
// 0x10006f4b  nIndexBuffer::nIndexBuffer()  (16 insns)
// 0x10006f77  nIndexBuffer::Index  (5 insns)
// 0x10006f8a  nIndexBuffer::Truncate  (3 insns)
// 0x10006f94  nIndexBuffer::Untruncate  (3 insns)
// 0x10006f9b  nIndexBuffer::GetPrimType  (2 insns)
// 0x10006f9f  nIndexBuffer::GetIndexBufferType  (2 insns)
// 0x10007056  nIndexBuffer::vfunc_18  (1157 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, IAT: GDI32.dll!CreateCompatibleDC, IAT: GDI32.dll!CreateDIBSection, IAT: GDI32.dll!SetMapMode, IAT: GDI32.dll!GetDeviceCaps, IAT: KERNEL32.dll!MulDiv, IAT: GDI32.dll!CreateFontA, IAT: GDI32.dll!SelectObject, IAT: GDI32.dll!SetTextColor, IAT: GDI32.dll!SetBkColor, IAT: GDI32.dll!SetTextAlign
//   consts:  f32=1, f32=0.5, f32=0.9
//   strings: 'Arial'
// 0x1000a5fe  nIndexBuffer::vfunc_17  (1 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::Unlock
// 0x1000a604  nIndexBuffer::vfunc_16  (1 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::Lock
// 0x1000a60a  nIndexBuffer::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::End
// 0x1000a610  nIndexBuffer::vfunc_14  (2 insns)
//   calls:   IAT: nnebula.dll!nIndexBuffer::Begin, IAT: nnebula.dll!nIndexBuffer::~nIndexBuffer()
// 0x1000a61c  nIndexBuffer::vfunc_35  (1 insns)
//   calls:   IAT: nnebula.dll!nPixelShader::EndRender
// 0x1000a622  nIndexBuffer::vfunc_34  (1 insns)
//   calls:   IAT: nnebula.dll!nPixelShader::Render
// 0x1000a628  nIndexBuffer::vfunc_33  (1 insns)
//   calls:   IAT: nnebula.dll!nPixelShader::BeginRender
// 0x1000a62e  nIndexBuffer::vfunc_32  (11227 insns)
//   calls:   IAT: nnebula.dll!nPixelShader::Compile, IAT: nnebula.dll!nPixelShader::~nPixelShader(), IAT: nnebula.dll!nTexture::nTexture(), IAT: nnebula.dll!nTexture::EndLoad, IAT: nnebula.dll!nTexture::LoadLine, IAT: nnebula.dll!nTexture::BeginLoad, IAT: nnebula.dll!nNtxFile::~nNtxFile(), IAT: nnebula.dll!nNtxFile::FreeBlocks, IAT: nnebula.dll!nNtxFile::CloseRead, IAT: nnebula.dll!nNtxFile::GetBytesPerRow, IAT: nnebula.dll!nNtxFile::ReadBlock, IAT: nnebula.dll!nNtxFile::GetSize
//   consts:  f32=0.5, f32=1, f32=0, f32=1e-05, f32=0.25, f32=0.125, f32=0.003921569, f32=0.0078125, f32=0.0625, f32=0.01587302, f32=3.051758e-05, f32=0.0009765625

} // namespace re_ndirect3d8
