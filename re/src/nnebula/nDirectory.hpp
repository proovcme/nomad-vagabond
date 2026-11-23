#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nDirectory.asm
// Class: nDirectory

#include <cstdint>

namespace re_nnebula {

struct nDirectory_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0006
    uint32_t field_0x0006;
    // +0x0008
    uint8_t field_0x0008;
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
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0208
    uint8_t field_0x0208;
    // +0x020c
    uint32_t field_0x020c;
    // +0x0410
    uint32_t field_0x0410;
};

// Methods (21):
// 0x10002eb6  nDirectory::nDirectory()  (29 insns)
// 0x10002f24  nDirectory::operator=  (48 insns)
// 0x10002fb5  nDirectory::vfunc_00  (41 insns)
// 0x10003016  nDirectory::IsOpen  (3 insns)
// 0x1000301e  nDirectory::GetPathName  (7 insns)
// 0x10003107  nDirectory::vfunc_09  (482 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f32=-1, f32=1, f32=32767.5, f32=0.5, f64=1.030792151e+11, f32=3.051804e-05
//   strings: 'loop', 'oneshot', 'step', 'linear', 'quaternion', 'c:/nomads/code/inc\\anim/nanimcurve.h'
// 0x10037b76  nDirectory::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::GetEntryType
// 0x10037b7c  nDirectory::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::GetEntryName
// 0x10037b82  nDirectory::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::SetToNextEntry
// 0x10037b88  nDirectory::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::SetToFirstEntry
// 0x10037b8e  nDirectory::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::IsEmpty
// 0x10037b94  nDirectory::vfunc_02  (1 insns)
//   calls:   IAT: nkernel.dll!nDirectory::Close
// 0x10037b9a  nDirectory::vfunc_01  (2 insns)
//   calls:   IAT: nkernel.dll!nDirectory::Open, IAT: nkernel.dll!nDirectory::~nDirectory()
// 0x10037ba6  nDirectory::vfunc_30  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::NewFileObject
// 0x10037bac  nDirectory::vfunc_29  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::NewDirectoryObject
// 0x10037bb2  nDirectory::vfunc_28  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::GetCwd
// 0x10037bb8  nDirectory::vfunc_27  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::ChangeDir
// 0x10037bbe  nDirectory::vfunc_26  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::MakeAbsolute
// 0x10037bc4  nDirectory::vfunc_25  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::ManglePath
// 0x10037bca  nDirectory::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::GetAssign
// 0x10037bd0  nDirectory::vfunc_23  (8 insns)
//   calls:   IAT: nkernel.dll!nFileServer2::SetAssign, IAT: nkernel.dll!nFileServer2::~nFileServer2(), IAT: nkernel.dll!nFileServer2::nFileServer2(), IAT: nkernel.dll!nClass::EndCmds, IAT: nkernel.dll!nClass::AddCmd, IAT: nkernel.dll!nClass::BeginCmds, IAT: nkernel.dll!nFile::nFile(), IAT: nkernel.dll!nDirectory::nDirectory()

} // namespace re_nnebula
