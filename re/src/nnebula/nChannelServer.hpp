#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nChannelServer.asm
// Class: nChannelServer : public nroot

#include <cstdint>

namespace re_nnebula {

struct nChannelServer_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    float field_0x0018;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0030
    float field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x0044
    uint8_t field_0x0044;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0220
    float field_0x0220;
};

// Script AddCmds (7):
//   v_setchannel1f_sf
//   v_setchannel2f_sff
//   v_setchannel3f_sfff
//   v_setchannel4f_sffff
//   v_setchannelstring_ss
//   f_getchannel1f_s
//   s_getchannelstring_s

// Methods (33):
// 0x10003a41  nChannelServer::nChannelServer()  (54 insns)
//   calls:   -> nRoot::nRoot()
// 0x10003ad5  nChannelServer::operator=  (70 insns)
//   calls:   -> nRoot::operator=, IAT: nkernel.dll!n_free
// 0x10003b75  nChannelServer::vfunc_00  (511 insns)
//   calls:   -> nChannelServer::~nChannelServer(), IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   consts:  f32=0, f32=1, f32=0.01, f32=0.1
//   strings: 'c:/nomads/code/inc\\gfx/nchannelset.h'
// 0x1000f5f6  nChannelServer::n_init_nchannelserver  (15 insns)
//   strings: 'nroot'
// 0x1000f621  nChannelServer::n_fini_nchannelserver  (5 insns)
// 0x1000f633  nChannelServer::n_new_nchannelserver  (10 insns)
//   calls:   -> nChannelServer::nChannelServer()
// 0x1000f64d  nChannelServer::n_version_nchannelserver  (2 insns)
// 0x1000f653  nChannelServer::nChannelServer()  (94 insns)
//   strings: '/sys/share/channels', 'nroot'
// 0x1000f748  nChannelServer::~nChannelServer()  (42 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1000f7b8  nChannelServer::AllocChannels  (10 insns)
// 0x1000f7d2  nChannelServer::GenChannel  (54 insns)
//   strings: 'nenv'
// 0x1000f870  nChannelServer::GetChannel  (4 insns)
// 0x1000f881  nChannelServer::SetChannel1f  (5 insns)
// 0x1000f896  nChannelServer::SetChannel2f  (8 insns)
// 0x1000f8b4  nChannelServer::SetChannel3f  (10 insns)
// 0x1000f8d9  nChannelServer::SetChannel4f  (15 insns)
// 0x1000f904  nChannelServer::SetChannelPtr  (5 insns)
// 0x1000f919  nChannelServer::SetChannelStringCopy  (38 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1000f984  nChannelServer::GetChannel1f  (4 insns)
// 0x1000f995  nChannelServer::GetChannel2f  (10 insns)
// 0x1000f9bc  nChannelServer::GetChannel3f  (13 insns)
// 0x1000f9ec  nChannelServer::GetChannel4f  (19 insns)
// 0x1000fa24  nChannelServer::GetChannelPtr  (4 insns)
// 0x1000fa35  nChannelServer::BeginScene  (4 insns)
// 0x1000fa42  nChannelServer::GetContext  (13 insns)
// 0x1000fa62  nChannelServer::EndScene  (118 insns)
//   strings: 'v_setchannel1f_sf', 'v_setchannel2f_sff', 'v_setchannel3f_sfff', 'v_setchannel4f_sffff', 'v_setchannelstring_ss', 'f_getchannel1f_s', 'ff_getchannel2f_s', 'fff_getchannel3f_s'
// 0x1000fbe0  nChannelServer::cmd_setchannel1f (v_setchannel1f_sf)  (21 insns)
//   calls:   -> nChannelServer::GenChannel, -> nChannelServer::SetChannel1f
// 0x1000fc24  nChannelServer::cmd_setchannel2f (v_setchannel2f_sff)  (26 insns)
//   calls:   -> nChannelServer::GenChannel, -> nChannelServer::SetChannel2f
// 0x1000fc77  nChannelServer::cmd_setchannel3f (v_setchannel3f_sfff)  (31 insns)
//   calls:   -> nChannelServer::GenChannel, -> nChannelServer::SetChannel3f
// 0x1000fcd9  nChannelServer::cmd_setchannel4f (v_setchannel4f_sffff)  (36 insns)
//   calls:   -> nChannelServer::GenChannel, -> nChannelServer::SetChannel4f
// 0x1000fd4a  nChannelServer::cmd_setchannelstring (v_setchannelstring_ss)  (19 insns)
//   calls:   -> nChannelServer::GenChannel, -> nChannelServer::SetChannelStringCopy
// 0x1000fd8a  nChannelServer::cmd_getchannel1f (f_getchannel1f_s)  (167 insns)
//   calls:   -> nChannelServer::GenChannel, -> nChannelServer::GetChannel1f, -> nChannelServer::GetChannel2f, -> nChannelServer::GetChannel3f, -> nChannelServer::GetChannel4f
// 0x1000ff76  nChannelServer::cmd_getchannelstring (s_getchannelstring_s)  (23 insns)
//   calls:   -> nChannelServer::GenChannel, -> nChannelServer::GetChannelPtr

} // namespace re_nnebula
