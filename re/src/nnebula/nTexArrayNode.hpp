#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nTexArrayNode.asm
// Class: nTexArrayNode : public nvisnode  (sizeof = 0x144 = 324 bytes)

#include <cstdint>

namespace re_nnebula {

struct nTexArrayNode_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0078
    uint8_t field_0x0078;
    // +0x0079
    uint8_t field_0x0079;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0134
    uint32_t field_0x0134;
    // +0x0138
    uint32_t field_0x0138;
    // +0x013c
    uint32_t field_0x013c;
    // +0x0140
    uint32_t field_0x0140;
};

// Script AddCmds (5):
//   v_settexture_iss
//   v_setgenmipmaps_ib
//   b_getgenmipmaps_i
//   v_sethighquality_ib
//   b_gethighquality_i

// Methods (24):
// 0x1001a71c  nTexArrayNode::n_init_ntexarraynode  (15 insns)
//   strings: 'nvisnode'
// 0x1001a747  nTexArrayNode::n_fini_ntexarraynode  (5 insns)
// 0x1001a759  nTexArrayNode::n_new_ntexarraynode  (10 insns)
//   calls:   -> nTexArrayNode::nTexArrayNode()
// 0x1001a773  nTexArrayNode::nTexArrayNode()  (53 insns)
//   calls:   -> nVisNode::nVisNode()
//   strings: '/sys/servers/file2'
// 0x1001a80b  nTexArrayNode::~nTexArrayNode()  (35 insns)
//   calls:   -> nVisNode::~nVisNode()
// 0x1001a86e  nTexArrayNode::checkLoadTextures  (55 insns)
// 0x1001a916  nTexArrayNode::Preload  (7 insns)
//   calls:   -> nTexArrayNode::checkLoadTextures, -> nVisNode::Preload
// 0x1001a927  nTexArrayNode::Attach  (17 insns)
//   calls:   -> nVisNode::Attach
// 0x1001a955  nTexArrayNode::Compute  (15 insns)
//   calls:   -> nVisNode::Compute, -> nTexArrayNode::checkLoadTextures
// 0x1001a986  nTexArrayNode::SetTexture  (193 insns)
//   calls:   IAT: MSVCRT.dll!sprintf, -> nTexture::SetTexture, IAT: nkernel.dll!n_printf
//   strings: '%s', '_a'
// 0x1001ab80  nTexArrayNode::GetTexture  (13 insns)
// 0x1001abae  nTexArrayNode::SetGenMipMaps  (4 insns)
// 0x1001abc0  nTexArrayNode::GetGenMipMaps  (3 insns)
// 0x1001abce  nTexArrayNode::nTexArrayNode()  (61 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x1001ac94  nTexArrayNode::operator=  (82 insns)
//   calls:   -> nVisNode::operator=
// 0x1001ad83  nTexArrayNode::vfunc_00  (41 insns)
//   calls:   -> nTexArrayNode::~nTexArrayNode()
// 0x1001ade4  nTexArrayNode::SetHighQuality  (4 insns)
// 0x1001adf6  nTexArrayNode::GetHighQuality  (41 insns)
//   strings: 'v_settexture_iss', 'ss_gettexture_i', 'v_setgenmipmaps_ib', 'b_getgenmipmaps_i', 'v_sethighquality_ib', 'b_gethighquality_i'
// 0x1001ae9d  nTexArrayNode::cmd_settexture (v_settexture_iss)  (122 insns)
//   calls:   -> nTexArrayNode::SetTexture
//   strings: 'none'
// 0x1001afd1  nTexArrayNode::cmd_setgenmipmaps (v_setgenmipmaps_ib)  (15 insns)
// 0x1001afff  nTexArrayNode::cmd_getgenmipmaps (b_getgenmipmaps_i)  (21 insns)
// 0x1001b044  nTexArrayNode::cmd_sethighquality (v_sethighquality_ib)  (15 insns)
// 0x1001b072  nTexArrayNode::cmd_gethighquality (b_gethighquality_i)  (21 insns)
// 0x1001b0b7  nTexArrayNode::SaveCmds  (138 insns)
//   calls:   -> nVisNode::SaveCmds
//   strings: 'none'

} // namespace re_nnebula
