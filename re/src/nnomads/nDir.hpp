#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nDir.asm
// Class: nDir

#include <cstdint>

namespace re_nnomads {

struct nDir_Layout {
    // +0x0204
    uint32_t field_0x0204;
};

// Methods (34):
// 0x1000bcd4  nDir::nDir()  (19 insns)
// 0x1000bd11  nDir::operator=  (28 insns)
// 0x1000bd5a  nDir::vfunc_00  (41 insns)
// 0x1000bdeb  nDir::vfunc_05  (40 insns)
// 0x1000bf9b  nDir::vfunc_15  (41 insns)
// 0x1000c0aa  nDir::vfunc_24  (41 insns)
// 0x10079546  nDir::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nDir::IsSubDir
// 0x1007954c  nDir::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nDir::Rewind
// 0x10079552  nDir::vfunc_02  (1 insns)
//   calls:   IAT: nkernel.dll!nDir::Read
// 0x10079558  nDir::vfunc_01  (2 insns)
//   calls:   IAT: nkernel.dll!nDir::Open, IAT: nkernel.dll!nDir::~nDir()
// 0x10079564  nDir::vfunc_14  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::IsOpen
// 0x1007956a  nDir::vfunc_13  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::GetS
// 0x10079570  nDir::vfunc_12  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::PutS
// 0x10079576  nDir::vfunc_11  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Seek
// 0x1007957c  nDir::vfunc_10  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Tell
// 0x10079582  nDir::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Read
// 0x10079588  nDir::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Write
// 0x1007958e  nDir::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Close
// 0x10079594  nDir::vfunc_06  (2 insns)
//   calls:   IAT: nkernel.dll!nFile::Open, IAT: nkernel.dll!nFile::~nFile()
// 0x100795a0  nDir::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::GetEntryType
// 0x100795a6  nDir::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::GetEntryName
// 0x100795ac  nDir::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::SetToNextEntry
// 0x100795b2  nDir::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::SetToFirstEntry
// 0x100795b8  nDir::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::IsEmpty
// 0x100795be  nDir::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::Close
// 0x100795c4  nDir::vfunc_16  (2 insns)
//   calls:   IAT: nkernel.dll!nDirectory::Open, IAT: nkernel.dll!nDirectory::~nDirectory()
// 0x100795d0  nDir::vfunc_45  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::NewFileObject
// 0x100795d6  nDir::vfunc_44  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::NewDirectoryObject
// 0x100795dc  nDir::vfunc_43  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::GetCwd
// 0x100795e2  nDir::vfunc_42  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::ChangeDir
// 0x100795e8  nDir::vfunc_41  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::MakeAbsolute
// 0x100795ee  nDir::vfunc_40  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::ManglePath
// 0x100795f4  nDir::vfunc_39  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::GetAssign
// 0x100795fa  nDir::vfunc_38  (5 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::SetAssign, IAT: nkernel.dll!nFileServer2::~nFileServer2(), IAT: nkernel.dll!nRoot::SetFlags, IAT: nkernel.dll!nHardRefServer::RegisterTargetObject, IAT: nkernel.dll!nRoot::Find

} // namespace re_nnomads
