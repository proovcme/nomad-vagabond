#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nAnimNode.asm
// Class: nAnimNode

#include <cstdint>

namespace re_nnomads {

struct nAnimNode_Layout {
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
    uint32_t field_0x0018;
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
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0038
    uint8_t field_0x0038;
    // +0x0039
    uint8_t field_0x0039;
    // +0x003c
    uint32_t field_0x003c;
    // +0x0040
    uint32_t field_0x0040;
    // +0x0050
    uint32_t field_0x0050;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    float field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00ac
    uint32_t field_0x00ac;
};

// Script AddCmds (14):
//   v_settracerlen_f
//   f_gettracerlen_v
//   v_settracerradius_f
//   f_gettracerradius_v
//   v_setglowradius_f
//   f_getglowradius_v
//   v_settracercolor_ffff
//   v_setsplattersize_f
//   f_getsplattersize_v
//   v_setsplattertime_f
//   f_getsplattertime_v
//   v_setsplatterspeed_f
//   f_getsplatterspeed_v
//   v_setsplattercolor_ffff

// Methods (13):
// 0x10005190  nAnimNode::GetChannel  (2 insns)
// 0x1003ac8e  nAnimNode::nAnimNode()  (25 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x1003acdf  nAnimNode::operator=  (26 insns)
//   calls:   -> nVisNode::operator=
// 0x1003ad35  nAnimNode::vfunc_00  (41 insns)
// 0x1003ad96  nAnimNode::SetRepType  (3 insns)
// 0x1003ada3  nAnimNode::GetRepType  (2 insns)
// 0x1003adaa  nAnimNode::SetChannel  (12 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2
// 0x1003adce  nAnimNode::SetScale  (3 insns)
// 0x1003addb  nAnimNode::GetScale  (609 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: '/sys/servers/gfx', 'dm_', 'u0', 'u1', 'u2', 'u3', 'c:/nomads/code/inc\\gfx/nchannelset.h', 'v_settracerlen_f'
// 0x100798c4  nAnimNode::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Compute
// 0x100798ca  nAnimNode::vfunc_14  (1 insns)
//   calls:   IAT: nnebula.dll!nVisNode::Attach
// 0x10079a1a  nAnimNode::vfunc_18  (1 insns)
//   calls:   IAT: nnebula.dll!nAnimNode::AttachChannels
// 0x10079a20  nAnimNode::vfunc_11  (5 insns)
//   calls:   IAT: nnebula.dll!nAnimNode::SaveCmds, IAT: nnebula.dll!nVertexBuffer::LockVertices, IAT: nnebula.dll!nVertexBuffer::UnlockVertices, IAT: nnebula.dll!nSoundNode::SetFile, IAT: nnebula.dll!nSoundNode::GetFile

} // namespace re_nnomads
