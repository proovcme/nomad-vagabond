#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nNetNode.asm
// Class: nNetNode : public nroot  (sizeof = 0x50 = 80 bytes)

#include <cstdint>

namespace re_nnetwork {

struct nNetNode_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x004e
    uint8_t field_0x004e;
};

// Script AddCmds (2):
//   v_markshadow_b
//   b_isshadow_v

// Methods (18):
// 0x10001000  nNetNode::n_init_nnetnode  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nroot', 'cannot initialize netnode class', 'node/nnn_init.cc'
// 0x1000105b  nNetNode::n_fini_nnetnode  (14 insns)
// 0x1000107e  nNetNode::n_new_nnetnode  (10 insns)
//   calls:   -> nNetNode::nNetNode()
// 0x10001095  nNetNode::n_version_nnetnode  (2 insns)
// 0x10001882  nNetNode::MarkShadow  (3 insns)
// 0x1000188c  nNetNode::IsShadow  (2 insns)
// 0x10001890  nNetNode::SetNetName  (3 insns)
// 0x1000189c  nNetNode::GetNetName  (2 insns)
// 0x100018a1  nNetNode::SetNetValid  (3 insns)
// 0x100018ab  nNetNode::IsNetValid  (2 insns)
// 0x100018af  nNetNode::nNetNode()  (19 insns)
//   calls:   -> nRoot::nRoot()
// 0x100018e4  nNetNode::operator=  (18 insns)
//   calls:   -> nRoot::operator=
// 0x1000196f  nNetNode::nNetNode()  (9 insns)
// 0x10001989  nNetNode::~nNetNode()  (2 insns)
// 0x10001994  nNetNode::MarkShadowAll  (60 insns)
//   calls:   -> nRoot::GetHead
//   strings: 'nnetnode', 'v_markshadow_b', 'b_isshadow_v'
// 0x10001a34  nNetNode::cmd_markshadow (v_markshadow_b)  (10 insns)
// 0x10001a55  nNetNode::cmd_isshadow (b_isshadow_v)  (13 insns)
// 0x10001a7e  nNetNode::SaveCmds  (36 insns)
//   calls:   -> nClass::vfunc_36

} // namespace re_nnetwork
