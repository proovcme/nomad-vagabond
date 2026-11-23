#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nFile.asm
// Class: nFile

#include <cstdint>

namespace re_nparticle {

struct nFile_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
};

// Methods (8):
// 0x1000607c  nFile::nFile()  (8 insns)
// 0x10006097  nFile::operator=  (7 insns)
// 0x10006106  nFile::PutShort  (6 insns)
// 0x10006115  nFile::PutChar  (6 insns)
// 0x10006124  nFile::PutFloat  (6 insns)
// 0x10006133  nFile::GetShort  (5 insns)
// 0x10006141  nFile::GetChar  (5 insns)
// 0x1000614f  nFile::GetFloat  (5 insns)

} // namespace re_nparticle
