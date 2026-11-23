#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nartefacttransformer.asm
// Class: nartefacttransformer : public nhouse  (sizeof = 0xf68 = 3944 bytes)

#include <cstdint>

namespace re_nnomads {

struct nartefacttransformer_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x0114
    uint32_t field_0x0114;
    // +0x06e4
    float field_0x06e4;
    // +0x06e8
    float field_0x06e8;
    // +0x06ec
    float field_0x06ec;
    // +0x06f0
    uint8_t field_0x06f0;
    // +0x0f30
    uint8_t field_0x0f30;
    // +0x0f34
    float field_0x0f34;
    // +0x0f60
    uint8_t field_0x0f60;
};

// Script AddCmds (6):
//   c_house/nartefacttransformer_head.cc
//   v_setdownanim_b
//   b_isdownanim_v
//   v_setstackbase_fff
//   v_setsuccessfx_s
//   s_getsuccessfx_v

// Methods (12):
// 0x10030843  nartefacttransformer::vfunc_00  (248 insns)
//   calls:   -> nHouse::~nHouse(), -> nRoot::GetHead, IAT: MSVCRT.dll!strtok
//   strings: '/datatoc', 'transform'
// 0x10030adf  nartefacttransformer::vfunc_18  (31 insns)
//   calls:   -> nHouse::UpdateChannels
// 0x10030b36  nartefacttransformer::n_init_nartefacttransformer  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nhouse', 'cannot initialize artefacttransformer class', 'c_house/nartefacttransformer_head.cc'
// 0x10030b91  nartefacttransformer::n_fini_nartefacttransformer  (14 insns)
// 0x10030bb4  nartefacttransformer::n_new_nartefacttransformer  (10 insns)
// 0x10030bce  nartefacttransformer::n_version_nartefacttransformer  (40 insns)
//   strings: 'v_setdownanim_b', 'b_isdownanim_v', 'v_setstackbase_fff', 'fff_getstackbase_v', 'v_setsuccessfx_s', 's_getsuccessfx_v'
// 0x10030c6d  nartefacttransformer::cmd_setdownanim (v_setdownanim_b)  (12 insns)
// 0x10030c94  nartefacttransformer::cmd_isdownanim (b_isdownanim_v)  (14 insns)
// 0x10030cc2  nartefacttransformer::cmd_setstackbase (v_setstackbase_fff)  (67 insns)
// 0x10030d86  nartefacttransformer::cmd_setsuccessfx (v_setsuccessfx_s)  (11 insns)
// 0x10030dad  nartefacttransformer::cmd_getsuccessfx (s_getsuccessfx_v)  (15 insns)
// 0x10030dda  nartefacttransformer::vfunc_11  (109 insns)
//   calls:   -> nHouse::SaveCmds

} // namespace re_nnomads
