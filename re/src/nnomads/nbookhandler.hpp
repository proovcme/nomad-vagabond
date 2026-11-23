#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nbookhandler.asm
// Class: nbookhandler : public nroot  (sizeof = 0xf8 = 248 bytes)

#include <cstdint>

namespace re_nnomads {

struct nbookhandler_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0068
    uint32_t field_0x0068;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0098
    uint32_t field_0x0098;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00d4
    uint32_t field_0x00d4;
    // +0x00d8
    uint32_t field_0x00d8;
    // +0x00dc
    uint32_t field_0x00dc;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00f4
    uint32_t field_0x00f4;
};

// Script AddCmds (10):
//   b_loadbook_s
//   b_loadbookquiet_s
//   v_unloadbook_v
//   b_registerpart_sss
//   b_activatepart_s
//   b_activatepartquiet_s
//   b_activatenextpart_v
//   s_getcurrentbook_v
//   s_getcurrentpart_v
//   s_getcurrentpartdir_v

// Methods (13):
// 0x10059839  nbookhandler::n_init_nbookhandler  (15 insns)
//   strings: 'nroot'
// 0x10059864  nbookhandler::n_fini_nbookhandler  (5 insns)
// 0x10059876  nbookhandler::n_new_nbookhandler  (829 insns)
//   calls:   IAT: nkernel.dll!n_free, -> nRoot::GetHead, -> nRealWorld::KillGame, IAT: nkernel.dll!n_strdup, IAT: MSVCRT.dll!_chdir, -> nRealWorld::LoadEncounter, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!sprintf, IAT: nkernel.dll!nn_malloc, -> nRealWorld::GetUserClan, -> nRealWorld::ReleaseClan, -> nStateNode::GetState
//   strings: '/world', '/sys/servers/script', '/sys/servers/file', '/game/handler/event', '/game/handler/data', '/sys/servers/menuhandler', '/game/parts', 'nroot'
// 0x1005a2b3  nbookhandler::cmd_loadbook (b_loadbook_s)  (22 insns)
// 0x1005a2f6  nbookhandler::cmd_loadbookquiet (b_loadbookquiet_s)  (22 insns)
// 0x1005a339  nbookhandler::cmd_unloadbook (v_unloadbook_v)  (2 insns)
// 0x1005a342  nbookhandler::cmd_registerpart (b_registerpart_sss)  (21 insns)
// 0x1005a37f  nbookhandler::cmd_activatepart (b_activatepart_s)  (10 insns)
// 0x1005a3a2  nbookhandler::cmd_activatepartquiet (b_activatepartquiet_s)  (10 insns)
// 0x1005a3c5  nbookhandler::cmd_activatenextpart (b_activatenextpart_v)  (2 insns)
// 0x1005a3ce  nbookhandler::cmd_getcurrentbook (s_getcurrentbook_v)  (14 insns)
// 0x1005a3f8  nbookhandler::cmd_getcurrentpart (s_getcurrentpart_v)  (14 insns)
// 0x1005a422  nbookhandler::cmd_getcurrentpartdir (s_getcurrentpartdir_v)  (14 insns)

} // namespace re_nnomads
