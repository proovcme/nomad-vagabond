#pragma once
// Auto-generated from nnomads.dll (Project Nomads, Oct 2002)
// Nebula class: nguistandardmenuentry | Superclass: nguimenuentry | sizeof: 216 bytes
// RVA: n_init=0x5db7e n_new=0x5dbbb n_initcmds=0x5e274

class nGuiStandardMenuEntry : public nGuiMenuEntry {
public:
    nGuiStandardMenuEntry(const nGuiStandardMenuEntry&); // 0x5df92
    nGuiStandardMenuEntry(); // 0x5dbd5
    virtual ~nGuiStandardMenuEntry(); // 0x5dc69
    nGuiStandardMenuEntry& operator=(const nGuiStandardMenuEntry&); // 0x5dfdf
    virtual bool Exists(); // 0x5dcaf
    virtual const char* GetMeshName() const; // 0x5dee6
    virtual const char* GetShaderName() const; // 0x5df47
    virtual void Make(); // 0x5dce0
    virtual void Render(); // 0x5de05
    virtual void SetMeshName(const char*); // 0x5dea5
    virtual void SetShaderName(const char*); // 0x5df06
    static nKernelServer* nGuiStandardMenuEntry::kernelServer; // 0xb57b8

    // Nebula Script Commands (4)
    // [STMN] v_setmeshname_s  (handler 0x5e2e1)
    // [GTMN] s_getmeshname_v  (handler 0xe53a)
    // [STSN] v_setshadername_s  (handler 0x5e305)
    // [GTSN] s_getshadername_v  (handler 0x5e329)
};
