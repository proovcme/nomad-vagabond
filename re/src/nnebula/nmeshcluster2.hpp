#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nmeshcluster2.asm
// Class: nmeshcluster2 : public nvisnode  (sizeof = 0x164 = 356 bytes)

#include <cstdint>

namespace re_nnebula {

struct nmeshcluster2_Layout {
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
    // +0x0018
    float field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0054
    uint32_t field_0x0054;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    float field_0x0064;
    // +0x0068
    float field_0x0068;
    // +0x006c
    float field_0x006c;
    // +0x0070
    float field_0x0070;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0078
    uint32_t field_0x0078;
    // +0x007c
    uint32_t field_0x007c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0094
    uint32_t field_0x0094;
    // +0x0098
    uint32_t field_0x0098;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x00dc
    uint32_t field_0x00dc;
    // +0x00f4
    uint32_t field_0x00f4;
    // +0x00fc
    uint32_t field_0x00fc;
    // +0x0100
    uint32_t field_0x0100;
    // +0x0104
    uint32_t field_0x0104;
    // +0x0108
    uint8_t field_0x0108;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0130
    uint32_t field_0x0130;
    // +0x0145
    uint8_t field_0x0145;
    // +0x0150
    uint8_t field_0x0150;
    // +0x0160
    uint32_t field_0x0160;
};

// Script AddCmds (8):
//   v_setreadonly_b
//   b_getreadonly_v
//   v_setskinmesh_s
//   s_getskinmesh_v
//   v_setrootjoint_s
//   s_getrootjoint_v
//   v_setcastshadow_b
//   b_getcastshadow_v

// Methods (11):
// 0x100295b3  nmeshcluster2::n_init_nmeshcluster2  (15 insns)
//   strings: 'nvisnode'
// 0x100295de  nmeshcluster2::n_fini_nmeshcluster2  (5 insns)
// 0x100295f0  nmeshcluster2::n_new_nmeshcluster2  (837 insns)
//   calls:   -> nVisNode::nVisNode(), -> nVisNode::~nVisNode(), -> nRoot::GetHead, -> nVisNode::Attach, -> nVertexBuffer::LockVertices, -> nVertexBuffer::UnlockVertices, -> nVisNode::Compute
//   consts:  f32=0
//   strings: '/sys/servers/shadow', 'njoint2', 'v_setreadonly_b', 'b_getreadonly_v', 'v_setskinmesh_s', 's_getskinmesh_v', 'v_setrootjoint_s', 's_getrootjoint_v'
// 0x1002a092  nmeshcluster2::cmd_setreadonly (v_setreadonly_b)  (10 insns)
// 0x1002a0b6  nmeshcluster2::cmd_getreadonly (b_getreadonly_v)  (13 insns)
// 0x1002a0e2  nmeshcluster2::cmd_setskinmesh (v_setskinmesh_s)  (11 insns)
// 0x1002a10c  nmeshcluster2::cmd_getskinmesh (s_getskinmesh_v)  (13 insns)
// 0x1002a135  nmeshcluster2::cmd_setrootjoint (v_setrootjoint_s)  (10 insns)
// 0x1002a158  nmeshcluster2::cmd_getrootjoint (s_getrootjoint_v)  (13 insns)
// 0x1002a181  nmeshcluster2::cmd_setcastshadow (v_setcastshadow_b)  (10 insns)
// 0x1002a1a5  nmeshcluster2::cmd_getcastshadow (b_getcastshadow_v)  (107 insns)
//   calls:   -> nVisNode::SaveCmds

} // namespace re_nnebula
