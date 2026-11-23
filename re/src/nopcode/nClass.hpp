#pragma once
// Auto-lifted C++ layout & method spec from nopcode.dll
// Source ASM: re/disasm/nopcode/nClass.asm
// Class: nClass

#include <cstdint>

namespace re_nopcode {

struct nClass_Layout {
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0088
    uint8_t field_0x0088;
    // +0x0089
    uint8_t field_0x0089;
    // +0x0194
    uint8_t field_0x0194;
    // +0x0195
    uint8_t field_0x0195;
    // +0x019c
    uint8_t field_0x019c;
    // +0x019d
    uint8_t field_0x019d;
    // +0x01c4
    uint32_t field_0x01c4;
    // +0x01f4
    uint32_t field_0x01f4;
    // +0x01fc
    uint8_t field_0x01fc;
    // +0x01fd
    uint8_t field_0x01fd;
    // +0x0204
    uint8_t field_0x0204;
    // +0x0205
    uint8_t field_0x0205;
    // +0x0218
    uint32_t field_0x0218;
};

// Methods (58):
// 0x100013ba  nClass::AddRef  (3 insns)
// 0x100013c1  nClass::RemRef  (3 insns)
// 0x100013c8  nClass::GetRef  (2 insns)
// 0x100013cc  nClass::GetCmdList  (2 insns)
// 0x100013d0  nClass::GetSuperClass  (2 insns)
// 0x100013d4  nClass::nClass()  (42 insns)
// 0x10001441  nClass::operator=  (41 insns)
// 0x100014a8  nClass::vfunc_00  (41 insns)
// 0x10001686  nClass::vfunc_01  (41 insns)
// 0x100017f3  nClass::vfunc_25  (41 insns)
// 0x100019db  nClass::vfunc_36  (41 insns)
// 0x10001c22  nClass::vfunc_46  (80 insns)
//   calls:   IAT: opcode11.dll!AABBTreeCollider@Opcode::AABBTreeCollider@Opcode(), IAT: opcode11.dll!AABBRayCollider@Opcode::AABBRayCollider@Opcode(), IAT: opcode11.dll!AABBSphereCollider@Opcode::AABBSphereCollider@Opcode(), IAT: opcode11.dll!Container::Container()
// 0x10003ff8  nClass::vfunc_24  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Trigger
// 0x10003ffe  nClass::vfunc_23  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddModule
// 0x10004004  nClass::vfunc_22  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::ReadTocFiles
// 0x1000400a  nClass::vfunc_21  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PopCwd
// 0x10004010  nClass::vfunc_20  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PushCwd
// 0x10004016  nClass::vfunc_19  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetCwd
// 0x1000401c  nClass::vfunc_18  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwd
// 0x10004022  nClass::vfunc_17  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::SetCwdObject
// 0x10004028  nClass::vfunc_16  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FlushLog
// 0x1000402e  nClass::vfunc_15  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Log
// 0x10004034  nClass::vfunc_14  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetLineBuffer
// 0x1000403a  nClass::vfunc_13  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::VPrintF
// 0x10004040  nClass::vfunc_12  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::PrintF
// 0x10004046  nClass::vfunc_11  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Lookup
// 0x1000404c  nClass::vfunc_10  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::Load
// 0x10004052  nClass::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::NewNoFail
// 0x10004058  nClass::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::New
// 0x1000405e  nClass::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::GetClassList
// 0x10004064  nClass::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::FindClass
// 0x1000406a  nClass::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::CloseClass
// 0x10004070  nClass::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::OpenClass
// 0x10004076  nClass::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::RemClass
// 0x1000407c  nClass::vfunc_02  (2 insns)
//   calls:   IAT: nkernel.dll!nKernelServer::AddClass, IAT: nkernel.dll!nKernelServer::~nKernelServer()
// 0x10004232  nClass::vfunc_35  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::SphereCheck
// 0x10004238  nClass::vfunc_34  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::LineCheck
// 0x1000423e  nClass::vfunc_33  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::MovingSphereCheck
// 0x10004244  nClass::vfunc_32  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::GetCollissions
// 0x1000424a  nClass::vfunc_31  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::Visualize
// 0x10004250  nClass::vfunc_30  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::Collide
// 0x10004256  nClass::vfunc_29  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::RemObject
// 0x1000425c  nClass::vfunc_28  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::AddObject
// 0x10004262  nClass::vfunc_27  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::ReleaseObject
// 0x10004268  nClass::vfunc_26  (2 insns)
//   calls:   IAT: ncollide.dll!nCollideContext::NewObject, IAT: ncollide.dll!nCollideContext::~nCollideContext()
// 0x10004274  nClass::vfunc_45  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::Visualize
// 0x1000427a  nClass::vfunc_44  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::SphereCheck
// 0x10004280  nClass::vfunc_43  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::LineCheck
// 0x10004286  nClass::vfunc_42  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::Collide
// 0x1000428c  nClass::vfunc_41  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::Load
// 0x10004292  nClass::vfunc_40  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::End
// 0x10004298  nClass::vfunc_39  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::SetTriangle
// 0x1000429e  nClass::vfunc_38  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::SetVertex
// 0x100042a4  nClass::vfunc_37  (2 insns)
//   calls:   IAT: ncollide.dll!nCollideShape::Begin, IAT: ncollide.dll!nCollideShape::~nCollideShape()
// 0x100042c2  nClass::vfunc_63  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideServer::ReleaseShape
// 0x100042c8  nClass::vfunc_62  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideServer::ReleaseContext
// 0x100042ce  nClass::vfunc_61  (1 insns)
//   calls:   IAT: ncollide.dll!nCollideServer::NewShape
// 0x100042d4  nClass::vfunc_60  (151 insns)
//   calls:   IAT: ncollide.dll!nCollideServer::NewContext, IAT: ncollide.dll!nCollideServer::~nCollideServer(), IAT: ncollide.dll!nCollideServer::nCollideServer(), IAT: ncollide.dll!nCollideServer::getResourceID, IAT: MSVCRT.dll!??2@YAPAXI@Z, IAT: MSVCRT.dll!??3@YAXPAX@Z, IAT: MSVCRT.dll!_adjust_fdiv, IAT: MSVCRT.dll!malloc, IAT: MSVCRT.dll!free, IAT: MSVCRT.dll!_initterm, IAT: KERNEL32.dll!DisableThreadLibraryCalls

} // namespace re_nopcode
