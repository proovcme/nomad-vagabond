#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ntaskmanager.asm
// Class: ntaskmanager : public nservice  (sizeof = 0x65c = 1628 bytes)

#include <cstdint>

namespace re_nnomads {

struct ntaskmanager_Layout {
    // +0x0058
    uint32_t field_0x0058;
};

// Script AddCmds (1):
//   m_tasks/ntaskmanager_main.cc

// Methods (6):
// 0x1006503b  ntaskmanager::n_init_ntaskmanager  (10 insns)
//   strings: 'nservice'
// 0x1006505c  ntaskmanager::n_fini_ntaskmanager  (5 insns)
// 0x1006506e  ntaskmanager::n_new_ntaskmanager  (70 insns)
//   strings: '/commandlists/vehicle/goto', '/commandlists/airplane/gotogarage'
// 0x10065118  ntaskmanager::vfunc_00  (14 insns)
// 0x10065191  ntaskmanager::vfunc_20  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Handletask: must be implement by subclasses', 'm_tasks/ntaskmanager_main.cc'
// 0x100651b1  ntaskmanager::vfunc_19  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'DoPathSelection: must be implement by subclasses', 'm_tasks/ntaskmanager_main.cc'

} // namespace re_nnomads
