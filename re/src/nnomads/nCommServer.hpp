#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nCommServer.asm
// Class: nCommServer

#include <cstdint>

namespace re_nnomads {

struct nCommServer_Layout {
    // +0x008c
    uint32_t field_0x008c;
    // +0x0090
    uint32_t field_0x0090;
    // +0x0094
    uint32_t field_0x0094;
    // +0x0098
    uint32_t field_0x0098;
    // +0x009a
    uint32_t field_0x009a;
    // +0x009c
    uint8_t field_0x009c;
    // +0x009e
    uint32_t field_0x009e;
    // +0x00a0
    uint8_t field_0x00a0;
    // +0x00a1
    uint8_t field_0x00a1;
    // +0x00a2
    uint8_t field_0x00a2;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00c0
    double field_0x00c0;
    // +0x00c8
    double field_0x00c8;
    // +0x00d0
    uint8_t field_0x00d0;
    // +0x00d8
    double field_0x00d8;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x0114
    uint8_t field_0x0114;
    // +0x0118
    double field_0x0118;
    // +0x0120
    double field_0x0120;
    // +0x0128
    uint32_t field_0x0128;
    // +0x012c
    uint32_t field_0x012c;
};

// Methods (20):
// 0x1000757a  nCommServer::nCommServer()  (99 insns)
//   calls:   -> nRoot::nRoot()
// 0x10007715  nCommServer::operator=  (98 insns)
//   calls:   -> nRoot::operator=
// 0x100078aa  nCommServer::vfunc_00  (41 insns)
// 0x1000790b  nCommServer::GetClientID  (2 insns)
// 0x10007913  nCommServer::IsConnected  (2 insns)
// 0x1000791a  nCommServer::SetConnected  (3 insns)
// 0x10007cee  nCommServer::vfunc_27  (41 insns)
//   calls:   -> nStateNode::~nStateNode()
// 0x10079d14  nCommServer::vfunc_26  (1 insns)
//   calls:   IAT: nnetwork.dll!nCommServer::ConnectionLost
// 0x10079d1a  nCommServer::vfunc_25  (1 insns)
//   calls:   IAT: nnetwork.dll!nCommServer::VoteNextHost
// 0x10079d20  nCommServer::vfunc_24  (1 insns)
//   calls:   IAT: nnetwork.dll!nCommServer::SessionLocked
// 0x10079d26  nCommServer::vfunc_23  (1 insns)
//   calls:   IAT: nnetwork.dll!nCommServer::LockSession
// 0x10079d2c  nCommServer::vfunc_22  (1 insns)
//   calls:   IAT: nnetwork.dll!nCommServer::SessionFull
// 0x10079d32  nCommServer::vfunc_21  (1 insns)
//   calls:   IAT: nnetwork.dll!nCommServer::Disconnected
// 0x10079d38  nCommServer::vfunc_20  (1 insns)
//   calls:   IAT: nnetwork.dll!nCommServer::GetEntities
// 0x10079d3e  nCommServer::vfunc_19  (1 insns)
//   calls:   IAT: nnetwork.dll!nCommServer::CreateEntity
// 0x10079d44  nCommServer::vfunc_18  (1 insns)
//   calls:   IAT: nnetwork.dll!nCommServer::SessionStarted
// 0x10079d4a  nCommServer::vfunc_17  (1 insns)
//   calls:   IAT: nnetwork.dll!nCommServer::CloseSession
// 0x10079d50  nCommServer::vfunc_16  (1 insns)
//   calls:   IAT: nnetwork.dll!nCommServer::JoinSession
// 0x10079d56  nCommServer::vfunc_15  (1 insns)
//   calls:   IAT: nnetwork.dll!nCommServer::AskSessions
// 0x10079d5c  nCommServer::vfunc_14  (2 insns)
//   calls:   IAT: nnetwork.dll!nCommServer::OpenSession, IAT: nnetwork.dll!nCommServer::~nCommServer()

} // namespace re_nnomads
