#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nmeshipol.asm
// Class: nmeshipol : public nanimnode  (sizeof = 0x10c = 268 bytes)

#include <cstdint>

namespace re_nnebula {

struct nmeshipol_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0018
    float field_0x0018;
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
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    float field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    uint8_t field_0x00b8;
    // +0x00bc
    uint32_t field_0x00bc;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x00c4
    uint8_t field_0x00c4;
    // +0x00ec
    uint32_t field_0x00ec;
    // +0x0101
    uint8_t field_0x0101;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (20):
//   v_setreadonly_b
//   b_getreadonly_v
//   v_beginkeys_i
//   v_setkey_ifs
//   v_endkeys_v
//   i_getnumkeys_v
//   v_setupdatecoord_b
//   b_getupdatecoord_v
//   v_setupdatenorm_b
//   b_getupdatenorm_v
//   v_setupdatecolor_b
//   b_getupdatecolor_v
//   v_setupdateuv0_b
//   b_getupdateuv0_v
//   v_setupdateuv1_b
//   b_getupdateuv1_v
//   v_setupdateuv2_b
//   b_getupdateuv2_v
//   v_setupdateuv3_b
//   b_getupdateuv3_v

// Methods (28):
// 0x10025c57  nmeshipol::n_init_nmeshipol  (15 insns)
//   strings: 'nanimnode'
// 0x10025c82  nmeshipol::n_fini_nmeshipol  (5 insns)
// 0x10025c94  nmeshipol::n_new_nmeshipol  (10 insns)
// 0x10025cae  nmeshipol::n_version_nmeshipol  (20 insns)
//   calls:   -> nAnimNode::nAnimNode()
// 0x10025cfa  nmeshipol::vfunc_00  (498 insns)
//   calls:   -> nAnimNode::~nAnimNode(), -> nVertexBuffer::LockVertices, -> nVertexBuffer::UnlockVertices
//   consts:  f32=256
// 0x100262e2  nmeshipol::vfunc_14  (19 insns)
//   calls:   -> nVisNode::Attach
// 0x10026319  nmeshipol::vfunc_15  (370 insns)
//   calls:   -> nVisNode::Compute, IAT: MSVCRT.dll!floor, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f64=0, f32=0.0001, f32=0
//   strings: 'node/nmeshipol_main.cc', 'Aborting.', 'v_setreadonly_b', 'b_getreadonly_v', 'v_beginkeys_i', 'v_setkey_ifs', 'v_endkeys_v', 'i_getnumkeys_v'
// 0x1002683b  nmeshipol::cmd_setreadonly (v_setreadonly_b)  (10 insns)
// 0x1002685f  nmeshipol::cmd_getreadonly (b_getreadonly_v)  (13 insns)
// 0x1002688b  nmeshipol::cmd_beginkeys (v_beginkeys_i)  (10 insns)
// 0x100268ae  nmeshipol::cmd_setkey (v_setkey_ifs)  (29 insns)
// 0x10026902  nmeshipol::cmd_endkeys (v_endkeys_v)  (3 insns)
// 0x1002690e  nmeshipol::cmd_getnumkeys (i_getnumkeys_v)  (42 insns)
// 0x100269a1  nmeshipol::cmd_setupdatecoord (v_setupdatecoord_b)  (13 insns)
// 0x100269d1  nmeshipol::cmd_setupdatenorm (v_setupdatenorm_b)  (13 insns)
// 0x10026a01  nmeshipol::cmd_setupdatecolor (v_setupdatecolor_b)  (13 insns)
// 0x10026a31  nmeshipol::cmd_setupdateuv0 (v_setupdateuv0_b)  (13 insns)
// 0x10026a61  nmeshipol::cmd_setupdateuv1 (v_setupdateuv1_b)  (13 insns)
// 0x10026a91  nmeshipol::cmd_setupdateuv2 (v_setupdateuv2_b)  (13 insns)
// 0x10026ac1  nmeshipol::cmd_setupdateuv3 (v_setupdateuv3_b)  (13 insns)
// 0x10026af1  nmeshipol::cmd_getupdatecoord (b_getupdatecoord_v)  (12 insns)
// 0x10026b1d  nmeshipol::cmd_getupdatenorm (b_getupdatenorm_v)  (13 insns)
// 0x10026b4b  nmeshipol::cmd_getupdatecolor (b_getupdatecolor_v)  (13 insns)
// 0x10026b7a  nmeshipol::cmd_getupdateuv0 (b_getupdateuv0_v)  (13 insns)
// 0x10026ba9  nmeshipol::cmd_getupdateuv1 (b_getupdateuv1_v)  (13 insns)
// 0x10026bd8  nmeshipol::cmd_getupdateuv2 (b_getupdateuv2_v)  (13 insns)
// 0x10026c07  nmeshipol::cmd_getupdateuv3 (b_getupdateuv3_v)  (13 insns)
// 0x10026c36  nmeshipol::vfunc_11  (332 insns)
//   calls:   -> nAnimNode::SaveCmds

} // namespace re_nnebula
