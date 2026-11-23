#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/n3DNode.asm
// Class: n3DNode : public nvisnode  (sizeof = 0x120 = 288 bytes)

#include <cstdint>

namespace re_nnebula {

struct n3DNode_Layout {
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
    uint32_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
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
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00dc
    float field_0x00dc;
    // +0x00e0
    float field_0x00e0;
    // +0x00e4
    float field_0x00e4;
    // +0x00e8
    float field_0x00e8;
    // +0x00ec
    float field_0x00ec;
    // +0x00f0
    float field_0x00f0;
    // +0x00f4
    float field_0x00f4;
    // +0x00f8
    float field_0x00f8;
    // +0x00fc
    float field_0x00fc;
    // +0x0100
    float field_0x0100;
    // +0x0104
    float field_0x0104;
    // +0x0108
    float field_0x0108;
    // +0x010c
    float field_0x010c;
    // +0x0110
    float field_0x0110;
    // +0x0114
    uint8_t field_0x0114;
    // +0x0115
    uint8_t field_0x0115;
    // +0x0118
    uint32_t field_0x0118;
    // +0x011c
    uint32_t field_0x011c;
};

// Script AddCmds (27):
//   v_setactive_b
//   b_getactive_v
//   v_setmaxlod_f
//   f_getmaxlod_v
//   v_sethighdetail_b
//   b_gethighdetail_v
//   v_setsprite_b
//   b_getsprite_v
//   v_setbillboard_b
//   b_getbillboard_v
//   v_setlockviewer_b
//   b_getlockviewer_v
//   v_setviewspace_b
//   b_getviewspace_v
//   v_txyz_fff
//   v_tx_f
//   v_ty_f
//   v_tz_f
//   v_rxyz_fff
//   v_rx_f
//   v_ry_f
//   v_rz_f
//   v_qxyzw_ffff
//   v_sxyz_fff
//   v_sx_f
//   v_sy_f
//   v_sz_f

// Methods (86):
// 0x10001fd3  n3DNode::n_version_n3dnode  (2 insns)
//   strings: 'unknown'
// 0x1001e868  n3DNode::n_init_n3dnode  (15 insns)
//   strings: 'nvisnode'
// 0x1001e893  n3DNode::n_fini_n3dnode  (5 insns)
// 0x1001e8a5  n3DNode::n_new_n3dnode  (10 insns)
//   calls:   -> n3DNode::n3DNode()
// 0x1001e8bf  n3DNode::n3DNode()  (51 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x1001e961  n3DNode::AttachChannels  (31 insns)
//   calls:   -> nVisNode::AttachChannels
//   strings: 'lod', 'detail'
// 0x1001e9bc  n3DNode::updateMatrix  (61 insns)
// 0x1001ea7b  n3DNode::Attach  (87 insns)
//   calls:   -> nSceneGraph2::BeginNode, -> nVisNode::GetChannelSet, -> nChannelServer::GetContext, -> nVisNode::Attach, -> nSceneGraph2::EndNode
//   consts:  f32=0, f32=0.5
// 0x1001eb84  n3DNode::Compute  (421 insns)
//   calls:   -> nVisNode::Compute, -> n3DNode::updateMatrix, -> nSceneGraph2::GetParentTransform
//   consts:  f32=1, f32=2, f64=1e-07
// 0x1001efdc  n3DNode::n3DNode()  (62 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x1001f0ec  n3DNode::operator=  (48 insns)
//   calls:   -> nVisNode::operator=
// 0x1001f183  n3DNode::~n3DNode()  (1 insns)
//   calls:   -> nVisNode::~nVisNode()
// 0x1001f188  n3DNode::vfunc_00  (41 insns)
//   calls:   -> nVisNode::~nVisNode()
// 0x1001f1e7  n3DNode::set  (3 insns)
// 0x1001f1f4  n3DNode::unset  (4 insns)
// 0x1001f203  n3DNode::get  (4 insns)
// 0x1001f213  n3DNode::SetViewSpace  (6 insns)
// 0x1001f22d  n3DNode::GetViewSpace  (4 insns)
// 0x1001f239  n3DNode::SetActive  (6 insns)
// 0x1001f253  n3DNode::GetActive  (4 insns)
// 0x1001f26c  n3DNode::SetSprite  (6 insns)
// 0x1001f286  n3DNode::GetSprite  (4 insns)
// 0x1001f292  n3DNode::SetBillboard  (6 insns)
// 0x1001f2ac  n3DNode::GetBillboard  (4 insns)
// 0x1001f2b8  n3DNode::SetLockViewer  (6 insns)
// 0x1001f2d2  n3DNode::GetLockViewer  (4 insns)
// 0x1001f2de  n3DNode::SetHighDetail  (10 insns)
//   calls:   -> nVisNode::NotifyChannelSetDirty
// 0x1001f301  n3DNode::GetHighDetail  (4 insns)
// 0x1001f30d  n3DNode::M  (15 insns)
// 0x1001f337  n3DNode::Txyz  (13 insns)
// 0x1001f368  n3DNode::Tx  (8 insns)
// 0x1001f389  n3DNode::Ty  (8 insns)
// 0x1001f3aa  n3DNode::Tz  (8 insns)
// 0x1001f3cb  n3DNode::Rxyz  (22 insns)
//   consts:  f32=0.005555556, f32=3.141593
// 0x1001f41c  n3DNode::Rx  (10 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x1001f449  n3DNode::Ry  (10 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x1001f476  n3DNode::Rz  (10 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x1001f4a3  n3DNode::Sxyz  (13 insns)
// 0x1001f4d4  n3DNode::Sx  (8 insns)
// 0x1001f4f5  n3DNode::Sy  (8 insns)
// 0x1001f516  n3DNode::Sz  (8 insns)
// 0x1001f537  n3DNode::Qxyzw  (15 insns)
// 0x1001f56f  n3DNode::GetT  (10 insns)
// 0x1001f596  n3DNode::GetR  (20 insns)
//   consts:  f32=0.3183099, f32=180
// 0x1001f5d9  n3DNode::GetS  (10 insns)
// 0x1001f600  n3DNode::GetQ  (13 insns)
// 0x1001f633  n3DNode::GetM  (251 insns)
//   calls:   -> n3DNode::updateMatrix, -> nChannelServer::GenChannel
//   strings: 'v_setactive_b', 'b_getactive_v', 'v_setmaxlod_f', 'f_getmaxlod_v', 'v_sethighdetail_b', 'b_gethighdetail_v', 'v_setsprite_b', 'b_getsprite_v'
// 0x1001f9c0  n3DNode::cmd_setactive (v_setactive_b)  (13 insns)
// 0x1001f9f0  n3DNode::cmd_getactive (b_getactive_v)  (13 insns)
// 0x1001fa1f  n3DNode::cmd_sethighdetail (v_sethighdetail_b)  (12 insns)
//   calls:   -> n3DNode::SetHighDetail
// 0x1001fa45  n3DNode::cmd_gethighdetail (b_gethighdetail_v)  (13 insns)
// 0x1001fa74  n3DNode::cmd_setmaxlod (v_setmaxlod_f)  (10 insns)
// 0x1001fa99  n3DNode::cmd_txyz (v_txyz_fff)  (31 insns)
// 0x1001fb00  n3DNode::cmd_tx (v_tx_f)  (15 insns)
// 0x1001fb39  n3DNode::cmd_ty (v_ty_f)  (15 insns)
// 0x1001fb72  n3DNode::cmd_tz (v_tz_f)  (15 insns)
// 0x1001fbab  n3DNode::cmd_rxyz (v_rxyz_fff)  (21 insns)
//   calls:   -> n3DNode::Rxyz
// 0x1001fbee  n3DNode::cmd_rx (v_rx_f)  (12 insns)
//   calls:   -> n3DNode::Rx
// 0x1001fc15  n3DNode::cmd_ry (v_ry_f)  (12 insns)
//   calls:   -> n3DNode::Ry
// 0x1001fc3c  n3DNode::cmd_rz (v_rz_f)  (12 insns)
//   calls:   -> n3DNode::Rz
// 0x1001fc63  n3DNode::cmd_sxyz (v_sxyz_fff)  (31 insns)
// 0x1001fcca  n3DNode::cmd_sx (v_sx_f)  (15 insns)
// 0x1001fd03  n3DNode::cmd_sy (v_sy_f)  (15 insns)
// 0x1001fd3c  n3DNode::cmd_sz (v_sz_f)  (15 insns)
// 0x1001fd75  n3DNode::cmd_qxyzw (v_qxyzw_ffff)  (26 insns)
//   calls:   -> n3DNode::Qxyzw
// 0x1001fdc7  n3DNode::cmd_setsprite (v_setsprite_b)  (13 insns)
// 0x1001fdf7  n3DNode::cmd_getsprite (b_getsprite_v)  (13 insns)
// 0x1001fe26  n3DNode::cmd_setbillboard (v_setbillboard_b)  (13 insns)
// 0x1001fe56  n3DNode::cmd_getbillboard (b_getbillboard_v)  (13 insns)
// 0x1001fe85  n3DNode::cmd_setlockviewer (v_setlockviewer_b)  (13 insns)
// 0x1001feb5  n3DNode::cmd_getlockviewer (b_getlockviewer_v)  (13 insns)
// 0x1001fee4  n3DNode::cmd_setviewspace (v_setviewspace_b)  (13 insns)
// 0x1001ff14  n3DNode::cmd_getviewspace (b_getviewspace_v)  (171 insns)
//   calls:   -> n3DNode::GetR
// 0x1002011d  n3DNode::SaveCmds  (403 insns)
//   calls:   -> nVisNode::SaveCmds, -> n3DNode::GetR
//   consts:  f32=0, f32=1
// 0x1003282a  n3DNode::cmd_getmaxlod (f_getmaxlod_v)  (11 insns)
// 0x10037a2c  n3DNode::vfunc_13  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Dispatch
// 0x10037a32  n3DNode::vfunc_12  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Import
// 0x10037a3e  n3DNode::vfunc_10  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Parse
// 0x10037a44  n3DNode::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Clone
// 0x10037a4a  n3DNode::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveAs
// 0x10037a50  n3DNode::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Save
// 0x10037a56  n3DNode::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsInstanceOf
// 0x10037a5c  n3DNode::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsA
// 0x10037a62  n3DNode::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::GetClass
// 0x10037a68  n3DNode::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SetClass
// 0x10037a6e  n3DNode::vfunc_02  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Release

} // namespace re_nnebula
