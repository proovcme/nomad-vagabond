#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nengine2.asm
// Class: nengine2 : public nservice  (sizeof = 0xa4 = 164 bytes)

#include <cstdint>

namespace re_nnomads {

struct nengine2_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x0014
    float field_0x0014;
    // +0x0020
    float field_0x0020;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0058
    float field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    uint8_t field_0x0060;
    // +0x0061
    uint8_t field_0x0061;
    // +0x0064
    float field_0x0064;
    // +0x0068
    float field_0x0068;
    // +0x006c
    float field_0x006c;
    // +0x0070
    float field_0x0070;
    // +0x0074
    float field_0x0074;
    // +0x0078
    float field_0x0078;
    // +0x007c
    float field_0x007c;
    // +0x0080
    float field_0x0080;
    // +0x0084
    float field_0x0084;
    // +0x0088
    float field_0x0088;
    // +0x008c
    float field_0x008c;
    // +0x0090
    float field_0x0090;
    // +0x0094
    float field_0x0094;
    // +0x0098
    float field_0x0098;
    // +0x009c
    float field_0x009c;
    // +0x00a0
    float field_0x00a0;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0b42
    uint8_t field_0x0b42;
    // +0x0b43
    uint8_t field_0x0b43;
    // +0x0b44
    float field_0x0b44;
    // +0x0b48
    float field_0x0b48;
    // +0x0b4c
    float field_0x0b4c;
    // +0x0d4c
    uint8_t field_0x0d4c;
};

// Script AddCmds (9):
//   m_engine2/nen2_main.cc
//   v_setlookattarget_f
//   f_getlookattarget_v
//   v_setgravityfactor_f
//   f_getgravityfactor_v
//   v_setupright_b
//   b_getupright_v
//   v_setconsiderfallflag_b
//   b_getconsiderfallflag_v

// Methods (38):
// 0x10040b3f  nengine2::cmd_setupright (v_setupright_b)  (10 insns)
// 0x10040b60  nengine2::cmd_setconsiderfallflag (v_setconsiderfallflag_b)  (10 insns)
// 0x10042d03  nengine2::n_init_nengine2  (15 insns)
//   strings: 'nservice'
// 0x10042d2e  nengine2::n_fini_nengine2  (5 insns)
// 0x10042d40  nengine2::n_new_nengine2  (10 insns)
// 0x10042d5a  nengine2::n_version_nengine2  (45 insns)
//   consts:  f32=-1
// 0x10042df3  nengine2::vfunc_00  (14 insns)
// 0x10042e20  nengine2::vfunc_16  (31 insns)
//   calls:   -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x10042e68  nengine2::vfunc_17  (5 insns)
//   calls:   -> nStateNode::NetImport
// 0x10042e7c  nengine2::vfunc_36  (39 insns)
//   calls:   -> nContainer::GetDirection
// 0x10042ee7  nengine2::vfunc_38  (101 insns)
//   consts:  f32=0, f32=1, f32=-1
// 0x10042feb  nengine2::vfunc_37  (59 insns)
//   consts:  f32=1, f32=-1
// 0x10043081  nengine2::vfunc_26  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Vorbereitung der Einschuebe: Totalst unwirkliche Funktion gerufen', 'm_engine2/nen2_main.cc'
// 0x100430a4  nengine2::vfunc_27  (10 insns)
// 0x100430c7  nengine2::vfunc_19  (6 insns)
// 0x100430e0  nengine2::vfunc_20  (46 insns)
//   consts:  f64=0
// 0x1004315b  nengine2::vfunc_21  (30 insns)
//   consts:  f64=0
// 0x100431ca  nengine2::vfunc_22  (60 insns)
// 0x10043275  nengine2::vfunc_23  (76 insns)
//   calls:   -> nContainer::IsHandControl, -> nRealWorld::GetFrameTime, -> nContainer::SetWantedDir
//   consts:  f32=0, f32=0.3
// 0x10043341  nengine2::vfunc_24  (114 insns)
//   consts:  f32=0, f32=1
//   strings: 'turbomove_up', 'move_up', 'turbomove_down', 'move_down', 'turboturn_left', 'turn_left', 'turboturn_right', 'turn_right'
// 0x100434b8  nengine2::vfunc_25  (66 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::GetActualCommand, -> nContainer::GetDirection
// 0x10043552  nengine2::vfunc_28  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'm_engine2/nen2_main.cc'
// 0x10043575  nengine2::vfunc_29  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'm_engine2/nen2_main.cc'
// 0x10043598  nengine2::vfunc_30  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'm_engine2/nen2_main.cc'
// 0x100435bb  nengine2::vfunc_31  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'm_engine2/nen2_main.cc'
// 0x100435de  nengine2::vfunc_32  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'm_engine2/nen2_main.cc'
// 0x10043601  nengine2::vfunc_33  (35 insns)
//   consts:  f32=-1
// 0x10043650  nengine2::vfunc_34  (59 insns)
// 0x100436e6  nengine2::vfunc_39  (57 insns)
//   consts:  f32=1
// 0x1004377a  nengine2::vfunc_40  (40 insns)
//   consts:  f32=0, f32=1
// 0x100437df  nengine2::vfunc_41  (143 insns)
//   consts:  f32=0, f32=-1, f32=0.5
// 0x1004395f  nengine2::vfunc_35  (417 insns)
//   consts:  f32=1.2, f32=0, f64=0, f32=-1, f32=3
// 0x10043d20  nengine2::vfunc_18  (182 insns)
//   calls:   -> nContainer::SetTurboMove, -> nContainer::IsHandControl, -> nconsumption::vfunc_37
//   strings: 'v_setlookattarget_f', 'f_getlookattarget_v', 'v_setgravityfactor_f', 'f_getgravityfactor_v', 'v_setupright_b', 'b_getupright_v', 'v_setconsiderfallflag_b', 'b_getconsiderfallflag_v'
// 0x10043f2c  nengine2::cmd_setlookattarget (v_setlookattarget_f)  (12 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x10043f5a  nengine2::cmd_getlookattarget (f_getlookattarget_v)  (13 insns)
//   consts:  f32=180, f32=0.3183099
// 0x10043fb4  nengine2::cmd_getupright (b_getupright_v)  (13 insns)
// 0x10043fdd  nengine2::cmd_getconsiderfallflag (b_getconsiderfallflag_v)  (13 insns)
// 0x10044006  nengine2::vfunc_11  (102 insns)
//   calls:   -> ncollidedata::vfunc_11
//   consts:  f32=180, f32=0.3183099

} // namespace re_nnomads
