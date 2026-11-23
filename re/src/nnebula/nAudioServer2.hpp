#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nAudioServer2.asm
// Class: nAudioServer2 : public nroot  (sizeof = 0xf8 = 248 bytes)

#include <cstdint>

namespace re_nnebula {

struct nAudioServer2_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
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
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint8_t field_0x006c;
    // +0x006d
    uint8_t field_0x006d;
    // +0x0070
    float field_0x0070;
    // +0x0074
    float field_0x0074;
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

// Script AddCmds (29):
//   v_setvelocitychannel_s
//   s_getvelocitychannel_v
//   v_settriggerchannel_s
//   s_gettriggerchannel_v
//   v_setfile_s
//   s_getfile_v
//   v_setambient_b
//   b_getambient_v
//   v_setdoppler_b
//   b_getdoppler_v
//   v_setlooping_b
//   b_getlooping_v
//   v_setpriority_f
//   f_getpriority_v
//   v_setvolume_f
//   f_getvolume_v
//   v_setfrequency_f
//   f_getfrequency_v
//   v_setminmaxdist_ff
//   v_start_v
//   v_stop_v
//   v_setmode_s
//   s_getmode_v
//   v_setmastervolume_f
//   f_getmastervolume_v
//   b_openaudio_v
//   v_closeaudio_v
//   v_flushaudio_ff
//   v_muteaudio_b

// Methods (30):
// 0x1000a03b  nAudioServer2::cmd_openaudio (b_openaudio_v)  (14 insns)
// 0x100321bc  nAudioServer2::nAudioServer2()  (57 insns)
//   calls:   -> nRoot::nRoot()
// 0x10032275  nAudioServer2::operator=  (57 insns)
//   calls:   -> nRoot::operator=
// 0x10032327  nAudioServer2::vfunc_00  (181 insns)
//   calls:   -> nAudioServer2::~nAudioServer2()
//   strings: 'v_setvelocitychannel_s', 's_getvelocitychannel_v', 'v_settriggerchannel_s', 's_gettriggerchannel_v', 'v_setfile_s', 's_getfile_v', 'v_setambient_b', 'b_getambient_v'
// 0x100343d7  nAudioServer2::cmd_closeaudio (v_closeaudio_v)  (3 insns)
// 0x1003472d  nAudioServer2::n_init_naudioserver2  (15 insns)
//   strings: 'nroot'
// 0x10034758  nAudioServer2::n_fini_naudioserver2  (5 insns)
// 0x1003476a  nAudioServer2::n_new_naudioserver2  (10 insns)
//   calls:   -> nAudioServer2::nAudioServer2()
// 0x10034784  nAudioServer2::nAudioServer2()  (51 insns)
//   strings: '/sys/share/audio', 'nroot'
// 0x10034828  nAudioServer2::~nAudioServer2()  (25 insns)
// 0x1003486a  nAudioServer2::GetModeTag  (92 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2, IAT: MSVCRT.dll!strtok, IAT: MSVCRT.dll!strchr
// 0x10034955  nAudioServer2::SetMode  (228 insns)
//   calls:   -> nAudioServer2::GetModeTag, IAT: MSVCRT.dll!atoi
//   strings: 'dev', 'bps', 'hz', 'chn', 'speakers', '5.1', 'head', 'mono'
// 0x10034b8a  nAudioServer2::SetMasterVolume  (3 insns)
// 0x10034b94  nAudioServer2::GetMasterVolume  (2 insns)
// 0x10034b98  nAudioServer2::OpenAudio  (3 insns)
// 0x10034b9f  nAudioServer2::CloseAudio  (2 insns)
// 0x10034ba4  nAudioServer2::GetResourceId  (49 insns)
// 0x10034c11  nAudioServer2::NewStream  (96 insns)
//   calls:   IAT: MSVCRT.dll!strstr, IAT: nkernel.dll!n_printf, -> nAudioServer2::GetResourceId
//   strings: '.wav', 'nwavstream', '.ogg', 'noggstream'
// 0x10034d0a  nAudioServer2::UpdateListener  (10 insns)
// 0x10034d1d  nAudioServer2::BeginScene  (14 insns)
// 0x10034d4e  nAudioServer2::EndScene  (2 insns)
// 0x10034d53  nAudioServer2::FlushAudio  (11 insns)
// 0x10034d88  nAudioServer2::MuteAudio  (7 insns)
// 0x10034d9b  nAudioServer2::GetUniqueId  (51 insns)
//   strings: 'v_setmode_s', 's_getmode_v', 'v_setmastervolume_f', 'f_getmastervolume_v', 'b_openaudio_v', 'v_closeaudio_v', 'v_flushaudio_ff', 'v_muteaudio_b'
// 0x10034e67  nAudioServer2::cmd_setmode (v_setmode_s)  (11 insns)
// 0x10034e8b  nAudioServer2::cmd_setmastervolume (v_setmastervolume_f)  (13 insns)
// 0x10034eb3  nAudioServer2::cmd_getmastervolume (f_getmastervolume_v)  (14 insns)
// 0x10034ede  nAudioServer2::cmd_flushaudio (v_flushaudio_ff)  (17 insns)
// 0x10034f12  nAudioServer2::cmd_muteaudio (v_muteaudio_b)  (12 insns)
// 0x100353c7  nAudioServer2::cmd_getmode (s_getmode_v)  (15 insns)

} // namespace re_nnebula
