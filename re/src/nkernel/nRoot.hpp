#pragma once
// Auto-lifted C++ layout & method spec from nkernel.dll
// Source ASM: re/disasm/nkernel/nRoot.asm
// Class: nRoot

#include <cstdint>

namespace re_nkernel {

struct nRoot_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0024
    uint32_t field_0x0024;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0038
    uint32_t field_0x0038;
    // +0x003c
    uint32_t field_0x003c;
    // +0x003e
    uint8_t field_0x003e;
    // +0x0040
    uint32_t field_0x0040;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (22):
//   i_getrefcount_v
//   s_getrefs_v
//   s_getclass_v
//   b_isa_s
//   b_isinstanceof_s
//   s_getcmds_v
//   b_save_v
//   b_saveas_s
//   o_clone_s
//   b_parse_s
//   o_getparent_v
//   o_gethead_v
//   o_gettail_v
//   o_getsucc_v
//   o_getpred_v
//   v_setname_s
//   s_getname_v
//   s_getfullname_v
//   s_getrelpath_o
//   o_find_s
//   v_sort_v
//   b_import_s

// Methods (41):
// 0x10001416  nRoot::nRoot()  (34 insns)
// 0x1000146d  nRoot::operator=  (33 insns)
// 0x10001519  nRoot::GetParent  (2 insns)
// 0x1000151d  nRoot::GetHead  (15 insns)
// 0x1000153b  nRoot::GetTail  (15 insns)
// 0x1000155b  nRoot::GetSucc  (10 insns)
// 0x10001570  nRoot::GetPred  (10 insns)
// 0x10001586  nRoot::GetName  (2 insns)
// 0x100043b7  nRoot::nRoot()  (22 insns)
// 0x100043fd  nRoot::~nRoot()  (62 insns)
//   calls:   -> n_free, -> n_printf, -> nRoot::GetHead, -> nRoot::InvalidateAllRefs, -> nRoot::Remove, -> nClass::DelObject
// 0x100044ab  nRoot::AddRef  (3 insns)
// 0x100044b4  nRoot::Release  (11 insns)
// 0x100044ce  nRoot::SetFlags  (3 insns)
// 0x100044da  nRoot::UnsetFlags  (4 insns)
// 0x100044e7  nRoot::GetFlags  (2 insns)
// 0x100044ec  nRoot::SetClass  (3 insns)
// 0x100044f6  nRoot::GetClass  (2 insns)
// 0x100044fa  nRoot::IsA  (11 insns)
// 0x10004515  nRoot::IsInstanceOf  (5 insns)
// 0x10004524  nRoot::GetRefCount  (2 insns)
// 0x10004529  nRoot::GetFullName  (82 insns)
//   calls:   -> n_strncpy2
// 0x10004606  nRoot::GetRelPath  (173 insns)
//   calls:   -> n_strcat
//   strings: '..', '../'
// 0x100047c5  nRoot::Dispatch  (15 insns)
// 0x100047f1  nRoot::GetCmdProtos  (91 insns)
//   calls:   -> nCmdProto::nCmdProto()
// 0x100048c9  nRoot::AddHead  (26 insns)
// 0x1000490b  nRoot::AddTail  (26 insns)
// 0x1000494d  nRoot::RemHead  (12 insns)
// 0x1000496b  nRoot::RemTail  (12 insns)
// 0x10004989  nRoot::Remove  (7 insns)
// 0x1000499a  nRoot::SetName  (4 insns)
// 0x100049a9  nRoot::Find  (57 insns)
// 0x10004a25  nRoot::Sort  (315 insns)
//   calls:   -> nRoot::GetHead, -> nn_malloc, -> n_printf, IAT: MSVCRT.dll!abort, IAT: MSVCRT.dll!qsort, -> nRoot::AddHead, -> n_free, -> n_strdup
//   strings: 'kernel/nrootchild.cc', 'Out of mem!'
// 0x10004d23  nRoot::Save  (5 insns)
// 0x10004d2d  nRoot::SaveAs  (115 insns)
//   calls:   -> nRoot::GetHead, -> n_printf
//   strings: 'nRoot::Save(): BeginObject() failed!', 'nRoot::Save(): could not open fileserver!', 'kernel/nrootsave.cc'
// 0x10004e56  nRoot::Clone  (138 insns)
//   calls:   -> nRoot::GetHead, -> n_printf
//   strings: 'nRoot::Clone(): BeginObject() failed!', 'kernel/nrootsave.cc', 'nRoot::Clone(): could not open fileserver!'
// 0x10004fbc  nRoot::Parse  (8 insns)
// 0x10004fd6  nRoot::Import  (757 insns)
//   calls:   -> n_free, -> n_strdup, -> nClass::BeginCmds, -> nClass::AddCmd, -> nClass::EndCmds, -> nRoot::GetRefCount, -> nRoot::GetRefs, -> nRoot::GetFullName, -> n_strncpy2, -> nRoot::GetCmdProtos, -> nCmdProto::~nCmdProto(), -> nRoot::GetHead
//   strings: 'i_getrefcount_v', 's_getrefs_v', 's_getclass_v', 'b_isa_s', 'b_isinstanceof_s', 's_getcmds_v', 'b_save_v', 'b_saveas_s'
// 0x100058e8  nRoot::AddObjectRef  (8 insns)
// 0x100058ff  nRoot::RemObjectRef  (8 insns)
// 0x10005917  nRoot::InvalidateAllRefs  (13 insns)
// 0x10005932  nRoot::GetRefs  (12 insns)

} // namespace re_nkernel
