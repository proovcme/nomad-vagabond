#pragma once
// Auto-lifted C++ layout & method spec from ndirect3d8.dll
// Source ASM: re/disasm/ndirect3d8/nPixelShader.asm
// Class: nPixelShader

#include <cstdint>

namespace re_ndirect3d8 {

struct nPixelShader_Layout {
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

// Methods (4):
// 0x10006fab  nPixelShader::SetShaderDesc  (11 insns)
// 0x10006fe0  nPixelShader::GetShaderDesc  (2 insns)
// 0x10006fe4  nPixelShader::nPixelShader()  (26 insns)
//   calls:   -> nRoot::nRoot()
// 0x10007020  nPixelShader::operator=  (25 insns)
//   calls:   -> nRoot::operator=

} // namespace re_ndirect3d8
