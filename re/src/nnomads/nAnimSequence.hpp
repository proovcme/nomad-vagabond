#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nAnimSequence.asm
// Class: nAnimSequence : public nroot  (sizeof = 0x330 = 816 bytes)

#include <cstdint>

namespace re_nnomads {

struct nAnimSequence_Layout {
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
    // +0x0024
    float field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0078
    uint32_t field_0x0078;
    // +0x007c
    uint32_t field_0x007c;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    uint8_t field_0x00a0;
    // +0x00c4
    uint32_t field_0x00c4;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00fc
    uint32_t field_0x00fc;
    // +0x0100
    uint32_t field_0x0100;
    // +0x0114
    uint32_t field_0x0114;
    // +0x011c
    uint32_t field_0x011c;
    // +0x0310
    uint8_t field_0x0310;
    // +0x0314
    uint32_t field_0x0314;
    // +0x0318
    uint32_t field_0x0318;
    // +0x0320
    double field_0x0320;
    // +0x0328
    uint8_t field_0x0328;
    // +0x0eb0
    uint32_t field_0x0eb0;
    // +0x0eb2
    uint8_t field_0x0eb2;
    // +0x0eb4
    uint32_t field_0x0eb4;
};

// Script AddCmds (16):
//   v_setchannelname_is
//   s_getchannelname_i
//   v_addtranslate_ffff
//   v_addrotate_ffff
//   v_addquaternion_fffff
//   v_addvisual_fs
//   v_addaudio_fs
//   v_addchannel_fif
//   v_setvehiclerelated_b
//   b_isvehiclerelated_v
//   v_setgeneratorproto_s
//   v_setgeneratorname_s
//   s_getgeneratorproto_v
//   s_getgeneratorname_v
//   v_setidletime_f
//   f_getidletime_v

// Methods (66):
// 0x10010365  nAnimSequence::nAnimSequence()  (252 insns)
//   calls:   -> nRoot::nRoot(), IAT: nkernel.dll!n_strdup
// 0x1001060c  nAnimSequence::operator=  (109 insns)
//   calls:   -> nRoot::operator=, IAT: nkernel.dll!n_free
// 0x1001075e  nAnimSequence::vfunc_00  (455 insns)
//   calls:   -> nAnimSequence::~nAnimSequence(), IAT: nkernel.dll!n_strdup, IAT: nkernel.dll!n_free
// 0x10010cd4  nAnimSequence::vfunc_20  (41 insns)
//   calls:   -> nDataHandler::~nDataHandler()
// 0x10011033  nAnimSequence::vfunc_34  (41 insns)
// 0x10053620  nAnimSequence::n_init_nanimsequence  (15 insns)
//   strings: 'nroot'
// 0x1005364b  nAnimSequence::n_fini_nanimsequence  (5 insns)
// 0x1005365d  nAnimSequence::n_new_nanimsequence  (10 insns)
//   calls:   -> nAnimSequence::nAnimSequence()
// 0x10053677  nAnimSequence::n_version_nanimsequence  (2 insns)
// 0x1005367d  nAnimSequence::nAnimSequence()  (75 insns)
//   strings: '/world'
// 0x1005377a  nAnimSequence::~nAnimSequence()  (64 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1005383c  nAnimSequence::SetVehicleRelated  (3 insns)
// 0x10053849  nAnimSequence::IsVehicleRelated  (2 insns)
// 0x10053850  nAnimSequence::SetChannelName  (27 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, -> nRealWorld::GetVChannelIndex
// 0x100538a3  nAnimSequence::GetChannelName  (3 insns)
// 0x100538b1  nAnimSequence::GetChannelIndex  (3 insns)
// 0x100538bf  nAnimSequence::AddTranslate  (53 insns)
//   consts:  f32=0.001
// 0x10053945  nAnimSequence::AddRotate  (53 insns)
//   consts:  f32=0.001
// 0x100539d7  nAnimSequence::AddQuaternion  (55 insns)
//   consts:  f32=0.001
// 0x10053a75  nAnimSequence::AddVisual  (54 insns)
//   calls:   IAT: nkernel.dll!n_strdup, IAT: nkernel.dll!n_free
// 0x10053af8  nAnimSequence::AddAudio  (54 insns)
//   calls:   IAT: nkernel.dll!n_strdup, IAT: nkernel.dll!n_free
// 0x10053b7b  nAnimSequence::AddChannel  (48 insns)
// 0x10053bf3  nAnimSequence::GetDuration  (60 insns)
// 0x10053c92  nAnimSequence::GetFrame  (84 insns)
// 0x10053d7c  nAnimSequence::Visualize  (132 insns)
// 0x10053eda  nAnimSequence::SetGeneratorProto  (36 insns)
// 0x10053f31  nAnimSequence::GetGeneratorProto  (2 insns)
// 0x10053f38  nAnimSequence::SetGeneratorName  (36 insns)
// 0x10053f8f  nAnimSequence::GetGeneratorName  (2 insns)
// 0x10053f96  nAnimSequence::SetIdleTime  (3 insns)
// 0x10053fa3  nAnimSequence::GetIdleTime  (1674 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
//   consts:  f32=0
//   strings: 'v_setchannelname_is', 's_getchannelname_i', 'v_addtranslate_ffff', 'v_addrotate_ffff', 'v_addquaternion_fffff', 'v_addvisual_fs', 'v_addaudio_fs', 'v_addchannel_fif'
// 0x10054f98  nAnimSequence::cmd_setchannelname (v_setchannelname_is)  (16 insns)
//   calls:   -> nAnimSequence::SetChannelName
// 0x10054fc5  nAnimSequence::cmd_getchannelname (s_getchannelname_i)  (23 insns)
//   calls:   -> nAnimSequence::GetChannelName
// 0x10055007  nAnimSequence::cmd_addtranslate (v_addtranslate_ffff)  (26 insns)
//   calls:   -> nAnimSequence::AddTranslate
// 0x10055059  nAnimSequence::cmd_addrotate (v_addrotate_ffff)  (32 insns)
//   calls:   -> nAnimSequence::AddRotate
//   consts:  f32=3.141593, f32=0.005555556
// 0x100550cf  nAnimSequence::cmd_addquaternion (v_addquaternion_fffff)  (31 insns)
//   calls:   -> nAnimSequence::AddQuaternion
// 0x10055130  nAnimSequence::cmd_addvisual (v_addvisual_fs)  (14 insns)
//   calls:   -> nAnimSequence::AddVisual
// 0x10055160  nAnimSequence::cmd_addaudio (v_addaudio_fs)  (14 insns)
//   calls:   -> nAnimSequence::AddAudio
// 0x10055190  nAnimSequence::cmd_addchannel (v_addchannel_fif)  (22 insns)
//   calls:   -> nAnimSequence::AddChannel
// 0x100551d2  nAnimSequence::cmd_setvehiclerelated (v_setvehiclerelated_b)  (12 insns)
//   calls:   -> nAnimSequence::SetVehicleRelated
// 0x100551f8  nAnimSequence::cmd_isvehiclerelated (b_isvehiclerelated_v)  (13 insns)
//   calls:   -> nAnimSequence::IsVehicleRelated
// 0x10055223  nAnimSequence::cmd_setgeneratorproto (v_setgeneratorproto_s)  (11 insns)
// 0x10055247  nAnimSequence::cmd_getgeneratorproto (s_getgeneratorproto_v)  (15 insns)
// 0x10055271  nAnimSequence::cmd_getgeneratorname (s_getgeneratorname_v)  (15 insns)
// 0x1005529b  nAnimSequence::cmd_setidletime (v_setidletime_f)  (14 insns)
// 0x100552c4  nAnimSequence::cmd_getidletime (f_getidletime_v)  (14 insns)
// 0x100552ef  nAnimSequence::SaveCmds  (513 insns)
//   calls:   -> nAnimSequence::vfunc_31, -> nAnimSequence::GetChannelName, -> nAnimSequence::IsVehicleRelated, -> nContainer::nContainer()
//   consts:  f32=0.3183099, f32=180
// 0x1007835d  nAnimSequence::cmd_setgeneratorname (v_setgeneratorname_s)  (11 insns)
// 0x100793f6  nAnimSequence::vfunc_31  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveCmds
// 0x10079432  nAnimSequence::vfunc_01  (4 insns)
//   calls:   IAT: nkernel.dll!nRoot::Initialize, IAT: nkernel.dll!nRoot::nRoot(), IAT: nkernel.dll!nRoot::~nRoot(), IAT: nkernel.dll!nClass::~nClass()
// 0x10079bf4  nAnimSequence::vfunc_49  (1 insns)
//   calls:   IAT: nnetwork.dll!nPDU::IncreaseNumBitsRead
// 0x10079bfa  nAnimSequence::vfunc_48  (1 insns)
//   calls:   IAT: nnetwork.dll!nPDU::IncreaseNumBitsWritten
// 0x10079c00  nAnimSequence::vfunc_47  (1 insns)
//   calls:   IAT: nnetwork.dll!nPDU::GetStatistic
// 0x10079c1e  nAnimSequence::vfunc_41  (1 insns)
//   calls:   IAT: nnetwork.dll!nPDU::GetHeartBeatTime
// 0x10079c24  nAnimSequence::vfunc_40  (1 insns)
//   calls:   IAT: nnetwork.dll!nPDU::UnpackData
// 0x10079c2a  nAnimSequence::vfunc_39  (1 insns)
//   calls:   IAT: nnetwork.dll!nPDU::PackData
// 0x10079c30  nAnimSequence::vfunc_38  (1 insns)
//   calls:   IAT: nnetwork.dll!nPDU::IsGhost
// 0x10079c36  nAnimSequence::vfunc_37  (1 insns)
//   calls:   IAT: nnetwork.dll!nPDU::GetTimestamp
// 0x10079dc2  nAnimSequence::vfunc_50  (1 insns)
//   calls:   IAT: nnetwork.dll!nEntityStatePDU::SaveDRData
// 0x10079dc8  nAnimSequence::vfunc_46  (1 insns)
//   calls:   IAT: nnetwork.dll!nEntityStatePDU::SetCurrentStatistic
// 0x10079dce  nAnimSequence::vfunc_45  (1 insns)
//   calls:   IAT: nnetwork.dll!nEntityStatePDU::Unpack
// 0x10079dd4  nAnimSequence::vfunc_44  (1 insns)
//   calls:   IAT: nnetwork.dll!nEntityStatePDU::Pack
// 0x10079dda  nAnimSequence::vfunc_43  (1 insns)
//   calls:   IAT: nnetwork.dll!nEntityStatePDU::Restore
// 0x10079de0  nAnimSequence::vfunc_42  (1 insns)
//   calls:   IAT: nnetwork.dll!nEntityStatePDU::Save
// 0x10079de6  nAnimSequence::vfunc_36  (1 insns)
//   calls:   IAT: nnetwork.dll!nEntityStatePDU::SetTimestamp
// 0x10079dec  nAnimSequence::vfunc_35  (37 insns)
//   calls:   IAT: nnetwork.dll!nEntityStatePDU::GetType, IAT: nnetwork.dll!nEntityStatePDU::~nEntityStatePDU(), IAT: nnetwork.dll!nDataPDU::EndWriteCustom, IAT: nnetwork.dll!nDataPDU::WriteLong, IAT: nnetwork.dll!nDataPDU::WriteBool, IAT: nnetwork.dll!nDataPDU::WriteFloat, IAT: nnetwork.dll!nDataPDU::BeginWriteCustom, IAT: nnetwork.dll!nDataPDU::SetSizeCustom, IAT: nnetwork.dll!nPDU::SetEntityType, IAT: nnetwork.dll!nPDU::SetGroupID, IAT: nnetwork.dll!nPDU::SetNeedTransmission, IAT: nnetwork.dll!nPDU::SetChanged

} // namespace re_nnomads
