#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nCurveArrayNode.asm
// Class: nCurveArrayNode : public nanimnode  (sizeof = 0x114 = 276 bytes)

#include <cstdint>

namespace re_nnebula {

struct nCurveArrayNode_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0034
    uint32_t field_0x0034;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00bc
    uint32_t field_0x00bc;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x00c4
    uint32_t field_0x00c4;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00cc
    uint32_t field_0x00cc;
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00d4
    uint32_t field_0x00d4;
    // +0x00d8
    uint32_t field_0x00d8;
    // +0x00dc
    uint32_t field_0x00dc;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00e8
    uint32_t field_0x00e8;
    // +0x00ec
    uint32_t field_0x00ec;
    // +0x00f0
    uint32_t field_0x00f0;
    // +0x00f4
    uint32_t field_0x00f4;
    // +0x00f8
    uint32_t field_0x00f8;
    // +0x00fc
    uint32_t field_0x00fc;
    // +0x0100
    uint32_t field_0x0100;
    // +0x0104
    uint32_t field_0x0104;
    // +0x0108
    uint32_t field_0x0108;
    // +0x010c
    uint32_t field_0x010c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (13):
//   v_setfilename_s
//   s_getfilename_v
//   v_begincurvebundles_i
//   v_beginbundle_isi
//   v_setbundlecurve_iss
//   v_endbundle_v
//   v_endcurvebundles_v
//   v_beginconnects_i
//   v_setcurveconnect_isss
//   v_setcurveconnect2_issss
//   v_setbundleconnect_isss
//   v_setbundleconnect2_issss
//   v_endconnects_v

// Methods (37):
// 0x1002a2e5  nCurveArrayNode::n_init_ncurvearraynode  (15 insns)
//   strings: 'nanimnode'
// 0x1002a310  nCurveArrayNode::n_fini_ncurvearraynode  (5 insns)
// 0x1002a322  nCurveArrayNode::n_new_ncurvearraynode  (10 insns)
//   calls:   -> nCurveArrayNode::nCurveArrayNode()
// 0x1002a33c  nCurveArrayNode::nCurveArrayNode()  (47 insns)
//   calls:   -> nAnimNode::nAnimNode()
//   strings: '/sys/servers/anim', '/sys/servers/file2'
// 0x1002a419  nCurveArrayNode::~nCurveArrayNode()  (92 insns)
//   calls:   -> nAnimNode::~nAnimNode()
// 0x1002a522  nCurveArrayNode::SetFilename  (62 insns)
//   calls:   IAT: MSVCRT.dll!strstr, -> nAnimCurveArray::LoadNax, -> nAnimCurveArray::LoadAnim
//   strings: '.nax'
// 0x1002a5d1  nCurveArrayNode::GetFilename  (2 insns)
// 0x1002a5dc  nCurveArrayNode::BeginCurveBundles  (33 insns)
// 0x1002a633  nCurveArrayNode::vfunc_21  (41 insns)
// 0x1002a68e  nCurveArrayNode::BeginBundle  (14 insns)
// 0x1002a6be  nCurveArrayNode::SetBundleCurve  (91 insns)
//   calls:   -> nAnimCurveArray::GetNumCurves, -> nAnimCurveArray::GetCurve, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Aborting.', 'node/ncurvearraynode_main.cc'
// 0x1002a7c3  nCurveArrayNode::BeginConnects  (35 insns)
// 0x1002a816  nCurveArrayNode::SetCurveConnect2  (70 insns)
//   calls:   -> nAnimCurveArray::GetNumCurves, -> nAnimCurveArray::GetCurve
// 0x1002a8c1  nCurveArrayNode::SetCurveConnect  (8 insns)
//   calls:   -> nCurveArrayNode::SetCurveConnect2
// 0x1002a8e0  nCurveArrayNode::SetBundleConnect2  (65 insns)
// 0x1002a982  nCurveArrayNode::SetBundleConnect  (8 insns)
//   calls:   -> nCurveArrayNode::SetBundleConnect2
// 0x1002a9a1  nCurveArrayNode::EndConnects  (18 insns)
// 0x1002a9d4  nCurveArrayNode::Initialize  (26 insns)
//   calls:   -> nVisNode::DependsOn, -> nVisNode::Initialize
//   strings: 'nvisnode'
// 0x1002aa0f  nCurveArrayNode::AttachChannels  (72 insns)
//   calls:   -> nAnimNode::AttachChannels
// 0x1002aadf  nCurveArrayNode::DoCurveAnim  (90 insns)
//   calls:   -> nCmdProto::NewCmd, -> nCmdProto::RelCmd
// 0x1002abe2  nCurveArrayNode::DoBundleAnim  (124 insns)
//   calls:   -> nCmdProto::NewCmd, -> nCmdProto::RelCmd
//   consts:  f32=0, f32=1
// 0x1002ad42  nCurveArrayNode::Compute  (336 insns)
//   calls:   -> nVisNode::Compute, -> nCurveArrayNode::DoBundleAnim, -> nCurveArrayNode::DoCurveAnim, IAT: nkernel.dll!n_free
//   consts:  f32=0
// 0x1002b09e  nCurveArrayNode::nCurveArrayNode()  (45 insns)
//   calls:   -> nAnimNode::nAnimNode()
// 0x1002b13d  nCurveArrayNode::operator=  (44 insns)
//   calls:   -> nAnimNode::operator=
// 0x1002b1d6  nCurveArrayNode::vfunc_00  (273 insns)
//   calls:   -> nCurveArrayNode::~nCurveArrayNode(), IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
//   strings: 'v_setfilename_s', 's_getfilename_v', 'v_begincurvebundles_i', 'v_beginbundle_isi', 'v_setbundlecurve_iss', 'v_endbundle_v', 'v_endcurvebundles_v', 'v_beginconnects_i'
// 0x1002b4ea  nCurveArrayNode::cmd_setfilename (v_setfilename_s)  (10 insns)
//   calls:   -> nCurveArrayNode::SetFilename
// 0x1002b50d  nCurveArrayNode::cmd_getfilename (s_getfilename_v)  (14 insns)
//   calls:   -> nCurveArrayNode::GetFilename
// 0x1002b537  nCurveArrayNode::cmd_begincurvebundles (v_begincurvebundles_i)  (10 insns)
//   calls:   -> nCurveArrayNode::BeginCurveBundles
// 0x1002b55a  nCurveArrayNode::cmd_beginbundle (v_beginbundle_isi)  (21 insns)
//   calls:   -> nCurveArrayNode::BeginBundle
// 0x1002b597  nCurveArrayNode::cmd_setbundlecurve (v_setbundlecurve_iss)  (21 insns)
//   calls:   -> nCurveArrayNode::SetBundleCurve
// 0x1002b5d4  nCurveArrayNode::cmd_beginconnects (v_beginconnects_i)  (10 insns)
//   calls:   -> nCurveArrayNode::BeginConnects
// 0x1002b5f7  nCurveArrayNode::cmd_setcurveconnect (v_setcurveconnect_isss)  (27 insns)
//   calls:   -> nCurveArrayNode::SetCurveConnect
// 0x1002b642  nCurveArrayNode::cmd_setcurveconnect2 (v_setcurveconnect2_issss)  (35 insns)
//   calls:   -> nCurveArrayNode::SetCurveConnect2
// 0x1002b6a0  nCurveArrayNode::cmd_setbundleconnect (v_setbundleconnect_isss)  (27 insns)
//   calls:   -> nCurveArrayNode::SetBundleConnect
// 0x1002b6eb  nCurveArrayNode::cmd_setbundleconnect2 (v_setbundleconnect2_issss)  (35 insns)
//   calls:   -> nCurveArrayNode::SetBundleConnect2
// 0x1002b749  nCurveArrayNode::cmd_endconnects (v_endconnects_v)  (2 insns)
//   calls:   -> nCurveArrayNode::EndConnects
// 0x1002b752  nCurveArrayNode::SaveCmds  (297 insns)
//   calls:   -> nAnimNode::SaveCmds, -> nCurveArrayNode::GetFilename

} // namespace re_nnebula
