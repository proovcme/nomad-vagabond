#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nnpkfileserver.asm
// Class: nnpkfileserver : public nfileserver2  (sizeof = 0x78 = 120 bytes)

#include <cstdint>

namespace re_nnebula {

struct nnpkfileserver_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0018
    uint32_t field_0x0018;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0038
    uint32_t field_0x0038;
    // +0x003c
    uint8_t field_0x003c;
    // +0x0064
    uint32_t field_0x0064;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0070
    uint8_t field_0x0070;
    // +0x0074
    uint32_t field_0x0074;
};

// Methods (10):
// 0x100058de  nnpkfileserver::n_init_nnpkfileserver  (15 insns)
//   strings: 'nfileserver2'
// 0x10005909  nnpkfileserver::n_fini_nnpkfileserver  (5 insns)
// 0x1000591b  nnpkfileserver::n_new_nnpkfileserver  (25 insns)
// 0x10005959  nnpkfileserver::vfunc_00  (41 insns)
//   calls:   -> nNpkFileWrapper::~nNpkFileWrapper(), IAT: nkernel.dll!n_free
// 0x100059be  nnpkfileserver::vfunc_21  (15 insns)
// 0x100059db  nnpkfileserver::vfunc_20  (52 insns)
//   calls:   IAT: MSVCRT.dll!strrchr
// 0x10005a48  nnpkfileserver::vfunc_22  (164 insns)
//   calls:   IAT: MSVCRT.dll!strrchr, IAT: nkernel.dll!n_printf, -> nNpkFileWrapper::nNpkFileWrapper(), -> nNpkFileWrapper::Open, -> nNpkFileWrapper::GetTocObject, -> nNpkFileWrapper::~nNpkFileWrapper()
// 0x10005be8  nnpkfileserver::vfunc_18  (62 insns)
//   calls:   -> nDirectory::vfunc_27, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x10005c8f  nnpkfileserver::vfunc_19  (360 insns)
//   calls:   -> nDirectory::vfunc_28, -> nNpkFileWrapper::GetTocObject, IAT: nkernel.dll!n_printf, IAT: nkernel.dll!n_strncpy2, IAT: MSVCRT.dll!strtok, IAT: MSVCRT.dll!strncmp
//   strings: '/\\', '..'
// 0x10006192  nnpkfileserver::cmd_parsefile (i_parsefile_s)  (24 insns)

} // namespace re_nnebula
