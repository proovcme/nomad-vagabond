#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nCommServer.asm
// Class: nCommServer : public nroot  (sizeof = 0x130 = 304 bytes)

#include <cstdint>

namespace re_nnetwork {

struct nCommServer_Layout {
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
    double field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x003c
    uint32_t field_0x003c;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0070
    uint32_t field_0x0070;
    // +0x007c
    uint32_t field_0x007c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0084
    uint32_t field_0x0084;
    // +0x0088
    uint32_t field_0x0088;
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
    // +0x00ac
    uint32_t field_0x00ac;
    // +0x00b4
    uint32_t field_0x00b4;
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
    float field_0x00e0;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00e8
    uint32_t field_0x00e8;
    // +0x00ec
    uint32_t field_0x00ec;
    // +0x00f0
    uint32_t field_0x00f0;
    // +0x00f4
    uint32_t field_0x00f4;
    // +0x00f8
    uint32_t field_0x00f8;
    // +0x00fc
    uint32_t field_0x00fc;
    // +0x0100
    uint32_t field_0x0100;
    // +0x0110
    uint32_t field_0x0110;
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

// Script AddCmds (21):
//   v_opensession_si
//   i_asksessions_bsi
//   v_joinsession_i
//   v_closesession_v
//   v_setregulartransmission_b
//   v_setdrthreshold_f
//   f_getdrthreshold_v
//   v_showstats_v
//   v_hidestats_v
//   v_togglestats_v
//   v_resetstats_v
//   v_printentities_v
//   v_printghosts_v
//   v_settransmissiontime_f
//   f_gettransmissiontime_v
//   v_setprediction_s
//   s_getprediction_v
//   v_setsmoothing_s
//   s_getsmoothing_v
//   i_getclientid_v
//   b_ishost_v

// Methods (76):
// 0x100035a2  nCommServer::SetDRThreshold  (3 insns)
// 0x10009032  nCommServer::nCommServer()  (132 insns)
//   calls:   -> nRecentStateManager::nRecentStateManager(), -> nAOIManager::nAOIManager()
//   consts:  f64=0.1, f64=0.25
//   strings: '/sys/servers/network', '/sys/servers/time', '/sys/servers/console'
// 0x1000922b  nCommServer::~nCommServer()  (93 insns)
// 0x1000934f  nCommServer::Trigger  (58 insns)
//   calls:   -> nCommServer::UpdateRemotePDUs, -> nCommServer::ReceiveData, -> nCommServer::UpdateLocalPDUs, -> nCommServer::SendData, -> nCommServer::UpdateStatistics, -> nCommServer::CheckConnection
// 0x100093fa  nCommServer::OpenSession  (107 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   strings: '/sys/share/clients', 'nroot', '/sys/share/clients/incoming', '/sys/share/clients/leaving'
// 0x1000954f  nCommServer::AskSessions  (119 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!strncpy, IAT: MSVCRT.dll!strtok, IAT: MSVCRT.dll!atoi
// 0x1000966e  nCommServer::JoinSession  (87 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   strings: 'Join network session...'
// 0x10009788  nCommServer::CloseSession  (112 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nCommServer::SendData, -> nCommServer::FlushDataToNetwork
// 0x100098e6  nCommServer::SessionFull  (43 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: '/sys/share/sessions/%d/max_players'
// 0x10009966  nCommServer::LockSession  (7 insns)
// 0x1000997c  nCommServer::SessionLocked  (4 insns)
// 0x1000998b  nCommServer::Disconnected  (2 insns)
// 0x10009992  nCommServer::CreateTargetMachine  (75 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: '%d', 'nenv'
// 0x10009a6c  nCommServer::RemoveTargetMachine  (53 insns)
//   calls:   -> nCommServer::FindTargetMachine, IAT: MSVCRT.dll!sprintf
//   strings: '%d', 'nenv'
// 0x10009afe  nCommServer::FindTargetMachine  (17 insns)
// 0x10009b2a  nCommServer::GetFreeID  (7 insns)
// 0x10009b49  nCommServer::FlushDataToNetwork  (105 insns)
// 0x10009c7d  nCommServer::CreateEntity  (27 insns)
//   calls:   -> nCommServer::GetFreeID, -> nPDU::SetEntityID, -> nPDUManager::AddLocal
// 0x10009cc2  nCommServer::GetEntities  (2 insns)
//   calls:   -> nPDUManager::GetRemotes
// 0x10009ccd  nCommServer::ReceiveData  (177 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nCommServer::FindTargetMachine, -> nCommServer::RemoveTargetMachine, -> nCommServer::CreateTargetMachine
// 0x10009eb2  nCommServer::SendData  (260 insns)
//   calls:   -> nAOIManager::SetTargetMachine, -> nPDUManager::GetLocals, -> nPDUStatistic::GetNumLocal, -> nPDU::SetState, -> nPDUManager::GetRemotes
// 0x1000a1d4  nCommServer::DeadReckon  (27 insns)
//   calls:   -> nCommServer::SmoothPath, -> nCommServer::PredictPath
// 0x1000a217  nCommServer::PredictPath  (165 insns)
//   calls:   -> nEntityStatePDU::GetLastOrientation, -> nEntityStatePDU::SetOrientation, -> nEntityStatePDU::GetLastPosition, -> nEntityStatePDU::GetLastVelocity, -> nEntityStatePDU::SetPosition, -> nEntityStatePDU::GetPosition
// 0x1000a3dc  nCommServer::SmoothPath  (180 insns)
//   calls:   -> nEntityStatePDU::GetPredictedPosition, -> nEntityStatePDU::GetRecentPosition, -> nEntityStatePDU::SetLastPosition, -> nEntityStatePDU::GetRecentOrientation, -> nEntityStatePDU::SetSmoothingTime, -> nEntityStatePDU::GetSmoothingTime, -> nEntityStatePDU::GetPredictedOrientation, -> nEntityStatePDU::SetLastOrientation
//   consts:  f32=0.001, f32=1
// 0x1000a5df  nCommServer::UpdateLocalPDUs  (96 insns)
//   calls:   -> nPDUManager::GetLocals, -> nPDU::NeedTransmission, -> nPDU::SetNeedTransmission, -> nEntityStatePDU::GetOrientation, -> nCommServer::PredictPath, -> nEntityStatePDU::GetLastOrientation
//   consts:  f32=0.05
// 0x1000a6e1  nCommServer::UpdateRemotePDUs  (46 insns)
//   calls:   -> nPDUManager::GetRemotes, -> nCommServer::SmoothPath, -> nCommServer::PredictPath
// 0x1000a748  nCommServer::SetRegularTransmission  (3 insns)
// 0x1000a755  nCommServer::SetTransmissionTime  (3 insns)
// 0x1000a762  nCommServer::GetTransmissionTime  (2 insns)
// 0x1000a769  nCommServer::GetDRThreshold  (2 insns)
// 0x1000a770  nCommServer::SetPrediction  (60 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   strings: 'pos', 'posvel'
// 0x1000a804  nCommServer::GetPrediction  (11 insns)
//   strings: 'posvel', 'pos'
// 0x1000a81f  nCommServer::SetSmoothing  (60 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   strings: 'snap', 'linear'
// 0x1000a8b3  nCommServer::GetSmoothing  (11 insns)
//   strings: 'linear', 'snap'
// 0x1000a8ce  nCommServer::UpdateStatistics  (331 insns)
//   calls:   -> nNetworkStatistic::SetCurrent, -> nNetworkStatistic::GetNumLocal, -> nNetworkStatistic::GetNumSend, -> nNetworkStatistic::GetNumBitsSend, -> nNetworkStatistic::GetNumRemote, -> nNetworkStatistic::GetNumReceived, -> nNetworkStatistic::GetNumBitsReceived
//   strings: 'netstat_time Statistic time', 'netstat_out DataPDUs (live)', 'netstat_out DataPDUs send', 'netstat_out DataPDUs send psec', 'netstat_out DataPDUs bits send', 'netstat_out DataPDUs bits send psec', 'netstat_out ESPDUs (live)', 'netstat_out ESPDUs send'
// 0x1000ad09  nCommServer::ShowStats  (7 insns)
//   strings: 'netstat*'
// 0x1000ad1e  nCommServer::HideStats  (5 insns)
// 0x1000ad2d  nCommServer::ToggleStats  (17 insns)
//   calls:   -> nCommServer::ShowStats
// 0x1000ad61  nCommServer::ResetStats  (19 insns)
//   calls:   -> nNetworkStatistic::Reset
// 0x1000ad95  nCommServer::PrintEntities  (64 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nPDUManager::GetLocals, -> nPDU::GetEntityType, -> nPDU::GetGroupID, -> nPDU::GetMachineID, -> nPDU::GetEntityID
// 0x1000ae30  nCommServer::PrintGhosts  (64 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nPDUManager::GetRemotes, -> nPDU::GetEntityType, -> nPDU::GetGroupID, -> nPDU::GetMachineID, -> nPDU::GetEntityID
// 0x1000aecb  nCommServer::IsHost  (2 insns)
// 0x1000aed2  nCommServer::VoteNextHost  (5 insns)
// 0x1000aee4  nCommServer::CheckConnection  (55 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nCommServer::RemoveTargetMachine
// 0x1000af65  nCommServer::ConnectionLost  (163 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'UNKNOWN', 'Aborting.', 'c:/nomads/code/inc\\kernel/nref.h', 'NOT INITIALIZED', 'c:/nomads/code/inc\\kernel/nautoref.h'
// 0x1000b126  nCommServer::nCommServer()  (99 insns)
//   calls:   -> nRoot::nRoot()
// 0x1000b2c1  nCommServer::operator=  (98 insns)
//   calls:   -> nRoot::operator=
// 0x1000b456  nCommServer::vfunc_00  (41 insns)
//   calls:   -> nCommServer::~nCommServer()
// 0x1000b4b7  nCommServer::GetClientID  (2 insns)
// 0x1000b4bf  nCommServer::IsConnected  (2 insns)
// 0x1000b4c6  nCommServer::SetConnected  (525 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   consts:  f32=0, f32=1, f32=0.05, f32=-1, f32=0.5, f32=3.141593, f32=2
//   strings: '/sys/var/%s', 'nenv'
// 0x1000ba19  nCommServer::n_init_ncommserver  (15 insns)
//   strings: 'nroot'
// 0x1000ba44  nCommServer::n_fini_ncommserver  (5 insns)
// 0x1000ba56  nCommServer::n_new_ncommserver  (10 insns)
//   calls:   -> nCommServer::nCommServer()
// 0x1000ba70  nCommServer::n_version_ncommserver  (115 insns)
//   strings: 'v_opensession_si', 'i_asksessions_bsi', 'v_joinsession_i', 'v_closesession_v', 'v_setregulartransmission_b', 'v_setdrthreshold_f', 'f_getdrthreshold_v', 'v_showstats_v'
// 0x1000bc59  nCommServer::cmd_opensession (v_opensession_si)  (28 insns)
//   calls:   IAT: MSVCRT.dll!strncpy
// 0x1000bca7  nCommServer::cmd_asksessions (i_asksessions_bsi)  (43 insns)
//   calls:   IAT: MSVCRT.dll!strncpy
// 0x1000bd28  nCommServer::cmd_joinsession (v_joinsession_i)  (11 insns)
// 0x1000bd4c  nCommServer::cmd_closesession (v_closesession_v)  (3 insns)
// 0x1000bd55  nCommServer::cmd_setregulartransmission (v_setregulartransmission_b)  (12 insns)
//   calls:   -> nCommServer::SetRegularTransmission
// 0x1000bd7b  nCommServer::cmd_setdrthreshold (v_setdrthreshold_f)  (12 insns)
//   calls:   -> nCommServer::SetDRThreshold
// 0x1000bda2  nCommServer::cmd_getdrthreshold (f_getdrthreshold_v)  (13 insns)
//   calls:   -> nCommServer::GetDRThreshold
// 0x1000bdcd  nCommServer::cmd_showstats (v_showstats_v)  (2 insns)
//   calls:   -> nCommServer::ShowStats
// 0x1000bdd6  nCommServer::cmd_hidestats (v_hidestats_v)  (2 insns)
//   calls:   -> nCommServer::HideStats
// 0x1000bddf  nCommServer::cmd_togglestats (v_togglestats_v)  (2 insns)
//   calls:   -> nCommServer::ToggleStats
// 0x1000bde8  nCommServer::cmd_resetstats (v_resetstats_v)  (2 insns)
//   calls:   -> nCommServer::ResetStats
// 0x1000bdf1  nCommServer::cmd_printentities (v_printentities_v)  (2 insns)
//   calls:   -> nCommServer::PrintEntities
// 0x1000bdfa  nCommServer::cmd_printghosts (v_printghosts_v)  (2 insns)
//   calls:   -> nCommServer::PrintGhosts
// 0x1000be03  nCommServer::cmd_settransmissiontime (v_settransmissiontime_f)  (13 insns)
//   calls:   -> nCommServer::SetTransmissionTime
// 0x1000be2b  nCommServer::cmd_gettransmissiontime (f_gettransmissiontime_v)  (13 insns)
//   calls:   -> nCommServer::GetTransmissionTime
// 0x1000be56  nCommServer::cmd_setprediction (v_setprediction_s)  (10 insns)
//   calls:   -> nCommServer::SetPrediction
// 0x1000be79  nCommServer::cmd_getprediction (s_getprediction_v)  (14 insns)
//   calls:   -> nCommServer::GetPrediction
// 0x1000bea3  nCommServer::cmd_setsmoothing (v_setsmoothing_s)  (10 insns)
//   calls:   -> nCommServer::SetSmoothing
// 0x1000bec6  nCommServer::cmd_getsmoothing (s_getsmoothing_v)  (14 insns)
//   calls:   -> nCommServer::GetSmoothing
// 0x1000bef0  nCommServer::cmd_getclientid (i_getclientid_v)  (14 insns)
// 0x1000bf20  nCommServer::cmd_ishost (b_ishost_v)  (16 insns)
//   calls:   -> nCommServer::IsHost, IAT: nkernel.dll!nClass::AddSubClass, IAT: nkernel.dll!nClass::RemSubClass

} // namespace re_nnetwork
