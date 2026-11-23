#pragma once
// Auto-lifted C++ layout & method spec from nkernel.dll
// Source ASM: re/disasm/nkernel/nArguments.asm
// Class: nArguments

#include <cstdint>

namespace re_nkernel {

struct nArguments_Layout {
    // +0x0004
    uint32_t field_0x0004;
};

// Methods (6):
// 0x10008772  nArguments::nArguments()  (115 insns)
//   calls:   IAT: MSVCRT.dll!strtok
// 0x10008882  nArguments::nArguments()  (76 insns)
// 0x10008935  nArguments::operator=  (7 insns)
// 0x10008948  nArguments::~nArguments()  (22 insns)
// 0x10008974  nArguments::ArgumentCount  (2 insns)
// 0x10008978  nArguments::Argument  (4 insns)

} // namespace re_nkernel
