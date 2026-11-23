#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nGuiMenuHandler.asm
// Class: nGuiMenuHandler : public nroot  (sizeof = 0x198 = 408 bytes)

#include <cstdint>

namespace re_nnomads {

struct nGuiMenuHandler_Layout {
    // +0x0004
    uint8_t field_0x0004;
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
    float field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0038
    uint32_t field_0x0038;
    // +0x003c
    uint32_t field_0x003c;
    // +0x004c
    uint32_t field_0x004c;
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
    // +0x0098
    uint32_t field_0x0098;
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
    // +0x00f8
    uint32_t field_0x00f8;
    // +0x00fc
    uint32_t field_0x00fc;
    // +0x0100
    uint32_t field_0x0100;
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
    uint32_t field_0x014c;
    // +0x0150
    uint32_t field_0x0150;
    // +0x0154
    uint32_t field_0x0154;
    // +0x0158
    uint32_t field_0x0158;
    // +0x0168
    uint32_t field_0x0168;
    // +0x0170
    double field_0x0170;
    // +0x0178
    double field_0x0178;
    // +0x0180
    uint8_t field_0x0180;
    // +0x0181
    uint8_t field_0x0181;
    // +0x0182
    uint8_t field_0x0182;
    // +0x0183
    uint8_t field_0x0183;
    // +0x0184
    uint8_t field_0x0184;
    // +0x0188
    float field_0x0188;
    // +0x0190
    double field_0x0190;
    // +0x131c
    uint32_t field_0x131c;
};

// Methods (61):
// 0x10008c41  nGuiMenuHandler::nGuiMenuHandler()  (94 insns)
//   calls:   -> nRoot::nRoot()
// 0x10008db8  nGuiMenuHandler::operator=  (98 insns)
//   calls:   -> nRoot::operator=
// 0x10008f32  nGuiMenuHandler::vfunc_00  (41 insns)
//   calls:   -> nGuiMenuHandler::~nGuiMenuHandler()
// 0x10009094  nGuiMenuHandler::vfunc_41  (41 insns)
// 0x10009ba1  nGuiMenuHandler::vfunc_60  (80 insns)
//   calls:   -> nRealWorld::~nRealWorld()
// 0x100632b4  nGuiMenuHandler::n_init_nguimenuhandler  (15 insns)
//   strings: 'nroot'
// 0x100632df  nGuiMenuHandler::n_fini_nguimenuhandler  (5 insns)
// 0x100632f1  nGuiMenuHandler::n_new_nguimenuhandler  (10 insns)
//   calls:   -> nGuiMenuHandler::nGuiMenuHandler()
// 0x1006330b  nGuiMenuHandler::nGuiMenuHandler()  (169 insns)
//   strings: '/sys/servers/gfx', '/world/gui/menus', '/sys/servers/input', '/sys/servers/channel', '/data/if_menu/messages/template', '/data/if_menu/messages/template/msg/tex', '/world', '/sys/servers/sgraph2'
// 0x100635ce  nGuiMenuHandler::~nGuiMenuHandler()  (79 insns)
// 0x100636d4  nGuiMenuHandler::Reset  (25 insns)
//   calls:   -> nRoot::GetHead
// 0x10063710  nGuiMenuHandler::OpenMenu  (50 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   strings: 'nguimenu'
// 0x100637bf  nGuiMenuHandler::CloseMenu  (32 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x10063835  nGuiMenuHandler::HasMenu  (32 insns)
//   strings: 'nguimenu'
// 0x10063893  nGuiMenuHandler::MenuOpen  (4 insns)
// 0x1006389f  nGuiMenuHandler::CancelMenu  (19 insns)
// 0x100638dc  nGuiMenuHandler::Trigger  (247 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nGuiMenuHandler::CancelMenu, -> nRealWorld::ContGame, -> nRealWorld::IsNetSession, -> nRealWorld::GetHandControlVehicle, -> nRealWorld::GetViewerCarrier, -> nRealWorld::SetHandControlVehicle, -> nRealWorld::GetGlobalTime
//   consts:  f64=0.0001
//   strings: 'guimenu_up', 'guimenu_down', 'guimenu_left', 'guimenu_right', 'guimenu_action', 'guimenu_cancel'
// 0x10063c16  nGuiMenuHandler::HasBar  (19 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: '/world/gui/bars/%s'
// 0x10063c53  nGuiMenuHandler::ShowBar  (19 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: '/world/gui/bars/%s'
// 0x10063c91  nGuiMenuHandler::HideBar  (19 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: '/world/gui/bars/%s'
// 0x10063ccf  nGuiMenuHandler::ShowAllBars  (37 insns)
//   calls:   -> nRoot::GetHead
//   strings: '/world/gui/bars', 'nguibar'
// 0x10063d2d  nGuiMenuHandler::HideAllBars  (37 insns)
//   calls:   -> nRoot::GetHead
//   strings: '/world/gui/bars', 'nguibar'
// 0x10063d8b  nGuiMenuHandler::ShowInfoScreen  (42 insns)
//   calls:   IAT: MSVCRT.dll!sprintf, -> nRealWorld::SetGlobalChannel, -> nRealWorld::RefreshGui
//   strings: '/world/gui/infoscreen', 'nlinknode', '/data/if_menu/infoscreen/%s'
// 0x10063e15  nGuiMenuHandler::UpdateInfoScreen  (18 insns)
//   calls:   -> nRealWorld::SetGlobalChannel, -> nRealWorld::RefreshGui
// 0x10063e4f  nGuiMenuHandler::InfoScreenVisible  (2 insns)
// 0x10063e56  nGuiMenuHandler::HideInfoScreen  (16 insns)
//   strings: '/world/gui/infoscreen'
// 0x10063e86  nGuiMenuHandler::DrawBelt  (178 insns)
//   calls:   -> nStateNode::GetPrototype
//   consts:  f32=0, f32=14.5, f32=13, f32=20, f32=15.5
//   strings: '/data/if_emptyslot/belt/gap', '/data/if_emptyslot/belt/slot', '/data/if_emptyslot/belt/end', 'visual', 'ifartefact', 'slot'
// 0x100640cf  nGuiMenuHandler::ShowTextMessage  (20 insns)
//   calls:   -> nRealWorld::GetGlobalTime
// 0x1006411b  nGuiMenuHandler::RenderTextMessage  (84 insns)
//   calls:   -> nRealWorld::IsCinematicRunning
//   consts:  f64=3
// 0x10064244  nGuiMenuHandler::ShowUserInfo  (2 insns)
// 0x1006424c  nGuiMenuHandler::HideUserInfo  (2 insns)
// 0x10064254  nGuiMenuHandler::UserInfoVisible  (2 insns)
// 0x1006425b  nGuiMenuHandler::RenderUserInfo  (171 insns)
//   calls:   -> nRealWorld::GetEnvironmentClan, -> nRoot::GetHead, IAT: MSVCRT.dll!atol, -> nRealWorld::FindPlayerClanByMachineID
//   consts:  f32=0.01, f32=-0.15, f32=1.85, f32=0, f32=1.35, f32=2
//   strings: '/world/session', '/world', '/data/if_menu/dots/grau'
// 0x10064464  nGuiMenuHandler::ShowCredits  (39 insns)
//   calls:   -> nDataHandler::Load, -> nRealWorld::GetGlobalTime
//   strings: 'if_credits', 'if_intro'
// 0x100644eb  nGuiMenuHandler::HideCredits  (63 insns)
//   calls:   -> nDataHandler::Unload
//   consts:  f32=0.0001
//   strings: 'if_credits', 'if_intro', 'main', 'nm_menumusic', 'nm_registerevents'
// 0x100645a5  nGuiMenuHandler::CreditsShown  (2 insns)
// 0x100645ac  nGuiMenuHandler::RenderCredits  (58 insns)
// 0x10064670  nGuiMenuHandler::ShowHelpScreen  (59 insns)
//   calls:   -> nDataHandler::Load, IAT: MSVCRT.dll!sprintf, -> nRealWorld::GetGlobalTime
//   strings: 'if_hilfe', '/data/if_hilfe/visual/plane/tex', '__objective', '%s/objective/%s'
// 0x1006472d  nGuiMenuHandler::HideHelpScreen  (15 insns)
//   calls:   -> nDataHandler::Unload
//   strings: 'if_hilfe'
// 0x10064764  nGuiMenuHandler::RenderHelpScreen  (71 insns)
//   calls:   -> nRealWorld::GetGlobalTime
//   consts:  f64=0, f64=7
//   strings: '/data/if_hilfe/visual'
// 0x10064e09  nGuiMenuHandler::cmd_openmenu (v_openmenu_s)  (40 insns)
//   calls:   -> nGuiMenuHandler::MenuOpen, IAT: nkernel.dll!n_printf
// 0x10064e72  nGuiMenuHandler::cmd_showtextmessage (v_showtextmessage_s)  (11 insns)
// 0x10064e96  nGuiMenuHandler::cmd_showcredits (v_showcredits_sf)  (19 insns)
// 0x10064ecb  nGuiMenuHandler::cmd_creditsshown (b_creditsshown_v)  (14 insns)
// 0x10064ef9  nGuiMenuHandler::cmd_showbar (v_showbar_s)  (11 insns)
// 0x10064f1d  nGuiMenuHandler::cmd_hidebar (v_hidebar_s)  (11 insns)
// 0x10064f41  nGuiMenuHandler::cmd_showallbars (v_showallbars_v)  (3 insns)
// 0x10064f4a  nGuiMenuHandler::cmd_hideallbars (v_hideallbars_v)  (3 insns)
// 0x10064f53  nGuiMenuHandler::cmd_closemenu (v_closemenu_v)  (20 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nGuiMenuHandler::MenuOpen
// 0x10064f84  nGuiMenuHandler::cmd_updateinfoscreen (v_updateinfoscreen_f)  (13 insns)
// 0x10064fb5  nGuiMenuHandler::cmd_cancelmenu (v_cancelmenu_v)  (12 insns)
//   calls:   IAT: nkernel.dll!n_printf, -> nGuiMenuHandler::CancelMenu
// 0x10064fe0  nGuiMenuHandler::cmd_menuopen (b_menuopen_v)  (13 insns)
//   calls:   -> nGuiMenuHandler::MenuOpen
// 0x1006500b  nGuiMenuHandler::cmd_showuserinfo (v_showuserinfo_v)  (3 insns)
// 0x10065017  nGuiMenuHandler::cmd_hideuserinfo (v_hideuserinfo_v)  (3 insns)
// 0x10065023  nGuiMenuHandler::cmd_showhelpscreen (v_showhelpscreen_v)  (3 insns)
// 0x1006502f  nGuiMenuHandler::cmd_hidehelpscreen (v_hidehelpscreen_v)  (3 insns)
// 0x100798e8  nGuiMenuHandler::vfunc_59  (1 insns)
//   calls:   IAT: nnebula.dll!nStream::Close
// 0x100798ee  nGuiMenuHandler::vfunc_58  (1 insns)
//   calls:   IAT: nnebula.dll!nStream::Seek
// 0x100798f4  nGuiMenuHandler::vfunc_57  (1 insns)
//   calls:   IAT: nnebula.dll!nStream::Tell
// 0x100798fa  nGuiMenuHandler::vfunc_56  (1 insns)
//   calls:   IAT: nnebula.dll!nStream::Read
// 0x10079900  nGuiMenuHandler::vfunc_55  (2 insns)
//   calls:   IAT: nnebula.dll!nStream::Open, IAT: nnebula.dll!nStream::~nStream()

} // namespace re_nnomads
