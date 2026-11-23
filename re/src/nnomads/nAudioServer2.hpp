#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nAudioServer2.asm
// Class: nAudioServer2

#include <cstdint>

namespace re_nnomads {

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

// Methods (19):
// 0x1007194e  nAudioServer2::nAudioServer2()  (57 insns)
//   calls:   -> nRoot::nRoot()
// 0x10071a07  nAudioServer2::operator=  (57 insns)
//   calls:   -> nRoot::operator=
// 0x10071ab9  nAudioServer2::vfunc_00  (129 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: '/sys/var/%s', 'nenv', 'empty'
// 0x10079a98  nAudioServer2::vfunc_29  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::NewStream
// 0x10079a9e  nAudioServer2::vfunc_28  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::MuteAudio
// 0x10079aa4  nAudioServer2::vfunc_27  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::FlushAudio
// 0x10079aaa  nAudioServer2::vfunc_26  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::EndScene
// 0x10079ab0  nAudioServer2::vfunc_25  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::StopSound
// 0x10079ab6  nAudioServer2::vfunc_24  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::UpdateSound
// 0x10079abc  nAudioServer2::vfunc_23  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::StartSound
// 0x10079ac2  nAudioServer2::vfunc_22  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::UpdateListener
// 0x10079ac8  nAudioServer2::vfunc_21  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::BeginScene
// 0x10079ace  nAudioServer2::vfunc_20  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::GetUniqueId
// 0x10079ad4  nAudioServer2::vfunc_19  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::CloseAudio
// 0x10079ada  nAudioServer2::vfunc_18  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::OpenAudio
// 0x10079ae0  nAudioServer2::vfunc_17  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::GetMasterVolume
// 0x10079ae6  nAudioServer2::vfunc_16  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::SetMasterVolume
// 0x10079aec  nAudioServer2::vfunc_15  (1 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::GetMode
// 0x10079af2  nAudioServer2::vfunc_14  (3 insns)
//   calls:   IAT: nnebula.dll!nAudioServer2::SetMode, IAT: nnebula.dll!nAudioServer2::~nAudioServer2(), IAT: nnebula.dll!nShadowServer::SetCastShadows

} // namespace re_nnomads
