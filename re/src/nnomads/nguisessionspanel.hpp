#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nguisessionspanel.asm
// Class: nguisessionspanel : public nguipanel  (sizeof = 0x148 = 328 bytes)

#include <cstdint>

namespace re_nnomads {

struct nguisessionspanel_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x001c
    uint32_t field_0x001c;
};

// Methods (5):
// 0x10062524  nguisessionspanel::n_init_nguisessionspanel  (10 insns)
//   strings: 'nguipanel'
// 0x10062545  nguisessionspanel::n_fini_nguisessionspanel  (5 insns)
// 0x10062557  nguisessionspanel::n_new_nguisessionspanel  (16 insns)
// 0x1006257e  nguisessionspanel::vfunc_00  (12 insns)
// 0x100625a0  nguisessionspanel::vfunc_20  (76 insns)
//   calls:   -> nRoot::GetHead, IAT: MSVCRT.dll!atoi, -> nguipanel::vfunc_20
//   strings: 'entries', 'nroot', '/sys/share/sessions', 'nguisessionentry'

} // namespace re_nnomads
