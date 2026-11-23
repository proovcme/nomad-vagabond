#pragma once
// Auto-lifted C++ layout & method spec from ncollide.dll
// Source ASM: re/disasm/ncollide/nCollideServer.asm
// Class: nCollideServer : public nroot  (sizeof = 0x84 = 132 bytes)

#include <cstdint>

namespace re_ncollide {

struct nCollideServer_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0024
    uint8_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint8_t field_0x006c;
    // +0x006d
    uint8_t field_0x006d;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0074
    uint32_t field_0x0074;
    // +0x007c
    uint32_t field_0x007c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (7):
//   v_begincollclasses_v
//   v_addcollclass_s
//   v_endcollclasses_v
//   v_begincolltypes_v
//   v_addcolltype_sss
//   v_endcolltypes_v
//   s_querycolltype_ss

// Methods (30):
// 0x10001000  nCollideServer::n_init_ncollideserver  (15 insns)
//   strings: 'nroot'
// 0x1000102b  nCollideServer::n_fini_ncollideserver  (5 insns)
// 0x1000103d  nCollideServer::n_new_ncollideserver  (10 insns)
//   calls:   -> nCollideServer::nCollideServer()
// 0x10001057  nCollideServer::n_version_ncollideserver  (18 insns)
// 0x10001b34  nCollideServer::QueryCollType  (35 insns)
// 0x10001b8b  nCollideServer::nCollideServer()  (42 insns)
//   calls:   -> nRoot::nRoot()
// 0x10001bf1  nCollideServer::operator=  (41 insns)
//   calls:   -> nRoot::operator=
// 0x10001cb2  nCollideServer::nCollideServer()  (28 insns)
// 0x10001d00  nCollideServer::~nCollideServer()  (75 insns)
//   calls:   -> nCollideServer::ReleaseShape, -> nCollideServer::ReleaseContext, IAT: nkernel.dll!n_free
// 0x10001db9  nCollideServer::NewContext  (25 insns)
//   calls:   -> nCollideContext::nCollideContext()
// 0x10001df3  nCollideServer::NewShape  (51 insns)
//   calls:   -> nCollideServer::getResourceID
// 0x10001e7c  nCollideServer::ReleaseContext  (20 insns)
// 0x10001eb2  nCollideServer::ReleaseShape  (14 insns)
// 0x10001ed4  nCollideServer::GetDefaultContext  (10 insns)
// 0x10001eea  nCollideServer::getResourceID  (63 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: 'res%d'
// 0x10001f78  nCollideServer::BeginCollClasses  (17 insns)
// 0x10001fa0  nCollideServer::AddCollClass  (60 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: nkernel.dll!n_strdup
// 0x1000202c  nCollideServer::EndCollClasses  (2 insns)
// 0x10002031  nCollideServer::BeginCollTypes  (30 insns)
// 0x10002084  nCollideServer::AddCollType  (46 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x100020fc  nCollideServer::EndCollTypes  (2 insns)
// 0x10002101  nCollideServer::QueryCollClass  (21 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'collide/ncollserv_main.cc'
// 0x1000214a  nCollideServer::QueryCollType  (248 insns)
//   calls:   -> nCollideServer::QueryCollType
//   strings: 'v_begincollclasses_v', 'v_addcollclass_s', 'v_endcollclasses_v', 'v_begincolltypes_v', 'v_addcolltype_sss', 'v_endcolltypes_v', 's_querycolltype_ss'
// 0x100023cb  nCollideServer::cmd_begincollclasses (v_begincollclasses_v)  (2 insns)
//   calls:   -> nCollideServer::BeginCollClasses
// 0x100023d4  nCollideServer::cmd_addcollclass (v_addcollclass_s)  (10 insns)
//   calls:   -> nCollideServer::AddCollClass
// 0x100023f7  nCollideServer::cmd_endcollclasses (v_endcollclasses_v)  (2 insns)
//   calls:   -> nCollideServer::EndCollClasses
// 0x10002400  nCollideServer::cmd_begincolltypes (v_begincolltypes_v)  (2 insns)
//   calls:   -> nCollideServer::BeginCollTypes
// 0x10002409  nCollideServer::cmd_addcolltype (v_addcolltype_sss)  (135 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nCollideServer::AddCollType
//   strings: 'ignore', 'quick', 'exact', 'contact'
// 0x1000254a  nCollideServer::cmd_endcolltypes (v_endcolltypes_v)  (2 insns)
//   calls:   -> nCollideServer::EndCollTypes
// 0x10002553  nCollideServer::cmd_querycolltype (s_querycolltype_ss)  (76 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
//   strings: 'exact', 'contact', 'quick', 'ignore'

} // namespace re_ncollide
