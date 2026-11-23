#pragma once
// Auto-generated from nnature.dll (Project Nomads, Oct 2002)
// Nebula class: nclouddesc | Superclass: nvisnode | sizeof: 288 bytes
// RVA: n_init=0xcd96 n_new=0xcdd3 n_initcmds=0xcf46

class nCloudDesc : public nvisnode {
public:
    nCloudDesc(const nCloudDesc&); // 0xaabf
    nCloudDesc(); // 0xcdf3
    virtual ~nCloudDesc(); // 0xce10
    nCloudDesc& operator=(const nCloudDesc&); // 0xaaec
    float GetAltitude() const; // 0xabea
    nCloudDescData GetData() const; // 0xab76
    float GetFadeMod() const; // 0xacb1
    vector4 GetFoggingColor() const; // 0xabf1
    float GetFoggingMod() const; // 0xac18
    vector2 GetGridPosition() const; // 0xab8d
    vector3 GetOffset() const; // 0xac40
    vector3 GetOffsetMod() const; // 0xac61
    float GetOffsetSpeed() const; // 0xac82
    float GetOpacityMod() const; // 0xacaa
    vector3 GetQuadOffset() const; // 0xac89
    vector3 GetSize() const; // 0xac1f
    vector2 GetWind() const; // 0xacb8
    bbox3 GetWorldBBox() const; // 0xabd4
    vector3 GetWorldCG() const; // 0xabbe
    vector3 GetWorldPosition() const; // 0xaba8
    virtual void Initialize(); // 0xce2d
    virtual bool SaveCmds(nFileServer*); // 0xd804
    void SetAltitude(const float&); // 0xce80
    void SetFadeMod(const float&); // 0xcf1f
    void SetFoggingColor(const vector4&); // 0xce8f
    void SetFoggingMod(const float&); // 0xcea4
    void SetGridPosition(const vector2&); // 0xce68
    void SetOffset(const vector3&); // 0xcec5
    void SetOffsetMod(const vector3&); // 0xced9
    void SetOffsetSpeed(const float&); // 0xceed
    void SetOpacityMod(const float&); // 0xcf10
    void SetQuadOffset(const vector3&); // 0xcefc
    void SetSize(const vector3&); // 0xceb3
    void SetWind(const vector2&); // 0xcf2e
    static nKernelServer* nCloudDesc::ks; // 0x1ae34
    static nClass* nCloudDesc::local_cl; // 0x1ae30

    // Nebula Script Commands (24)
    // [SLAL] v_setaltitude_f  (handler 0xd16b)
    // [SFCL] v_setfoggingcolor_ffff  (handler 0xd197)
    // [SFMO] v_setfoggingmod_f  (handler 0xd200)
    // [SCSI] v_setsize_fff  (handler 0xd22c)
    // [SCSX] v_setsizex_f  (handler 0xd281)
    // [SCSY] v_setsizey_f  (handler 0xd2c3)
    // [SCSZ] v_setsizez_f  (handler 0xd308)
    // [SCQU] v_setquadoffset_fff  (handler 0xd49a)
    // [SCOM] v_setoffsetmod_fff  (handler 0xd34d)
    // [SCOX] v_setoffsetmodx_f  (handler 0xd3a2)
    // [SCOY] v_setoffsetmody_f  (handler 0xd3e4)
    // [SCOZ] v_setoffsetmodz_f  (handler 0xd429)
    // [SCOS] v_setoffsetspeed_f  (handler 0xd46e)
    // [SCOP] v_setopacitymod_f  (handler 0xd4ef)
    // [SWND] v_setwind_ff  (handler 0xd51b)
    // [GLAL] f_getaltitude_v  (handler 0xd558)
    // [GFCL] ffff_getfoggingcolor_v  (handler 0xd582)
    // [GFMO] f_getfoggingmod_v  (handler 0x68d1)
    // [GCSI] fff_getsize_v  (handler 0xd60a)
    // [GCQU] fff_getquadoffset_v  (handler 0xd718)
    // [GCOM] fff_getoffsetmod_v  (handler 0xd67c)
    // [GCOS] f_getoffsetspeed_v  (handler 0xd6ee)
    // [GCOP] f_getopacitymod_v  (handler 0xd78a)
    // [GWND] ff_getwind_v  (handler 0xd7b4)
};
