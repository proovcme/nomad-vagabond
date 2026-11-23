#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nipolapproachgarage.asm
// Class: nipolapproachgarage : public ninterpolate  (sizeof = 0x68 = 104 bytes)

#include <cstdint>

namespace re_nnomads {

struct nipolapproachgarage_Layout {
    // +0x0020
    uint32_t field_0x0020;
};

// Methods (10):
// 0x10040c56  nipolapproachgarage::n_init_nipolapproachgarage  (10 insns)
//   strings: 'ninterpolate'
// 0x10040c77  nipolapproachgarage::n_fini_nipolapproachgarage  (5 insns)
// 0x10040c89  nipolapproachgarage::n_new_nipolapproachgarage  (10 insns)
// 0x10040ca0  nipolapproachgarage::n_version_nipolapproachgarage  (9 insns)
// 0x10040cb8  nipolapproachgarage::vfunc_00  (12 insns)
// 0x10040cda  nipolapproachgarage::vfunc_16  (12 insns)
//   calls:   -> nRealWorld::GetGlobalTime, -> ninterpolate::vfunc_16
// 0x10040d00  nipolapproachgarage::vfunc_17  (6 insns)
//   calls:   -> nStateNode::NetImport
// 0x10040d15  nipolapproachgarage::vfunc_22  (77 insns)
// 0x10040dd1  nipolapproachgarage::vfunc_23  (9 insns)
// 0x10040df1  nipolapproachgarage::vfunc_11  (10 insns)
//   calls:   -> ninterpolate::vfunc_11

} // namespace re_nnomads
