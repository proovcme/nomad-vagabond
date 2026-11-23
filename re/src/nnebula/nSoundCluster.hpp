#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nSoundCluster.asm
// Class: nSoundCluster

#include <cstdint>

namespace re_nnebula {

struct nSoundCluster_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint8_t field_0x0010;
    // +0x0014
    float field_0x0014;
};

// Methods (9):
// 0x10034f36  nSoundCluster::nSoundCluster()  (38 insns)
// 0x10034f8b  nSoundCluster::~nSoundCluster()  (10 insns)
// 0x10034fa2  nSoundCluster::Begin  (4 insns)
// 0x10034faf  nSoundCluster::AddPlayCandidate  (54 insns)
// 0x10035033  nSoundCluster::StartSound  (6 insns)
//   calls:   -> nSoundCluster::AddPlayCandidate
// 0x1003504a  nSoundCluster::UpdateSound  (6 insns)
//   calls:   -> nSoundCluster::AddPlayCandidate
// 0x10035061  nSoundCluster::End  (2 insns)
// 0x10035068  nSoundCluster::GetHighPriPlayCandidate  (24 insns)
// 0x1003509a  nSoundCluster::operator=  (11 insns)

} // namespace re_nnebula
