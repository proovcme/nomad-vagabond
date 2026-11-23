#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nAnimCurveArray.asm
// Class: nAnimCurveArray : public nroot  (sizeof = 0x60 = 96 bytes)

#include <cstdint>

namespace re_nnebula {

struct nAnimCurveArray_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    float field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
};

// Methods (19):
// 0x10001f89  nAnimCurveArray::n_init_nanimcurvearray  (10 insns)
//   strings: 'nroot'
// 0x10001faa  nAnimCurveArray::n_fini_nanimcurvearray  (5 insns)
// 0x10001fbc  nAnimCurveArray::n_new_nanimcurvearray  (10 insns)
//   calls:   -> nAnimCurveArray::nAnimCurveArray()
// 0x10001fd9  nAnimCurveArray::nAnimCurveArray()  (11 insns)
// 0x10001ffb  nAnimCurveArray::~nAnimCurveArray()  (10 insns)
//   calls:   -> nAnimCurveArray::Clear
// 0x1000201a  nAnimCurveArray::SaveAnim  (160 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!sprintf
//   strings: 'oneshot', 'loop', 'quaternion', 'linear', 'step'
// 0x100021cb  nAnimCurveArray::SaveNax  (228 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   strings: 'wb'
// 0x10002400  nAnimCurveArray::LoadAnim  (378 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!strtok, IAT: MSVCRT.dll!atoi, -> nAnimCurveArray::SetNumCurves, IAT: MSVCRT.dll!atof, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, IAT: MSVCRT.dll!abort
//   strings: 'curves', 'curve', 'key', 'anim/nanimcurvearray_main.cc'
// 0x1000283a  nAnimCurveArray::LoadNax  (288 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nAnimCurveArray::SetNumCurves, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
//   strings: 'rb'
// 0x10002b0c  nAnimCurveArray::Clear  (112 insns)
// 0x10002c0f  nAnimCurveArray::SetNumCurves  (39 insns)
//   calls:   -> nAnimCurveArray::Clear
// 0x10002c68  nAnimCurveArray::GetNumCurves  (2 insns)
// 0x10002c6c  nAnimCurveArray::GetCurve  (62 insns)
// 0x10002cfa  nAnimCurveArray::FindCurveByName  (93 insns)
// 0x100035a6  nAnimCurveArray::nAnimCurveArray()  (22 insns)
//   calls:   -> nRoot::nRoot()
// 0x100035da  nAnimCurveArray::operator=  (21 insns)
//   calls:   -> nRoot::operator=
// 0x10003608  nAnimCurveArray::vfunc_00  (41 insns)
//   calls:   -> nAnimCurveArray::~nAnimCurveArray()
// 0x10037a38  nAnimCurveArray::vfunc_11  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveCmds
// 0x10037a74  nAnimCurveArray::vfunc_01  (9 insns)
//   calls:   IAT: nkernel.dll!nRoot::Initialize, IAT: nkernel.dll!nRoot::nRoot(), IAT: nkernel.dll!nRoot::~nRoot(), IAT: nkernel.dll!nRoot::RemObjectRef, IAT: nkernel.dll!nRoot::AddRef, IAT: nkernel.dll!nRoot::Find, IAT: nkernel.dll!nRoot::GetFullName, IAT: nkernel.dll!nRoot::AddObjectRef, IAT: nkernel.dll!nClass::~nClass()

} // namespace re_nnebula
