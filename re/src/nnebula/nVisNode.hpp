#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nVisNode.asm
// Class: nVisNode : public nroot  (sizeof = 0x9c = 156 bytes)

#include <cstdint>

namespace re_nnebula {

struct nVisNode_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0074
    uint32_t field_0x0074;
    // +0x007c
    uint32_t field_0x007c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0084
    uint32_t field_0x0084;
    // +0x0088
    uint32_t field_0x0088;
    // +0x008c
    float field_0x008c;
    // +0x0090
    uint32_t field_0x0090;
    // +0x0094
    uint32_t field_0x0094;
    // +0x0098
    uint8_t field_0x0098;
};

// Script AddCmds (3):
//   v_setfinishedafter_f
//   f_getfinishedafter_v
//   v_preload_v

// Methods (25):
// 0x1000e139  nVisNode::nVisNode()  (43 insns)
//   calls:   -> nRoot::nRoot()
// 0x1000e1b6  nVisNode::operator=  (42 insns)
//   calls:   -> nRoot::operator=
// 0x1000e22d  nVisNode::vfunc_00  (41 insns)
//   calls:   -> nVisNode::~nVisNode()
// 0x1000e28e  nVisNode::SetFinishedAfter  (3 insns)
// 0x1000e29b  nVisNode::GetFinishedAfter  (2 insns)
// 0x1001989b  nVisNode::n_init_nvisnode  (15 insns)
//   strings: 'nroot'
// 0x100198c6  nVisNode::n_fini_nvisnode  (5 insns)
// 0x100198d8  nVisNode::n_new_nvisnode  (10 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x100198f2  nVisNode::nVisNode()  (52 insns)
//   strings: 'nvisnode', '/sys/servers/gfx', '/sys/servers/channel'
// 0x100199ab  nVisNode::~nVisNode()  (45 insns)
// 0x10019a2e  nVisNode::Initialize  (7 insns)
//   calls:   -> nVisNode::NotifyChannelSetDirty, -> nAnimCurveArray::vfunc_01
// 0x10019a3f  nVisNode::DependsOn  (9 insns)
// 0x10019a5b  nVisNode::Preload  (31 insns)
//   calls:   -> nRoot::GetHead
// 0x10019a9f  nVisNode::IsChannelSetDirty  (2 insns)
// 0x10019aa6  nVisNode::GetChannelSet  (29 insns)
// 0x10019b00  nVisNode::AttachChannels  (32 insns)
//   calls:   -> nRoot::GetHead
// 0x10019b4a  nVisNode::NotifyChannelSetDirty  (49 insns)
//   calls:   -> nVisNode::NotifyChannelSetDirty
// 0x10019bc4  nVisNode::RenderContextCreated  (32 insns)
//   calls:   -> nRoot::GetHead
// 0x10019c0e  nVisNode::RenderContextDestroyed  (32 insns)
//   calls:   -> nRoot::GetHead
// 0x10019c58  nVisNode::Attach  (33 insns)
//   calls:   -> nRoot::GetHead
// 0x10019ca4  nVisNode::Compute  (57 insns)
//   strings: 'v_setfinishedafter_f', 'f_getfinishedafter_v', 'v_preload_v'
// 0x10019d4b  nVisNode::cmd_setfinishedafter (v_setfinishedafter_f)  (10 insns)
// 0x10019d70  nVisNode::cmd_getfinishedafter (f_getfinishedafter_v)  (11 insns)
// 0x10019d9a  nVisNode::cmd_preload (v_preload_v)  (3 insns)
// 0x10019da3  nVisNode::SaveCmds  (36 insns)
//   calls:   -> nAnimCurveArray::vfunc_11
//   consts:  f32=0

} // namespace re_nnebula
