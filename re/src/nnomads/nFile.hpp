#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nFile.asm
// Class: nFile

#include <cstdint>

namespace re_nnomads {

struct nFile_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
};

// Methods (8):
// 0x1000bdbb  nFile::nFile()  (8 insns)
// 0x1000bdd6  nFile::operator=  (7 insns)
// 0x1000be45  nFile::PutShort  (6 insns)
// 0x1000be54  nFile::PutChar  (6 insns)
// 0x1000be63  nFile::PutFloat  (6 insns)
// 0x1000be72  nFile::GetFloat  (5 insns)
// 0x1000be80  nFile::GetShort  (5 insns)
// 0x1000be8e  nFile::GetChar  (5 insns)

} // namespace re_nnomads
