#pragma once
// Auto-generated from nnomads.dll (Project Nomads, Oct 2002)
// Nebula class: nhouse | Superclass: ncontainer | sizeof: 3888 bytes
// RVA: n_init=0x2c23d n_new=0x2c2bb n_initcmds=0x2c2db

class nHouse : public nContainer {
public:
    nHouse(const nHouse&); // 0x12c70
    nHouse(); // 0x2b6cb
    virtual ~nHouse(); // 0x2b767
    nHouse& operator=(const nHouse&); // 0x12d70
    static float nHouse::BUILD_DISTANCE; // 0x821e0
    virtual float CalcHouseMenuAngle(); // 0x2c09a
    virtual vector3 CalcHouseMenuCentre(); // 0x2c019
    virtual float CalcHouseMenuRadius(); // 0x2c05b
    virtual float GetAimOffset(); // 0x2c0c4
    virtual float GetBuildSlotRadius(); // 0x2c0f3
    N1::nBuildState GetBuildState(); // 0x31640
    virtual nStation* GetBuildStation() const; // 0x2d1d9
    virtual const char* GetBuildingClass() const; // 0x2d246
    virtual int GetCustomDataSize(int); // 0x2b902
    virtual float GetHouseMenuAngle() const; // 0x2c093
    virtual vector3 GetHouseMenuCentre() const; // 0x2bff8
    virtual float GetHouseMenuRadius() const; // 0x2c054
    virtual bool GetRemoveBuilding() const; // 0x2d2b9
    virtual bool GetSleepMode() const; // 0x2bfdd
    virtual const matrix33& GetViewerDir() const; // 0x2b7da
    virtual const vector3& GetViewerPos() const; // 0x2b7bd
    virtual bool GetVisualizePossessArea() const; // 0x2b7a2
    bool HasMenu(nClan*); // 0x2bf26
    virtual bool IsNetworkObjectValid(nPDU*) const; // 0x1c6d6
    virtual bool IsOccupied(); // 0x2d11c
    virtual bool NearBuildGround(); // 0x2d01b
    virtual void NetExport(); // 0x2b7e1
    virtual void ReadCustomData(nDataPDU&); // 0x2ba5f
    virtual void RemoveFromIsland(); // 0x2d24d
    virtual bool SaveCmds(nFileServer*); // 0x2c7dd
    virtual bool SearchLockedIsland(); // 0x2cf7a
    virtual bool SearchUnlockedIsland(); // 0x2ced0
    virtual void SetArtefactMode(bool); // 0x2c0a2
    void SetBuildState(N1::nBuildState); // 0x2d085
    virtual void SetBuildStation(nStation*); // 0x2d1a3
    virtual void SetBuildStation(const char*); // 0x2d1c7
    virtual void SetBuildingClass(const char*); // 0x2d1ef
    virtual void SetHouseMenuAngle(float); // 0x2c086
    virtual void SetHouseMenuCentre(const vector3&); // 0x2bfe4
    virtual void SetHouseMenuRadius(float); // 0x1f6d5
    virtual void SetRemoveBuilding(bool); // 0x2d2ac
    virtual void SetSleepMode(bool); // 0x2bfd0
    virtual void SetViewerDir(const matrix33&); // 0x2b7c4
    virtual void SetViewerPos(const vector3&); // 0x2b7a9
    virtual void SetVisualizePossessArea(bool); // 0x2b795
    virtual bool SupportMenuAction(int, nClan*); // 0x2bd91
    virtual bool Trigger(void*); // 0x1ffb7
    virtual void TriggerRecord(double); // 0x2bbd8
    virtual void UpdateChannels(double); // 0x2ca09
    virtual void UpdateLocalFromNetwork(); // 0x2b8c5
    virtual void UpdateNetworkFromLocal(); // 0x2b893
    virtual void Visualize(nGfxServer*); // 0x2ca8a
    virtual void WriteCustomData(nDataPDU&); // 0x2b912
    static nKernelServer* nHouse::ks; // 0xb5444
    static nClass* nHouse::local_cl; // 0xb5440

    // Nebula Script Commands (19)
    // [SULI] b_searchunlockedisland_v  (handler 0x2c492)
    // [SLOI] b_searchlockedisland_v  (handler 0x67590)
    // [NBGD] b_nearbuildground_v  (handler 0x2c4ee)
    // [SBDC] v_setbuildingclass_s  (handler 0x214fe)
    // [GBDC] s_getbuildingclass_v  (handler 0x2c51c)
    // [SVPA] v_setvisualizepossessarea_b  (handler 0x2c549)
    // [GVPA] b_getvisualizepossessarea_v  (handler 0x2c570)
    // [RMFI] v_removefromisland_v  (handler 0x2c59e)
    // [RMVB] b_removebuilding_v  (handler 0x2c601)
    // [SSMD] v_setsleepmode_b  (handler 0x2c62f)
    // [GSMD] b_getsleepmode_v  (handler 0x2c656)
    // [SHMR] v_sethousemenuradius_f  (handler 0x2c6ed)
    // [GHMR] f_gethousemenuradius_v  (handler 0x2c718)
    // [SHMC] v_sethousemenucentre_fff  (handler 0x1d9ed)
    // [GHMC] fff_gethousemenucentre_v  (handler 0x2c684)
    // [SHMA] v_sethousemenuangle_f  (handler 0x2c746)
    // [GHMA] f_gethousemenuangle_v  (handler 0x2c77c)
    // [ISOC] b_isoccupied_v  (handler 0x2c4c0)
    // [SBST] v_setbuildstation_s  (handler 0x2c7b6)
};
