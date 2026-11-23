#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nAnimNode.asm
// Class: nAnimNode : public nvisnode  (sizeof = 0xb8 = 184 bytes)

#include <cstdint>

namespace re_nnebula {

struct nAnimNode_Layout {
    // +0x0004
    float field_0x0004;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    float field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (6):
//   v_setreptype_s
//   s_getreptype_v
//   v_setchannel_s
//   s_getchannel_v
//   v_setscale_f
//   f_getscale_v

// Methods (23):
// 0x100217f8  nAnimNode::n_init_nanimnode  (15 insns)
//   strings: 'nvisnode'
// 0x10021823  nAnimNode::n_fini_nanimnode  (5 insns)
// 0x10021835  nAnimNode::n_new_nanimnode  (10 insns)
//   calls:   -> nAnimNode::nAnimNode()
// 0x1002184f  nAnimNode::n_version_nanimnode  (2 insns)
// 0x10021855  nAnimNode::nAnimNode()  (30 insns)
//   calls:   -> nVisNode::nVisNode()
//   strings: 'time'
// 0x100218ac  nAnimNode::~nAnimNode()  (2 insns)
//   calls:   -> nVisNode::~nVisNode()
// 0x100218b7  nAnimNode::AttachChannels  (15 insns)
//   calls:   -> nVisNode::AttachChannels
// 0x100218e8  nAnimNode::nAnimNode()  (25 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x10021939  nAnimNode::operator=  (26 insns)
//   calls:   -> nVisNode::operator=
// 0x1002198f  nAnimNode::vfunc_00  (43 insns)
//   calls:   -> nVisNode::~nVisNode()
// 0x100219fc  nAnimNode::SetRepType  (3 insns)
// 0x10021a09  nAnimNode::GetRepType  (2 insns)
// 0x10021a10  nAnimNode::SetChannel  (12 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2, -> nVisNode::NotifyChannelSetDirty
// 0x10021a34  nAnimNode::GetChannel  (2 insns)
// 0x10021a3b  nAnimNode::SetScale  (3 insns)
// 0x10021a48  nAnimNode::GetScale  (40 insns)
//   strings: 'v_setreptype_s', 's_getreptype_v', 'v_setchannel_s', 's_getchannel_v', 'v_setscale_f', 'f_getscale_v'
// 0x10021ae8  nAnimNode::cmd_setreptype (v_setreptype_s)  (69 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   strings: 'oneshot', 'loop'
// 0x10021b98  nAnimNode::cmd_getreptype (s_getreptype_v)  (22 insns)
//   strings: '<error>', 'loop', 'oneshot'
// 0x10021bdc  nAnimNode::cmd_setchannel (v_setchannel_s)  (18 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2, -> nVisNode::NotifyChannelSetDirty
// 0x10021c15  nAnimNode::cmd_getchannel (s_getchannel_v)  (11 insns)
// 0x10021c3b  nAnimNode::cmd_setscale (v_setscale_f)  (10 insns)
// 0x10021c60  nAnimNode::cmd_getscale (f_getscale_v)  (11 insns)
// 0x10021c8a  nAnimNode::SaveCmds  (82 insns)
//   calls:   -> nVisNode::SaveCmds
//   strings: '<error>', 'loop', 'oneshot'

} // namespace re_nnebula
