#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nAnimNode.asm
// Class: nAnimNode

#include <cstdint>

namespace re_nnature {

struct nAnimNode_Layout {
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    float field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
};

// Methods (56):
// 0x100019ae  nAnimNode::nAnimNode()  (25 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x100019ff  nAnimNode::operator=  (26 insns)
//   calls:   -> nVisNode::operator=
// 0x10001a55  nAnimNode::vfunc_00  (41 insns)
// 0x10001ab6  nAnimNode::SetRepType  (3 insns)
// 0x10001ac3  nAnimNode::GetRepType  (2 insns)
// 0x10001aca  nAnimNode::SetChannel  (12 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2
// 0x10001aee  nAnimNode::GetChannel  (2 insns)
// 0x10001af5  nAnimNode::SetScale  (3 insns)
// 0x10001b02  nAnimNode::GetScale  (31 insns)
// 0x10001d51  nAnimNode::vfunc_21  (41 insns)
// 0x10001f20  nAnimNode::vfunc_28  (41 insns)
// 0x10001fcf  nAnimNode::vfunc_41  (40 insns)
// 0x1000217f  nAnimNode::vfunc_54  (41 insns)
// 0x1000dd14  nAnimNode::vfunc_13  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Dispatch
// 0x1000dd1a  nAnimNode::vfunc_12  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Import
// 0x1000dd26  nAnimNode::vfunc_10  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Parse
// 0x1000dd2c  nAnimNode::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Clone
// 0x1000dd32  nAnimNode::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveAs
// 0x1000dd38  nAnimNode::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Save
// 0x1000dd3e  nAnimNode::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsInstanceOf
// 0x1000dd44  nAnimNode::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsA
// 0x1000dd4a  nAnimNode::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::GetClass
// 0x1000dd50  nAnimNode::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SetClass
// 0x1000dd56  nAnimNode::vfunc_02  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Release
// 0x1000dd5c  nAnimNode::vfunc_55  (3 insns)
//   calls:   IAT: nkernel.dll!nRoot::Initialize, IAT: nkernel.dll!nRoot::~nRoot(), IAT: nkernel.dll!nClass::~nClass()
// 0x1000def4  nAnimNode::vfunc_20  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::RenderContextDestroyed
// 0x1000defa  nAnimNode::vfunc_19  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::RenderContextCreated
// 0x1000df06  nAnimNode::vfunc_17  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::IsChannelSetDirty
// 0x1000df0c  nAnimNode::vfunc_16  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Preload
// 0x1000df12  nAnimNode::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Compute
// 0x1000df18  nAnimNode::vfunc_14  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Attach
// 0x1000df24  nAnimNode::vfunc_01  (2 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Initialize, IAT: nnebula.dll!nVisNode::~nVisNode()
// 0x1000df30  nAnimNode::vfunc_18  (1 insns)
//   calls:   IAT: nnebula.dll!nAnimNode::AttachChannels
// 0x1000df36  nAnimNode::vfunc_11  (3 insns)
//   calls:   IAT: nnebula.dll!nAnimNode::SaveCmds, IAT: nnebula.dll!nAnimNode::~nAnimNode(), IAT: nnebula.dll!nVisNode::NotifyChannelSetDirty
// 0x1000df48  nAnimNode::vfunc_27  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::ReleaseBubble
// 0x1000df4e  nAnimNode::vfunc_26  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::NewBubble
// 0x1000df54  nAnimNode::vfunc_25  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::RenderBubble
// 0x1000df5a  nAnimNode::vfunc_24  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::UnlockBubble
// 0x1000df60  nAnimNode::vfunc_23  (1 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::LockBubble
// 0x1000df66  nAnimNode::vfunc_22  (2 insns)
//   calls:   IAT: nnebula.dll!nVertexPool::Initialize, IAT: nnebula.dll!nVertexPool::~nVertexPool()
// 0x1000df72  nAnimNode::vfunc_40  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::WriteLine
// 0x1000df78  nAnimNode::vfunc_39  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetPixelFormat
// 0x1000df7e  nAnimNode::vfunc_38  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetPixelFormat
// 0x1000df84  nAnimNode::vfunc_37  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetHeight
// 0x1000df8a  nAnimNode::vfunc_36  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::SetWidth
// 0x1000df90  nAnimNode::vfunc_35  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::ReadLine
// 0x1000df96  nAnimNode::vfunc_34  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetPixelFormat
// 0x1000df9c  nAnimNode::vfunc_33  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetHeight
// 0x1000dfa2  nAnimNode::vfunc_32  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::GetWidth
// 0x1000dfa8  nAnimNode::vfunc_31  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::IsOpen
// 0x1000dfae  nAnimNode::vfunc_30  (1 insns)
//   calls:   IAT: nnebula.dll!nImageFile::Close
// 0x1000dfb4  nAnimNode::vfunc_29  (2 insns)
//   calls:   IAT: nnebula.dll!nImageFile::Open, IAT: nnebula.dll!nImageFile::~nImageFile()
// 0x1000dfc0  nAnimNode::vfunc_53  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::WriteLine
// 0x1000dfc6  nAnimNode::vfunc_48  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::ReadLine
// 0x1000dfcc  nAnimNode::vfunc_43  (1 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::Close
// 0x1000dfd2  nAnimNode::vfunc_42  (2 insns)
//   calls:   IAT: nnebula.dll!nBmpFile::Open, IAT: nnebula.dll!nBmpFile::~nBmpFile()

} // namespace re_nnature
