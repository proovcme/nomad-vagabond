#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nmixer.asm
// Class: nmixer : public nvisnode  (sizeof = 0x508 = 1288 bytes)

#include <cstdint>

namespace re_nnebula {

struct nmixer_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0034
    uint32_t field_0x0034;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x010c
    uint32_t field_0x010c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0460
    uint32_t field_0x0460;
    // +0x0504
    uint8_t field_0x0504;
    // +0x0505
    uint8_t field_0x0505;
};

// Script AddCmds (11):
//   v_beginsources_i
//   v_setsource_iss
//   v_endsources_v
//   i_getnumsources_v
//   v_getsource_iss
//   v_beginconnects_i
//   v_setconnect_iss
//   v_endconnects_v
//   i_getnumconnects_v
//   v_setnormalize_b
//   b_getnormalize_v

// Methods (15):
// 0x1002c805  nmixer::n_init_nmixer  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nvisnode', 'node/nmix_init.cc'
// 0x1002c860  nmixer::n_fini_nmixer  (14 insns)
// 0x1002c883  nmixer::n_new_nmixer  (10 insns)
// 0x1002c89d  nmixer::n_version_nmixer  (51 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x1002c92c  nmixer::vfunc_00  (38 insns)
//   calls:   -> nVisNode::~nVisNode()
// 0x1002c98a  nmixer::vfunc_01  (26 insns)
//   calls:   -> nVisNode::DependsOn, -> nVisNode::Initialize
//   strings: 'nvisnode'
// 0x1002c9c5  nmixer::vfunc_18  (38 insns)
//   calls:   -> nVisNode::AttachChannels
// 0x1002cae8  nmixer::vfunc_15  (353 insns)
//   calls:   -> nVisNode::Compute, -> nCmdProto::NewCmd, -> nCmdProto::RelCmd, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f64=1e-07, f32=0
//   strings: 'Aborting.', 'c:/nomads/code/inc\\node/nmixer.h', 'v_beginsources_i', 'v_setsource_iss', 'v_endsources_v', 'i_getnumsources_v', 'v_getsource_iss', 'v_beginconnects_i'
// 0x1002cf82  nmixer::cmd_endsources (v_endsources_v)  (2 insns)
//   calls:   -> nchnmodulator::vfunc_23
// 0x1002cfb6  nmixer::cmd_getsource (v_getsource_iss)  (31 insns)
//   calls:   -> nHyperMixer2::GetSource
// 0x1002d015  nmixer::cmd_beginconnects (v_beginconnects_i)  (10 insns)
// 0x1002d038  nmixer::cmd_setconnect (v_setconnect_iss)  (21 insns)
// 0x1002d108  nmixer::cmd_setnormalize (v_setnormalize_b)  (12 insns)
// 0x1002d12e  nmixer::cmd_getnormalize (b_getnormalize_v)  (13 insns)
// 0x1002d159  nmixer::vfunc_11  (182 insns)
//   calls:   -> nVisNode::SaveCmds, -> nHyperMixer2::GetSource

} // namespace re_nnebula
