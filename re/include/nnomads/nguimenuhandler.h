#pragma once
// Auto-generated from nnomads.dll (Project Nomads, Oct 2002)
// Nebula class: nguimenuhandler | Superclass: nroot | sizeof: 408 bytes
// RVA: n_init=0x632b4 n_new=0x632f1 n_initcmds=0x64c52

class nGuiMenuHandler : public nroot {
public:
    nGuiMenuHandler(const nGuiMenuHandler&); // 0x8c41
    nGuiMenuHandler(); // 0x6330b
    virtual ~nGuiMenuHandler(); // 0x635ce
    nGuiMenuHandler& operator=(const nGuiMenuHandler&); // 0x8db8
    void CancelMenu(); // 0x6389f
    virtual void CloseMenu(); // 0x637bf
    virtual bool CreditsShown(); // 0x645a5
    virtual void DrawBelt(nMaennel*, nGfxServer*, nSceneGraph2*); // 0x63e86
    virtual bool HasBar(const char*); // 0x63c16
    virtual bool HasMenu(const char*); // 0x63835
    virtual void HideAllBars(); // 0x63d2d
    virtual void HideBar(const char*); // 0x63c91
    virtual void HideCredits(); // 0x644eb
    virtual void HideHelpScreen(); // 0x6472d
    virtual void HideInfoScreen(); // 0x63e56
    virtual void HideUserInfo(); // 0x6424c
    virtual bool InfoScreenVisible() const; // 0x63e4f
    bool MenuOpen() const; // 0x63893
    virtual void OpenMenu(const char*); // 0x63710
    virtual void RenderCredits(nGfxServer*, nSceneGraph2*, double); // 0x645ac
    void RenderHelpScreen(nGfxServer*, nSceneGraph2*); // 0x64764
    virtual void RenderTextMessage(nGfxServer*, nSceneGraph2*, double); // 0x6411b
    virtual void RenderUserInfo(); // 0x6425b
    virtual void Reset(); // 0x636d4
    virtual void ShowAllBars(); // 0x63ccf
    virtual void ShowBar(const char*); // 0x63c53
    virtual void ShowCredits(const char*, float); // 0x64464
    virtual void ShowHelpScreen(); // 0x64670
    virtual void ShowInfoScreen(const char*); // 0x63d8b
    virtual void ShowTextMessage(const char*); // 0x640cf
    virtual void ShowUserInfo(); // 0x64244
    virtual void Trigger(); // 0x638dc
    virtual void UpdateInfoScreen(float); // 0x63e15
    virtual bool UserInfoVisible() const; // 0x64254
    static nKernelServer* nGuiMenuHandler::kernelServer; // 0xb5828

    // Nebula Script Commands (19)
    // [OPMN] v_openmenu_s  (handler 0x64e09)
    // [CLMN] v_closemenu_v  (handler 0x64f53)
    // [CNMN] v_cancelmenu_v  (handler 0x64fb5)
    // [RESM] v_reset_v  (handler 0x64fd7)
    // [MNOP] b_menuopen_v  (handler 0x64fe0)
    // [SWIS] v_showinfoscreen_s  (handler 0x3fd26)
    // [UPIS] v_updateinfoscreen_f  (handler 0x64f84)
    // [HDIS] v_hideinfoscreen_v  (handler 0x64fac)
    // [SHBA] v_showbar_s  (handler 0x64ef9)
    // [HIBA] v_hidebar_s  (handler 0x64f1d)
    // [SHAB] v_showallbars_v  (handler 0x64f41)
    // [HIAB] v_hideallbars_v  (handler 0x64f4a)
    // [TXTM] v_showtextmessage_s  (handler 0x64e72)
    // [SHUI] v_showuserinfo_v  (handler 0x6500b)
    // [HDUI] v_hideuserinfo_v  (handler 0x65017)
    // [CRED] v_showcredits_sf  (handler 0x64e96)
    // [CRSH] b_creditsshown_v  (handler 0x64ecb)
    // [SHLP] v_showhelpscreen_v  (handler 0x65023)
    // [HHLP] v_hidehelpscreen_v  (handler 0x6502f)
};
