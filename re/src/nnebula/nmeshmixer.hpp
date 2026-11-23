#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nmeshmixer.asm
// Class: nmeshmixer : public nvisnode  (sizeof = 0x4ac = 1196 bytes)

#include <cstdint>

namespace re_nnebula {

struct nmeshmixer_Layout {
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
    // +0x0020
    uint32_t field_0x0020;
    // +0x0038
    uint32_t field_0x0038;
    // +0x0078
    uint32_t field_0x0078;
    // +0x007c
    uint32_t field_0x007c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x009c
    uint8_t field_0x009c;
    // +0x00a0
    uint8_t field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x048c
    uint32_t field_0x048c;
    // +0x04a1
    uint8_t field_0x04a1;
};

// Script AddCmds (22):
//   v_setreadonly_b
//   b_getreadonly_v
//   v_beginsources_i
//   v_setsource_iss
//   v_endsources_v
//   i_getnumsources_v
//   v_setnormalize_b
//   b_getnormalize_v
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

// Methods (31):
// 0x10026ff8  nmeshmixer::n_init_nmeshmixer  (15 insns)
//   strings: 'nvisnode'
// 0x10027023  nmeshmixer::n_fini_nmeshmixer  (5 insns)
// 0x10027035  nmeshmixer::n_new_nmeshmixer  (10 insns)
// 0x1002704f  nmeshmixer::n_version_nmeshmixer  (51 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x100270dc  nmeshmixer::vfunc_00  (32 insns)
//   calls:   -> nVisNode::~nVisNode()
// 0x1002712f  nmeshmixer::vfunc_18  (591 insns)
//   calls:   -> nVisNode::AttachChannels, -> nVertexBuffer::LockVertices, -> nVertexBuffer::UnlockVertices
//   consts:  f32=256
// 0x1002780f  nmeshmixer::vfunc_14  (19 insns)
//   calls:   -> nVisNode::Attach
// 0x10027846  nmeshmixer::vfunc_15  (248 insns)
//   calls:   -> nVisNode::Compute, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f32=0, f64=1e-07
//   strings: 'node/nmeshmixer_main.cc', 'v_setreadonly_b', 'b_getreadonly_v', 'v_beginsources_i', 'v_setsource_iss', 'v_endsources_v', 'i_getnumsources_v', 'ss_getsource_i'
// 0x10027bf2  nmeshmixer::cmd_setreadonly (v_setreadonly_b)  (10 insns)
// 0x10027c16  nmeshmixer::cmd_getreadonly (b_getreadonly_v)  (13 insns)
// 0x10027c42  nmeshmixer::cmd_beginsources (v_beginsources_i)  (11 insns)
// 0x10027c6d  nmeshmixer::cmd_setsource (v_setsource_iss)  (21 insns)
// 0x10027caa  nmeshmixer::cmd_endsources (v_endsources_v)  (3 insns)
//   calls:   -> nVisNode::NotifyChannelSetDirty
// 0x10027cba  nmeshmixer::cmd_getnumsources (i_getnumsources_v)  (47 insns)
// 0x10027d58  nmeshmixer::cmd_setnormalize (v_setnormalize_b)  (13 insns)
// 0x10027d88  nmeshmixer::cmd_getnormalize (b_getnormalize_v)  (13 insns)
// 0x10027db7  nmeshmixer::cmd_setupdatecoord (v_setupdatecoord_b)  (13 insns)
// 0x10027de7  nmeshmixer::cmd_setupdatenorm (v_setupdatenorm_b)  (13 insns)
// 0x10027e17  nmeshmixer::cmd_setupdatecolor (v_setupdatecolor_b)  (13 insns)
// 0x10027e47  nmeshmixer::cmd_setupdateuv0 (v_setupdateuv0_b)  (13 insns)
// 0x10027e77  nmeshmixer::cmd_setupdateuv1 (v_setupdateuv1_b)  (13 insns)
// 0x10027ea7  nmeshmixer::cmd_setupdateuv2 (v_setupdateuv2_b)  (13 insns)
// 0x10027ed7  nmeshmixer::cmd_setupdateuv3 (v_setupdateuv3_b)  (13 insns)
// 0x10027f07  nmeshmixer::cmd_getupdatecoord (b_getupdatecoord_v)  (12 insns)
// 0x10027f33  nmeshmixer::cmd_getupdatenorm (b_getupdatenorm_v)  (13 insns)
// 0x10027f61  nmeshmixer::cmd_getupdatecolor (b_getupdatecolor_v)  (13 insns)
// 0x10027f90  nmeshmixer::cmd_getupdateuv0 (b_getupdateuv0_v)  (13 insns)
// 0x10027fbf  nmeshmixer::cmd_getupdateuv1 (b_getupdateuv1_v)  (13 insns)
// 0x10027fee  nmeshmixer::cmd_getupdateuv2 (b_getupdateuv2_v)  (13 insns)
// 0x1002801d  nmeshmixer::cmd_getupdateuv3 (b_getupdateuv3_v)  (13 insns)
// 0x1002804c  nmeshmixer::vfunc_11  (315 insns)
//   calls:   -> nVisNode::SaveCmds, IAT: nkernel.dll!n_strncpy2

} // namespace re_nnebula
