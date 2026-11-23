#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nchnsplitter.asm
// Class: nchnsplitter : public nanimnode  (sizeof = 0xc4 = 196 bytes)

#include <cstdint>

namespace re_nnebula {

struct nchnsplitter_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    float field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00bc
    uint32_t field_0x00bc;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (5):
//   v_addkey_fs
//   v_beginkeys_i
//   v_setkey_ifs
//   v_endkeys_v
//   i_getkeyinfo_v

// Methods (18):
// 0x1002d991  nchnsplitter::n_init_nchnsplitter  (15 insns)
//   strings: 'nanimnode'
// 0x1002d9bc  nchnsplitter::n_fini_nchnsplitter  (5 insns)
// 0x1002d9ce  nchnsplitter::n_new_nchnsplitter  (10 insns)
// 0x1002d9e8  nchnsplitter::n_version_nchnsplitter  (13 insns)
//   calls:   -> nAnimNode::nAnimNode()
// 0x1002da14  nchnsplitter::vfunc_00  (85 insns)
//   calls:   -> nAnimNode::~nAnimNode()
// 0x1002db04  nchnsplitter::vfunc_21  (21 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2, -> nVisNode::NotifyChannelSetDirty
// 0x1002db3d  nchnsplitter::vfunc_22  (19 insns)
// 0x1002db7c  nchnsplitter::vfunc_23  (26 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2, IAT: nkernel.dll!n_printf
// 0x1002dbca  nchnsplitter::vfunc_25  (4 insns)
// 0x1002dbd9  nchnsplitter::vfunc_26  (27 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x1002dc23  nchnsplitter::vfunc_18  (33 insns)
//   calls:   -> nAnimNode::AttachChannels
// 0x1002dc78  nchnsplitter::vfunc_15  (203 insns)
//   calls:   -> nVisNode::Compute, IAT: MSVCRT.dll!floor, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f64=0, f32=0.0001, f32=0
//   strings: 'node/nchnsplitter_main.cc', 'v_addkey_fs', 'v_beginkeys_i', 'v_setkey_ifs', 'v_endkeys_v', 'i_getkeyinfo_v', 'fs_getkey_i'
// 0x1002deec  nchnsplitter::cmd_addkey (v_addkey_fs)  (15 insns)
// 0x1002df1c  nchnsplitter::cmd_beginkeys (v_beginkeys_i)  (11 insns)
// 0x1002df40  nchnsplitter::cmd_setkey (v_setkey_ifs)  (21 insns)
// 0x1002df7e  nchnsplitter::cmd_endkeys (v_endkeys_v)  (3 insns)
// 0x1002df87  nchnsplitter::cmd_getkeyinfo (i_getkeyinfo_v)  (53 insns)
// 0x1002e01e  nchnsplitter::vfunc_11  (98 insns)
//   calls:   -> nAnimNode::SaveCmds

} // namespace re_nnebula
