#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/ncloudrender.asm
// Class: ncloudrender : public nanimnode  (sizeof = 0x5a0 = 1440 bytes)

#include <cstdint>

namespace re_nnature {

struct ncloudrender_Layout {
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
    // +0x0039
    uint8_t field_0x0039;
    // +0x003c
    float field_0x003c;
    // +0x0040
    uint32_t field_0x0040;
    // +0x0044
    float field_0x0044;
    // +0x0048
    float field_0x0048;
    // +0x004c
    float field_0x004c;
    // +0x0050
    float field_0x0050;
    // +0x0058
    uint32_t field_0x0058;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b8
    float field_0x00b8;
    // +0x00bc
    float field_0x00bc;
    // +0x00c0
    float field_0x00c0;
    // +0x00c4
    float field_0x00c4;
    // +0x00c8
    float field_0x00c8;
    // +0x00cc
    float field_0x00cc;
    // +0x00d0
    float field_0x00d0;
    // +0x00d4
    uint32_t field_0x00d4;
    // +0x00d8
    float field_0x00d8;
    // +0x00dc
    float field_0x00dc;
    // +0x00e0
    float field_0x00e0;
    // +0x00e4
    float field_0x00e4;
    // +0x00e8
    float field_0x00e8;
    // +0x00ec
    float field_0x00ec;
    // +0x00f0
    float field_0x00f0;
    // +0x00f4
    uint32_t field_0x00f4;
    // +0x00f8
    uint32_t field_0x00f8;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0480
    float field_0x0480;
    // +0x0488
    float field_0x0488;
    // +0x048c
    float field_0x048c;
    // +0x0490
    float field_0x0490;
    // +0x0494
    float field_0x0494;
    // +0x0498
    float field_0x0498;
    // +0x049c
    float field_0x049c;
    // +0x04ac
    uint32_t field_0x04ac;
    // +0x04c4
    uint32_t field_0x04c4;
    // +0x04d8
    uint32_t field_0x04d8;
    // +0x0504
    uint32_t field_0x0504;
    // +0x0524
    float field_0x0524;
    // +0x0528
    float field_0x0528;
    // +0x052c
    float field_0x052c;
    // +0x0530
    float field_0x0530;
    // +0x0534
    float field_0x0534;
    // +0x0538
    float field_0x0538;
    // +0x053c
    float field_0x053c;
    // +0x0540
    float field_0x0540;
    // +0x0544
    float field_0x0544;
    // +0x0548
    float field_0x0548;
    // +0x054c
    float field_0x054c;
    // +0x0550
    float field_0x0550;
    // +0x0554
    uint32_t field_0x0554;
    // +0x0558
    uint32_t field_0x0558;
    // +0x0568
    uint8_t field_0x0568;
    // +0x056c
    uint32_t field_0x056c;
    // +0x0570
    uint32_t field_0x0570;
    // +0x0574
    uint32_t field_0x0574;
    // +0x0578
    uint32_t field_0x0578;
    // +0x057c
    uint32_t field_0x057c;
    // +0x0580
    uint32_t field_0x0580;
    // +0x0584
    uint32_t field_0x0584;
    // +0x0588
    uint32_t field_0x0588;
    // +0x058c
    uint32_t field_0x058c;
    // +0x0590
    uint32_t field_0x0590;
    // +0x0594
    uint32_t field_0x0594;
    // +0x0598
    uint32_t field_0x0598;
    // +0x059c
    uint32_t field_0x059c;
};

// Methods (14):
// 0x10007ad7  ncloudrender::n_init_ncloudrender  (15 insns)
//   strings: 'nanimnode'
// 0x10007b02  ncloudrender::n_fini_ncloudrender  (5 insns)
// 0x10007b14  ncloudrender::n_new_ncloudrender  (10 insns)
// 0x10007b2e  ncloudrender::n_version_ncloudrender  (1761 insns)
//   calls:   -> nAnimNode::vfunc_14, -> nAnimNode::vfunc_15, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f32=0, f32=0.1, f32=1, f32=255
//   strings: 'unknown', '/sys/servers/gfx', 'ncloudrender_ibuf', 'Aborting.', 'c:/nomads/code/inc\\kernel/nref.h'
// 0x10009312  ncloudrender::cmd_setmeshnode (v_setmeshnode_s)  (11 insns)
// 0x1000933c  ncloudrender::cmd_getmeshnode (s_getmeshnode_v)  (13 insns)
// 0x10009365  ncloudrender::cmd_setdiffuse (v_setdiffuse_ffff)  (79 insns)
// 0x10009459  ncloudrender::cmd_setambient (v_setambient_ffff)  (79 insns)
// 0x1000954d  ncloudrender::cmd_setemissive (v_setemissive_ffff)  (79 insns)
// 0x10009641  ncloudrender::cmd_setabsorb (v_setabsorb_ffff)  (79 insns)
// 0x10009735  ncloudrender::cmd_setradius (v_setradius_f)  (10 insns)
// 0x1000975a  ncloudrender::cmd_getradius (f_getradius_v)  (11 insns)
// 0x10009784  ncloudrender::cmd_setalpha (v_setalpha_f)  (10 insns)
// 0x100097a9  ncloudrender::cmd_getalpha (f_getalpha_v)  (260 insns)
//   calls:   -> nAnimNode::vfunc_11

} // namespace re_nnature
