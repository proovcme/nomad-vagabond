#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/ncharacternode.asm
// Class: ncharacternode : public nanimnode  (sizeof = 0x1e8 = 488 bytes)

#include <cstdint>

namespace re_nnebula {

struct ncharacternode_Layout {
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
    float field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0030
    float field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x003c
    float field_0x003c;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00c4
    uint32_t field_0x00c4;
    // +0x00dc
    uint32_t field_0x00dc;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00f4
    uint32_t field_0x00f4;
    // +0x00f8
    uint32_t field_0x00f8;
    // +0x00fc
    uint32_t field_0x00fc;
    // +0x010c
    uint32_t field_0x010c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0124
    uint32_t field_0x0124;
    // +0x0128
    uint32_t field_0x0128;
    // +0x012c
    uint32_t field_0x012c;
    // +0x0130
    uint32_t field_0x0130;
    // +0x0134
    uint32_t field_0x0134;
    // +0x0144
    uint32_t field_0x0144;
    // +0x0148
    uint32_t field_0x0148;
    // +0x014c
    uint32_t field_0x014c;
    // +0x0150
    uint8_t field_0x0150;
    // +0x0158
    uint32_t field_0x0158;
    // +0x015c
    uint32_t field_0x015c;
    // +0x0160
    uint32_t field_0x0160;
    // +0x0164
    uint32_t field_0x0164;
    // +0x01b8
    uint32_t field_0x01b8;
    // +0x01bc
    uint32_t field_0x01bc;
    // +0x01c0
    uint32_t field_0x01c0;
    // +0x01d4
    uint32_t field_0x01d4;
    // +0x01d8
    uint32_t field_0x01d8;
    // +0x01dc
    uint8_t field_0x01dc;
    // +0x01dd
    uint8_t field_0x01dd;
    // +0x01de
    uint8_t field_0x01de;
    // +0x01e0
    uint32_t field_0x01e0;
    // +0x01e4
    uint32_t field_0x01e4;
};

// Script AddCmds (29):
//   v_setreadonly_b
//   b_getreadonly_v
//   v_setskinmesh_s
//   s_getskinmesh_v
//   v_setcastshadow_b
//   b_getcastshadow_v
//   v_setstatechannel_s
//   s_getstatechannel_v
//   v_setanimfile_s
//   s_getanimfile_v
//   v_beginjoints_i
//   v_addjoint_isifffffff
//   v_endjoints_v
//   i_getnumjoints_v
//   v_beginstates_i
//   v_addstate_is
//   v_beginstateanims_ii
//   v_addstateanim_iiss
//   v_endstateanims_i
//   v_endstates_v
//   i_getnumstates_v
//   s_getstate_i
//   i_getnumstateanims_i
//   v_setrenderskeleton_b
//   b_getrenderskeleton_v
//   v_beginhardpoints_i
//   v_addhardpoint_iis
//   v_endhardpoints_v
//   i_getnumhardpoints_v

// Methods (32):
// 0x10021d7f  ncharacternode::n_init_ncharacternode  (15 insns)
//   strings: 'nanimnode'
// 0x10021daa  ncharacternode::n_fini_ncharacternode  (5 insns)
// 0x10021dbc  ncharacternode::n_new_ncharacternode  (2009 insns)
//   calls:   -> nAnimNode::nAnimNode(), -> nVertexSorter::nVertexSorter(), IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, -> nAnimNode::~nAnimNode(), IAT: MSVCRT.dll!strstr, -> nAnimCurveArray::LoadNax, -> nAnimCurveArray::LoadAnim, -> nVisNode::NotifyChannelSetDirty, -> nInputServer::BeginScripts, -> nAnimNode::AttachChannels, -> nVisNode::RenderContextCreated
//   consts:  f64=0
//   strings: '/sys/servers/anim', '/sys/servers/character', '/sys/servers/gfx', '/sys/servers/shadow', '/sys/servers/file2', 'charstate', '.nax', 'NOT INITIALIZED'
// 0x10023632  ncharacternode::cmd_setreadonly (v_setreadonly_b)  (10 insns)
// 0x10023656  ncharacternode::cmd_getreadonly (b_getreadonly_v)  (13 insns)
// 0x10023682  ncharacternode::cmd_setskinmesh (v_setskinmesh_s)  (11 insns)
// 0x100236ac  ncharacternode::cmd_getskinmesh (s_getskinmesh_v)  (13 insns)
// 0x100236d5  ncharacternode::cmd_setcastshadow (v_setcastshadow_b)  (10 insns)
// 0x100236f9  ncharacternode::cmd_getcastshadow (b_getcastshadow_v)  (13 insns)
// 0x10023725  ncharacternode::cmd_setstatechannel (v_setstatechannel_s)  (10 insns)
// 0x10023748  ncharacternode::cmd_getstatechannel (s_getstatechannel_v)  (14 insns)
// 0x10023772  ncharacternode::cmd_setanimfile (v_setanimfile_s)  (10 insns)
// 0x10023795  ncharacternode::cmd_getanimfile (s_getanimfile_v)  (15 insns)
// 0x100237c5  ncharacternode::cmd_beginjoints (v_beginjoints_i)  (10 insns)
// 0x100237e8  ncharacternode::cmd_addjoint (v_addjoint_isifffffff)  (72 insns)
// 0x100238bb  ncharacternode::cmd_endjoints (v_endjoints_v)  (2 insns)
// 0x100238c4  ncharacternode::cmd_getnumjoints (i_getnumjoints_v)  (115 insns)
// 0x10023a31  ncharacternode::cmd_beginstates (v_beginstates_i)  (10 insns)
// 0x10023a54  ncharacternode::cmd_addstate (v_addstate_is)  (16 insns)
// 0x10023a81  ncharacternode::cmd_beginstateanims (v_beginstateanims_ii)  (16 insns)
// 0x10023aae  ncharacternode::cmd_addstateanim (v_addstateanim_iiss)  (27 insns)
// 0x10023af9  ncharacternode::cmd_endstateanims (v_endstateanims_i)  (10 insns)
// 0x10023b1c  ncharacternode::cmd_endstates (v_endstates_v)  (2 insns)
// 0x10023b25  ncharacternode::cmd_getnumstates (i_getnumstates_v)  (13 insns)
// 0x10023b50  ncharacternode::cmd_getstate (s_getstate_i)  (24 insns)
// 0x10023b97  ncharacternode::cmd_getnumstateanims (i_getnumstateanims_i)  (59 insns)
// 0x10023c43  ncharacternode::cmd_setrenderskeleton (v_setrenderskeleton_b)  (10 insns)
// 0x10023c67  ncharacternode::cmd_getrenderskeleton (b_getrenderskeleton_v)  (13 insns)
// 0x10023c93  ncharacternode::cmd_beginhardpoints (v_beginhardpoints_i)  (10 insns)
// 0x10023cb6  ncharacternode::cmd_addhardpoint (v_addhardpoint_iis)  (21 insns)
// 0x10023cf3  ncharacternode::cmd_getnumhardpoints (i_getnumhardpoints_v)  (589 insns)
//   calls:   -> nAnimNode::SaveCmds, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, -> nVisNode::NotifyChannelSetDirty
// 0x1002d075  ncharacternode::cmd_endhardpoints (v_endhardpoints_v)  (2 insns)
//   calls:   -> nInputServer::BeginScripts

} // namespace re_nnebula
