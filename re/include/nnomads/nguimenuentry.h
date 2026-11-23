#pragma once
// Auto-generated from nnomads.dll (Project Nomads, Oct 2002)
// Nebula class: nguimenuentry | Superclass: nroot | sizeof: 208 bytes
// RVA: n_init=0x5d273 n_new=0x5d2b0 n_initcmds=0x5d992

class nGuiMenuEntry : public nroot {
public:
    nGuiMenuEntry(const nGuiMenuEntry&); // 0x5d727
    nGuiMenuEntry(); // 0x5d2ca
    virtual ~nGuiMenuEntry(); // 0x5d405
    nGuiMenuEntry& operator=(const nGuiMenuEntry&); // 0x5d858
    void Execute(); // 0x5d4cf
    virtual bool Exists(); // 0x5d650
    const char* GetCommand() const; // 0x5d4a4
    nGfxServer* GetGfxServer(); // 0x77e29
    void GetRect(float&, nGuiMenuEntry, nGuiMenuEntry, nGuiMenuEntry) const; // 0x5d5e0
    virtual nSceneGraph2* GetSceneGraph(); // 0x5d6a2
    bool HasCommand(); // 0x5d4c4
    virtual void Hide(); // 0x5d62f
    virtual bool InSensitiveArea(float, float); // 0x5d6b7
    virtual bool IsVisible() const; // 0x5d653
    virtual void Make(); // 0x4a64
    virtual void Render(); // 0x5d65a
    void SetCommand(const char*); // 0x5d463
    void SetRect(float, float, float, float); // 0x5d50d
    void SetVisible(bool); // 0x5d6aa
    virtual void Show(); // 0x5d613
    static nKernelServer* nGuiMenuEntry::kernelServer; // 0xb57b0

    // Nebula Script Commands (7)
    // [STCM] v_setcommand_s  (handler 0x5da41)
    // [GTCM] s_getcommand_v  (handler 0x5da64)
    // [EXEC] v_execute_v  (handler 0x5da8e)
    // [STPS] v_setrect_ffff  (handler 0x5da97)
    // [GTPS] ffff_getrect_v  (handler 0x5dae9)
    // [ENSH] v_show_v  (handler 0x64fd7)
    // [ENHD] v_hide_v  (handler 0x5db75)
};
