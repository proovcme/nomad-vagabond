#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nstaticmeshemitter.asm
// Class: nstaticmeshemitter : public npemitter  (sizeof = 0x15c0 = 5568 bytes)

#include <cstdint>

namespace re_nparticle {

struct nstaticmeshemitter_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0074
    uint32_t field_0x0074;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00c4
    float field_0x00c4;
    // +0x010c
    uint32_t field_0x010c;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0120
    uint32_t field_0x0120;
    // +0x01a8
    uint32_t field_0x01a8;
    // +0x01ac
    float field_0x01ac;
    // +0x01b0
    uint32_t field_0x01b0;
    // +0x01b4
    uint32_t field_0x01b4;
    // +0x01b8
    uint32_t field_0x01b8;
    // +0x01bc
    uint32_t field_0x01bc;
};

// Methods (5):
// 0x10005b08  nstaticmeshemitter::n_init_nstaticmeshemitter  (15 insns)
//   strings: 'npemitter'
// 0x10005b33  nstaticmeshemitter::n_fini_nstaticmeshemitter  (5 insns)
// 0x10005b45  nstaticmeshemitter::n_new_nstaticmeshemitter  (350 insns)
//   calls:   -> nAnimNode::vfunc_15, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
//   consts:  f64=1.030792151e+11
//   strings: '`\\', '/sys/servers/gfx', '/sys/servers/sgraph2'
// 0x1000660a  nstaticmeshemitter::cmd_setmeshnode (v_setmeshnode_s)  (10 insns)
// 0x1000662d  nstaticmeshemitter::cmd_getmeshnode (s_getmeshnode_v)  (54 insns)
//   calls:   -> npemitter::vfunc_11

} // namespace re_nparticle
