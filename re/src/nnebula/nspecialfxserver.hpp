#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nspecialfxserver.asm
// Class: nspecialfxserver : public nroot  (sizeof = 0x70 = 112 bytes)

#include <cstdint>

namespace re_nnebula {

struct nspecialfxserver_Layout {
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
    uint8_t field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    float field_0x0064;
    // +0x0068
    float field_0x0068;
    // +0x006c
    float field_0x006c;
};

// Methods (9):
// 0x100344db  nspecialfxserver::n_init_nspecialfxserver  (21 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nroot', 'misc/nsfx_init.cc'
// 0x1003452c  nspecialfxserver::n_fini_nspecialfxserver  (14 insns)
// 0x1003454f  nspecialfxserver::n_new_nspecialfxserver  (10 insns)
// 0x10034566  nspecialfxserver::n_version_nspecialfxserver  (34 insns)
//   strings: '/sys/servers/specialfx/root'
// 0x100345c2  nspecialfxserver::vfunc_00  (24 insns)
// 0x10034600  nspecialfxserver::vfunc_14  (10 insns)
// 0x10034619  nspecialfxserver::vfunc_15  (14 insns)
//   calls:   -> nSceneGraph2::Attach
// 0x1003463f  nspecialfxserver::vfunc_16  (77 insns)
//   consts:  f32=1, f32=0
// 0x10034703  nspecialfxserver::vfunc_17  (14 insns)

} // namespace re_nnebula
