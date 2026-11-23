#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nipol.asm
// Class: nipol : public nanimnode  (sizeof = 0xe8 = 232 bytes)

#include <cstdint>

namespace re_nnebula {

struct nipol_Layout {
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
    // +0x001c
    uint32_t field_0x001c;
    // +0x0034
    uint32_t field_0x0034;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    float field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00bc
    uint32_t field_0x00bc;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00cc
    uint32_t field_0x00cc;
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00d4
    uint32_t field_0x00d4;
    // +0x00d8
    float field_0x00d8;
    // +0x00dc
    float field_0x00dc;
    // +0x00e0
    float field_0x00e0;
    // +0x00e4
    float field_0x00e4;
    // +0x0108
    uint32_t field_0x0108;
    // +0x010c
    uint32_t field_0x010c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (15):
//   b_connect_s
//   s_getconnect_v
//   v_setipoltype_s
//   s_getipoltype_v
//   v_addkey1f_ff
//   v_addkey2f_fff
//   v_addkey3f_ffff
//   v_addkey4f_fffff
//   f_getval1f_v
//   v_beginkeys_ii
//   v_setkey1f_iff
//   v_setkey2f_ifff
//   v_setkey3f_iffff
//   v_setkey4f_ifffff
//   v_endkeys_v

// Methods (22):
// 0x10024415  nipol::n_init_nipol  (15 insns)
//   strings: 'nanimnode'
// 0x10024440  nipol::n_fini_nipol  (5 insns)
// 0x10024452  nipol::n_new_nipol  (34 insns)
//   calls:   -> nAnimNode::nAnimNode()
// 0x100244c5  nipol::vfunc_00  (21 insns)
//   calls:   -> nAnimNode::~nAnimNode()
// 0x100244ff  nipol::vfunc_01  (227 insns)
//   calls:   -> nVisNode::DependsOn, -> nVisNode::Initialize, IAT: nkernel.dll!n_printf
//   strings: 'nvisnode', 'n3dnode'
// 0x10024798  nipol::vfunc_15  (671 insns)
//   calls:   -> nVisNode::Compute, IAT: MSVCRT.dll!floor, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort, -> n3DNode::Rxyz, -> n3DNode::Rx, -> n3DNode::Ry, -> n3DNode::Rz, -> nCmdProto::NewCmd, -> nCmdProto::RelCmd
//   consts:  f64=0, f32=0.001, f32=0
//   strings: 'node/nipol_main.cc', 'b_connect_s', 's_getconnect_v', 'v_setipoltype_s', 's_getipoltype_v', 'v_addkey1f_ff', 'v_addkey2f_fff', 'v_addkey3f_ffff'
// 0x10024ffa  nipol::cmd_connect (b_connect_s)  (22 insns)
// 0x1002503d  nipol::cmd_getconnect (s_getconnect_v)  (14 insns)
// 0x10025067  nipol::cmd_setipoltype (v_setipoltype_s)  (101 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'step', 'linear', 'quaternion', 'node/nipol_cmds.cc'
// 0x10025160  nipol::cmd_getipoltype (s_getipoltype_v)  (23 insns)
//   strings: 'linear', 'quaternion', 'step'
// 0x100251a5  nipol::cmd_addkey1f (v_addkey1f_ff)  (16 insns)
// 0x100251d9  nipol::cmd_addkey2f (v_addkey2f_fff)  (21 insns)
// 0x1002521c  nipol::cmd_addkey3f (v_addkey3f_ffff)  (26 insns)
// 0x1002526e  nipol::cmd_addkey4f (v_addkey4f_fffff)  (31 insns)
// 0x100252cf  nipol::cmd_getval1f (f_getval1f_v)  (101 insns)
// 0x10025420  nipol::cmd_beginkeys (v_beginkeys_ii)  (21 insns)
// 0x1002545c  nipol::cmd_setkey1f (v_setkey1f_iff)  (34 insns)
// 0x100254c1  nipol::cmd_setkey2f (v_setkey2f_ifff)  (38 insns)
// 0x10025536  nipol::cmd_setkey3f (v_setkey3f_iffff)  (42 insns)
// 0x100255ba  nipol::cmd_setkey4f (v_setkey4f_ifffff)  (46 insns)
// 0x1002564d  nipol::cmd_endkeys (v_endkeys_v)  (221 insns)
// 0x100258fa  nipol::vfunc_11  (291 insns)
//   calls:   -> nAnimNode::SaveCmds
//   strings: 'linear', 'quaternion', 'step'

} // namespace re_nnebula
