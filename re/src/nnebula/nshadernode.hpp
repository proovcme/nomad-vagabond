#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nshadernode.asm
// Class: nshadernode : public nvisnode  (sizeof = 0x3ec = 1004 bytes)

#include <cstdint>

namespace re_nnebula {

struct nshadernode_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0051
    uint8_t field_0x0051;
    // +0x005c
    uint32_t field_0x005c;
    // +0x009c
    uint8_t field_0x009c;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00b4
    uint32_t field_0x00b4;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0294
    uint8_t field_0x0294;
    // +0x0295
    uint8_t field_0x0295;
    // +0x0296
    uint8_t field_0x0296;
    // +0x0297
    uint8_t field_0x0297;
    // +0x0298
    uint8_t field_0x0298;
    // +0x029c
    uint32_t field_0x029c;
    // +0x02a0
    uint32_t field_0x02a0;
    // +0x02a4
    uint32_t field_0x02a4;
    // +0x02a8
    uint32_t field_0x02a8;
    // +0x02ac
    uint32_t field_0x02ac;
    // +0x02b0
    uint32_t field_0x02b0;
    // +0x02b4
    float field_0x02b4;
    // +0x0328
    uint8_t field_0x0328;
    // +0x0329
    uint8_t field_0x0329;
    // +0x032a
    uint8_t field_0x032a;
    // +0x032b
    uint8_t field_0x032b;
    // +0x032c
    uint8_t field_0x032c;
    // +0x0348
    uint8_t field_0x0348;
    // +0x0349
    uint8_t field_0x0349;
    // +0x034a
    uint8_t field_0x034a;
    // +0x034b
    uint8_t field_0x034b;
    // +0x034c
    uint8_t field_0x034c;
    // +0x0350
    uint32_t field_0x0350;
    // +0x0354
    uint32_t field_0x0354;
    // +0x0358
    uint32_t field_0x0358;
    // +0x035c
    uint32_t field_0x035c;
    // +0x0360
    uint32_t field_0x0360;
    // +0x0364
    uint32_t field_0x0364;
    // +0x0368
    float field_0x0368;
    // +0x03bc
    uint32_t field_0x03bc;
    // +0x03c0
    uint32_t field_0x03c0;
    // +0x03dc
    uint8_t field_0x03dc;
    // +0x03df
    uint8_t field_0x03df;
    // +0x03e0
    uint8_t field_0x03e0;
    // +0x03e4
    uint32_t field_0x03e4;
    // +0x03e8
    uint32_t field_0x03e8;
};

// Script AddCmds (66):
//   v_setrenderpri_i
//   i_getrenderpri_v
//   v_setnumstages_i
//   i_getnumstages_v
//   b_setcolorop_is
//   s_getcolorop_i
//   b_setalphaop_is
//   s_getalphaop_i
//   v_begintunit_i
//   v_endtunit_v
//   v_setaddress_ss
//   v_setminmagfilter_ss
//   v_settexcoordsrc_s
//   s_gettexcoordsrc_i
//   v_setmiplodbias_i
//   i_getmiplodbias_v
//   v_setconst_iffff
//   v_setenabletransform_b
//   b_getenabletransform_v
//   v_txyz_fff
//   v_rxyz_fff
//   v_sxyz_fff
//   v_setdiffuse_ffff
//   v_setemissive_ffff
//   v_setambient_ffff
//   v_setlightenable_b
//   b_getlightenable_v
//   v_setalphaenable_b
//   b_getalphaenable_v
//   v_setzwriteenable_b
//   b_getzwriteenable_v
//   v_setfogenable_b
//   b_getfogenable_v
//   v_setalphablend_ss
//   v_setzfunc_s
//   s_getzfunc_v
//   v_setcullmode_s
//   s_getcullmode_v
//   v_setcolormaterial_s
//   s_getcolormaterial_v
//   v_setalphatestenable_b
//   b_getalphatestenable_v
//   v_setalpharef_f
//   f_getalpharef_v
//   v_setalphafunc_s
//   s_getalphafunc_v
//   v_setconst0_ffff
//   v_setconst1_ffff
//   v_setconst2_ffff
//   v_setconst3_ffff
//   v_txyz0_fff
//   v_txyz1_fff
//   v_txyz2_fff
//   v_txyz3_fff
//   v_rxyz0_fff
//   v_rxyz1_fff
//   v_rxyz2_fff
//   v_rxyz3_fff
//   v_sxyz0_fff
//   v_sxyz1_fff
//   v_sxyz2_fff
//   v_sxyz3_fff
//   v_setemissiver_f
//   v_setemissiveg_f
//   v_setemissiveb_f
//   v_setemissivea_f

// Methods (74):
// 0x1001b274  nshadernode::n_init_nshadernode  (15 insns)
//   strings: 'nvisnode'
// 0x1001b29f  nshadernode::n_fini_nshadernode  (5 insns)
// 0x1001b2b1  nshadernode::n_new_nshadernode  (691 insns)
//   calls:   -> nVisNode::~nVisNode(), IAT: nkernel.dll!n_strncpy2, IAT: MSVCRT.dll!strtok, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Aborting.', 'node/nshadernode_main.cc'
// 0x1001b9a3  nshadernode::vfunc_16  (9 insns)
//   calls:   -> nVisNode::Preload
// 0x1001b9bd  nshadernode::vfunc_14  (27 insns)
//   calls:   -> nVisNode::Attach, -> nSceneGraph2::AttachOpaqueness
// 0x1001ba18  nshadernode::vfunc_15  (694 insns)
//   calls:   -> nVisNode::Compute, IAT: MSVCRT.dll!strstr, IAT: MSVCRT.dll!sprintf, IAT: nkernel.dll!n_strncpy2, -> nVisNode::nVisNode()
//   strings: 'nop', 'mul', 'replace', 'adds', 'add', 'ipol', 'dot', '.1'
// 0x1001c0ff  nshadernode::vfunc_00  (399 insns)
//   strings: 'v_setrenderpri_i', 'i_getrenderpri_v', 'v_setnumstages_i', 'i_getnumstages_v', 'b_setcolorop_is', 's_getcolorop_i', 'b_setalphaop_is', 's_getalphaop_i'
// 0x1001c7b8  nshadernode::cmd_setrenderpri (v_setrenderpri_i)  (10 insns)
// 0x1001c7dc  nshadernode::cmd_getrenderpri (i_getrenderpri_v)  (13 insns)
// 0x1001c808  nshadernode::cmd_setnumstages (v_setnumstages_i)  (10 insns)
// 0x1001c82c  nshadernode::cmd_getnumstages (i_getnumstages_v)  (13 insns)
// 0x1001c858  nshadernode::cmd_setcolorop (b_setcolorop_is)  (28 insns)
// 0x1001c8a6  nshadernode::cmd_getcolorop (s_getcolorop_i)  (27 insns)
// 0x1001c8f3  nshadernode::cmd_setalphaop (b_setalphaop_is)  (28 insns)
// 0x1001c941  nshadernode::cmd_getalphaop (s_getalphaop_i)  (27 insns)
// 0x1001c98e  nshadernode::cmd_begintunit (v_begintunit_i)  (11 insns)
// 0x1001c9b9  nshadernode::cmd_endtunit (v_endtunit_v)  (3 insns)
// 0x1001c9c5  nshadernode::cmd_setaddress (v_setaddress_ss)  (140 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Aborting.', 'node/nshadernode_cmds.cc'
// 0x1001cb54  nshadernode::cmd_setminmagfilter (v_setminmagfilter_ss)  (61 insns)
// 0x1001cc03  nshadernode::cmd_settexcoordsrc (v_settexcoordsrc_s)  (15 insns)
// 0x1001cc3e  nshadernode::cmd_gettexcoordsrc (s_gettexcoordsrc_i)  (26 insns)
// 0x1001cc8c  nshadernode::cmd_setconst (v_setconst_iffff)  (93 insns)
// 0x1001cdaf  nshadernode::cmd_setmiplodbias (v_setmiplodbias_i)  (10 insns)
// 0x1001cdd3  nshadernode::cmd_getmiplodbias (i_getmiplodbias_v)  (13 insns)
// 0x1001cdff  nshadernode::cmd_setenabletransform (v_setenabletransform_b)  (13 insns)
// 0x1001ce34  nshadernode::cmd_getenabletransform (b_getenabletransform_v)  (22 insns)
// 0x1001ce7c  nshadernode::cmd_txyz (v_txyz_fff)  (74 insns)
// 0x1001cf5e  nshadernode::cmd_rxyz (v_rxyz_fff)  (73 insns)
// 0x1001d036  nshadernode::cmd_sxyz (v_sxyz_fff)  (74 insns)
// 0x1001d118  nshadernode::cmd_setdiffuse (v_setdiffuse_ffff)  (82 insns)
// 0x1001d20f  nshadernode::cmd_setemissive (v_setemissive_ffff)  (36 insns)
// 0x1001d275  nshadernode::cmd_setemissiver (v_setemissiver_f)  (32 insns)
// 0x1001d2ca  nshadernode::cmd_setemissiveg (v_setemissiveg_f)  (32 insns)
// 0x1001d31f  nshadernode::cmd_setemissiveb (v_setemissiveb_f)  (32 insns)
// 0x1001d374  nshadernode::cmd_setemissivea (v_setemissivea_f)  (78 insns)
// 0x1001d45a  nshadernode::cmd_setambient (v_setambient_ffff)  (82 insns)
// 0x1001d551  nshadernode::cmd_setlightenable (v_setlightenable_b)  (11 insns)
// 0x1001d57c  nshadernode::cmd_getlightenable (b_getlightenable_v)  (13 insns)
// 0x1001d5a8  nshadernode::cmd_setalphaenable (v_setalphaenable_b)  (11 insns)
// 0x1001d5d3  nshadernode::cmd_getalphaenable (b_getalphaenable_v)  (13 insns)
// 0x1001d5ff  nshadernode::cmd_setzwriteenable (v_setzwriteenable_b)  (11 insns)
// 0x1001d62a  nshadernode::cmd_getzwriteenable (b_getzwriteenable_v)  (13 insns)
// 0x1001d656  nshadernode::cmd_setfogenable (v_setfogenable_b)  (11 insns)
// 0x1001d681  nshadernode::cmd_getfogenable (b_getfogenable_v)  (13 insns)
// 0x1001d6ad  nshadernode::cmd_setalphablend (v_setalphablend_ss)  (59 insns)
// 0x1001d75a  nshadernode::cmd_setzfunc (v_setzfunc_s)  (16 insns)
// 0x1001d78e  nshadernode::cmd_getzfunc (s_getzfunc_v)  (19 insns)
// 0x1001d7c2  nshadernode::cmd_setcullmode (v_setcullmode_s)  (16 insns)
// 0x1001d7f6  nshadernode::cmd_getcullmode (s_getcullmode_v)  (19 insns)
// 0x1001d82a  nshadernode::cmd_setcolormaterial (v_setcolormaterial_s)  (16 insns)
// 0x1001d85e  nshadernode::cmd_getcolormaterial (s_getcolormaterial_v)  (19 insns)
// 0x1001d892  nshadernode::cmd_setalphatestenable (v_setalphatestenable_b)  (11 insns)
// 0x1001d8bd  nshadernode::cmd_getalphatestenable (b_getalphatestenable_v)  (13 insns)
// 0x1001d8e9  nshadernode::cmd_setalpharef (v_setalpharef_f)  (11 insns)
// 0x1001d915  nshadernode::cmd_getalpharef (f_getalpharef_v)  (11 insns)
// 0x1001d93f  nshadernode::cmd_setalphafunc (v_setalphafunc_s)  (16 insns)
// 0x1001d973  nshadernode::cmd_getalphafunc (s_getalphafunc_v)  (19 insns)
// 0x1001d9a7  nshadernode::cmd_setconst0 (v_setconst0_ffff)  (44 insns)
// 0x1001da27  nshadernode::cmd_setconst1 (v_setconst1_ffff)  (6 insns)
// 0x1001da3a  nshadernode::cmd_setconst2 (v_setconst2_ffff)  (6 insns)
// 0x1001da4d  nshadernode::cmd_setconst3 (v_setconst3_ffff)  (6 insns)
// 0x1001da60  nshadernode::cmd_txyz0 (v_txyz0_fff)  (41 insns)
// 0x1001dad8  nshadernode::cmd_txyz1 (v_txyz1_fff)  (6 insns)
// 0x1001daeb  nshadernode::cmd_txyz2 (v_txyz2_fff)  (6 insns)
// 0x1001dafe  nshadernode::cmd_txyz3 (v_txyz3_fff)  (6 insns)
// 0x1001db11  nshadernode::cmd_rxyz0 (v_rxyz0_fff)  (37 insns)
// 0x1001db7f  nshadernode::cmd_rxyz1 (v_rxyz1_fff)  (6 insns)
// 0x1001db92  nshadernode::cmd_rxyz2 (v_rxyz2_fff)  (6 insns)
// 0x1001dba5  nshadernode::cmd_rxyz3 (v_rxyz3_fff)  (6 insns)
// 0x1001dbb8  nshadernode::cmd_sxyz0 (v_sxyz0_fff)  (41 insns)
// 0x1001dc30  nshadernode::cmd_sxyz1 (v_sxyz1_fff)  (6 insns)
// 0x1001dc43  nshadernode::cmd_sxyz2 (v_sxyz2_fff)  (6 insns)
// 0x1001dc56  nshadernode::cmd_sxyz3 (v_sxyz3_fff)  (6 insns)
// 0x1001dc69  nshadernode::vfunc_11  (1010 insns)
//   calls:   -> nVisNode::SaveCmds
//   consts:  f32=0.005555556, f32=3.141593

} // namespace re_nnebula
