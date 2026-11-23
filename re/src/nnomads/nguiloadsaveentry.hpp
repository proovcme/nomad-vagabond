#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nguiloadsaveentry.asm
// Class: nguiloadsaveentry : public nguistandardmenuentry  (sizeof = 0xf4 = 244 bytes)

#include <cstdint>

namespace re_nnomads {

struct nguiloadsaveentry_Layout {
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
    // +0x001c
    uint32_t field_0x001c;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00f0
    uint32_t field_0x00f0;
    // +0x013c
    uint8_t field_0x013c;
    // +0x0140
    uint8_t field_0x0140;
};

// Methods (7):
// 0x1005e9a3  nguiloadsaveentry::n_init_nguiloadsaveentry  (10 insns)
//   strings: 'nguistandardmenuentry'
// 0x1005e9c4  nguiloadsaveentry::n_fini_nguiloadsaveentry  (5 insns)
// 0x1005e9d6  nguiloadsaveentry::n_new_nguiloadsaveentry  (38 insns)
//   calls:   -> nGuiStandardMenuEntry::nGuiStandardMenuEntry(), -> nGuiStandardMenuEntry::SetMeshName, -> nGuiStandardMenuEntry::SetShaderName
//   strings: 'plane_1x1.nvx', '/sys/servers/file2', 'if_standard'
// 0x1005ea4e  nguiloadsaveentry::vfunc_00  (34 insns)
//   calls:   IAT: nkernel.dll!n_free, -> nGuiStandardMenuEntry::~nGuiStandardMenuEntry()
// 0x1005eaab  nguiloadsaveentry::vfunc_26  (19 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1005eaec  nguiloadsaveentry::vfunc_27  (13 insns)
// 0x1005eb0c  nguiloadsaveentry::vfunc_20  (121 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: 'entry', 'n3dnode', 'entry/mesh', 'nmeshnode', 'data:if_menu.n/%s', 'entry/tex', 'ntexarraynode', '%s%s.bmp'

} // namespace re_nnomads
