#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nartefactstorage.asm
// Class: nartefactstorage : public nhouse  (sizeof = 0xf50 = 3920 bytes)

#include <cstdint>

namespace re_nnomads {

struct nartefactstorage_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x0018
    uint32_t field_0x0018;
    // +0x0114
    uint32_t field_0x0114;
    // +0x01b8
    uint32_t field_0x01b8;
    // +0x02b6
    uint8_t field_0x02b6;
    // +0x0f30
    uint8_t field_0x0f30;
    // +0x0f38
    uint32_t field_0x0f38;
    // +0x0f3c
    uint32_t field_0x0f3c;
    // +0x0f40
    float field_0x0f40;
    // +0x0f4c
    uint32_t field_0x0f4c;
    // +0x0f60
    uint8_t field_0x0f60;
};

// Script AddCmds (8):
//   c_house/nartefactstorage_head.cc
//   v_setcapacity_i
//   v_getcapacity_v
//   b_insertartefact_s
//   v_setstackbase_fff
//   v_setloadmode_i
//   i_getloadmode_v
//   v_emptystorage_v

// Methods (14):
// 0x1001dabf  nartefactstorage::cmd_insertartefact (b_insertartefact_s)  (23 insns)
// 0x1002d59a  nartefactstorage::vfunc_15  (3 insns)
//   calls:   -> nHouse::Trigger
// 0x10030048  nartefactstorage::vfunc_00  (315 insns)
//   calls:   -> nHouse::~nHouse(), -> nContainer::SetArtefactOwner, -> nContainer::IsVehicleClass, -> nContainer::GetPosition, -> nContainer::SetPosition
//   consts:  f32=6.283185, f32=1.5
//   strings: 'concret.nature.island'
// 0x10030396  nartefactstorage::n_init_nartefactstorage  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nhouse', 'cannot initialize artefactstorage class', 'c_house/nartefactstorage_head.cc'
// 0x100303f1  nartefactstorage::n_fini_nartefactstorage  (14 insns)
// 0x10030414  nartefactstorage::n_new_nartefactstorage  (10 insns)
// 0x1003042e  nartefactstorage::n_version_nartefactstorage  (50 insns)
//   strings: 'v_setcapacity_i', 'v_getcapacity_v', 'b_insertartefact_s', 'v_setstackbase_fff', 'fff_getstackbase_v', 'v_setloadmode_i', 'i_getloadmode_v', 'v_emptystorage_v'
// 0x100304f9  nartefactstorage::cmd_setcapacity (v_setcapacity_i)  (11 insns)
// 0x10030520  nartefactstorage::cmd_getcapacity (v_getcapacity_v)  (14 insns)
// 0x1003054e  nartefactstorage::cmd_setstackbase (v_setstackbase_fff)  (67 insns)
// 0x10030612  nartefactstorage::cmd_setloadmode (v_setloadmode_i)  (11 insns)
// 0x10030639  nartefactstorage::cmd_getloadmode (i_getloadmode_v)  (14 insns)
// 0x10030667  nartefactstorage::cmd_emptystorage (v_emptystorage_v)  (3 insns)
// 0x10030673  nartefactstorage::vfunc_11  (157 insns)
//   calls:   -> nHouse::SaveCmds, -> nHouse::nHouse()
//   consts:  f32=2

} // namespace re_nnomads
