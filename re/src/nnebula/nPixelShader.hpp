#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nPixelShader.asm
// Class: nPixelShader : public nroot  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnebula {

struct nPixelShader_Layout {
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
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint8_t field_0x0064;
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
};

// Methods (15):
// 0x1000f05f  nPixelShader::SetShaderDesc  (11 insns)
// 0x1000f094  nPixelShader::GetShaderDesc  (2 insns)
// 0x1000f098  nPixelShader::nPixelShader()  (26 insns)
//   calls:   -> nRoot::nRoot()
// 0x1000f0d4  nPixelShader::operator=  (25 insns)
//   calls:   -> nRoot::operator=
// 0x1000f10a  nPixelShader::vfunc_00  (41 insns)
//   calls:   -> nPixelShader::~nPixelShader()
// 0x10010577  nPixelShader::n_init_npixelshader  (10 insns)
//   strings: 'nroot'
// 0x10010598  nPixelShader::n_fini_npixelshader  (5 insns)
// 0x100105aa  nPixelShader::n_new_npixelshader  (10 insns)
//   calls:   -> nPixelShader::nPixelShader()
// 0x100105c1  nPixelShader::n_version_npixelshader  (2 insns)
// 0x100105c7  nPixelShader::nPixelShader()  (26 insns)
//   strings: '/sys/servers/gfx'
// 0x1001060f  nPixelShader::~nPixelShader()  (34 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nGfxServer::SetStats
// 0x10010674  nPixelShader::Compile  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'gfx/npshader_main.cc'
// 0x10010694  nPixelShader::BeginRender  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'gfx/npshader_main.cc'
// 0x100106b4  nPixelShader::Render  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'gfx/npshader_main.cc'
// 0x100106d4  nPixelShader::EndRender  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'gfx/npshader_main.cc'

} // namespace re_nnebula
