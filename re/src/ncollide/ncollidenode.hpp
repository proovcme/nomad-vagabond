#pragma once
// Auto-lifted C++ layout & method spec from ncollide.dll
// Source ASM: re/disasm/ncollide/ncollidenode.asm
// Class: ncollidenode : public nvisnode  (sizeof = 0x100 = 256 bytes)

#include <cstdint>

namespace re_ncollide {

struct ncollidenode_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x001c
    float field_0x001c;
    // +0x0024
    float field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0030
    float field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x003c
    float field_0x003c;
    // +0x004c
    uint32_t field_0x004c;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x00d8
    uint32_t field_0x00d8;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00e8
    uint32_t field_0x00e8;
    // +0x00ec
    uint32_t field_0x00ec;
    // +0x00f0
    uint8_t field_0x00f0;
    // +0x00fc
    uint32_t field_0x00fc;
    // +0x0110
    uint32_t field_0x0110;
};

// Methods (11):
// 0x100061d9  ncollidenode::n_init_ncollidenode  (15 insns)
//   strings: 'nvisnode'
// 0x10006204  ncollidenode::n_fini_ncollidenode  (5 insns)
// 0x10006216  ncollidenode::n_new_ncollidenode  (10 insns)
// 0x10006230  ncollidenode::n_version_ncollidenode  (2 insns)
// 0x1000659b  ncollidenode::vfunc_00  (73 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1000668b  ncollidenode::vfunc_14  (17 insns)
//   calls:   -> nVisNode::vfunc_14
// 0x100066b9  ncollidenode::vfunc_15  (239 insns)
//   calls:   -> nVisNode::vfunc_15, -> nCollideObject::Transform, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'NOT INITIALIZED', 'Aborting.', 'c:/nomads/code/inc\\kernel/nautoref.h'
// 0x10007101  ncollidenode::cmd_setfilename (v_setfilename_s)  (10 insns)
// 0x10007124  ncollidenode::cmd_getfilename (s_getfilename_v)  (15 insns)
// 0x10007154  ncollidenode::cmd_setcollclass (v_setcollclass_s)  (12 insns)
//   calls:   IAT: nkernel.dll!n_strdup
// 0x1000717f  ncollidenode::cmd_getcollclass (s_getcollclass_v)  (119 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, IAT: nkernel.dll!nClass::~nClass()

} // namespace re_ncollide
