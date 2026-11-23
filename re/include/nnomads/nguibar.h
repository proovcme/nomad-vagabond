#pragma once
// Auto-generated from nnomads.dll (Project Nomads, Oct 2002)
// Nebula class: nguibar | Superclass: nroot | sizeof: 428 bytes
// RVA: n_init=0x77487 n_new=0x774c4 n_initcmds=0x77e31

class nGuiBar : public nroot {
public:
    nGuiBar(const nGuiBar&); // 0x64847
    nGuiBar(); // 0x774de
    virtual ~nGuiBar(); // 0x777a7
    nGuiBar& operator=(const nGuiBar&); // 0x64a8d
    static const char** nGuiBar::BarNames; // 0xb4f30
    virtual float GetBaseMax() const; // 0x77d1b
    virtual float GetCurrent() const; // 0x77c90
    virtual float GetExtension() const; // 0x77d2f
    virtual const vector3& GetLeftPos() const; // 0x77d65
    virtual const vector3& GetLeftScale() const; // 0x77dec
    virtual n3DNode* GetLeftVisual() const; // 0x77853
    virtual float GetMax() const; // 0x77cf3
    virtual const vector3& GetMiddleOffset() const; // 0x77d9b
    virtual const vector3& GetMiddlePos() const; // 0x77d80
    virtual const vector3& GetMiddleScale() const; // 0x77e07
    virtual n3DNode* GetMiddleVisual() const; // 0x7787c
    virtual float GetOptional() const; // 0x77d07
    virtual const vector3& GetPos() const; // 0x77d4a
    virtual const vector3& GetRightPos() const; // 0x77db6
    virtual const vector3& GetRightScale() const; // 0x77e22
    virtual n3DNode* GetRightVisual() const; // 0x778a5
    virtual const vector3& GetScale() const; // 0x77dd1
    virtual nSceneGraph2* GetSceneGraph(); // 0x77e29
    virtual n3DNode* GetVisual() const; // 0x7782a
    virtual void Hide(); // 0x778c4
    static int nGuiBar::NumChannelIndices; // 0x8ece0
    virtual void Render(); // 0x778d3
    virtual void SetBaseMax(float); // 0x77d0e
    virtual void SetCurrent(float); // 0x77c83
    virtual void SetExtension(float); // 0x77d22
    virtual void SetLeftPos(const vector3&); // 0x77d51
    virtual void SetLeftScale(const vector3&); // 0x77dd8
    virtual void SetLeftVisual(const char*); // 0x77841
    virtual void SetMax(float); // 0x77c97
    virtual void SetMiddleOffset(const vector3&); // 0x77d87
    virtual void SetMiddlePos(const vector3&); // 0x77d6c
    virtual void SetMiddleScale(const vector3&); // 0x77df3
    virtual void SetMiddleVisual(const char*); // 0x7786a
    virtual void SetOptional(float); // 0x77cfa
    virtual void SetPos(const vector3&); // 0x77d36
    virtual void SetRightPos(const vector3&); // 0x77da2
    virtual void SetRightScale(const vector3&); // 0x77e0e
    virtual void SetRightVisual(const char*); // 0x77893
    virtual void SetScale(const vector3&); // 0x77dbd
    virtual void SetVisual(const char*); // 0x77818
    virtual void Show(); // 0x778bc
    virtual bool Visible() const; // 0x778cc
    static nKernelServer* nGuiBar::kernelServer; // 0xb5908

    // Nebula Script Commands (39)
    // [STVI] v_setvisual_s  (handler 0x55223)
    // [GTVI] o_getvisual_v  (handler 0x781a0)
    // [STLV] v_setleftvisual_s  (handler 0x7835d)
    // [GTLV] o_getleftvisual_v  (handler 0x78381)
    // [STMV] v_setmiddlevisual_s  (handler 0x783ac)
    // [GTMV] o_getmiddleviusal_v  (handler 0x783d0)
    // [STRV] v_setrightvisual_s  (handler 0x783fb)
    // [GTRV] o_getrightvisual_v  (handler 0x7841f)
    // [SHOW] v_show_v  (handler 0x64fac)
    // [HIDE] v_hide_v  (handler 0x781cb)
    // [VSBL] b_visible_v  (handler 0x781d4)
    // [STCU] v_setcurrent_f  (handler 0x781dd)
    // [GTCU] f_getcurrent_v  (handler 0x78205)
    // [STMX] v_setmax_f  (handler 0x78230)
    // [GTMX] f_getmax_v  (handler 0x60d4d)
    // [STBM] v_setbasemax_f  (handler 0x78258)
    // [GTBM] f_getbasemax_v  (handler 0x78283)
    // [STEX] v_setextension_f  (handler 0x782b1)
    // [GTEX] f_getextension_v  (handler 0x782dc)
    // [STOP] v_setoptional_f  (handler 0x7830a)
    // [GTOP] f_getoptional_v  (handler 0x78332)
    // [STPO] v_setpos_fff  (handler 0x7844a)
    // [GTPO] fff_getpos_v  (handler 0x784a5)
    // [SLPO] v_setleftpos_fff  (handler 0x78513)
    // [GLPO] fff_getleftpos_v  (handler 0x7856e)
    // [SEPO] v_setmiddlepos_fff  (handler 0x785dc)
    // [GEPO] fff_getmiddlepos_v  (handler 0x78637)
    // [SEOF] v_setmiddleoffset_fff  (handler 0x786a5)
    // [GEOF] fff_getmiddleoffset_v  (handler 0x78700)
    // [SRPO] v_setrightpos_fff  (handler 0x7876e)
    // [GRPO] fff_getrightpos_v  (handler 0x787c9)
    // [STSC] v_setscale_fff  (handler 0x78837)
    // [GTSC] fff_getscale_v  (handler 0x78892)
    // [STLS] v_setleftscale_fff  (handler 0x78900)
    // [GTLS] fff_getleftscale_v  (handler 0x7895b)
    // [STMS] v_setmiddlescale_fff  (handler 0x789c9)
    // [GTMS] fff_getmiddlescale_v  (handler 0x78a24)
    // [STRS] v_setrightscale_fff  (handler 0x78a92)
    // [GTRS] fff_getrightscale_v  (handler 0x78aed)
};
