#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nProfileServer.asm
// Class: nProfileServer : public nroot  (sizeof = 0x48 = 72 bytes)

#include <cstdint>

namespace re_nnebula {

struct nProfileServer_Layout {
    // +0x0044
    uint8_t field_0x0044;
};

// Script AddCmds (4):
//   v_start_v
//   v_stop_v
//   v_toggle_v
//   b_isprofiling_v

// Methods (17):
// 0x1003784e  nProfileServer::n_init_nprofileserver  (15 insns)
//   strings: 'nroot'
// 0x10037879  nProfileServer::n_fini_nprofileserver  (5 insns)
// 0x1003788b  nProfileServer::n_new_nprofileserver  (10 insns)
//   calls:   -> nProfileServer::nProfileServer()
// 0x100378a2  nProfileServer::n_version_nprofileserver  (2 insns)
// 0x100378a8  nProfileServer::nProfileServer()  (13 insns)
//   calls:   -> nRoot::nRoot()
// 0x100378c9  nProfileServer::operator=  (12 insns)
//   calls:   -> nRoot::operator=
// 0x100378e4  nProfileServer::vfunc_00  (40 insns)
//   calls:   -> nProfileServer::~nProfileServer()
// 0x1003793e  nProfileServer::nProfileServer()  (8 insns)
// 0x10037954  nProfileServer::~nProfileServer()  (2 insns)
// 0x1003795f  nProfileServer::Start  (8 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10037974  nProfileServer::Stop  (8 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10037989  nProfileServer::IsProfiling  (2 insns)
// 0x1003798d  nProfileServer::Toggle  (33 insns)
//   strings: 'v_start_v', 'v_stop_v', 'v_toggle_v', 'b_isprofiling_v'
// 0x10037a08  nProfileServer::cmd_start (v_start_v)  (3 insns)
// 0x10037a11  nProfileServer::cmd_stop (v_stop_v)  (3 insns)
// 0x10037a1a  nProfileServer::cmd_toggle (v_toggle_v)  (2 insns)
//   calls:   -> nProfileServer::Toggle
// 0x10037a23  nProfileServer::cmd_isprofiling (b_isprofiling_v)  (2 insns)
//   calls:   -> nProfileServer::IsProfiling

} // namespace re_nnebula
