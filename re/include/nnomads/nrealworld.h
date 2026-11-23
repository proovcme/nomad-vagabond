#pragma once
// Auto-generated from nnomads.dll (Project Nomads, Oct 2002)
// Nebula class: nrealworld | Superclass: nroot | sizeof: 1576 bytes
// RVA: n_init=0x6eeb4 n_new=0x6f08b n_initcmds=0x6f0ab

class nRealWorld : public nroot {
public:
    nRealWorld(const nRealWorld&); // 0x90fd
    nRealWorld(); // 0x6d842
    virtual ~nRealWorld(); // 0x6e17b
    nRealWorld& operator=(const nRealWorld&); // 0x9600
    void ActivateFastPossess(); // 0x718bb
    void AddCookie(const char*, nRealWorld); // 0x76f4e
    void AnnounceLoadSavePoint(const char*); // 0x7439d
    void AnnounceSavePoint(const char*); // 0x7435c
    void ApplyPrefs(); // 0x75726
    void BeginAliases(); // 0x76e36
    void BeginCookies(); // 0x76f3c
    void CheckIllegalObjects(); // 0x755e9
    bool CheckIllegalObjectsInClan(nClan*); // 0x7541b
    void CheckLoosingClient(); // 0x72727
    void CheckLoosingServer(); // 0x72551
    void CheckWinningClient(); // 0x72808
    void CheckWinningServer(); // 0x72798
    bool CloseGame(); // 0x70cec
    void CloseSession(); // 0x74063
    void ContGame(); // 0x70e34
    nClan* CopyClan(nClan**); // 0x74c5f
    int CountObjectsByClassId(const char*); // 0x768a0
    nClan* CreateClan(); // 0x72aaf
    nClan* CreateClanWithName(const char*); // 0x72b00
    void DeactivateFastPossess(); // 0x718c3
    void EndAliases(); // 0x4a64
    void EndCookies(); // 0x4a64
    void EnterWarpMode(); // 0x70e7b
    bool FastPossessActive(); // 0x718a3
    void FilterClanAtLoad(char*, nClan*); // 0x74b70
    void FilterClanAtLoad(char*, nContainer*); // 0x74c43
    void FilterClanAtSave(char*); // 0x74ab1
    nClan* FindClanBySymbolicName(const char*); // 0x767aa
    nClan* FindNextClanBySymbolicName(nClan**, const char*); // 0x76823
    nContainer* FindNextObjectByClassId(nContainer**, const char*); // 0x765ad
    nContainer* FindNextObjectBySymbolicName(nContainer**, const char*); // 0x766e2
    nContainer* FindObjectByClassId(const char*); // 0x76538
    nContainer* FindObjectByNetworkID(long); // 0x7235f
    nContainer* FindObjectBySymbolicName(const char*); // 0x76640
    nClan* FindPlayerClanByMachineID(long); // 0x728f5
    nContainer* FindVehicle(nContainer**, const vector3&, const char*, float, bool, nContainer::nSearchKind, nContainer*); // 0x75e1f
    nContainer* FindVehicle(nContainer**, const char*, float, bool, nContainer::nSearchKind, nContainer*); // 0x75de4
    nContainer* FindVehicleMultipleClasses(nContainer**, const vector3&, PBD::?$nArray&, float, bool, nContainer::nSearchKind, nContainer*); // 0x75f78
    bool GameOver() const; // 0x718cb
    const char* GetAlias(const char*); // 0x76f0b
    bool GetAlreadySaved() const; // 0x6cf2
    float GetArtefactUseEnergy(); // 0x6e648
    const char* GetBuildVersion(); // 0x6e73c
    nClan* GetClanById(unsigned short); // 0x72c17
    double GetDayPeriod(); // 0x74237
    nClan* GetEnvironmentClan(); // 0x72f5c
    float GetFrameTime(); // 0x6e634
    int GetGlobalChannelIndex(int); // 0x9c75
    double GetGlobalTime(); // 0x6e62d
    nContainer* GetHandControlVehicle(); // 0x6e578
    int GetNumClientsConnected(); // 0x72880
    int GetPref(const char*); // 0x75afc
    double GetRecordStartTime() const; // 0x77268
    static N1::nSearchKind GetSearchKindID(const char*); // 0x763c6
    static const char* GetSearchKindName(const char*::nSearchKind); // 0x764dd
    double GetTimeOfDay(); // 0x74203
    int GetUniqueId(); // 0x6e72d
    nClan* GetUserClan(); // 0x72bce
    int GetVChannelIndex(const char*); // 0x73d56
    const char* GetVChannelName(int) const; // 0x73dd5
    nViewer2* GetViewer2(); // 0x76a09
    nContainer* GetViewerCarrier(); // 0x76ad2
    matrix44 GetViewerMatrix(); // 0x76a20
    void HandleDamagePDUs(); // 0x723d2
    void InitChannelIndices(); // 0x73d18
    bool IsCinematicRunning(); // 0x717a0
    bool IsEnemy(nClan*, nRealWorld); // 0x769b1
    bool IsEnemy(nContainer*, nRealWorld); // 0x7690c
    bool IsFriend(nClan*, nRealWorld); // 0x76986
    bool IsFriend(nContainer*, nRealWorld); // 0x768c9
    bool IsGameStarted(); // 0x70c6e
    bool IsHost(); // 0x73ee5
    bool IsJoined(); // 0x73eec
    bool IsNetSession(); // 0x73ede
    bool IsNeutral(nClan*, nRealWorld); // 0x769dd
    bool IsNeutral(nContainer*, nRealWorld); // 0x76950
    bool IsPlaying() const; // 0x77203
    bool IsRecording() const; // 0x771fc
    bool IsSessionStarted(); // 0x728d7
    bool IsWarpMode() const; // 0x70f8a
    bool JoinSession(int); // 0x74139
    void KillGame(); // 0x743de
    void LeaveWarpMode(); // 0x70f49
    bool LoadBook2(const char*); // 0x75283
    bool LoadCharacter(const char*); // 0x75107
    bool LoadCharacterAt(const char*, nVector3D*); // 0x75148
    nClan* LoadEncounter(const char*); // 0x747c5
    nClan* LoadEncounterAt(const char*, nVector3D&, nMatrix3D&); // 0x7491f
    bool LoadGame(const char*); // 0x7446b
    bool LoadMultiplayerGame(const char*); // 0x74697
    void LoadPrefs(); // 0x7566b
    bool LoadRecord(const char*); // 0x75341
    bool LockNextSpawnPoint(short); // 0x71bed
    bool OpenGame(); // 0x70c75
    bool OpenSession(const char*); // 0x73ef3
    void PauseGame(); // 0x70e18
    void PlaySound(const char*); // 0x73df5
    void RefreshDisplay(); // 0x73c2e
    void RefreshGui(); // 0x73c49
    void ReleaseClan(nClan*); // 0x72b26
    void RenderGui(); // 0x733a7
    void RenderVersionString(); // 0x4a64
    void ResetClan(nClan*); // 0x74c92
    void ResetUserClan(); // 0x74fd5
    void ResetViewer(); // 0x76af0
    void RestoreBook(const char*, nRealWorld); // 0x752e3
    bool SaveCharacter(const char*); // 0x75009
    virtual bool SaveCmds(nFileServer*); // 0x708a1
    void SaveCookies(nFileServer*); // 0x76f6b
    bool SaveEncounter(nClan*, const char*); // 0x74734
    bool SaveGame(const char*); // 0x7425a
    void SavePrefs(); // 0x756ff
    void SaveRecord(const char*); // 0x75312
    void SetAlias(const char*, nRealWorld); // 0x76e77
    void SetAlreadySaved(bool); // 0x6ce8
    void SetArtefactUseEnergy(float); // 0x6e63b
    void SetControlOwner(nRoot*); // 0x70f0d
    void SetDayPeriod(double); // 0x7420a
    void SetGlobalChannel(nGlobalChannelIndex, float); // 0x73de3
    void SetGlobalTime(double); // 0x6e603
    bool SetHandControlVehicle(nContainer*); // 0x6e475
    bool SetHandControlVehicleName(const char*); // 0x6e4c5
    void SetPref(const char*, int); // 0x75a8b
    void SetRecordStartTime(double); // 0x7725b
    void SetTimeOfDay(double); // 0x741d3
    void SetUserClan(nClan*); // 0x72b7d
    void SetViewer2(nViewer2*); // 0x769f7
    void SetViewerCarrier(nContainer*); // 0x76a59
    void SetViewerCarrierSG(const char*); // 0x76b2c
    void SetupInfoBars(); // 0x76bc2
    virtual void ShowValue(const char*, nRealWorld); // 0x6e64f
    virtual void ShowValue(const char*, int); // 0x6e6fc
    virtual void ShowValue(const char*, float); // 0x6e6c6
    bool StartGame(); // 0x70d90
    void StartRecord(); // 0x77041
    void StartSession(); // 0x728bd
    void StopGame(); // 0x70e01
    void StopRecord(); // 0x771a6
    nContainer* TestVehicleForSearch(nContainer**, const vector3&, nRealWorld, bool, const char*, nContainer::nSearchKind, float&, vector3); // 0x76121
    void TriggerPlaying(); // 0x7726f
    void TriggerRecord(); // 0x7720a
    void TriggerViewers(nConTriggerInfo*); // 0x76b6d
    bool UnlockSpawnPoint(short); // 0x71c48
    void UnsetHandControlVehicle(); // 0x6e54b
    void UpdateGlobalTime(); // 0x6e597
    void UpdateInfoBars(nContainer*); // 0x76cb2
    void UpdateInputMapping(bool); // 0x6e74c
    void actualize_clanid(); // 0x72f4a
    void calc_clan_energy(float&, nRealWorld, nRealWorld); // 0x73c64
    void calc_maennel_energy(float&, nRealWorld, nRealWorld); // 0x73cbe
    nClan* createClan(bool, unsigned short, short); // 0x7294d
    short detect_highest_clanid(); // 0x72ef5
    void exportLocalClans(); // 0x72c8c
    unsigned short getClanId(); // 0x72c5c
    void getClientId(); // 0x72330
    unsigned short getNetworkClanId(); // 0x72c6e
    void joinRenameClans(); // 0x72dca
    static nKernelServer* nRealWorld::ks; // 0xb5900
    static nClass* nRealWorld::local_cl; // 0xb58fc
    bool netTrigger(double); // 0x71c95
    static nProfiler* nRealWorld::p_collcheck; // 0xb58e4
    static nProfiler* nRealWorld::p_collhandle; // 0xb58cc
    static nProfiler* nRealWorld::p_container; // 0xb58f0
    static nProfiler* nRealWorld::p_engine; // 0xb58d4
    static nProfiler* nRealWorld::p_explosion; // 0xb58dc
    static nProfiler* nRealWorld::p_frame; // 0xb58c4
    static nProfiler* nRealWorld::p_ki; // 0xb58f8
    static nProfiler* nRealWorld::p_misc; // 0xb58e8
    static nProfiler* nRealWorld::p_move; // 0xb58ec
    static nProfiler* nRealWorld::p_network; // 0xb58c0
    static nProfiler* nRealWorld::p_other; // 0xb58bc
    static nProfiler* nRealWorld::p_physics; // 0xb58e0
    static nProfiler* nRealWorld::p_render; // 0xb58f4
    static nProfiler* nRealWorld::p_statewatcher; // 0xb58d0
    static nProfiler* nRealWorld::p_target; // 0xb58d8
    static nProfiler* nRealWorld::p_viewerdata; // 0xb58c8
    void releaseShadowClans(); // 0x72cce
    void renderFrame(bool, nRealWorld); // 0x72f98
    void setNewClanId(nClan*, unsigned short); // 0x72d15
    void singleRenameClans(); // 0x72e59
    void tmpRenameClans(); // 0x72d53
    void triggerClans(int); // 0x70f91
    bool triggerGame(); // 0x70fe4
    void update_timeofday(); // 0x7423e

    // Nebula Script Commands (92)
    // [OGAM] b_opengame_v  (handler 0x6f8a8)
    // [SGAM] b_startgame_v  (handler 0x6f910)
    // [XGAM] v_stopgame_v  (handler 0x6f93b)
    // [CGAM] b_closegame_v  (handler 0x6f947)
    // [PGAM] v_pausegame_v  (handler 0x6f995)
    // [ISPS] b_ispaused_v  (handler 0x6f99e)
    // [WGAM] v_contgame_v  (handler 0x6f9c8)
    // [KLGM] v_killgame_v  (handler 0x7019d)
    // [SVGM] b_savegame_s  (handler 0x6fe08)
    // [ANSG] v_announcesavepoint_s  (handler 0x6fe4b)
    // [ANLP] v_announceloadsavepoint_s  (handler 0x6fe6e)
    // [LDGM] b_loadgame_s  (handler 0x6fe91)
    // [LDMG] b_loadmultiplayergame_s  (handler 0x6fed4)
    // [SVEN] b_saveencounter_os  (handler 0x6ff17)
    // [LDEN] o_loadencounter_s  (handler 0x6ff65)
    // [LDEA] o_loadencounterat_sffffff  (handler 0x6ffa8)
    // [SVCH] b_savecharacter_s  (handler 0x7015a)
    // [LDCH] b_loadcharacter_s  (handler 0x70098)
    // [LDCA] b_loadcharacterat_sfff  (handler 0x700db)
    // [OPSN] b_opensession_s  (handler 0x6f9d1)
    // [CLSN] v_closesession_v  (handler 0x6fa14)
    // [STSN] v_startsession_v  (handler 0x6fa1d)
    // [ISSS] b_issessionstarted_v  (handler 0x6fa26)
    // [CNCT] b_joinsession_i  (handler 0x6fa51)
    // [ISNS] b_isnetsession_v  (handler 0x6fc3c)
    // [ISCN] b_isjoined_v  (handler 0x6fc92)
    // [ISHT] b_ishost_v  (handler 0x6fc67)
    // [CPLR] o_createclan_v  (handler 0x6fa94)
    // [CSCL] o_createandselclan_v  (handler 0x6fabf)
    // [CCWN] o_createclanwithname_s  (handler 0x6faf6)
    // [CSCN] o_createandselclanwithname_s  (handler 0x6fb36)
    // [RPLR] v_releaseclan_o  (handler 0x6fb82)
    // [SUPL] b_setuserclan_o  (handler 0x6fbee)
    // [GUPL] o_getuserclan_v  (handler 0x6fc11)
    // [CPCL] o_copyclan_o  (handler 0x6fba5)
    // [RUCL] v_resetuserclan_v  (handler 0x6fbe5)
    // [SCIC] v_setclanidcount_i  (handler 0x701a6)
    // [STHC] b_sethandcontrol_s  (handler 0x6fcbd)
    // [UTHC] v_unsethandcontrol_v  (handler 0x6fcfd)
    // [GTHC] o_gethandcontrol_v  (handler 0x6fd06)
    // [RFDS] v_refreshdisplay_v  (handler 0x6fd31)
    // [STOD] v_settimeofday_f  (handler 0x6fd62)
    // [GTOD] f_gettimeofday_v  (handler 0x6fd8a)
    // [SDPD] v_setdayperiod_f  (handler 0x6fdb5)
    // [GDPD] f_getdayperiod_v  (handler 0x6fddd)
    // [SGLT] v_setglobaltime_f  (handler 0x6fd3a)
    // [FNDV] o_findvehicle_osfbs  (handler 0x701cb)
    // [FOID] o_findobjectbyclassid_s  (handler 0x70257)
    // [FNID] o_findnextobjectbyclassid_os  (handler 0x7029a)
    // [COID] i_countobjectsbyclassid_s  (handler 0x702e8)
    // [STAR] v_startrecord_v  (handler 0x7032b)
    // [STPR] v_stoprecord_v  (handler 0x70342)
    // [SVRC] v_saverecord_s  (handler 0x70359)
    // [LDRC] b_loadrecord_s  (handler 0x70392)
    // [ISRC] b_isrecording_v  (handler 0x703d5)
    // [ISPL] b_isplaying_v  (handler 0x70400)
    // [LBK2] b_loadbook2_s  (handler 0x7042b)
    // [RSBK] v_restorebook_ss  (handler 0x7044e)
    // [GECL] o_getenvironmentclan_v  (handler 0x7047b)
    // [FSYM] o_findobjectbysymbolicname_s  (handler 0x704a6)
    // [FNSM] o_findnextobjectbysymbolicname_os  (handler 0x704e9)
    // [FCSM] o_findclanbysymbolicname_s  (handler 0x70537)
    // [FNCS] o_findnextclanbysymbolicname_os  (handler 0x7057a)
    // [SVW2] v_setviewer2_o  (handler 0x705c8)
    // [GVW2] o_getviewer2_v  (handler 0x705eb)
    // [SVWC] v_setviewercarrier_o  (handler 0x70616)
    // [GVWC] o_getviewercarrier_v  (handler 0x70639)
    // [RSTV] v_resetviewer_v  (handler 0x70664)
    // [SVCS] v_setviewercarriersg_s  (handler 0x7066d)
    // [BALS] v_beginaliases_v  (handler 0x70690)
    // [SALS] v_setalias_ss  (handler 0x70699)
    // [EALS] v_endaliases_v  (handler 0x7073e)
    // [GALS] s_getalias_s  (handler 0x706c6)
    // [BGCK] v_begincookies_v  (handler 0x70708)
    // [ADCK] v_addcookie_ss  (handler 0x70711)
    // [EDCK] v_endcookies_v  (handler 0x7073e)
    // [TCLS] v_tclstop_v  (handler 0x707d2)
    // [LDPR] v_loadprefs_v  (handler 0x70747)
    // [SVPR] v_saveprefs_v  (handler 0x70750)
    // [APPR] v_applyprefs_v  (handler 0x70759)
    // [SEPR] v_setpref_si  (handler 0x70762)
    // [GEPR] i_getpref_s  (handler 0x7078f)
    // [PLSN] v_playsound_s  (handler 0x707f5)
    // [EWMO] v_enterwarpmode_v  (handler 0x6f8d3)
    // [LWMO] v_leavewarpmode_v  (handler 0x6f8dc)
    // [ISWM] b_iswarpmode_v  (handler 0x6f8e5)
    // [SCOW] v_setcontrolowner_o  (handler 0x6f972)
    // [ICRN] b_iscinematicrunning_v  (handler 0x70818)
    // [FPAC] b_fastpossessactive_v  (handler 0x70843)
    // [ACFP] v_activatefastpossess_v  (handler 0x7086e)
    // [DAFP] v_deactivatefastpossess_v  (handler 0x70877)
    // [SALR] v_setalreadysaved_b  (handler 0x70880)
};
