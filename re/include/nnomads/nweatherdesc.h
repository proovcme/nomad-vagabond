#pragma once
// Auto-generated from nnomads.dll (Project Nomads, Oct 2002)
// Nebula class: nweatherdesc | Superclass: ncontainer | sizeof: 3784 bytes
// RVA: n_init=0x1c080 n_new=0x1c0bd n_initcmds=0x1c280

class nWeatherDesc : public nContainer {
public:
    nWeatherDesc(const nWeatherDesc&); // 0xc30b
    nWeatherDesc(); // 0x1c0dd
    virtual ~nWeatherDesc(); // 0x1c11a
    nWeatherDesc& operator=(const nWeatherDesc&); // 0xc36e
    virtual void CalcWeightForPos(const vector3&); // 0x1c1cb
    float GetAreaOfEffect() const; // 0xc46e
    int GetChannelIndex() const; // 0x674f3
    nCloudDesc* GetCloudDesc() const; // 0xc442
    void GetCloudDescPath(char*&) const; // 0xc42c
    float GetWeight() const; // 0xc467
    bool IsDefault() const; // 0xc482
    virtual void ResolveCloudDescPath(); // 0x1c149
    virtual bool SaveCmds(nFileServer*); // 0x1c423
    void SetAreaOfEffect(const float&); // 0x1c1a5
    void SetChannelIndex(int); // 0xc475
    void SetCloudDescPath(const char*); // 0x1c165
    void SetDefaultFlag(bool); // 0x1c1b4
    void SetWeight(const float&); // 0x1c196
    static nClass* nWeatherDesc::pClass; // 0xb53f8
    static nKernelServer* nWeatherDesc::pKernelServer; // 0xb53fc

    // Nebula Script Commands (6)
    // [SCDP] v_setclouddescpath_s  (handler 0x1c319)
    // [SAOE] v_setareaofeffect_f  (handler 0x1c33c)
    // [SDFT] v_setdefaultflag_b  (handler 0x1c368)
    // [GCDP] s_getclouddescpath_v  (handler 0x1c38e)
    // [GAOE] f_getareaofeffect_v  (handler 0x1c3be)
    // [IDFT] b_isdefault_v  (handler 0x1c3e8)
};
