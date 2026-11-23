#pragma once
// Auto-lifted C++ layout & method spec from nnature.dll
// Source ASM: re/disasm/nnature/nChannelServer.asm
// Class: nChannelServer

#include <cstdint>

namespace re_nnature {

struct nChannelServer_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
};

// Script AddCmds (8):
//   v_setmeshnode_s
//   s_getmeshnode_v
//   v_setsize_f
//   f_getsize_v
//   v_setwindstrength_f
//   f_getwindstrength_v
//   v_setwinddir_f
//   f_getwinddir_v

// Methods (36):
// 0x10004b1f  nChannelServer::nChannelServer()  (54 insns)
//   calls:   -> nRoot::nRoot()
// 0x10004bb3  nChannelServer::operator=  (70 insns)
//   calls:   -> nRoot::operator=, IAT: nkernel.dll!n_free
// 0x10004c53  nChannelServer::vfunc_00  (41 insns)
// 0x10004d3a  nChannelServer::vfunc_14  (41 insns)
// 0x10004dcb  nChannelServer::vfunc_19  (40 insns)
// 0x10004f7b  nChannelServer::vfunc_29  (41 insns)
// 0x1000508a  nChannelServer::vfunc_38  (41 insns)
// 0x10005215  nChannelServer::vfunc_60  (143 insns)
//   calls:   IAT: nkernel.dll!n_free
//   strings: 'v_setmeshnode_s', 's_getmeshnode_v', 'v_setsize_f', 'f_getsize_v', 'v_setwindstrength_f', 'f_getwindstrength_v', 'v_setwinddir_f', 'f_getwinddir_v'
// 0x1000de16  nChannelServer::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nDir::IsSubDir
// 0x1000de1c  nChannelServer::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nDir::Rewind
// 0x1000de22  nChannelServer::vfunc_16  (1 insns)
//   calls:   IAT: nkernel.dll!nDir::Read
// 0x1000de28  nChannelServer::vfunc_15  (2 insns)
//   calls:   IAT: nkernel.dll!nDir::Open, IAT: nkernel.dll!nDir::~nDir()
// 0x1000de34  nChannelServer::vfunc_28  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::IsOpen
// 0x1000de3a  nChannelServer::vfunc_27  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::GetS
// 0x1000de40  nChannelServer::vfunc_26  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::PutS
// 0x1000de46  nChannelServer::vfunc_25  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Seek
// 0x1000de4c  nChannelServer::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Tell
// 0x1000de52  nChannelServer::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Read
// 0x1000de58  nChannelServer::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Write
// 0x1000de5e  nChannelServer::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nFile::Close
// 0x1000de64  nChannelServer::vfunc_20  (2 insns)
//   calls:   IAT: nkernel.dll!nFile::Open, IAT: nkernel.dll!nFile::~nFile()
// 0x1000de70  nChannelServer::vfunc_36  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::GetEntryType
// 0x1000de76  nChannelServer::vfunc_35  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::GetEntryName
// 0x1000de7c  nChannelServer::vfunc_34  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::SetToNextEntry
// 0x1000de82  nChannelServer::vfunc_33  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::SetToFirstEntry
// 0x1000de88  nChannelServer::vfunc_32  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::IsEmpty
// 0x1000de8e  nChannelServer::vfunc_31  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::Close
// 0x1000de94  nChannelServer::vfunc_30  (2 insns)
//   calls:   IAT: nkernel.dll!nDirectory::Open, IAT: nkernel.dll!nDirectory::~nDirectory()
// 0x1000dea0  nChannelServer::vfunc_59  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::NewFileObject
// 0x1000dea6  nChannelServer::vfunc_58  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::NewDirectoryObject
// 0x1000deac  nChannelServer::vfunc_57  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::GetCwd
// 0x1000deb2  nChannelServer::vfunc_56  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::ChangeDir
// 0x1000deb8  nChannelServer::vfunc_55  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::MakeAbsolute
// 0x1000debe  nChannelServer::vfunc_54  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::ManglePath
// 0x1000dec4  nChannelServer::vfunc_53  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::GetAssign
// 0x1000deca  nChannelServer::vfunc_52  (7 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::SetAssign, IAT: nkernel.dll!nFileServer2::~nFileServer2(), IAT: nkernel.dll!nClass::EndCmds, IAT: nkernel.dll!nClass::AddCmd, IAT: nkernel.dll!nClass::BeginCmds, IAT: nkernel.dll!nClass::AddSubClass, IAT: nkernel.dll!nClass::RemSubClass

} // namespace re_nnature
