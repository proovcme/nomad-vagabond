#pragma once
// Auto-generated from nnomads.dll (Project Nomads, Oct 2002)
// Nebula class: nanimsequence | Superclass: nroot | sizeof: 816 bytes
// RVA: n_init=0x53620 n_new=0x5365d n_initcmds=0x54e23

class nAnimSequence : public nroot {
public:
    nAnimSequence(const nAnimSequence&); // 0x10365
    nAnimSequence(); // 0x5367d
    virtual ~nAnimSequence(); // 0x5377a
    nAnimSequence& operator=(const nAnimSequence&); // 0x1060c
    void AddAudio(float, const char*); // 0x53af8
    void AddChannel(float, int, float); // 0x53b7b
    void AddQuaternion(float, float, float, float, float); // 0x539d7
    void AddRotate(float, float, float, float); // 0x53945
    void AddTranslate(float, float, float, float); // 0x538bf
    void AddVisual(float, const char*); // 0x53a75
    int GetChannelIndex(int); // 0x538b1
    const char* GetChannelName(int); // 0x538a3
    float GetDuration(); // 0x53bf3
    const nAnimFrame& GetFrame(float); // 0x53c92
    virtual const char* GetGeneratorName() const; // 0x53f8f
    virtual const char* GetGeneratorProto() const; // 0x53f31
    virtual double GetIdleTime() const; // 0x53fa3
    bool IsVehicleRelated() const; // 0x53849
    virtual bool SaveCmds(nFileServer*); // 0x552ef
    void SetChannelName(int, const char*); // 0x53850
    virtual void SetGeneratorName(const char*); // 0x53f38
    virtual void SetGeneratorProto(const char*); // 0x53eda
    virtual void SetIdleTime(double); // 0x53f96
    void SetVehicleRelated(bool); // 0x5383c
    void Visualize(nGfxServer*, const matrix44&); // 0x53d7c
    static nClass* nAnimSequence::clazz; // 0xb573c
    static nKernelServer* nAnimSequence::kernelServer; // 0xb5740

    // Nebula Script Commands (16)
    // [SCHN] v_setchannelname_is  (handler 0x54f98)
    // [GCHN] s_getchannelname_i  (handler 0x54fc5)
    // [ADTK] v_addtranslate_ffff  (handler 0x55007)
    // [ADRK] v_addrotate_ffff  (handler 0x55059)
    // [ADQK] v_addquaternion_fffff  (handler 0x550cf)
    // [ADVK] v_addvisual_fs  (handler 0x55130)
    // [ADAK] v_addaudio_fs  (handler 0x55160)
    // [ADCH] v_addchannel_fif  (handler 0x55190)
    // [SVRL] v_setvehiclerelated_b  (handler 0x551d2)
    // [IVRL] b_isvehiclerelated_v  (handler 0x551f8)
    // [SGPT] v_setgeneratorproto_s  (handler 0x55223)
    // [SGNM] v_setgeneratorname_s  (handler 0x7835d)
    // [GGPT] s_getgeneratorproto_v  (handler 0x55247)
    // [GGNM] s_getgeneratorname_v  (handler 0x55271)
    // [STIT] v_setidletime_f  (handler 0x5529b)
    // [GTIT] f_getidletime_v  (handler 0x552c4)
};
