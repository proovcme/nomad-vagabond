#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nInputServer.asm
// Class: nInputServer : public nroot  (sizeof = 0x128 = 296 bytes)

#include <cstdint>

namespace re_nnebula {

struct nInputServer_Layout {
    // +0x0004
    float field_0x0004;
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
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0030
    double field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    double field_0x0038;
    // +0x0040
    double field_0x0040;
    // +0x0048
    double field_0x0048;
    // +0x0050
    float field_0x0050;
    // +0x0054
    uint8_t field_0x0054;
    // +0x0058
    uint8_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint8_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x0074
    uint32_t field_0x0074;
    // +0x0078
    uint32_t field_0x0078;
    // +0x007c
    uint32_t field_0x007c;
    // +0x0080
    uint32_t field_0x0080;
    // +0x0090
    uint32_t field_0x0090;
    // +0x0094
    uint32_t field_0x0094;
    // +0x009c
    uint32_t field_0x009c;
    // +0x00a0
    uint8_t field_0x00a0;
    // +0x00a1
    uint8_t field_0x00a1;
    // +0x00a4
    uint32_t field_0x00a4;
    // +0x00a8
    uint32_t field_0x00a8;
    // +0x00b8
    uint32_t field_0x00b8;
    // +0x00cc
    uint32_t field_0x00cc;
    // +0x0110
    double field_0x0110;
    // +0x0118
    double field_0x0118;
    // +0x0120
    float field_0x0120;
    // +0x0124
    uint8_t field_0x0124;
};

// Script AddCmds (16):
//   v_startlogging_v
//   v_stoplogging_v
//   b_islogging_v
//   v_beginmap_v
//   b_map_ss
//   v_endmap_v
//   f_getslider_s
//   b_getbutton_s
//   v_setlongpressedtime_f
//   f_getlongpressedtime_v
//   v_setdoubleclicktime_f
//   f_getdoubleclicktime_v
//   v_setmousefactor_f
//   f_getmousefactor_v
//   v_setmouseinvert_b
//   b_getmouseinvert_v

// Methods (65):
// 0x10010967  nInputServer::n_init_ninputserver  (15 insns)
//   strings: 'nroot'
// 0x10010992  nInputServer::n_fini_ninputserver  (5 insns)
// 0x100109a4  nInputServer::n_new_ninputserver  (10 insns)
//   calls:   -> nInputServer::nInputServer()
// 0x100109be  nInputServer::ExportDefaultKeyboard  (82 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: '/sys/share/input/devs/keyb0', 'nroot', 'inst_name', 'nenv', 'Keyboard 0', 'prod_name', 'Default Keyboard', 'channels'
// 0x10010ab1  nInputServer::ExportDefaultMouse  (86 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: '/sys/share/input/devs/mouse0', 'nroot', 'inst_name', 'nenv', 'Mouse 0', 'prod_name', 'Default Mouse', 'channels'
// 0x10010bb4  nInputServer::nInputServer()  (95 insns)
//   calls:   -> nInputServer::ExportDefaultKeyboard, -> nInputServer::ExportDefaultMouse
//   consts:  f64=0.5
//   strings: '/sys/servers/script', '/sys/servers/console', '/sys/share/input/states', 'nroot', '/sys/share/input'
// 0x10010d04  nInputServer::~nInputServer()  (78 insns)
//   calls:   -> nInputServer::FlushEvents
// 0x10010df8  nInputServer::AddScript  (26 insns)
//   calls:   IAT: nkernel.dll!n_strdup, IAT: nkernel.dll!n_free
// 0x10010e3e  nInputServer::EndScripts  (39 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: nkernel.dll!n_free
// 0x10010e9f  nInputServer::SetLongPressedTime  (3 insns)
// 0x10010eac  nInputServer::GetLongPressedTime  (2 insns)
// 0x10010eb3  nInputServer::SetDoubleClickTime  (3 insns)
// 0x10010ec0  nInputServer::GetDoubleClickTime  (2 insns)
// 0x10010ec7  nInputServer::Trigger  (134 insns)
//   calls:   -> nInputServer::LogEvents, -> nInputServer::DoInputMapping, -> nInputServer::AddScript, -> nInputServer::EndScripts, IAT: MSVCRT.dll!sprintf
//   consts:  f32=1, f32=0
//   strings: 'is_%s', '%s %f'
// 0x1001118f  nInputServer::nInputServer()  (71 insns)
//   calls:   -> nRoot::nRoot()
// 0x10011274  nInputServer::operator=  (75 insns)
//   calls:   -> nRoot::operator=
// 0x1001135a  nInputServer::vfunc_00  (41 insns)
//   calls:   -> nInputServer::~nInputServer()
// 0x100113bb  nInputServer::SetMouseFactor  (10 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x100113df  nInputServer::GetMouseFactor  (2 insns)
// 0x100113e6  nInputServer::SetMouseInvert  (12 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x1001140f  nInputServer::GetMouseInvert  (35 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: '/sys/var/%s', 'nenv'
// 0x1001146f  nInputServer::NewEvent  (10 insns)
// 0x10011486  nInputServer::ReleaseEvent  (15 insns)
// 0x100114ad  nInputServer::LinkEvent  (8 insns)
// 0x100114ca  nInputServer::UnlinkEvent  (8 insns)
// 0x100114e2  nInputServer::FlushEvents  (12 insns)
// 0x100114ff  nInputServer::FlushInput  (37 insns)
//   calls:   -> nInputServer::FlushEvents
// 0x10011555  nInputServer::FirstEvent  (6 insns)
// 0x10011564  nInputServer::NextEvent  (7 insns)
// 0x10011575  nInputServer::IsIdenticalEvent  (43 insns)
// 0x100115e4  nInputServer::FirstIdenticalEvent  (33 insns)
//   calls:   -> nInputServer::IsIdenticalEvent
// 0x10011629  nInputServer::NextIdenticalEvent  (28 insns)
//   calls:   -> nInputServer::IsIdenticalEvent
// 0x10011662  nInputServer::MapStrToEvent  (188 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2, IAT: MSVCRT.dll!strchr, IAT: MSVCRT.dll!sprintf, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!strtok, IAT: MSVCRT.dll!atoi
//   strings: '/sys/share/input/devs/%s', 'channels/%s', 'devid', 'type', 'btn', 'axis', 'key', ' ='
// 0x10011843  nInputServer::GetInputState  (4 insns)
// 0x10011855  nInputServer::AddInputState  (41 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: '/sys/share/input/states/%s', 'nroot'
// 0x100118ce  nInputServer::BeginMap  (15 insns)
// 0x100118f6  nInputServer::BuildInputMappingName  (8 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: '%s_%s'
// 0x10011917  nInputServer::Map  (289 insns)
//   calls:   IAT: MSVCRT.dll!sprintf, IAT: nkernel.dll!n_strncpy2, IAT: MSVCRT.dll!strchr, -> nInputServer::NewEvent, -> nInputServer::MapStrToEvent, -> nInputServer::ReleaseEvent, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!strncmp, -> nInputServer::AddInputState
//   strings: '%s_%s', 'pressed', 'down', 'up', 'long', 'double', 'longdown', 'script:'
// 0x10011c17  nInputServer::EndMap  (74 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'input/ninput_states.cc'
// 0x10011cd9  nInputServer::GetSlider  (9 insns)
//   consts:  f32=0
// 0x10011cfa  nInputServer::GetButton  (9 insns)
// 0x10011d17  nInputServer::DoInputMapping  (98 insns)
//   calls:   -> nInputServer::FirstIdenticalEvent, -> nInputServer::NextIdenticalEvent
// 0x10011dfe  nInputServer::LoseFocus  (35 insns)
// 0x10011e52  nInputServer::StartLogging  (9 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10011e72  nInputServer::StopLogging  (9 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10011e92  nInputServer::LogSingleEvent  (122 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   strings: 'unknown', 'keyb', 'mouse', 'joy', 'joymouse', 'padmouse', 'button_up', 'button_down'
// 0x10011fe2  nInputServer::LogEvents  (291 insns)
//   calls:   -> nInputServer::LogSingleEvent, -> nInputServer::ReleaseEvent, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
//   strings: 'v_startlogging_v', 'v_stoplogging_v', 'b_islogging_v', 'v_beginmap_v', 'b_map_ss', 'v_endmap_v', 'f_getslider_s', 'b_getbutton_s'
// 0x1001235f  nInputServer::cmd_startlogging (v_startlogging_v)  (2 insns)
//   calls:   -> nInputServer::StartLogging
// 0x10012368  nInputServer::cmd_stoplogging (v_stoplogging_v)  (2 insns)
//   calls:   -> nInputServer::StopLogging
// 0x10012371  nInputServer::cmd_islogging (b_islogging_v)  (13 insns)
//   calls:   -> nInputServer::IsLogging
// 0x1001239c  nInputServer::cmd_beginmap (v_beginmap_v)  (2 insns)
//   calls:   -> nInputServer::BeginMap
// 0x100123a5  nInputServer::cmd_map (b_map_ss)  (28 insns)
//   calls:   -> nInputServer::Map
// 0x100123f3  nInputServer::cmd_endmap (v_endmap_v)  (2 insns)
//   calls:   -> nInputServer::EndMap
// 0x100123fc  nInputServer::cmd_getslider (f_getslider_s)  (22 insns)
//   calls:   -> nInputServer::GetSlider
// 0x1001243f  nInputServer::cmd_getbutton (b_getbutton_s)  (22 insns)
//   calls:   -> nInputServer::GetButton
// 0x10012482  nInputServer::cmd_setlongpressedtime (v_setlongpressedtime_f)  (12 insns)
//   calls:   -> nInputServer::SetLongPressedTime
// 0x100124a9  nInputServer::cmd_getlongpressedtime (f_getlongpressedtime_v)  (13 insns)
//   calls:   -> nInputServer::GetLongPressedTime
// 0x100124d4  nInputServer::cmd_setdoubleclicktime (v_setdoubleclicktime_f)  (12 insns)
//   calls:   -> nInputServer::SetDoubleClickTime
// 0x100124fb  nInputServer::cmd_getdoubleclicktime (f_getdoubleclicktime_v)  (13 insns)
//   calls:   -> nInputServer::GetDoubleClickTime
// 0x10012526  nInputServer::cmd_setmousefactor (v_setmousefactor_f)  (17 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10012560  nInputServer::cmd_getmousefactor (f_getmousefactor_v)  (11 insns)
// 0x1001258a  nInputServer::cmd_setmouseinvert (v_setmouseinvert_b)  (19 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x100125cb  nInputServer::cmd_getmouseinvert (b_getmouseinvert_v)  (13 insns)
// 0x100184d5  nInputServer::IsLogging  (316 insns)
//   consts:  f32=0.5
// 0x1002cac2  nInputServer::BeginScripts  (11 insns)

} // namespace re_nnebula
