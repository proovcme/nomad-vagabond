#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ncookiehandler.asm
// Class: ncookiehandler : public nroot  (sizeof = 0x54 = 84 bytes)

#include <cstdint>

namespace re_nnomads {

struct ncookiehandler_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
};

// Script AddCmds (7):
//   __temporary__
//   v_setcookie_ss
//   s_getcookie_s
//   b_cookieexists_s
//   v_clearcookie_s
//   v_clearcookies_v
//   v_marktemporary_s

// Methods (10):
// 0x10058bbe  ncookiehandler::n_init_ncookiehandler  (15 insns)
//   strings: 'nroot'
// 0x10058be9  ncookiehandler::n_fini_ncookiehandler  (5 insns)
// 0x10058bfb  ncookiehandler::n_new_ncookiehandler  (33 insns)
//   strings: '/game/cookies', 'nroot'
// 0x10058c53  ncookiehandler::vfunc_00  (220 insns)
//   calls:   -> nRoot::GetHead
//   strings: 'nenv', '__temporary__', 'nroot', '/game/cookies', 'v_setcookie_ss', 's_getcookie_s', 'b_cookieexists_s', 'v_clearcookie_s'
// 0x10058eea  ncookiehandler::cmd_setcookie (v_setcookie_ss)  (16 insns)
// 0x10058f17  ncookiehandler::cmd_getcookie (s_getcookie_s)  (23 insns)
// 0x10058f59  ncookiehandler::cmd_cookieexists (b_cookieexists_s)  (22 insns)
// 0x10058f9c  ncookiehandler::cmd_clearcookie (v_clearcookie_s)  (10 insns)
// 0x10058fbf  ncookiehandler::cmd_marktemporary (v_marktemporary_s)  (10 insns)
// 0x10058fe2  ncookiehandler::cmd_clearcookies (v_clearcookies_v)  (2 insns)

} // namespace re_nnomads
