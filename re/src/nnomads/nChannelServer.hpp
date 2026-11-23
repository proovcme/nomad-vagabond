#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nChannelServer.asm
// Class: nChannelServer

#include <cstdint>

namespace re_nnomads {

struct nChannelServer_Layout {
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
};

// Methods (12):
// 0x10007f01  nChannelServer::nChannelServer()  (54 insns)
//   calls:   -> nRoot::nRoot()
// 0x10007f95  nChannelServer::operator=  (70 insns)
//   calls:   -> nRoot::operator=, IAT: nkernel.dll!n_free
// 0x10008035  nChannelServer::vfunc_00  (41 insns)
// 0x10008108  nChannelServer::vfunc_14  (41 insns)
// 0x1000832f  nChannelServer::vfunc_30  (41 insns)
// 0x1007989a  nChannelServer::vfunc_44  (2 insns)
//   calls:   IAT: nnebula.dll!nInputServer::Trigger, IAT: nnebula.dll!nInputServer::~nInputServer()
// 0x10079d68  nChannelServer::vfunc_26  (1 insns)
//   calls:   IAT: nnetwork.dll!nDataPDU::SetCurrentStatistic
// 0x10079d6e  nChannelServer::vfunc_25  (1 insns)
//   calls:   IAT: nnetwork.dll!nDataPDU::Unpack
// 0x10079d74  nChannelServer::vfunc_24  (1 insns)
//   calls:   IAT: nnetwork.dll!nDataPDU::Pack
// 0x10079d7a  nChannelServer::vfunc_23  (1 insns)
//   calls:   IAT: nnetwork.dll!nDataPDU::Restore
// 0x10079d80  nChannelServer::vfunc_22  (1 insns)
//   calls:   IAT: nnetwork.dll!nDataPDU::Save
// 0x10079d86  nChannelServer::vfunc_15  (10 insns)
//   calls:   IAT: nnetwork.dll!nDataPDU::GetType, IAT: nnetwork.dll!nDataPDU::~nDataPDU(), IAT: nnetwork.dll!nNetNode::nNetNode(), IAT: nnetwork.dll!nPDU::SetState, IAT: nnetwork.dll!nPDU::GetEntityID, IAT: nnetwork.dll!nPDU::GetMachineID, IAT: nnetwork.dll!nPDU::GetState, IAT: nnetwork.dll!nPDU::GetEntityType, IAT: nnetwork.dll!nPDU::GetGroupID, IAT: nnetwork.dll!nEntityStatePDU::GetRecentPosition

} // namespace re_nnomads
