#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nHyperMixer2.asm
// Class: nHyperMixer2

#include <cstdint>

namespace re_nnomads {

struct nHyperMixer2_Layout {
    // +0x009c
    uint32_t field_0x009c;
    // +0x0460
    uint32_t field_0x0460;
    // +0x1c64
    uint8_t field_0x1c64;
    // +0x1c65
    uint8_t field_0x1c65;
};

// Methods (7):
// 0x1000d4de  nHyperMixer2::nHyperMixer2()  (40 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x1000d577  nHyperMixer2::operator=  (63 insns)
//   calls:   -> nVisNode::operator=
// 0x1000d634  nHyperMixer2::vfunc_00  (41 insns)
// 0x1007999c  nHyperMixer2::vfunc_18  (1 insns)
//   calls:   IAT: nnebula.dll!nHyperMixer2::AttachChannels
// 0x100799a2  nHyperMixer2::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nHyperMixer2::Compute
// 0x100799a8  nHyperMixer2::vfunc_11  (1 insns)
//   calls:   IAT: nnebula.dll!nHyperMixer2::SaveCmds
// 0x100799ae  nHyperMixer2::vfunc_01  (11 insns)
//   calls:   IAT: nnebula.dll!nHyperMixer2::Initialize, IAT: nnebula.dll!nHyperMixer2::~nHyperMixer2(), IAT: nnebula.dll!nInputServer::GetSlider, IAT: nnebula.dll!nInputServer::GetButton, IAT: nnebula.dll!nChannelServer::SetChannel3f, IAT: nnebula.dll!nSceneGraph2::EndScene, IAT: nnebula.dll!nSceneGraph2::Attach, IAT: nnebula.dll!nSceneGraph2::BeginScene, IAT: nnebula.dll!nChannelServer::SetChannelPtr, IAT: nnebula.dll!nChannelServer::SetChannelString, IAT: nnebula.dll!nTexArrayNode::SetTexture

} // namespace re_nnomads
