#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nfactory.asm
// Class: nfactory : public nhouse  (sizeof = 0xf48 = 3912 bytes)

#include <cstdint>

namespace re_nnomads {

struct nfactory_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    double field_0x0008;
    // +0x0010
    uint8_t field_0x0010;
    // +0x0020
    uint32_t field_0x0020;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0114
    uint32_t field_0x0114;
    // +0x03f4
    float field_0x03f4;
    // +0x03f8
    float field_0x03f8;
    // +0x03fc
    float field_0x03fc;
    // +0x0400
    uint8_t field_0x0400;
    // +0x0494
    float field_0x0494;
    // +0x0498
    float field_0x0498;
    // +0x049c
    float field_0x049c;
    // +0x04a0
    uint8_t field_0x04a0;
    // +0x04f4
    float field_0x04f4;
    // +0x04f8
    float field_0x04f8;
    // +0x04fc
    float field_0x04fc;
    // +0x0500
    uint8_t field_0x0500;
    // +0x0514
    float field_0x0514;
    // +0x0518
    float field_0x0518;
    // +0x051c
    float field_0x051c;
    // +0x0520
    uint8_t field_0x0520;
    // +0x0524
    float field_0x0524;
    // +0x0528
    float field_0x0528;
    // +0x052c
    float field_0x052c;
    // +0x0530
    uint8_t field_0x0530;
    // +0x0534
    float field_0x0534;
    // +0x0538
    float field_0x0538;
    // +0x053c
    float field_0x053c;
    // +0x0540
    uint8_t field_0x0540;
    // +0x0544
    float field_0x0544;
    // +0x0548
    float field_0x0548;
    // +0x054c
    float field_0x054c;
    // +0x0550
    uint8_t field_0x0550;
    // +0x0554
    float field_0x0554;
    // +0x0558
    float field_0x0558;
    // +0x055c
    float field_0x055c;
    // +0x0560
    uint8_t field_0x0560;
    // +0x0564
    float field_0x0564;
    // +0x0568
    float field_0x0568;
    // +0x056c
    float field_0x056c;
    // +0x0570
    uint8_t field_0x0570;
    // +0x05c4
    float field_0x05c4;
    // +0x05c8
    float field_0x05c8;
    // +0x05cc
    float field_0x05cc;
    // +0x05d0
    uint8_t field_0x05d0;
    // +0x05d4
    float field_0x05d4;
    // +0x05d8
    float field_0x05d8;
    // +0x05dc
    float field_0x05dc;
    // +0x05e0
    uint8_t field_0x05e0;
    // +0x06c4
    float field_0x06c4;
    // +0x06c8
    float field_0x06c8;
    // +0x06cc
    float field_0x06cc;
    // +0x06d0
    uint8_t field_0x06d0;
    // +0x0e64
    uint8_t field_0x0e64;
    // +0x0f40
    uint8_t field_0x0f40;
    // +0x0f48
    uint32_t field_0x0f48;
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
    // +0x1140
    double field_0x1140;
    // +0x119c
    uint8_t field_0x119c;
    // +0x1264
    float field_0x1264;
    // +0x1268
    float field_0x1268;
    // +0x126c
    float field_0x126c;
};

// Script AddCmds (13):
//   c_house/nfct_head.cc
//   v_setbuildcounter_if
//   f_getbuildcounter_i
//   v_setbuilding_ib
//   b_getbuilding_i
//   v_setproductcount_ii
//   i_getproductcount_i
//   v_setproductname_is
//   o_getproduct_i
//   b_destroyproduct_i
//   b_isworking_v
//   v_setfastbuild_b
//   b_isfastbuild_v

// Methods (18):
// 0x1002d324  nfactory::vfunc_00  (201 insns)
//   calls:   -> nHouse::~nHouse(), -> nContainer::KillByGarage, -> nContainer::IsVehicleClass, -> nContainer::GetPosition, -> nHouse::GetAimOffset
//   strings: 'concret.technical.static.building.flakbuilding'
// 0x1002d5a6  nfactory::n_init_nfactory  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nhouse', 'cannot initialize factory class', 'c_house/nfct_head.cc'
// 0x1002d601  nfactory::n_fini_nfactory  (14 insns)
// 0x1002d624  nfactory::n_new_nfactory  (10 insns)
// 0x1002d63e  nfactory::n_version_nfactory  (70 insns)
//   strings: 'v_setbuildcounter_if', 'f_getbuildcounter_i', 'v_setbuilding_ib', 'b_getbuilding_i', 'v_setproductcount_ii', 'i_getproductcount_i', 'v_setproductname_is', 'o_getproduct_i'
// 0x1002d761  nfactory::cmd_setbuildcounter (v_setbuildcounter_if)  (20 insns)
// 0x1002d797  nfactory::cmd_getbuildcounter (f_getbuildcounter_i)  (23 insns)
// 0x1002d7dd  nfactory::cmd_setbuilding (v_setbuilding_ib)  (18 insns)
// 0x1002d80e  nfactory::cmd_getbuilding (b_getbuilding_i)  (23 insns)
// 0x1002d854  nfactory::cmd_setproductcount (v_setproductcount_ii)  (17 insns)
// 0x1002d884  nfactory::cmd_getproductcount (i_getproductcount_i)  (24 insns)
// 0x1002d8cd  nfactory::cmd_setproductname (v_setproductname_is)  (54 insns)
//   calls:   -> nStateNode::GetWorld, -> nRealWorld::FilterClanAtLoad
// 0x1002d95c  nfactory::cmd_getproduct (o_getproduct_i)  (23 insns)
// 0x1002d9a2  nfactory::cmd_destroyproduct (b_destroyproduct_i)  (23 insns)
// 0x1002d9e8  nfactory::cmd_setfastbuild (v_setfastbuild_b)  (10 insns)
// 0x1002da0c  nfactory::cmd_isfastbuild (b_isfastbuild_v)  (13 insns)
// 0x1002da38  nfactory::vfunc_11  (189 insns)
//   calls:   -> nHouse::SaveCmds, -> nRealWorld::FilterClanAtSave
// 0x1002dc92  nfactory::vfunc_18  (542 insns)
//   calls:   -> nContainer::IsVehicleClass, -> nContainer::GetDirection, -> nHouse::UpdateChannels
//   consts:  f64=0, f64=1, f32=0.3183099, f32=180, f32=90, f32=0, f32=360, f32=1, f32=1000, f64=1.570796371, f64=3.141592741, f64=4.712389112
//   strings: 'concret.technical.static.flak'

} // namespace re_nnomads
