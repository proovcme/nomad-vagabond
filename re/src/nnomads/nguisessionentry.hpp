#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nguisessionentry.asm
// Class: nguisessionentry : public nguistandardmenuentry  (sizeof = 0xdc = 220 bytes)

#include <cstdint>

namespace re_nnomads {

struct nguisessionentry_Layout {
    // +0x001c
    uint32_t field_0x001c;
    // +0x00d8
    uint32_t field_0x00d8;
    // +0x013c
    uint8_t field_0x013c;
    // +0x0140
    uint8_t field_0x0140;
};

// Methods (7):
// 0x1006266a  nguisessionentry::n_init_nguisessionentry  (10 insns)
//   strings: 'nguistandardmenuentry'
// 0x1006268b  nguisessionentry::n_fini_nguisessionentry  (5 insns)
// 0x1006269d  nguisessionentry::n_new_nguisessionentry  (24 insns)
//   calls:   -> nGuiStandardMenuEntry::nGuiStandardMenuEntry(), -> nGuiStandardMenuEntry::SetMeshName, -> nGuiStandardMenuEntry::SetShaderName
//   strings: 'plane_1x1.nvx', 'if_standard'
// 0x100626e8  nguisessionentry::vfunc_00  (12 insns)
//   calls:   -> nGuiStandardMenuEntry::~nGuiStandardMenuEntry()
// 0x1006270a  nguisessionentry::vfunc_26  (3 insns)
// 0x10062717  nguisessionentry::vfunc_27  (2 insns)
// 0x1006271e  nguisessionentry::vfunc_20  (163 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: 'entry', 'n3dnode', 'entry/mesh', 'nmeshnode', 'data:if_menu.n/%s', '/sys/share/sessions/%s/name', 'home:mplevels/%s.bmp', 'home:mplevels/empty.bmp'

} // namespace re_nnomads
