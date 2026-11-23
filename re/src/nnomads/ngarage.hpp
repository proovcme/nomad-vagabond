#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/ngarage.asm
// Class: ngarage : public nfactory  (sizeof = 0xf68 = 3944 bytes)

#include <cstdint>

namespace re_nnomads {

struct ngarage_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    float field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    float field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x009c
    float field_0x009c;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00ac
    uint32_t field_0x00ac;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00b4
    uint32_t field_0x00b4;
    // +0x00bc
    uint32_t field_0x00bc;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x00c4
    uint32_t field_0x00c4;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0f30
    uint32_t field_0x0f30;
    // +0x0f34
    uint32_t field_0x0f34;
    // +0x0f38
    float field_0x0f38;
    // +0x0f44
    uint8_t field_0x0f44;
    // +0x0f48
    float field_0x0f48;
    // +0x0f4c
    float field_0x0f4c;
    // +0x0f50
    float field_0x0f50;
    // +0x0f54
    uint32_t field_0x0f54;
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

// Script AddCmds (10):
//   c_house/ngrg_head.cc
//   v_setapproachpos_fff
//   v_setvisualizegarage_b
//   b_getvisualizegarage_v
//   v_setappearposname_s
//   s_getappearposname_v
//   v_setremoveposname_s
//   s_getremoveposname_v
//   v_setoutputvehicle_b
//   b_isoutputvehicle_v

// Methods (17):
// 0x100244ab  ngarage::cmd_setremoveposname (v_setremoveposname_s)  (11 insns)
// 0x10024546  ngarage::cmd_setappearposname (v_setappearposname_s)  (11 insns)
// 0x1002e86e  ngarage::vfunc_00  (441 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, -> nStateNode::GetPrototype, IAT: MSVCRT.dll!sprintf, -> nContainer::GetPosition, -> nContainer::GetDirection
//   strings: '%s/visual/%s'
// 0x1002ed7f  ngarage::vfunc_15  (101 insns)
//   calls:   -> nartefactstorage::vfunc_15
// 0x1002ee85  ngarage::n_init_ngarage  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nfactory', 'cannot initialize ngarage class', 'c_house/ngrg_head.cc'
// 0x1002eee0  ngarage::n_fini_ngarage  (14 insns)
// 0x1002ef03  ngarage::n_new_ngarage  (10 insns)
// 0x1002ef1d  ngarage::n_version_ngarage  (85 insns)
//   strings: 'v_setapproachpos_fff', 'fff_getapproachpos_v', 'fff_getglobalapproachpos_v', 'v_setvisualizegarage_b', 'b_getvisualizegarage_v', 'v_setappearposname_s', 's_getappearposname_v', 'v_setremoveposname_s'
// 0x1002f082  ngarage::cmd_setapproachpos (v_setapproachpos_fff)  (111 insns)
// 0x1002f1b3  ngarage::cmd_setvisualizegarage (v_setvisualizegarage_b)  (10 insns)
// 0x1002f1d7  ngarage::cmd_getvisualizegarage (b_getvisualizegarage_v)  (13 insns)
// 0x1002f203  ngarage::cmd_getappearposname (s_getappearposname_v)  (13 insns)
// 0x1002f22c  ngarage::cmd_getremoveposname (s_getremoveposname_v)  (213 insns)
//   consts:  f32=0.3183099, f32=180
// 0x1002f491  ngarage::cmd_setoutputvehicle (v_setoutputvehicle_b)  (12 insns)
// 0x1002f4b7  ngarage::cmd_isoutputvehicle (b_isoutputvehicle_v)  (13 insns)
// 0x1002f4e2  ngarage::vfunc_11  (99 insns)
//   calls:   -> nfactory::vfunc_11
// 0x1002f5f7  ngarage::vfunc_63  (200 insns)
//   calls:   -> nContainer::GetMatrix44, -> nContainer::GetPosition, -> nContainer::DrawCross, -> nHouse::Visualize, -> nHouse::nHouse()
//   consts:  f32=0.5

} // namespace re_nnomads
