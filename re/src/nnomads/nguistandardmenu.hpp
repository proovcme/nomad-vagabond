#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nguistandardmenu.asm
// Class: nguistandardmenu : public nguimenu  (sizeof = 0xf0 = 240 bytes)

#include <cstdint>

namespace re_nnomads {

struct nguistandardmenu_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x008c
    uint32_t field_0x008c;
    // +0x00b8
    uint8_t field_0x00b8;
    // +0x013c
    uint8_t field_0x013c;
    // +0x0140
    uint8_t field_0x0140;
};

// Methods (11):
// 0x1005f097  nguistandardmenu::vfunc_15  (179 insns)
//   calls:   -> nRoot::GetHead
//   consts:  f32=1
//   strings: 'title', 'background', 'entries', 'nguimenuentry'
// 0x1005f2cc  nguistandardmenu::vfunc_16  (43 insns)
//   calls:   -> nRoot::GetHead, -> nRoot::GetPred
//   strings: 'entries', 'nguimenuentry'
// 0x1005f361  nguistandardmenu::vfunc_17  (59 insns)
//   calls:   -> nRoot::GetHead
//   strings: 'entries', 'nguimenuentry'
// 0x1005f665  nguistandardmenu::vfunc_20  (83 insns)
//   calls:   -> nRoot::GetHead
//   strings: 'entries', 'nguimenuentry', 'submenu', 'background', 'title'
// 0x1005f7f7  nguistandardmenu::vfunc_26  (2 insns)
//   calls:   -> nGuiMenuEntry::HasCommand
// 0x1005f802  nguistandardmenu::vfunc_23  (2 insns)
//   calls:   -> nGuiMenuEntry::Execute
// 0x1006193f  nguistandardmenu::n_init_nguistandardmenu  (10 insns)
//   strings: 'nguimenu'
// 0x10061960  nguistandardmenu::n_fini_nguistandardmenu  (5 insns)
// 0x10061972  nguistandardmenu::n_new_nguistandardmenu  (16 insns)
// 0x10061999  nguistandardmenu::vfunc_00  (12 insns)
// 0x100619bb  nguistandardmenu::vfunc_27  (76 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: 'cursor', 'n3dnode', 'cursor/mesh', 'nmeshnode', 'data:if_menu.n/plane_1x1.nvx', 'cursor/tex', 'ntexarraynode', 'data:if_menu.n/%s'

} // namespace re_nnomads
