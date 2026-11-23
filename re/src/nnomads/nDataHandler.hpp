#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nDataHandler.asm
// Class: nDataHandler : public nroot  (sizeof = 0xc0 = 192 bytes)

#include <cstdint>

namespace re_nnomads {

struct nDataHandler_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0034
    uint32_t field_0x0034;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0068
    uint32_t field_0x0068;
    // +0x0080
    uint32_t field_0x0080;
    // +0x008c
    uint32_t field_0x008c;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00b4
    uint32_t field_0x00b4;
    // +0x00b8
    uint8_t field_0x00b8;
    // +0x00b9
    uint8_t field_0x00b9;
    // +0x00bc
    uint32_t field_0x00bc;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
};

// Script AddCmds (8):
//   __permanent_data
//   __keep_data
//   v_setdatapaths_ss
//   o_load_s
//   v_unload_s
//   b_loadlist_s
//   b_unloadlist_s
//   o_loadpermanent_s

// Methods (32):
// 0x10010b81  nDataHandler::EnableSafetyMode  (3 insns)
// 0x10010b8e  nDataHandler::nDataHandler()  (52 insns)
//   calls:   -> nRoot::nRoot()
// 0x10010c2c  nDataHandler::operator=  (58 insns)
//   calls:   -> nRoot::operator=, IAT: nkernel.dll!n_free
// 0x10057bca  nDataHandler::n_init_ndatahandler  (15 insns)
//   strings: 'nroot'
// 0x10057bf5  nDataHandler::n_fini_ndatahandler  (5 insns)
// 0x10057c07  nDataHandler::n_new_ndatahandler  (10 insns)
//   calls:   -> nDataHandler::nDataHandler()
// 0x10057c21  nDataHandler::nDataHandler()  (72 insns)
//   strings: '/world', '/sys/servers/menuhandler', '/sys/servers/file2'
// 0x10057d1c  nDataHandler::~nDataHandler()  (60 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x10057dd5  nDataHandler::createToc  (187 insns)
//   calls:   IAT: MSVCRT.dll!strstr, IAT: nkernel.dll!n_strncpy2, IAT: MSVCRT.dll!strrchr, -> nDataHandler::ReadTransformSources
//   strings: '/datatoc', 'nroot', '..', '.n'
// 0x10057fe4  nDataHandler::SetDataPaths  (42 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, -> nDataHandler::createToc
//   strings: 'nroot'
// 0x1005806b  nDataHandler::GetDataPaths  (18 insns)
// 0x100580a4  nDataHandler::SetPreload  (3 insns)
// 0x100580b1  nDataHandler::splitProtoName  (28 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2, IAT: MSVCRT.dll!strchr
// 0x100580f3  nDataHandler::MarkPermanent  (21 insns)
//   strings: '__permanent_data', 'nroot'
// 0x10058136  nDataHandler::MarkKeep  (21 insns)
//   strings: '__keep_data', 'nroot'
// 0x10058179  nDataHandler::Cleanup  (42 insns)
//   calls:   -> nRoot::GetHead
//   strings: '__permanent_data', '__keep_data'
// 0x100581e2  nDataHandler::Load  (145 insns)
//   calls:   -> nRealWorld::GetAlias, IAT: nkernel.dll!n_strncpy2, IAT: MSVCRT.dll!strchr, IAT: MSVCRT.dll!sprintf, IAT: nkernel.dll!n_printf, -> nDataHandler::MarkPermanent
//   strings: '%s/%s.n', 'visual'
// 0x100583aa  nDataHandler::Unload  (57 insns)
//   calls:   -> nRealWorld::GetAlias, IAT: nkernel.dll!n_strncpy2, IAT: MSVCRT.dll!strchr
// 0x10058457  nDataHandler::GetProtoName  (24 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: '%s/%s', '%s'
// 0x100584a7  nDataHandler::GetIndexByProtoName  (115 insns)
//   calls:   -> nRealWorld::GetAlias, -> nDataHandler::Load, IAT: nkernel.dll!n_strncpy2, IAT: MSVCRT.dll!strchr, -> nRoot::GetHead
//   strings: 'vhcl'
// 0x100585db  nDataHandler::GetIndexByProto  (16 insns)
//   calls:   -> nDataHandler::GetProtoName, -> nDataHandler::GetIndexByProtoName
// 0x10058608  nDataHandler::GetProtoByIndex  (75 insns)
//   calls:   -> nRoot::GetHead, -> nDataHandler::Load
//   strings: 'vhcl'
// 0x100586b7  nDataHandler::LoadList  (111 insns)
//   calls:   -> nRoot::GetHead, -> nStateNode::GetPrototype, -> nDataHandler::MarkKeep, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!fgets, IAT: MSVCRT.dll!strtok, -> nDataHandler::Load
//   strings: 'clans'
// 0x100587e6  nDataHandler::UnloadList  (62 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!fgets, IAT: MSVCRT.dll!strtok, -> nDataHandler::Unload
// 0x10058895  nDataHandler::ReadTransformSources  (109 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: '%s/transform.txt', 'transform', 'nenv', 'v_setdatapaths_ss', 'ss_getdatapaths_v', 'o_load_s', 'v_unload_s', 'b_loadlist_s'
// 0x10058a08  nDataHandler::cmd_setdatapaths (v_setdatapaths_ss)  (42 insns)
//   calls:   -> nDataHandler::SetDataPaths, -> nDataHandler::GetDataPaths
// 0x10058a80  nDataHandler::cmd_load (o_load_s)  (22 insns)
//   calls:   -> nDataHandler::Load
// 0x10058ac3  nDataHandler::cmd_loadpermanent (o_loadpermanent_s)  (27 insns)
//   calls:   -> nDataHandler::Load, -> nDataHandler::MarkPermanent
// 0x10058b15  nDataHandler::cmd_unload (v_unload_s)  (10 insns)
//   calls:   -> nDataHandler::Unload
// 0x10058b38  nDataHandler::cmd_loadlist (b_loadlist_s)  (22 insns)
//   calls:   -> nDataHandler::LoadList
// 0x10058b7b  nDataHandler::cmd_unloadlist (b_unloadlist_s)  (22 insns)
//   calls:   -> nDataHandler::UnloadList
// 0x1005f7f0  nDataHandler::GetPreload  (2 insns)

} // namespace re_nnomads
