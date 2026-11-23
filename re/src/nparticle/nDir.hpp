#pragma once
// Auto-lifted C++ layout & method spec from nparticle.dll
// Source ASM: re/disasm/nparticle/nDir.asm
// Class: nDir

#include <cstdint>

namespace re_nparticle {

struct nDir_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0204
    uint32_t field_0x0204;
};

// Script AddCmds (2):
//   v_setmeshnode_s
//   s_getmeshnode_v

// Methods (39):
// 0x10005f95  nDir::nDir()  (19 insns)
// 0x10005fd2  nDir::operator=  (28 insns)
// 0x1000601b  nDir::vfunc_00  (41 insns)
// 0x100060ac  nDir::vfunc_05  (40 insns)
// 0x1000625c  nDir::vfunc_15  (41 insns)
// 0x1000636b  nDir::vfunc_24  (41 insns)
// 0x100064f6  nDir::vfunc_46  (110 insns)
//   calls:   IAT: nkernel.dll!n_free
//   strings: 'v_setmeshnode_s', 's_getmeshnode_v'
// 0x10009710  nDir::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nDir::IsSubDir
// 0x10009716  nDir::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nDir::Rewind
// 0x1000971c  nDir::vfunc_02  (1 insns)
//   calls:   IAT: nkernel.dll!nDir::Read
// 0x10009722  nDir::vfunc_01  (2 insns)
//   calls:   IAT: nkernel.dll!nDir::Open, IAT: nkernel.dll!nDir::~nDir()
// 0x1000972e  nDir::vfunc_14  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::IsOpen
// 0x10009734  nDir::vfunc_13  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::GetS
// 0x1000973a  nDir::vfunc_12  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::PutS
// 0x10009740  nDir::vfunc_11  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Seek
// 0x10009746  nDir::vfunc_10  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Tell
// 0x1000974c  nDir::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Read
// 0x10009752  nDir::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Write
// 0x10009758  nDir::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Close
// 0x1000975e  nDir::vfunc_06  (2 insns)
//   calls:   IAT: nkernel.dll!nFile::Open, IAT: nkernel.dll!nFile::~nFile()
// 0x1000976a  nDir::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::GetEntryType
// 0x10009770  nDir::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::GetEntryName
// 0x10009776  nDir::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::SetToNextEntry
// 0x1000977c  nDir::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::SetToFirstEntry
// 0x10009782  nDir::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::IsEmpty
// 0x10009788  nDir::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::Close
// 0x1000978e  nDir::vfunc_16  (2 insns)
//   calls:   IAT: nkernel.dll!nDirectory::Open, IAT: nkernel.dll!nDirectory::~nDirectory()
// 0x1000979a  nDir::vfunc_45  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::NewFileObject
// 0x100097a0  nDir::vfunc_44  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::NewDirectoryObject
// 0x100097a6  nDir::vfunc_43  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::GetCwd
// 0x100097ac  nDir::vfunc_42  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::ChangeDir
// 0x100097b2  nDir::vfunc_41  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::MakeAbsolute
// 0x100097b8  nDir::vfunc_40  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::ManglePath
// 0x100097be  nDir::vfunc_39  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::GetAssign
// 0x100097c4  nDir::vfunc_38  (4 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::SetAssign, IAT: nkernel.dll!nFileServer2::~nFileServer2(), IAT: nkernel.dll!nRoot::GetRelPath, IAT: nkernel.dll!nRoot::SetFlags
// 0x10009a2e  nDir::vfunc_62  (1 insns)
//   calls:   IAT: nnebula.dll!nMeshNode::Preload
// 0x10009a34  nDir::vfunc_61  (1 insns)
//   calls:   IAT: nnebula.dll!nMeshNode::Compute
// 0x10009a3a  nDir::vfunc_60  (1 insns)
//   calls:   IAT: nnebula.dll!nMeshNode::Attach
// 0x10009a40  nDir::vfunc_57  (2 insns)
//   calls:   IAT: nnebula.dll!nMeshNode::SaveCmds, IAT: nnebula.dll!nMeshNode::~nMeshNode()

} // namespace re_nparticle
