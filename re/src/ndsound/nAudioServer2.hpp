#pragma once
// Auto-lifted C++ layout & method spec from ndsound.dll
// Source ASM: re/disasm/ndsound/nAudioServer2.asm
// Class: nAudioServer2

#include <cstdint>

namespace re_ndsound {

struct nAudioServer2_Layout {
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x006c
    uint8_t field_0x006c;
    // +0x006d
    uint8_t field_0x006d;
    // +0x0070
    uint32_t field_0x0070;
    // +0x0074
    uint32_t field_0x0074;
    // +0x00d0
    double field_0x00d0;
    // +0x00d8
    double field_0x00d8;
    // +0x00e0
    uint8_t field_0x00e0;
    // +0x00e1
    uint8_t field_0x00e1;
    // +0x00e8
    double field_0x00e8;
    // +0x00f0
    double field_0x00f0;
};

// Methods (32):
// 0x100020b7  nAudioServer2::nAudioServer2()  (57 insns)
//   calls:   -> nRoot::nRoot()
// 0x10002170  nAudioServer2::operator=  (57 insns)
//   calls:   -> nRoot::operator=
// 0x10002222  nAudioServer2::vfunc_00  (63 insns)
// 0x10003118  nAudioServer2::vfunc_13  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Dispatch
// 0x1000311e  nAudioServer2::vfunc_12  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Import
// 0x10003124  nAudioServer2::vfunc_11  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveCmds
// 0x1000312a  nAudioServer2::vfunc_10  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Parse
// 0x10003130  nAudioServer2::vfunc_09  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Clone
// 0x10003136  nAudioServer2::vfunc_08  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SaveAs
// 0x1000313c  nAudioServer2::vfunc_07  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Save
// 0x10003142  nAudioServer2::vfunc_06  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsInstanceOf
// 0x10003148  nAudioServer2::vfunc_05  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::IsA
// 0x1000314e  nAudioServer2::vfunc_04  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::GetClass
// 0x10003154  nAudioServer2::vfunc_03  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::SetClass
// 0x1000315a  nAudioServer2::vfunc_02  (1 insns)
//   calls:   IAT: nkernel.dll!nRoot::Release
// 0x10003160  nAudioServer2::vfunc_01  (6 insns)
//   calls:   IAT: nkernel.dll!nRoot::Initialize, IAT: nkernel.dll!nRoot::RemObjectRef, IAT: nkernel.dll!nRoot::GetFullName, IAT: nkernel.dll!nRoot::AddObjectRef, IAT: nkernel.dll!nRoot::~nRoot(), IAT: nkernel.dll!nClass::~nClass()
// 0x1000321a  nAudioServer2::vfunc_29  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::NewStream
// 0x10003220  nAudioServer2::vfunc_22  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::UpdateListener
// 0x10003226  nAudioServer2::vfunc_20  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::GetUniqueId
// 0x1000322c  nAudioServer2::vfunc_17  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::GetMasterVolume
// 0x10003232  nAudioServer2::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::GetMode
// 0x10003238  nAudioServer2::vfunc_14  (3 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::SetMode, IAT: nnebula.dll!nAudioServer2::nAudioServer2(), IAT: nnebula.dll!nAudioServer2::~nAudioServer2()
// 0x1000324a  nAudioServer2::vfunc_16  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::SetMasterVolume
// 0x10003250  nAudioServer2::vfunc_18  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::OpenAudio
// 0x10003256  nAudioServer2::vfunc_19  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::CloseAudio
// 0x1000325c  nAudioServer2::vfunc_21  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::BeginScene
// 0x10003262  nAudioServer2::vfunc_28  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::MuteAudio
// 0x10003268  nAudioServer2::vfunc_26  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::EndScene
// 0x1000326e  nAudioServer2::vfunc_27  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::FlushAudio
// 0x10003298  nAudioServer2::vfunc_25  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::StopSound
// 0x1000329e  nAudioServer2::vfunc_24  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::UpdateSound
// 0x100032a4  nAudioServer2::vfunc_23  (160 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::StartSound, IAT: nnebula.dll!nStream::BeginXFade, IAT: nnebula.dll!nStream::EndXFade, IAT: nnebula.dll!nSoundCluster::nSoundCluster(), IAT: nnebula.dll!nSoundCluster::~nSoundCluster(), IAT: nnebula.dll!nSoundCluster::Begin, IAT: nnebula.dll!nSoundCluster::StartSound, IAT: nnebula.dll!nSoundCluster::UpdateSound, IAT: nnebula.dll!nSoundCluster::StopSound, IAT: nnebula.dll!nSoundCluster::End, IAT: nnebula.dll!nSoundCluster::GetHighPriPlayCandidate, IAT: DSOUND.dll!ord_11

} // namespace re_ndsound
