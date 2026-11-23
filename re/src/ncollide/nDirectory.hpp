#pragma once
// Auto-lifted C++ layout & method spec from ncollide.dll
// Source ASM: re/disasm/ncollide/nDirectory.asm
// Class: nDirectory

#include <cstdint>

namespace re_ncollide {

struct nDirectory_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x0208
    uint8_t field_0x0208;
    // +0x020c
    uint32_t field_0x020c;
    // +0x0410
    uint32_t field_0x0410;
};

// Methods (21):
// 0x10002d17  nDirectory::nDirectory()  (29 insns)
// 0x10002d85  nDirectory::operator=  (48 insns)
// 0x10002e16  nDirectory::vfunc_00  (41 insns)
// 0x10002e77  nDirectory::IsOpen  (3 insns)
// 0x10002e7f  nDirectory::GetPathName  (2 insns)
// 0x10002f5c  nDirectory::vfunc_09  (57 insns)
// 0x100073f6  nDirectory::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::GetEntryType
// 0x100073fc  nDirectory::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::GetEntryName
// 0x10007402  nDirectory::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::SetToNextEntry
// 0x10007408  nDirectory::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::SetToFirstEntry
// 0x1000740e  nDirectory::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::IsEmpty
// 0x10007414  nDirectory::vfunc_02  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::Close
// 0x1000741a  nDirectory::vfunc_01  (2 insns)
//   calls:   IAT: nkernel.dll!nDirectory::Open, IAT: nkernel.dll!nDirectory::~nDirectory()
// 0x10007426  nDirectory::vfunc_30  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::NewFileObject
// 0x1000742c  nDirectory::vfunc_29  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::NewDirectoryObject
// 0x10007432  nDirectory::vfunc_28  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::GetCwd
// 0x10007438  nDirectory::vfunc_27  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::ChangeDir
// 0x1000743e  nDirectory::vfunc_26  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::MakeAbsolute
// 0x10007444  nDirectory::vfunc_25  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::ManglePath
// 0x1000744a  nDirectory::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::GetAssign
// 0x10007450  nDirectory::vfunc_23  (2 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::SetAssign, IAT: nkernel.dll!nFileServer2::~nFileServer2()

} // namespace re_ncollide
