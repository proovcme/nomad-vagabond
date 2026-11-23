#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nGuiStandardMenuEntry.asm
// Class: nGuiStandardMenuEntry : public nguimenuentry  (sizeof = 0xd8 = 216 bytes)

#include <cstdint>

namespace re_nnomads {

struct nGuiStandardMenuEntry_Layout {
    // +0x001c
    uint32_t field_0x001c;
    // +0x00d0
    uint32_t field_0x00d0;
    // +0x00d4
    uint32_t field_0x00d4;
    // +0x0114
    uint32_t field_0x0114;
    // +0x013c
    uint8_t field_0x013c;
    // +0x0140
    uint8_t field_0x0140;
};

// Methods (19):
// 0x1000e53a  nGuiStandardMenuEntry::cmd_getmeshname (s_getmeshname_v)  (15 insns)
// 0x1005db7e  nGuiStandardMenuEntry::n_init_nguistandardmenuentry  (15 insns)
//   strings: 'nguimenuentry'
// 0x1005dba9  nGuiStandardMenuEntry::n_fini_nguistandardmenuentry  (5 insns)
// 0x1005dbbb  nGuiStandardMenuEntry::n_new_nguistandardmenuentry  (10 insns)
//   calls:   -> nGuiStandardMenuEntry::nGuiStandardMenuEntry()
// 0x1005dbd5  nGuiStandardMenuEntry::nGuiStandardMenuEntry()  (52 insns)
//   calls:   -> nGuiMenuEntry::nGuiMenuEntry(), IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
//   strings: 'plane_1x1.nvx', 'if_standard'
// 0x1005dc69  nGuiStandardMenuEntry::~nGuiStandardMenuEntry()  (28 insns)
//   calls:   IAT: nkernel.dll!n_free, -> nGuiMenuEntry::~nGuiMenuEntry()
// 0x1005dcaf  nGuiStandardMenuEntry::Exists  (19 insns)
//   strings: 'entry'
// 0x1005dce0  nGuiStandardMenuEntry::Make  (90 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: 'entry', 'n3dnode', 'entry/mesh', 'nmeshnode', 'data:if_menu.n/%s', 'entry/tex', 'ntexarraynode', 'locale:if_%s.bmp'
// 0x1005de05  nGuiStandardMenuEntry::Render  (55 insns)
//   calls:   -> nGuiMenuEntry::Render
//   strings: 'entry'
// 0x1005dea5  nGuiStandardMenuEntry::SetMeshName  (19 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1005dee6  nGuiStandardMenuEntry::GetMeshName  (13 insns)
// 0x1005df06  nGuiStandardMenuEntry::SetShaderName  (19 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1005df47  nGuiStandardMenuEntry::GetShaderName  (30 insns)
// 0x1005df92  nGuiStandardMenuEntry::nGuiStandardMenuEntry()  (21 insns)
//   calls:   -> nGuiMenuEntry::nGuiMenuEntry()
// 0x1005dfdf  nGuiStandardMenuEntry::operator=  (39 insns)
//   calls:   -> nGuiMenuEntry::operator=, IAT: nkernel.dll!n_free
// 0x1005e048  nGuiStandardMenuEntry::vfunc_00  (41 insns)
//   calls:   -> nGuiStandardMenuEntry::~nGuiStandardMenuEntry()
// 0x1005e2e1  nGuiStandardMenuEntry::cmd_setmeshname (v_setmeshname_s)  (11 insns)
// 0x1005e305  nGuiStandardMenuEntry::cmd_setshadername (v_setshadername_s)  (11 insns)
// 0x1005e329  nGuiStandardMenuEntry::cmd_getshadername (s_getshadername_v)  (15 insns)

} // namespace re_nnomads
