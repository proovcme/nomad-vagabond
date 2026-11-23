#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nobserver.asm
// Class: nobserver : public nroot  (sizeof = 0x174 = 372 bytes)

#include <cstdint>

namespace re_nnebula {

struct nobserver_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x0050
    uint32_t field_0x0050;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint32_t field_0x006c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0084
    uint32_t field_0x0084;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00b0
    uint32_t field_0x00b0;
    // +0x00b4
    uint32_t field_0x00b4;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00cc
    uint32_t field_0x00cc;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00f8
    uint32_t field_0x00f8;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0118
    uint32_t field_0x0118;
    // +0x0128
    uint32_t field_0x0128;
    // +0x012c
    uint32_t field_0x012c;
    // +0x0130
    uint32_t field_0x0130;
    // +0x0140
    uint32_t field_0x0140;
    // +0x0144
    uint32_t field_0x0144;
    // +0x0148
    uint32_t field_0x0148;
    // +0x014c
    float field_0x014c;
    // +0x0150
    uint8_t field_0x0150;
    // +0x0151
    uint8_t field_0x0151;
    // +0x0154
    uint32_t field_0x0154;
    // +0x0158
    uint32_t field_0x0158;
    // +0x015c
    uint32_t field_0x015c;
    // +0x0160
    uint32_t field_0x0160;
    // +0x0164
    uint32_t field_0x0164;
    // +0x0168
    uint32_t field_0x0168;
    // +0x016c
    uint32_t field_0x016c;
    // +0x0170
    uint32_t field_0x0170;
};

// Script AddCmds (9):
//   v_start_v
//   v_stop_v
//   v_startsinglestep_v
//   b_rendersinglestep_v
//   v_setsleep_f
//   f_getsleep_v
//   v_setgrid_b
//   b_getgrid_v
//   v_renderframe_f

// Methods (9):
// 0x10033535  nobserver::n_init_nobserver  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'nroot', 'misc/nobs_init.cc'
// 0x10033590  nobserver::n_fini_nobserver  (14 insns)
// 0x100335b3  nobserver::n_new_nobserver  (10 insns)
// 0x100335cd  nobserver::n_version_nobserver  (1088 insns)
//   calls:   -> nChannelServer::GenChannel, -> nChannelServer::SetChannel1f, -> nSceneGraph2::BeginScene, -> nSceneGraph2::Attach, -> nSceneGraph2::EndScene, -> n3DNode::updateMatrix, -> nInputServer::FlushEvents, IAT: nkernel.dll!n_sleep, -> nInputServer::FirstEvent, -> nInputServer::NextEvent, -> nInputServer::GetButton
//   consts:  f32=0.5, f32=-25, f32=25, f32=1, f64=0, f32=-0.025, f32=0.025, f32=-0.005, f32=0, f32=0.01
//   strings: '/sys/servers/gfx', '/sys/servers/input', '/sys/servers/script', '/sys/servers/sgraph2', '/sys/servers/channel', '/sys/servers/specialfx', '/sys/servers/console', '/sys/servers/particle'
// 0x100343e9  nobserver::cmd_rendersinglestep (b_rendersinglestep_v)  (14 insns)
// 0x10034414  nobserver::cmd_setsleep (v_setsleep_f)  (13 insns)
// 0x1003443c  nobserver::cmd_getsleep (f_getsleep_v)  (12 insns)
// 0x10034465  nobserver::cmd_setgrid (v_setgrid_b)  (12 insns)
// 0x100344b4  nobserver::cmd_renderframe (v_renderframe_f)  (12 insns)

} // namespace re_nnebula
