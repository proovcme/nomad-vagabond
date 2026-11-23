#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nsubtitle.asm
// Class: nsubtitle : public ncontainer  (sizeof = 0x12d8 = 4824 bytes)

#include <cstdint>

namespace re_nnomads {

struct nsubtitle_Layout {
    // +0x0644
    float field_0x0644;
    // +0x0648
    float field_0x0648;
    // +0x064c
    float field_0x064c;
    // +0x0650
    uint8_t field_0x0650;
    // +0x0eb0
    uint8_t field_0x0eb0;
    // +0x0ed0
    uint8_t field_0x0ed0;
    // +0x10d0
    uint8_t field_0x10d0;
    // +0x12d0
    uint8_t field_0x12d0;
};

// Script AddCmds (6):
//   v_setbitmappath_s
//   s_getbitmappath_v
//   v_setvoicepath_s
//   s_getvoicepath_v
//   v_setvoicecarrier_s
//   s_getvoicecarrier_v

// Methods (12):
// 0x1003121e  nsubtitle::n_init_nsubtitle  (15 insns)
//   strings: 'ncontainer'
// 0x10031249  nsubtitle::n_fini_nsubtitle  (5 insns)
// 0x1003125b  nsubtitle::n_new_nsubtitle  (22 insns)
//   calls:   -> nContainer::nContainer()
// 0x100312a1  nsubtitle::vfunc_00  (105 insns)
//   calls:   -> nContainer::~nContainer()
// 0x100313ae  nsubtitle::vfunc_18  (63 insns)
//   calls:   -> nContainer::UpdateChannels
//   strings: 'v_setbitmappath_s', 's_getbitmappath_v', 'v_setvoicepath_s', 's_getvoicepath_v', 'v_setvoicecarrier_s', 's_getvoicecarrier_v'
// 0x10031495  nsubtitle::cmd_setbitmappath (v_setbitmappath_s)  (10 insns)
// 0x100314b8  nsubtitle::cmd_getbitmappath (s_getbitmappath_v)  (14 insns)
// 0x100314e2  nsubtitle::cmd_setvoicepath (v_setvoicepath_s)  (10 insns)
// 0x10031505  nsubtitle::cmd_getvoicepath (s_getvoicepath_v)  (14 insns)
// 0x1003152f  nsubtitle::cmd_setvoicecarrier (v_setvoicecarrier_s)  (10 insns)
// 0x10031552  nsubtitle::cmd_getvoicecarrier (s_getvoicecarrier_v)  (14 insns)
// 0x1003157c  nsubtitle::vfunc_11  (5 insns)
//   calls:   -> nContainer::SaveCmds

} // namespace re_nnomads
