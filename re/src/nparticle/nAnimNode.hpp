#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nAnimNode.asm
// Class: nAnimNode

#include <cstdint>

namespace re_nparticle {

struct nAnimNode_Layout {
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    float field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    float field_0x00b8;
    // +0x00bc
    float field_0x00bc;
    // +0x00c0
    float field_0x00c0;
    // +0x00c4
    float field_0x00c4;
    // +0x00c8
    float field_0x00c8;
    // +0x00cc
    float field_0x00cc;
    // +0x00d0
    float field_0x00d0;
    // +0x00d4
    float field_0x00d4;
    // +0x00d8
    float field_0x00d8;
    // +0x00e8
    float field_0x00e8;
    // +0x00ec
    float field_0x00ec;
    // +0x00f0
    float field_0x00f0;
    // +0x00f4
    float field_0x00f4;
    // +0x00f8
    uint8_t field_0x00f8;
    // +0x00f9
    uint8_t field_0x00f9;
};

// Methods (29):
// 0x10002145  nAnimNode::nAnimNode()  (25 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x10002196  nAnimNode::operator=  (26 insns)
//   calls:   -> nVisNode::operator=
// 0x100021ec  nAnimNode::vfunc_00  (41 insns)
// 0x1000224d  nAnimNode::SetRepType  (3 insns)
// 0x1000225a  nAnimNode::GetRepType  (2 insns)
// 0x10002261  nAnimNode::SetChannel  (12 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2
// 0x10002285  nAnimNode::GetChannel  (2 insns)
// 0x1000228c  nAnimNode::SetScale  (3 insns)
// 0x10002299  nAnimNode::GetScale  (43 insns)
//   consts:  f32=3.141593
// 0x100095fc  nAnimNode::vfunc_13  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Dispatch
// 0x10009602  nAnimNode::vfunc_12  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Import
// 0x1000960e  nAnimNode::vfunc_10  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Parse
// 0x10009614  nAnimNode::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Clone
// 0x1000961a  nAnimNode::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveAs
// 0x10009620  nAnimNode::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Save
// 0x10009626  nAnimNode::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsInstanceOf
// 0x1000962c  nAnimNode::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsA
// 0x10009632  nAnimNode::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::GetClass
// 0x10009638  nAnimNode::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SetClass
// 0x1000963e  nAnimNode::vfunc_02  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Release
// 0x100097dc  nAnimNode::vfunc_20  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::RenderContextDestroyed
// 0x100097e2  nAnimNode::vfunc_19  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::RenderContextCreated
// 0x100097e8  nAnimNode::vfunc_18  (1 insns)
//   calls:   IAT: nnebula.dll!nAnimNode::AttachChannels
// 0x100097ee  nAnimNode::vfunc_17  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::IsChannelSetDirty
// 0x100097f4  nAnimNode::vfunc_16  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Preload
// 0x100097fa  nAnimNode::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Compute
// 0x10009800  nAnimNode::vfunc_14  (2 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Attach, IAT: nnebula.dll!nAnimNode::~nAnimNode()
// 0x1000980c  nAnimNode::vfunc_01  (2 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Initialize, IAT: nnebula.dll!nVisNode::DependsOn
// 0x1000982a  nAnimNode::vfunc_11  (3 insns)
//   calls:   IAT: nnebula.dll!nAnimNode::SaveCmds, IAT: nnebula.dll!nVisNode::NotifyChannelSetDirty, IAT: nnebula.dll!nAnimNode::nAnimNode()

} // namespace re_nparticle
