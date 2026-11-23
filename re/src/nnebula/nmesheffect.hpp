#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nmesheffect.asm
// Class: nmesheffect : public nanimnode  (sizeof = 0x124 = 292 bytes)

#include <cstdint>

namespace re_nnebula {

struct nmesheffect_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0078
    uint32_t field_0x0078;
    // +0x007c
    uint32_t field_0x007c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    float field_0x00b8;
    // +0x00bc
    float field_0x00bc;
    // +0x00c0
    float field_0x00c0;
    // +0x00c4
    uint8_t field_0x00c4;
    // +0x00d8
    uint32_t field_0x00d8;
    // +0x0104
    uint32_t field_0x0104;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0119
    uint8_t field_0x0119;
};

// Script AddCmds (12):
//   v_setreadonly_b
//   b_getreadonly_v
//   v_setmeshnode_s
//   s_getmeshnode_v
//   v_setamplitude_f
//   f_getamplitude_v
//   v_setfrequency_f
//   f_getfrequency_v
//   v_settwinktime_f
//   f_gettwinktime_v
//   v_settwink_b
//   b_gettwink_v

// Methods (19):
// 0x1002bb05  nmesheffect::n_init_nmesheffect  (15 insns)
//   strings: 'nanimnode'
// 0x1002bb30  nmesheffect::n_fini_nmesheffect  (5 insns)
// 0x1002bb42  nmesheffect::n_new_nmesheffect  (38 insns)
//   calls:   -> nAnimNode::nAnimNode()
// 0x1002bbbe  nmesheffect::vfunc_00  (22 insns)
//   calls:   -> nAnimNode::~nAnimNode()
// 0x1002bc02  nmesheffect::vfunc_14  (301 insns)
//   calls:   -> nVisNode::Attach, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort, -> nVertexBuffer::LockVertices, IAT: MSVCRT.dll!rand, -> nVertexBuffer::UnlockVertices
//   consts:  f32=1e+09
//   strings: 'Aborting.', 'c:/nomads/code/inc\\kernel/nref.h'
// 0x1002bfc0  nmesheffect::vfunc_15  (477 insns)
//   calls:   -> nVisNode::Compute, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort, IAT: nkernel.dll!n_free
//   strings: 'dm_', 'u0', 'u1', 'u2', 'u3', 'c:/nomads/code/inc\\gfx/nchannelset.h', 'NOT INITIALIZED', 'Aborting.'
// 0x1002c4fd  nmesheffect::cmd_setreadonly (v_setreadonly_b)  (10 insns)
// 0x1002c521  nmesheffect::cmd_getreadonly (b_getreadonly_v)  (13 insns)
// 0x1002c54d  nmesheffect::cmd_setmeshnode (v_setmeshnode_s)  (11 insns)
// 0x1002c577  nmesheffect::cmd_getmeshnode (s_getmeshnode_v)  (13 insns)
// 0x1002c5a0  nmesheffect::cmd_setamplitude (v_setamplitude_f)  (10 insns)
// 0x1002c5c5  nmesheffect::cmd_setfrequency (v_setfrequency_f)  (10 insns)
// 0x1002c5ea  nmesheffect::cmd_settwinktime (v_settwinktime_f)  (10 insns)
// 0x1002c60f  nmesheffect::cmd_gettwinktime (f_gettwinktime_v)  (11 insns)
// 0x1002c639  nmesheffect::cmd_settwink (v_settwink_b)  (10 insns)
// 0x1002c65d  nmesheffect::cmd_gettwink (b_gettwink_v)  (13 insns)
// 0x1002c689  nmesheffect::vfunc_11  (131 insns)
//   calls:   -> nAnimNode::SaveCmds
// 0x1003344d  nmesheffect::cmd_getamplitude (f_getamplitude_v)  (11 insns)
// 0x10033477  nmesheffect::cmd_getfrequency (f_getfrequency_v)  (11 insns)

} // namespace re_nnebula
