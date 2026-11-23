#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nchnmodulator.asm
// Class: nchnmodulator : public nvisnode  (sizeof = 0xa4 = 164 bytes)

#include <cstdint>

namespace re_nnebula {

struct nchnmodulator_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0040
    uint32_t field_0x0040;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    float field_0x0048;
    // +0x004c
    float field_0x004c;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (4):
//   v_begin_i
//   v_set_iss
//   v_end_v
//   i_getnum_v

// Methods (17):
// 0x1002d6f6  nchnmodulator::vfunc_14  (15 insns)
//   calls:   -> nVisNode::Attach
// 0x1002e14b  nchnmodulator::n_init_nchnmodulator  (15 insns)
//   strings: 'nvisnode'
// 0x1002e176  nchnmodulator::n_fini_nchnmodulator  (5 insns)
// 0x1002e188  nchnmodulator::n_new_nchnmodulator  (10 insns)
// 0x1002e1a2  nchnmodulator::n_version_nchnmodulator  (11 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x1002e1c8  nchnmodulator::vfunc_00  (24 insns)
//   calls:   -> nVisNode::~nVisNode()
// 0x1002e207  nchnmodulator::vfunc_21  (33 insns)
// 0x1002e254  nchnmodulator::vfunc_22  (21 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2
// 0x1002e28b  nchnmodulator::vfunc_23  (1 insns)
//   calls:   -> nVisNode::NotifyChannelSetDirty
// 0x1002e290  nchnmodulator::vfunc_25  (11 insns)
// 0x1002e2b4  nchnmodulator::vfunc_18  (40 insns)
//   calls:   -> nVisNode::AttachChannels
// 0x1002e31e  nchnmodulator::vfunc_15  (108 insns)
//   calls:   -> nVisNode::Compute
//   strings: 'v_begin_i', 'v_set_iss', 'v_end_v', 'i_getnum_v', 'ss_get_i'
// 0x1002e46c  nchnmodulator::cmd_begin (v_begin_i)  (11 insns)
// 0x1002e490  nchnmodulator::cmd_set (v_set_iss)  (22 insns)
// 0x1002e4cd  nchnmodulator::cmd_end (v_end_v)  (3 insns)
// 0x1002e4d6  nchnmodulator::cmd_getnum (i_getnum_v)  (48 insns)
// 0x1002e562  nchnmodulator::vfunc_11  (98 insns)
//   calls:   -> nVisNode::SaveCmds

} // namespace re_nnebula
