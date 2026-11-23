#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nchnreader.asm
// Class: nchnreader : public nvisnode  (sizeof = 0xa4 = 164 bytes)

#include <cstdint>

namespace re_nnebula {

struct nchnreader_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0040
    uint32_t field_0x0040;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x010c
    uint32_t field_0x010c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (3):
//   v_beginconnects_i
//   v_setconnect_iss
//   v_endconnects_v

// Methods (12):
// 0x1002e68f  nchnreader::n_init_nchnreader  (15 insns)
//   strings: 'nvisnode'
// 0x1002e6ba  nchnreader::n_fini_nchnreader  (5 insns)
// 0x1002e6cc  nchnreader::n_new_nchnreader  (10 insns)
// 0x1002e6e6  nchnreader::n_version_nchnreader  (11 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x1002e70c  nchnreader::vfunc_00  (23 insns)
//   calls:   -> nVisNode::~nVisNode()
// 0x1002e74b  nchnreader::vfunc_01  (26 insns)
//   calls:   -> nVisNode::DependsOn, -> nVisNode::Initialize
//   strings: 'nvisnode'
// 0x1002e786  nchnreader::vfunc_18  (125 insns)
//   calls:   -> nVisNode::AttachChannels, IAT: nkernel.dll!n_strncpy2
// 0x1002e8bd  nchnreader::vfunc_15  (173 insns)
//   calls:   -> nVisNode::Compute, -> nCmdProto::NewCmd, -> nCmdProto::RelCmd, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Aborting.', 'c:/nomads/code/inc\\node/nchannelconnect.h', 'v_beginconnects_i', 'v_setconnect_iss', 'v_endconnects_v'
// 0x1002eace  nchnreader::cmd_beginconnects (v_beginconnects_i)  (10 insns)
// 0x1002eaf1  nchnreader::cmd_setconnect (v_setconnect_iss)  (21 insns)
// 0x1002eb2e  nchnreader::cmd_endconnects (v_endconnects_v)  (2 insns)
// 0x1002eb37  nchnreader::vfunc_11  (90 insns)
//   calls:   -> nVisNode::SaveCmds

} // namespace re_nnebula
