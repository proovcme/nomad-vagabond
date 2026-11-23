#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nShadowServer.asm
// Class: nShadowServer : public nroot  (sizeof = 0x6c = 108 bytes)

#include <cstdint>

namespace re_nnebula {

struct nShadowServer_Layout {
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
    // +0x001d
    uint8_t field_0x001d;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
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
    // +0x0080
    uint32_t field_0x0080;
    // +0x0084
    uint32_t field_0x0084;
    // +0x0088
    uint32_t field_0x0088;
    // +0x008c
    uint32_t field_0x008c;
    // +0x0090
    uint32_t field_0x0090;
    // +0x00a0
    uint32_t field_0x00a0;
};

// Script AddCmds (3):
//   v_setcastshadows_b
//   b_getcastshadows_v
//   v_setshadowcolor_ffff

// Methods (23):
// 0x1000d494  nShadowServer::nShadowServer()  (33 insns)
//   calls:   -> nRoot::nRoot()
// 0x1000d4e1  nShadowServer::operator=  (30 insns)
//   calls:   -> nRoot::operator=
// 0x1000d51a  nShadowServer::vfunc_00  (646 insns)
//   calls:   -> nShadowServer::~nShadowServer(), IAT: nkernel.dll!n_strncpy2, IAT: nkernel.dll!n_printf, IAT: nkernel.dll!nn_malloc, -> nVertexBuffer::LockVertices, -> nVertexBuffer::JointWeight1, -> nVertexBuffer::JointWeight2, -> nVertexBuffer::JointWeight3, -> nVertexBuffer::JointWeight4, -> nVertexBuffer::UnlockVertices, IAT: nkernel.dll!n_free
//   consts:  f32=1000000, f32=-1000000
//   strings: '_ro', '_rw', 'rb', 'gfx/nnvxmeshloader.cc'
// 0x10035d53  nShadowServer::n_init_nshadowserver  (15 insns)
//   strings: 'nroot'
// 0x10035d7e  nShadowServer::n_fini_nshadowserver  (5 insns)
// 0x10035d90  nShadowServer::n_new_nshadowserver  (10 insns)
//   calls:   -> nShadowServer::nShadowServer()
// 0x10035da7  nShadowServer::n_version_nshadowserver  (2 insns)
// 0x10035dad  nShadowServer::nShadowServer()  (32 insns)
//   strings: '/sys/share/shadowcasters', 'nroot'
// 0x10035e0b  nShadowServer::~nShadowServer()  (20 insns)
// 0x10035e42  nShadowServer::SetCastShadows  (3 insns)
// 0x10035e4c  nShadowServer::GetCastShadows  (2 insns)
// 0x10035e50  nShadowServer::SetShadowColor  (9 insns)
// 0x10035e6f  nShadowServer::GetShadowColor  (13 insns)
// 0x10035e96  nShadowServer::BeginScene  (4 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10035ea3  nShadowServer::AttachLight  (24 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10035edf  nShadowServer::AttachCaster  (24 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10035f1b  nShadowServer::EndScene  (4 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10035f28  nShadowServer::NewCaster  (33 insns)
//   calls:   -> nShadowServer::getResourceId
//   strings: 'nshadowcaster'
// 0x10035f82  nShadowServer::FindCaster  (19 insns)
//   calls:   -> nShadowServer::getResourceId
// 0x10035fb1  nShadowServer::getResourceId  (91 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: 'res%d', 'v_setcastshadows_b', 'b_getcastshadows_v', 'v_setshadowcolor_ffff', 'ffff_getshadowcolor_v'
// 0x100360ac  nShadowServer::cmd_setcastshadows (v_setcastshadows_b)  (12 insns)
//   calls:   -> nShadowServer::SetCastShadows
// 0x100360d2  nShadowServer::cmd_getcastshadows (b_getcastshadows_v)  (13 insns)
//   calls:   -> nShadowServer::GetCastShadows
// 0x100360fd  nShadowServer::cmd_setshadowcolor (v_setshadowcolor_ffff)  (74 insns)
//   calls:   -> nShadowServer::SetShadowColor, -> nShadowServer::GetShadowColor

} // namespace re_nnebula
