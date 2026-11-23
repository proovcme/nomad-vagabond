#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nconserver.asm
// Class: nconserver : public nroot  (sizeof = 0x10bc = 4284 bytes)

#include <cstdint>

namespace re_nnebula {

struct nconserver_Layout {
    // +0x0004
    uint8_t field_0x0004;
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
    uint32_t field_0x001c;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint8_t field_0x005c;
    // +0x0068
    uint32_t field_0x0068;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0080
    uint32_t field_0x0080;
    // +0x008c
    uint32_t field_0x008c;
    // +0x0090
    uint8_t field_0x0090;
    // +0x0091
    uint8_t field_0x0091;
    // +0x0094
    uint32_t field_0x0094;
    // +0x0098
    uint32_t field_0x0098;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x0c04
    uint32_t field_0x0c04;
    // +0x0c08
    uint32_t field_0x0c08;
    // +0x0cb0
    uint32_t field_0x0cb0;
    // +0x0cb4
    uint8_t field_0x0cb4;
    // +0x0cb5
    uint8_t field_0x0cb5;
    // +0x0cb8
    uint32_t field_0x0cb8;
};

// Script AddCmds (5):
//   b_open_v
//   b_close_v
//   v_toggle_v
//   v_watch_s
//   v_unwatch_v

// Methods (22):
// 0x1000a007  nconserver::cmd_open (b_open_v)  (14 insns)
// 0x100164d9  nconserver::n_init_nconserver  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nroot', 'misc/ncsrv_init.cc'
// 0x10016534  nconserver::n_fini_nconserver  (14 insns)
// 0x10016557  nconserver::n_new_nconserver  (10 insns)
// 0x10016571  nconserver::n_version_nconserver  (80 insns)
//   calls:   IAT: nkernel.dll!nn_malloc
//   strings: '/sys/servers/input', '/sys/servers/gfx', '/sys/servers/script', 'nenv', 'misc/ncsrv_main.cc'
// 0x1001669f  nconserver::vfunc_00  (51 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x10016724  nconserver::vfunc_16  (11 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10016748  nconserver::vfunc_17  (11 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x1001676c  nconserver::vfunc_18  (5 insns)
// 0x1001677d  nconserver::vfunc_19  (8 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2
// 0x100167a0  nconserver::vfunc_20  (307 insns)
//   calls:   -> nRoot::GetHead, IAT: nkernel.dll!n_strmatch, IAT: MSVCRT.dll!sprintf
//   strings: '/sys/var'
// 0x10016af6  nconserver::vfunc_15  (69 insns)
//   consts:  f32=-1
// 0x10016bb6  nconserver::vfunc_21  (420 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10017054  nconserver::vfunc_22  (22 insns)
// 0x1001708f  nconserver::vfunc_25  (2 insns)
// 0x10017097  nconserver::vfunc_23  (58 insns)
// 0x1001712a  nconserver::vfunc_24  (60 insns)
// 0x100171c6  nconserver::vfunc_14  (206 insns)
//   calls:   -> nInputServer::FirstEvent, -> nInputServer::NextEvent, IAT: nkernel.dll!nn_calloc, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'c:/nomads/code/inc\\kernel/nlinebuffer.h', 'Out Of Mem!', 'b_open_v', 'b_close_v', 'v_toggle_v', 'v_watch_s', 'v_unwatch_v'
// 0x100173fc  nconserver::cmd_toggle (v_toggle_v)  (3 insns)
// 0x10017405  nconserver::cmd_watch (v_watch_s)  (11 insns)
// 0x100343e0  nconserver::cmd_unwatch (v_unwatch_v)  (3 insns)
// 0x10034489  nconserver::cmd_close (b_close_v)  (14 insns)

} // namespace re_nnebula
