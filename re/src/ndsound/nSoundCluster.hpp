#pragma once
// Auto-lifted C++ layout & method spec from ndsound.dll
// Source ASM: re/disasm/ndsound/nSoundCluster.asm
// Class: nSoundCluster

#include <cstdint>

namespace re_ndsound {

struct nSoundCluster_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint8_t field_0x0010;
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
    uint32_t field_0x003c;
    // +0x0040
    uint32_t field_0x0040;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    float field_0x0048;
    // +0x004c
    float field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint8_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
};

// Methods (1):
// 0x100022b7  nSoundCluster::operator=  (1422 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   consts:  f32=10000, f32=-10000, f32=0
//   strings: 'DSERR_NOAGGREGATION', 'DSERR_GENERIC', 'DSERR_NOINTERFACE', 'DSERR_UNSUPPORTED', 'DSERR_ACCESSDENIED', 'DSERR_CONTROLUNAVAIL', 'DSERR_ALLOCATED', 'DSERR_INVALIDPARAM'

} // namespace re_ndsound
