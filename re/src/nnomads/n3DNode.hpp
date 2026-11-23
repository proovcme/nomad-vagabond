#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/n3DNode.asm
// Class: n3DNode

#include <cstdint>

namespace re_nnomads {

struct n3DNode_Layout {
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
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
    uint32_t field_0x0110;
    // +0x0114
    uint8_t field_0x0114;
    // +0x0115
    uint8_t field_0x0115;
    // +0x0118
    uint32_t field_0x0118;
    // +0x011c
    uint32_t field_0x011c;
};

// Methods (58):
// 0x10009c83  n3DNode::n3DNode()  (62 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x10009d93  n3DNode::operator=  (48 insns)
//   calls:   -> nVisNode::operator=
// 0x10009e2a  n3DNode::~n3DNode()  (1 insns)
// 0x10009e2f  n3DNode::vfunc_00  (41 insns)
// 0x10009e8e  n3DNode::set  (3 insns)
// 0x10009e9b  n3DNode::unset  (4 insns)
// 0x10009eaa  n3DNode::get  (4 insns)
// 0x10009eba  n3DNode::SetViewSpace  (6 insns)
// 0x10009ed4  n3DNode::GetViewSpace  (4 insns)
// 0x10009ee0  n3DNode::SetActive  (6 insns)
// 0x10009efa  n3DNode::GetActive  (4 insns)
// 0x10009f0d  n3DNode::SetSprite  (6 insns)
// 0x10009f27  n3DNode::GetSprite  (4 insns)
// 0x10009f33  n3DNode::SetBillboard  (6 insns)
// 0x10009f4d  n3DNode::GetBillboard  (4 insns)
// 0x10009f59  n3DNode::SetLockViewer  (6 insns)
// 0x10009f73  n3DNode::GetLockViewer  (4 insns)
// 0x10009f7f  n3DNode::SetHighDetail  (10 insns)
// 0x10009fa2  n3DNode::GetHighDetail  (4 insns)
// 0x10009fae  n3DNode::M  (15 insns)
// 0x10009fd8  n3DNode::Txyz  (13 insns)
// 0x1000a009  n3DNode::Tx  (8 insns)
// 0x1000a02a  n3DNode::Ty  (8 insns)
// 0x1000a04b  n3DNode::Tz  (8 insns)
// 0x1000a06c  n3DNode::Rxyz  (22 insns)
//   consts:  f32=0.005555556, f32=3.141593
// 0x1000a0bd  n3DNode::Rx  (10 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x1000a0ea  n3DNode::Ry  (10 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x1000a117  n3DNode::Rz  (10 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x1000a144  n3DNode::Sxyz  (13 insns)
// 0x1000a175  n3DNode::Sx  (8 insns)
// 0x1000a196  n3DNode::Sy  (8 insns)
// 0x1000a1b7  n3DNode::Sz  (8 insns)
// 0x1000a1d8  n3DNode::Qxyzw  (15 insns)
// 0x1000a210  n3DNode::GetT  (10 insns)
// 0x1000a237  n3DNode::GetR  (20 insns)
//   consts:  f32=0.3183099, f32=180
// 0x1000a27a  n3DNode::GetS  (10 insns)
// 0x1000a2a1  n3DNode::GetQ  (13 insns)
// 0x1000a2d4  n3DNode::GetM  (6 insns)
// 0x100793ea  n3DNode::vfunc_13  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Dispatch
// 0x100793f0  n3DNode::vfunc_12  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Import
// 0x100793fc  n3DNode::vfunc_10  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Parse
// 0x10079402  n3DNode::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Clone
// 0x10079408  n3DNode::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveAs
// 0x1007940e  n3DNode::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Save
// 0x10079414  n3DNode::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsInstanceOf
// 0x1007941a  n3DNode::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsA
// 0x10079420  n3DNode::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::GetClass
// 0x10079426  n3DNode::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SetClass
// 0x1007942c  n3DNode::vfunc_02  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Release
// 0x100798a6  n3DNode::vfunc_20  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::RenderContextDestroyed
// 0x100798ac  n3DNode::vfunc_19  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::RenderContextCreated
// 0x100798b8  n3DNode::vfunc_17  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::IsChannelSetDirty
// 0x100798be  n3DNode::vfunc_16  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Preload
// 0x100798d6  n3DNode::vfunc_01  (3 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Initialize, IAT: nnebula.dll!nVisNode::~nVisNode(), IAT: nnebula.dll!nSceneGraph2::~nSceneGraph2()
// 0x1007990c  n3DNode::vfunc_18  (1 insns)
//   calls:   IAT: nnebula.dll!n3DNode::AttachChannels
// 0x10079912  n3DNode::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!n3DNode::Compute
// 0x10079918  n3DNode::vfunc_14  (1 insns)
//   calls:   IAT: nnebula.dll!n3DNode::Attach
// 0x1007991e  n3DNode::vfunc_11  (8 insns)
//   calls:   IAT: nnebula.dll!n3DNode::SaveCmds, IAT: nnebula.dll!nVisNode::NotifyChannelSetDirty, IAT: nnebula.dll!n3DNode::updateMatrix, IAT: nnebula.dll!nChannelServer::SetChannel1f, IAT: nnebula.dll!nHyperMixer2::EndSources, IAT: nnebula.dll!nHyperMixer2::SetSource, IAT: nnebula.dll!nHyperMixer2::BeginSources, IAT: nnebula.dll!nChannelServer::GenChannel

} // namespace re_nnomads
