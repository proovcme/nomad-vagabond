#pragma once
// Auto-generated from nnomads.dll (Project Nomads, Oct 2002)
// Nebula class: ndatahandler | Superclass: nroot | sizeof: 192 bytes
// RVA: n_init=0x57bca n_new=0x57c07 n_initcmds=0x58959

class nDataHandler : public nroot {
public:
    nDataHandler(const nDataHandler&); // 0x10b8e
    nDataHandler(); // 0x57c21
    virtual ~nDataHandler(); // 0x57d1c
    nDataHandler& operator=(const nDataHandler&); // 0x10c2c
    void Cleanup(); // 0x58179
    void EnableSafetyMode(bool); // 0x10b81
    void GetDataPaths(const char*&, nDataHandler); // 0x5806b
    int GetIndexByProto(nRoot*); // 0x585db
    int GetIndexByProtoName(const char*); // 0x584a7
    bool GetPreload(); // 0x5f7f0
    nRoot* GetProtoByIndex(int); // 0x58608
    char* GetProtoName(nRoot*, char*, int); // 0x58457
    nRoot* Load(const char*); // 0x581e2
    bool LoadList(const char*); // 0x586b7
    void MarkKeep(nRoot*); // 0x58136
    void MarkPermanent(nRoot*); // 0x580f3
    void ReadTransformSources(const char*, nRoot*); // 0x58895
    void RenderLoadingText(const char*); // 0x31dae
    void SetDataPaths(const char*, nDataHandler); // 0x57fe4
    void SetPreload(bool); // 0x580a4
    void Unload(const char*); // 0x583aa
    bool UnloadList(const char*); // 0x587e6
    void createToc(); // 0x57dd5
    static nKernelServer* nDataHandler::kernelServer; // 0xb5780
    bool splitProtoName(const char*, const char*&, const char*, char*, int); // 0x580b1

    // Nebula Script Commands (7)
    // [SDTP] v_setdatapaths_ss  (handler 0x58a08)
    // [GDTP] ss_getdatapaths_v  (handler 0x58a35)
    // [LOAD] o_load_s  (handler 0x58a80)
    // [UNLD] v_unload_s  (handler 0x58b15)
    // [LDLS] b_loadlist_s  (handler 0x58b38)
    // [ULDL] b_unloadlist_s  (handler 0x58b7b)
    // [LOAP] o_loadpermanent_s  (handler 0x58ac3)
};
