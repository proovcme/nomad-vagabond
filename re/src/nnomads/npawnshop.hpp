#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/npawnshop.asm
// Class: npawnshop : public nfactory  (sizeof = 0xf58 = 3928 bytes)

#include <cstdint>

namespace re_nnomads {

struct npawnshop_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0f48
    float field_0x0f48;
    // +0x0f4c
    uint32_t field_0x0f4c;
    // +0x0f50
    uint8_t field_0x0f50;
    // +0x0f51
    uint8_t field_0x0f51;
    // +0x0f52
    uint8_t field_0x0f52;
    // +0x0f53
    uint8_t field_0x0f53;
    // +0x0f54
    uint8_t field_0x0f54;
    // +0x0f55
    uint8_t field_0x0f55;
    // +0x0f58
    uint32_t field_0x0f58;
    // +0x0f5c
    uint32_t field_0x0f5c;
    // +0x0f60
    uint32_t field_0x0f60;
    // +0x0f64
    uint8_t field_0x0f64;
    // +0x0f65
    uint8_t field_0x0f65;
};

// Script AddCmds (11):
//   v_setmaxpricedelta_i
//   i_getmaxpricedelta_v
//   b_ismaennelinside_v
//   v_settradefinished_b
//   b_istradefinished_v
//   v_settradecancelled_b
//   b_istradecancelled_v
//   b_iscontentmentlevel1_v
//   b_iscontentmentlevel2_v
//   b_iscontentmentlevel3_v
//   v_resetcontentmentflags_v

// Methods (17):
// 0x1002e2cd  npawnshop::vfunc_00  (152 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::SetPosition, -> nContainer::SetArtefactOwner, -> nContainer::SetInShop, -> nContainer::GetArtefactPrice
//   consts:  f32=0.5, f32=1
// 0x1002e48e  npawnshop::n_init_npawnshop  (15 insns)
//   strings: 'nfactory'
// 0x1002e4b9  npawnshop::n_fini_npawnshop  (5 insns)
// 0x1002e4cb  npawnshop::n_new_npawnshop  (10 insns)
// 0x1002e4e5  npawnshop::n_version_npawnshop  (65 insns)
//   strings: 'v_setmaxpricedelta_i', 'i_getmaxpricedelta_v', 'b_ismaennelinside_v', 'v_settradefinished_b', 'b_istradefinished_v', 'v_settradecancelled_b', 'b_istradecancelled_v', 'b_iscontentmentlevel1_v'
// 0x1002e5f2  npawnshop::cmd_setmaxpricedelta (v_setmaxpricedelta_i)  (11 insns)
// 0x1002e619  npawnshop::cmd_getmaxpricedelta (i_getmaxpricedelta_v)  (14 insns)
// 0x1002e647  npawnshop::cmd_ismaennelinside (b_ismaennelinside_v)  (14 insns)
// 0x1002e675  npawnshop::cmd_settradefinished (v_settradefinished_b)  (12 insns)
// 0x1002e69c  npawnshop::cmd_istradefinished (b_istradefinished_v)  (14 insns)
// 0x1002e6ca  npawnshop::cmd_settradecancelled (v_settradecancelled_b)  (12 insns)
// 0x1002e6f1  npawnshop::cmd_istradecancelled (b_istradecancelled_v)  (14 insns)
// 0x1002e71f  npawnshop::cmd_iscontentmentlevel1 (b_iscontentmentlevel1_v)  (14 insns)
// 0x1002e74d  npawnshop::cmd_iscontentmentlevel2 (b_iscontentmentlevel2_v)  (14 insns)
// 0x1002e77b  npawnshop::cmd_iscontentmentlevel3 (b_iscontentmentlevel3_v)  (14 insns)
// 0x1002e7a9  npawnshop::cmd_resetcontentmentflags (v_resetcontentmentflags_v)  (3 insns)
// 0x1002e7b5  npawnshop::vfunc_11  (64 insns)
//   calls:   -> nfactory::vfunc_11

} // namespace re_nnomads
