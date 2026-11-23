#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nFile.asm
// Class: nFile

#include <cstdint>

namespace re_nnature {

struct nFile_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
};

// Methods (8):
// 0x10004d9b  nFile::nFile()  (8 insns)
// 0x10004db6  nFile::operator=  (7 insns)
// 0x10004e25  nFile::PutFloat  (6 insns)
// 0x10004e34  nFile::PutShort  (6 insns)
// 0x10004e43  nFile::PutChar  (6 insns)
// 0x10004e52  nFile::GetShort  (5 insns)
// 0x10004e60  nFile::GetChar  (5 insns)
// 0x10004e6e  nFile::GetFloat  (5 insns)

} // namespace re_nnature
