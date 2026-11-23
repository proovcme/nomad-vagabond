#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nSoundNode.asm
// Class: nSoundNode : public nvisnode  (sizeof = 0x158 = 344 bytes)

#include <cstdint>

namespace re_nnebula {

struct nSoundNode_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0038
    uint32_t field_0x0038;
    // +0x003c
    uint32_t field_0x003c;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00c0
    uint32_t field_0x00c0;
    // +0x00c4
    uint32_t field_0x00c4;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00d8
    uint32_t field_0x00d8;
    // +0x00dc
    uint32_t field_0x00dc;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00f0
    uint32_t field_0x00f0;
    // +0x00f4
    uint8_t field_0x00f4;
    // +0x00f8
    uint32_t field_0x00f8;
    // +0x0100
    uint32_t field_0x0100;
    // +0x0108
    float field_0x0108;
    // +0x010c
    float field_0x010c;
    // +0x0110
    float field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x012c
    float field_0x012c;
    // +0x0130
    float field_0x0130;
    // +0x0134
    uint32_t field_0x0134;
    // +0x0138
    uint32_t field_0x0138;
    // +0x013c
    uint32_t field_0x013c;
    // +0x0140
    float field_0x0140;
    // +0x0144
    uint32_t field_0x0144;
    // +0x0148
    uint32_t field_0x0148;
    // +0x014c
    uint32_t field_0x014c;
    // +0x0150
    uint32_t field_0x0150;
    // +0x0154
    uint8_t field_0x0154;
    // +0x0155
    uint8_t field_0x0155;
    // +0x0156
    uint8_t field_0x0156;
    // +0x0157
    uint8_t field_0x0157;
};

// Methods (53):
// 0x1001f25f  nSoundNode::SetFrequency  (3 insns)
// 0x10031508  nSoundNode::n_init_nsoundnode  (15 insns)
//   strings: 'nvisnode'
// 0x10031533  nSoundNode::n_fini_nsoundnode  (5 insns)
// 0x10031545  nSoundNode::n_new_nsoundnode  (10 insns)
//   calls:   -> nSoundNode::nSoundNode()
// 0x1003155f  nSoundNode::nSoundNode()  (108 insns)
//   calls:   -> nVisNode::nVisNode(), IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
//   strings: '/sys/servers/audio', '/sys/servers/gfx', '/sys/servers/file2', 'velocity', 'soundtrigger'
// 0x100316f3  nSoundNode::~nSoundNode()  (64 insns)
//   calls:   IAT: nkernel.dll!n_free, -> nVisNode::~nVisNode()
// 0x100317c4  nSoundNode::SetFile  (30 insns)
// 0x10031824  nSoundNode::GetFile  (2 insns)
// 0x1003182f  nSoundNode::SetTriggerChannel  (21 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, -> nVisNode::NotifyChannelSetDirty
// 0x10031877  nSoundNode::GetTriggerChannel  (13 insns)
// 0x10031897  nSoundNode::SetVelocityChannel  (21 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, -> nVisNode::NotifyChannelSetDirty
// 0x100318df  nSoundNode::GetVelocityChannel  (13 insns)
// 0x100318ff  nSoundNode::AttachChannels  (36 insns)
//   calls:   -> nVisNode::AttachChannels
// 0x1003195d  nSoundNode::Attach  (17 insns)
//   calls:   -> nVisNode::Attach
// 0x1003198b  nSoundNode::Compute  (176 insns)
//   calls:   -> nVisNode::Compute
//   consts:  f32=0, f32=1, f32=0.99
// 0x10031d9e  nSoundNode::nSoundNode()  (70 insns)
//   calls:   -> nVisNode::nVisNode()
// 0x10031eb6  nSoundNode::operator=  (121 insns)
//   calls:   -> nVisNode::operator=, IAT: nkernel.dll!n_free
// 0x1003203b  nSoundNode::vfunc_00  (80 insns)
//   calls:   -> nSoundNode::~nSoundNode()
// 0x1003210f  nSoundNode::SetAmbient  (3 insns)
// 0x1003211c  nSoundNode::GetAmbient  (2 insns)
// 0x10032123  nSoundNode::SetDoppler  (3 insns)
// 0x10032130  nSoundNode::GetDoppler  (2 insns)
// 0x10032137  nSoundNode::SetLooping  (3 insns)
// 0x10032144  nSoundNode::GetLooping  (2 insns)
// 0x1003214b  nSoundNode::SetPriority  (3 insns)
// 0x10032158  nSoundNode::GetPriority  (2 insns)
// 0x1003215f  nSoundNode::SetVolume  (3 insns)
// 0x1003216c  nSoundNode::GetVolume  (2 insns)
// 0x10032173  nSoundNode::GetFrequency  (2 insns)
// 0x1003217a  nSoundNode::SetMinMaxDist  (5 insns)
// 0x10032191  nSoundNode::GetMinMaxDist  (7 insns)
// 0x100321ac  nSoundNode::Start  (2 insns)
// 0x100321b4  nSoundNode::Stop  (2 insns)
// 0x100325b5  nSoundNode::cmd_setvelocitychannel (v_setvelocitychannel_s)  (10 insns)
//   calls:   -> nSoundNode::SetVelocityChannel
// 0x100325d8  nSoundNode::cmd_getvelocitychannel (s_getvelocitychannel_v)  (14 insns)
//   calls:   -> nSoundNode::GetVelocityChannel
// 0x10032602  nSoundNode::cmd_settriggerchannel (v_settriggerchannel_s)  (10 insns)
//   calls:   -> nSoundNode::SetTriggerChannel
// 0x10032625  nSoundNode::cmd_gettriggerchannel (s_gettriggerchannel_v)  (14 insns)
//   calls:   -> nSoundNode::GetTriggerChannel
// 0x1003264f  nSoundNode::cmd_setfile (v_setfile_s)  (10 insns)
//   calls:   -> nSoundNode::SetFile
// 0x10032672  nSoundNode::cmd_getfile (s_getfile_v)  (14 insns)
//   calls:   -> nSoundNode::GetFile
// 0x1003269c  nSoundNode::cmd_setambient (v_setambient_b)  (10 insns)
// 0x100326c0  nSoundNode::cmd_getambient (b_getambient_v)  (13 insns)
// 0x100326ec  nSoundNode::cmd_setdoppler (v_setdoppler_b)  (10 insns)
// 0x10032710  nSoundNode::cmd_getdoppler (b_getdoppler_v)  (13 insns)
// 0x1003273c  nSoundNode::cmd_setlooping (v_setlooping_b)  (10 insns)
// 0x10032760  nSoundNode::cmd_getlooping (b_getlooping_v)  (13 insns)
// 0x1003278c  nSoundNode::cmd_setpriority (v_setpriority_f)  (10 insns)
// 0x100327b1  nSoundNode::cmd_getpriority (f_getpriority_v)  (11 insns)
// 0x100327db  nSoundNode::cmd_setvolume (v_setvolume_f)  (10 insns)
// 0x10032800  nSoundNode::cmd_getvolume (f_getvolume_v)  (11 insns)
// 0x10032854  nSoundNode::cmd_setminmaxdist (v_setminmaxdist_ff)  (41 insns)
// 0x100328d8  nSoundNode::cmd_start (v_start_v)  (3 insns)
// 0x100328e4  nSoundNode::cmd_stop (v_stop_v)  (3 insns)
// 0x100328f0  nSoundNode::SaveCmds  (309 insns)
//   calls:   -> nVisNode::SaveCmds, -> nSoundNode::GetVelocityChannel, -> nSoundNode::GetTriggerChannel, -> nSoundNode::GetFile
//   strings: 'velocity', 'soundtrigger'

} // namespace re_nnebula
