#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nShadowServer.asm
// Class: nShadowServer

#include <cstdint>

namespace re_nnomads {

struct nShadowServer_Layout {
    // +0x0054
    uint8_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
};

// Methods (9):
// 0x10075d03  nShadowServer::nShadowServer()  (33 insns)
//   calls:   -> nRoot::nRoot()
// 0x10075d50  nShadowServer::operator=  (30 insns)
//   calls:   -> nRoot::operator=
// 0x10075d89  nShadowServer::vfunc_00  (41 insns)
// 0x10079b04  nShadowServer::vfunc_19  (1 insns)
//   calls:   IAT: nnebula.dll!nShadowServer::FindCaster
// 0x10079b0a  nShadowServer::vfunc_18  (1 insns)
//   calls:   IAT: nnebula.dll!nShadowServer::NewCaster
// 0x10079b10  nShadowServer::vfunc_17  (1 insns)
//   calls:   IAT: nnebula.dll!nShadowServer::EndScene
// 0x10079b16  nShadowServer::vfunc_16  (1 insns)
//   calls:   IAT: nnebula.dll!nShadowServer::AttachCaster
// 0x10079b1c  nShadowServer::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nShadowServer::AttachLight
// 0x10079b22  nShadowServer::vfunc_14  (2 insns)
//   calls:   IAT: nnebula.dll!nShadowServer::BeginScene, IAT: nnebula.dll!nShadowServer::~nShadowServer()

} // namespace re_nnomads
