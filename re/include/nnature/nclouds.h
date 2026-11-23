#pragma once
// Auto-generated from nnature.dll (Project Nomads, Oct 2002)
// Nebula class: nclouds | Superclass: nvisnode | sizeof: 340 bytes
// RVA: n_init=0xa5ff n_new=0xa67d n_initcmds=0xcaf2

class nClouds : public nvisnode {
public:
    nClouds(const nClouds&); // 0xacd3
    nClouds(); // 0xb180
    virtual ~nClouds(); // 0xb28c
    nClouds& operator=(const nClouds&); // 0xaddf
    virtual bool Attach(nSceneGraph2*); // 0xb5b2
    virtual void BeginClouds(const int&, const float&); // 0xb30c
    virtual void CalcCoord(int&, const nCloudDescData&); // 0xbaf9
    virtual void CalcFoggingColor(const vector3&, const nCloudDescData&); // 0xc722
    virtual void CalcNormals(); // 0xc1e1
    virtual void CalcRGBA(int&, const nCloudDescData&, const vector3&); // 0xbe81
    virtual void CalcUVCoords(); // 0xc481
    virtual vector3 CalcViewerDir(); // 0xc842
    virtual vector3 CalcViewerPos(); // 0xc7f1
    virtual void Compute(nSceneGraph2*); // 0xb5f9
    virtual void EndClouds(); // 0xb430
    float GetCloudAltAt(const int&, nClouds) const; // 0xb006
    nCloudDescData GetCloudAt(const int&, nClouds) const; // 0xaf7b
    vector4 GetCloudFogClrAt(const int&, nClouds) const; // 0xb028
    float GetCloudFogModAt(const int&, nClouds) const; // 0xb064
    vector2 GetCloudGridPosAt(const int&, nClouds) const; // 0xafa9
    vector3 GetCloudOffsetAt(const int&, nClouds) const; // 0xb128
    vector3 GetCloudOffsetModAt(const int&, nClouds) const; // 0xb0f2
    float GetCloudOpacityModAt(const int&, nClouds) const; // 0xb15e
    vector3 GetCloudQuadOffsetAt(const int&, nClouds) const; // 0xb0bc
    vector3 GetCloudSizeAt(const int&, nClouds) const; // 0xb086
    vector3 GetCloudWorldPosAt(const int&, nClouds); // 0xafd9
    vector2 GetGridOrigin() const; // 0xaf60
    int GetLayerDensity() const; // 0xaf44
    float GetLayerExtent() const; // 0xaf52
    float GetLayerNearFadeDist() const; // 0xaf59
    float GetLayerSpacing() const; // 0xaf4b
    virtual void InitVBuffer(); // 0xb675
    virtual bool SaveCmds(nFileServer*); // 0xccc7
    void SetCloudAltAt(const int&, nClouds, const float&); // 0xb489
    void SetCloudAt(const int&, nClouds, const nCloudDescData&); // 0xb45f
    void SetCloudFogClrAt(const int&, nClouds, const vector4&); // 0xb4b1
    void SetCloudFogModAt(const int&, nClouds, const float&); // 0xb4df
    void SetCloudOffsetAt(const int&, nClouds, const vector3&); // 0xb530
    void SetCloudOpacityModAt(const int&, nClouds, const float&); // 0xb58a
    void SetCloudQuadOffsetAt(const int&, nClouds, const vector3&); // 0xb55d
    void SetCloudSizeAt(const int&, nClouds, const vector3&); // 0xb507
    void SetGridOrigin(const vector2&); // 0xb447
    void SetLayerNearFadeDist(const float&); // 0xb438
    virtual void UpdateFade(const vector3&); // 0xc9be
    virtual void UpdateGrid(const vector3&); // 0xc893
    virtual void UpdateVBuffer(); // 0xb850
    virtual bool ViewerInCloud(const vector3&, const nCloudDescData&); // 0xc6c3
    static nKernelServer* nClouds::ks; // 0x1ae2c
    static nClass* nClouds::local_cl; // 0x1ae28

    // Nebula Script Commands (7)
    // [BCDS] v_beginclouds_if  (handler 0xcba1)
    // [ECDS] v_endclouds_v  (handler 0xcbe8)
    // [SLNF] v_setlayernearfadedist_f  (handler 0xcbf1)
    // [GLDN] i_getlayerdensity_v  (handler 0xcc1d)
    // [GLSP] f_getlayerspacing_v  (handler 0xcc49)
    // [GLXT] f_getlayerextent_v  (handler 0xcc73)
    // [GLNF] f_getlayernearfadedist_v  (handler 0xcc9d)
};
