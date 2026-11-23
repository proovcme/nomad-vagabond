#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nHyperMixer2.asm
// Class: nHyperMixer2 : public nvisnode  (sizeof = 0x1c68 = 7272 bytes)

#include <cstdint>

namespace re_nnebula {

struct nHyperMixer2_Layout {
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
    // +0x0018
    uint32_t field_0x0018;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0034
    uint32_t field_0x0034;
    // +0x004c
    uint32_t field_0x004c;
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
    // +0x0505
    uint8_t field_0x0505;
    // +0x1c64
    uint8_t field_0x1c64;
    // +0x1c65
    uint8_t field_0x1c65;
};

// Script AddCmds (9):
//   v_beginsources_i
//   v_setsource_iss
//   v_endsources_v
//   i_getnumsources_v
//   v_getsource_iss
//   v_beginconnects_i
//   v_setconnect_issss
//   v_endconnects_v
//   i_getnumconnects_v

// Methods (33):
// 0x1002ca2d  nHyperMixer2::BeginSources  (3 insns)
// 0x1002ca3a  nHyperMixer2::SetSource  (20 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2
// 0x1002ca79  nHyperMixer2::GetNumSources  (23 insns)
//   calls:   IAT: nkernel.dll!n_strdup
// 0x1002cf8b  nHyperMixer2::cmd_getnumsources (i_getnumsources_v)  (13 insns)
//   calls:   -> nHyperMixer2::GetNumSources
// 0x1002d07e  nHyperMixer2::cmd_getnumconnects (i_getnumconnects_v)  (44 insns)
//   calls:   -> nHyperMixer2::GetNumConnects
// 0x10030610  nHyperMixer2::n_init_nhypermixer2  (15 insns)
//   strings: 'nvisnode'
// 0x1003063b  nHyperMixer2::n_fini_nhypermixer2  (5 insns)
// 0x1003064d  nHyperMixer2::n_new_nhypermixer2  (10 insns)
//   calls:   -> nHyperMixer2::nHyperMixer2()
// 0x10030667  nHyperMixer2::n_version_nhypermixer2  (2 insns)
// 0x1003066d  nHyperMixer2::nHyperMixer2()  (40 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x10030706  nHyperMixer2::operator=  (63 insns)
//   calls:   -> nVisNode::operator=
// 0x100307c3  nHyperMixer2::vfunc_00  (41 insns)
//   calls:   -> nHyperMixer2::~nHyperMixer2()
// 0x10030824  nHyperMixer2::nHyperMixer2()  (48 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x100308b6  nHyperMixer2::~nHyperMixer2()  (27 insns)
//   calls:   -> nVisNode::~nVisNode()
// 0x100308f8  nHyperMixer2::Initialize  (26 insns)
//   calls:   -> nVisNode::DependsOn, -> nVisNode::Initialize
//   strings: 'nvisnode'
// 0x10030933  nHyperMixer2::AttachChannels  (39 insns)
//   calls:   -> nVisNode::AttachChannels
// 0x10030994  nHyperMixer2::EndSources  (2 insns)
//   calls:   -> nVisNode::NotifyChannelSetDirty
// 0x100309a0  nHyperMixer2::GetSource  (14 insns)
// 0x100309cf  nHyperMixer2::BeginConnects  (4 insns)
// 0x100309e3  nHyperMixer2::SetConnect  (12 insns)
// 0x10030a08  nHyperMixer2::EndConnects  (2 insns)
// 0x10030a10  nHyperMixer2::GetNumConnects  (2 insns)
// 0x10030a17  nHyperMixer2::GetConnect  (19 insns)
// 0x10030a52  nHyperMixer2::LookupObjPointers  (116 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Aborting.', 'node/nhypermixer2_main.cc'
// 0x10030be0  nHyperMixer2::Compute  (397 insns)
//   calls:   -> nVisNode::Compute, -> nHyperMixer2::LookupObjPointers, -> nCmdProto::NewCmd, -> nCmdProto::RelCmd, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f32=0
//   strings: 'Aborting.', 'c:/nomads/code/inc\\node/nhypermixerconnect.h', 'v_beginsources_i', 'v_setsource_iss', 'v_endsources_v', 'i_getnumsources_v', 'v_getsource_iss', 'v_beginconnects_i'
// 0x100310d7  nHyperMixer2::cmd_beginsources (v_beginsources_i)  (10 insns)
//   calls:   -> nHyperMixer2::BeginSources
// 0x100310fa  nHyperMixer2::cmd_setsource (v_setsource_iss)  (21 insns)
//   calls:   -> nHyperMixer2::SetSource
// 0x10031137  nHyperMixer2::cmd_endsources (v_endsources_v)  (2 insns)
//   calls:   -> nHyperMixer2::EndSources
// 0x10031140  nHyperMixer2::cmd_getsource (v_getsource_iss)  (31 insns)
//   calls:   -> nHyperMixer2::GetSource
// 0x1003119f  nHyperMixer2::cmd_beginconnects (v_beginconnects_i)  (10 insns)
//   calls:   -> nHyperMixer2::BeginConnects
// 0x100311c2  nHyperMixer2::cmd_setconnect (v_setconnect_issss)  (35 insns)
//   calls:   -> nHyperMixer2::SetConnect
// 0x10031220  nHyperMixer2::cmd_endconnects (v_endconnects_v)  (51 insns)
//   calls:   -> nHyperMixer2::EndConnects, -> nHyperMixer2::GetConnect
// 0x100312c2  nHyperMixer2::SaveCmds  (178 insns)
//   calls:   -> nVisNode::SaveCmds, -> nHyperMixer2::GetSource, -> nHyperMixer2::GetConnect

} // namespace re_nnebula
