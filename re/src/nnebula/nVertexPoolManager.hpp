#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nVertexPoolManager.asm
// Class: nVertexPoolManager

#include <cstdint>

namespace re_nnebula {

struct nVertexPoolManager_Layout {
    // +0x0004
    uint32_t field_0x0004;
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
    // +0x001c
    uint8_t field_0x001c;
    // +0x001d
    uint8_t field_0x001d;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x003c
    uint32_t field_0x003c;
    // +0x01e0
    uint32_t field_0x01e0;
    // +0x01e4
    uint32_t field_0x01e4;
    // +0x01e8
    uint32_t field_0x01e8;
};

// Script AddCmds (10):
//   v_beginflares_i
//   v_setbasecolor_ffff
//   v_setblindcolor_ffff
//   v_setflaresizeat_if
//   v_setflareposat_if
//   v_setflarecolorat_iffff
//   v_endflares_v
//   i_getnumberofflares_v
//   f_getflaresizeat_i
//   f_getflareposat_i

// Methods (7):
// 0x10006dc1  nVertexPoolManager::nVertexPoolManager()  (97 insns)
// 0x10006ea6  nVertexPoolManager::operator=  (11 insns)
// 0x1000b9a6  nVertexPoolManager::~nVertexPoolManager()  (136 insns)
// 0x1000bad8  nVertexPoolManager::map_vtype_2_list  (162 insns)
// 0x1000bd09  nVertexPoolManager::NewVertexBubble  (75 insns)
//   calls:   -> nVertexPoolManager::map_vtype_2_list
// 0x1000bdc1  nVertexPoolManager::ReleaseVertexBubble  (52 insns)
//   strings: '/sys/servers/file2'
// 0x1002f967  nVertexPoolManager::GetPreferedPoolSize  (85 insns)
//   strings: 'v_beginflares_i', 'v_setbasecolor_ffff', 'v_setblindcolor_ffff', 'v_setflaresizeat_if', 'v_setflareposat_if', 'v_setflarecolorat_iffff', 'v_endflares_v', 'i_getnumberofflares_v'

} // namespace re_nnebula
