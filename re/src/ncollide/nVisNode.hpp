#pragma once
// Auto-lifted C++ layout & method spec from ncollide.dll
// Source ASM: re/disasm/ncollide/nVisNode.asm
// Class: nVisNode

#include <cstdint>

namespace re_ncollide {

struct nVisNode_Layout {
    // +0x008c
    float field_0x008c;
    // +0x0090
    uint32_t field_0x0090;
    // +0x0094
    uint32_t field_0x0094;
    // +0x0098
    uint8_t field_0x0098;
};

// Methods (14):
// 0x10006236  nVisNode::nVisNode()  (43 insns)
//   calls:   -> nRoot::nRoot()
// 0x100062b3  nVisNode::operator=  (42 insns)
//   calls:   -> nRoot::operator=
// 0x1000632a  nVisNode::vfunc_00  (41 insns)
// 0x1000638b  nVisNode::SetFinishedAfter  (3 insns)
// 0x10006398  nVisNode::GetFinishedAfter  (2 insns)
// 0x10007636  nVisNode::vfunc_20  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::RenderContextDestroyed
// 0x1000763c  nVisNode::vfunc_19  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::RenderContextCreated
// 0x10007642  nVisNode::vfunc_18  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::AttachChannels
// 0x10007648  nVisNode::vfunc_17  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::IsChannelSetDirty
// 0x1000764e  nVisNode::vfunc_16  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Preload
// 0x10007654  nVisNode::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Compute
// 0x1000765a  nVisNode::vfunc_14  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Attach
// 0x10007660  nVisNode::vfunc_11  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::SaveCmds
// 0x10007666  nVisNode::vfunc_01  (150 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Initialize, IAT: nnebula.dll!nVisNode::~nVisNode(), IAT: nnebula.dll!nVisNode::nVisNode(), IAT: nnebula.dll!nSceneGraph2::~nSceneGraph2(), IAT: MSVCRT.dll!??2@YAPAXI@Z, IAT: MSVCRT.dll!??3@YAXPAX@Z, IAT: MSVCRT.dll!_ftol, IAT: MSVCRT.dll!_adjust_fdiv, IAT: MSVCRT.dll!malloc, IAT: MSVCRT.dll!free, IAT: MSVCRT.dll!_initterm, IAT: KERNEL32.dll!DisableThreadLibraryCalls

} // namespace re_ncollide
