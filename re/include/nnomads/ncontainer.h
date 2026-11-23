#pragma once
// Auto-generated from nnomads.dll (Project Nomads, Oct 2002)
// Nebula class: ncontainer | Superclass: nstatenode | sizeof: 3760 bytes
// RVA: n_init=0x13f5a n_new=0x13fd8 n_initcmds=0x13ff8

class nContainer : public nStateNode {
public:
    nContainer(const nContainer&); // 0xa30e
    nContainer(); // 0x13175
    virtual ~nContainer(); // 0x1364b
    nContainer& operator=(const nContainer&); // 0xa9ec
    virtual void Activate(nRealWorld*); // 0x1383c
    virtual void AddChildVehicle(const char*, const char**); // 0x18626
    void AddCommand(double, nVector3D*, nContainer, nContainer, short, short); // 0x1b2bd
    void AddCommand(nConCommand*); // 0x1b2a0
    void AddCommandToBuffer(nVector3D*, bool); // 0x1b3dc
    void AddEnergy(float, bool, float); // 0x1b0fe
    virtual void AddPositionToBuffer(double); // 0x189a8
    void AddRelSpeed(const nVector3D&); // 0x18c73
    void AddViewerNode(n3DNode*, nContainer, bool, float); // 0x1b786
    virtual void AlignVehicle(N1*, const vector3&, N1); // 0x18a91
    float CalcCommonAirConst(); // 0x1935a
    float CalcCommonRotAirConst(); // 0x193a9
    bool CalcStabilityAxis(nVector3D*, float&); // 0x193b0
    float CalcTotalEnergyReduction(float, const char*, bool, float); // 0x1af64
    void CheckLocalizePosition(); // 0x188f0
    void ClearCommandList(); // 0x1b337
    void ClearViewerNodes(); // 0x1b753
    virtual bool CrashAllowed(); // 0x19736
    virtual bool DoesDamage(); // 0x17d51
    void DrawCross(nGfxServer*, nVector3D&, float); // 0x19786
    void DrawLine(nGfxServer*, nVector3D&, nGfxServer); // 0x19739
    void EnableEmitting(bool); // 0x13d9f
    nViewerNode* FindViewerNode(const n3DNode*, nContainer); // 0x1b80e
    void GetAccel(nVector3D&); // 0xb3fc
    nConCommand* GetActualCommand(); // 0x1b377
    virtual float GetAimOffset(); // 0x13cce
    float GetAirConst(); // 0xb3b0
    bool GetAllowMove(); // 0xb1d4
    bool GetAllowRotate(); // 0xb1e8
    nVisNode* GetAnimFinishedNode(); // 0xb5f6
    float GetArmor(const char*); // 0x1b1fa
    bool GetArtefactMode(); // 0xb62c
    N1* GetArtefactOwner(); // 0x1b64a
    unsigned int GetArtefactPrice() const; // 0x13a30
    float GetArtefactUsageDelay() const; // 0x1b66e
    bool GetArtefactUse(); // 0xb640
    float GetArtefactUseEnergy(); // 0xb6de
    const char* GetAvoidCollisionDirection(); // 0x1969e
    const char* GetAvoidCollisionKind(); // 0x196db
    nBLayer* GetBLayer(); // 0xb466
    const vector3& GetChannel(int); // 0xb5c3
    const char* GetCharAnimState() const; // 0xb7d3
    short GetCharges(); // 0xb6b2
    nList* GetChildVehicleList(); // 0xb1c0
    virtual nAnimSequence* GetCinematicSequence(); // 0x1ab66
    virtual const char* GetCinematicSequenceName() const; // 0x1ab9c
    matrix44 GetCinematicsMatrix() const; // 0x1abd2
    N1* GetCollVehicle(); // 0xb474
    nList* GetCommandList(); // 0xb618
    float GetCorrectRadius(); // 0x1968d
    virtual N1* GetCreator(); // 0x138db
    nVisNode* GetCurrentAudioNode(); // 0xb5ef
    float GetCurrentForce(); // 0xb4f7
    nViewerNode* GetCurrentViewerNode(); // 0x1b7ea
    nVisNode* GetCurrentVisNode(); // 0xb5e8
    virtual int GetCustomDataSize(int); // 0x17b69
    matrix33 GetDirection(); // 0x18227
    void GetDirection(nMatrix3D*); // 0x182a7
    int GetEmitterPopulation() const; // 0xa2f8
    double GetEmittingStarted(); // 0xa2ff
    float GetEnergy(); // 0xb51d
    void GetEngineDeltaV(nVector3D*); // 0xb4d6
    void GetEngineForce(nVector3D*); // 0xb4ae
    virtual N1* GetFactory(); // 0x13c82
    virtual N1* GetFirstVehicle(); // 0x18946
    bool GetFocusAllowed(); // 0xb5fd
    bool GetForcedFallFlag(); // 0xb374
    virtual N1* GetGarage(); // 0x13c36
    void GetGravity(nVector3D*); // 0x19595
    float GetGravityFactor(); // 0xb42a
    bool GetHardCarrierChange(); // 0xb72e
    bool GetInsideQuickSlot(); // 0xb6f2
    double GetInterpolStarted(); // 0xb71a
    float GetInvStateTime(); // 0xb1ae
    bool GetKeepViewerPos() const; // 0xb7cc
    double GetLastRecordTime() const; // 0x13bf7
    void GetLocalMatrix44(matrix44&); // 0x1858a
    float GetMass(); // 0xb388
    void GetMatrix44(matrix44&); // 0x1838e
    void GetMatrix4D(nMatrix4D&); // 0x1845a
    float GetMaxBendBackRotAccel(); // 0xb359
    float GetMaxBendBackRotation(); // 0xb309
    float GetMaxBendRotAccel(); // 0xb345
    float GetMaxBendRotation(); // 0xb2f5
    short GetMaxCharges(); // 0xb6c9
    float GetMaxEnergy(); // 0xb531
    float GetMaxHoriAccel(); // 0xb27d
    float GetMaxHoriDecel(); // 0xb291
    float GetMaxHoriRotAccel(); // 0xb331
    float GetMaxHoriRotation(); // 0xb2e1
    float GetMaxHoriSpeed(); // 0xb255
    float GetMaxVertAccel(); // 0xb2a5
    float GetMaxVertDecel(); // 0xb2b9
    float GetMaxVertRotAccel(); // 0xb31d
    float GetMaxVertRotation(); // 0xb2cd
    float GetMaxVertSpeed(); // 0xb269
    virtual N1* GetNextVehicle(N1*); // 0x18963
    virtual float GetOutsideValue() const; // 0x1ac1e
    virtual N1* GetParentVehicle(); // 0x1892f
    float GetPitchRotation() const; // 0xb756
    vector3 GetPosition(); // 0x18048
    void GetPosition(nVector3D*); // 0x18131
    vector3 GetPreMovePosition(); // 0x17dd9
    bool GetQuickSlotArtefact(); // 0xb69c
    float GetRadius(); // 0xb46d
    char* GetReasonOfDeath(); // 0xb565
    float GetRelEnergy() const; // 0x1b26d
    float GetRollRotation() const; // 0xb76a
    float GetRotAirConst(); // 0xb3c4
    float GetRotInertia(); // 0xb39c
    nRotationSlot* GetRotationSlots(); // 0xb360
    const vector3& GetSpeed(); // 0xb241
    void GetSpeed(nVector3D*); // 0xb20c
    float GetStability(); // 0xb3d8
    void GetStabilityForce(nVector3D*); // 0x19528
    void GetStoss(nVector3D*); // 0xb445
    bool GetTurboMove(); // 0x1b501
    char* GetUseableTest(); // 0xb688
    short GetUseableTester(); // 0xb656
    const char* GetVehicleClass(); // 0x13c2f
    nViewerNode* GetViewerNode(nViewerNode**); // 0x1b7f1
    virtual void GetViewerTransform(matrix44&); // 0x1b851
    bool GetVisualizeCinematic(); // 0xb5bc
    bool GetVisualizeCmdBuffer(); // 0xb5a8
    bool GetVisualizePhysics(); // 0xb580
    bool GetVisualizeWay(); // 0xb594
    const vector3& GetWantedDir(); // 0xb56c
    bool GetWeaponWorks() const; // 0x1b299
    float GetYawRotation() const; // 0xb742
    void Global2LocalDir(const matrix33&, const matrix33&&); // 0x17eee
    void Global2LocalPos(const vector3&, const vector3&&); // 0x17e54
    bool InShop() const; // 0x13a1c
    void InitSimpleCountChannel(const char*, bool, float, float, float, float, float, float, float, float); // 0x1a9b1
    bool IsCollided(); // 0xb4fe
    bool IsCommandListEmpty(); // 0xb61f
    bool IsCrashed(); // 0x19706
    bool IsCurrentAnimFinished(); // 0xb19a
    bool IsEmittingEnabled() const; // 0xa2e4
    virtual bool IsEngineWorking(); // 0x1b426
    bool IsHandControl(); // 0x139bf
    bool IsInParentSystem(); // 0xb1b5
    bool IsKilled(); // 0xb545
    virtual bool IsNetworkObjectValid(nPDU*) const; // 0x17d3d
    virtual bool IsPartOfSquadron(N1*); // 0x13dcf
    bool IsReplenished(); // 0x18d15
    bool IsTimeToTurnBack(); // 0x18d01
    bool IsVehicleClass(const char*); // 0x139e0
    bool IsVisible(); // 0xb5e1
    void KillByDistanceChecker(); // 0x1b0a1
    void KillByGarage(); // 0x1b063
    double LastTurboSwitch() const; // 0x1b508
    void Local2GlobalDir(const matrix33&, const matrix33&&); // 0x17f7c
    void Local2GlobalPos(const vector3&, const vector3&&); // 0x17ea5
    virtual void NetExport(); // 0x17806
    virtual void NetExportDamage(); // 0x17c98
    virtual void NetImport(nPDU*); // 0x178e9
    virtual void NetRelease(); // 0x178c1
    virtual void NetReleaseDamage(); // 0x17cef
    virtual void NetResetDamage(); // 0x17d04
    bool PleaseCollect() const; // 0xb706
    virtual void ReadCustomData(nDataPDU&); // 0x17bd8
    bool ReduceEnergy(float, const char*, bool, float); // 0x1ae71
    virtual void RemoveChildVehicle(N1*); // 0x1877f
    void ResetSimpleCountChannels(nChannelServer*, double); // 0x1a1b1
    virtual bool SaveCmds(nFileServer*); // 0x165c1
    virtual bool SaveGame(const char*); // 0x1b675
    void SendEnergyUpdate(N1*, float, const char*, bool, float, N1*); // 0x1af90
    void SetAccel(nVector3D&); // 0xb3df
    void SetAirConst(float); // 0xb3a3
    void SetAllowMove(bool); // 0xb1c7
    void SetAllowRotate(bool); // 0xb1db
    void SetAnimFinishedNode(nVisNode*); // 0x1abf7
    void SetArmor(const char*, float); // 0x1b142
    virtual void SetArtefactMode(bool); // 0x1b50f
    void SetArtefactOwner(N1*); // 0x1b5ec
    void SetArtefactOwner(const char*); // 0x1b624
    void SetArtefactPrice(unsigned int); // 0x13a23
    void SetArtefactUsageDelay(float); // 0x1b661
    void SetArtefactUse(bool); // 0xb633
    void SetArtefactUseEnergy(float); // 0xb6d1
    void SetBLayer(nBLayer*); // 0xb459
    void SetChannel(int, float); // 0xb156
    void SetCharAnimState(const char*); // 0xb77e
    void SetCharges(short); // 0xb6a3
    virtual void SetCinematicSequence(nAnimSequence*); // 0x1aaf2
    virtual void SetCinematicSequence(const char*); // 0x1aaa5
    void SetCinematicsMatrix(const matrix44&); // 0x1abbc
    virtual void SetCreator(N1*); // 0x138b7
    virtual void SetCreator(const char*); // 0x138a5
    void SetCurrentAnimFinished(bool); // 0xb18d
    void SetCurrentAudioNode(nVisNode*); // 0x1ac04
    void SetCurrentForce(float); // 0xb4ea
    void SetCurrentViewerNode(nViewerNode*); // 0x1b7dd
    void SetCurrentVisNode(nVisNode*); // 0x1abea
    void SetDirection(const matrix33&); // 0x18158
    void SetDirection(nMatrix3D*); // 0x18283
    void SetDrall(const vector3&); // 0x18b8f
    void SetEmitterPopulation(int); // 0xa2eb
    void SetEnergy(float); // 0xb510
    void SetEngineDeltaV(nVector3D*); // 0xb4c2
    void SetEngineForce(nVector3D*); // 0xb49a
    virtual void SetEngineWorking(bool); // 0xb771
    void SetFocusAllowed(bool); // 0x139d3
    void SetForcedFallFlag(bool); // 0xb367
    void SetGravityFactor(float); // 0xb41d
    void SetHandControl(bool); // 0x139c6
    void SetHardCarrierChange(bool); // 0xb721
    void SetInShop(bool); // 0x13a0f
    void SetInsideQuickSlot(bool); // 0xb6e5
    void SetInterpolStarted(double); // 0xb70d
    void SetInvStateTime(float); // 0xb1a1
    void SetKeepViewerPos(bool); // 0xb7bf
    void SetKilled(bool); // 0xb538
    void SetLastRecordTime(double); // 0x13bea
    void SetLocalMatrix44(const matrix44&); // 0x18526
    void SetMass(float); // 0xb37b
    void SetMatrix44(const matrix44&); // 0x1832e
    void SetMaxBendBackRotAccel(float); // 0xb34c
    void SetMaxBendBackRotation(float); // 0xb2fc
    void SetMaxBendRotAccel(float); // 0xb338
    void SetMaxBendRotation(float); // 0xb2e8
    void SetMaxCharges(short); // 0xb6ba
    void SetMaxEnergy(float); // 0xb524
    void SetMaxHoriAccel(float); // 0xb270
    void SetMaxHoriDecel(float); // 0xb284
    void SetMaxHoriRotAccel(float); // 0xb324
    void SetMaxHoriRotation(float); // 0xb2d4
    void SetMaxHoriSpeed(float); // 0xb248
    void SetMaxVertAccel(float); // 0xb298
    void SetMaxVertDecel(float); // 0xb2ac
    void SetMaxVertRotAccel(float); // 0xb310
    void SetMaxVertRotation(float); // 0xb2c0
    void SetMaxVertSpeed(float); // 0xb25c
    virtual void SetOutsideValue(float); // 0x1ac11
    virtual void SetParentVehicle(const char*, const char**); // 0x187f2
    void SetPitchRotation(float); // 0xb749
    void SetPleaseCollect(bool); // 0xb6f9
    void SetPosition(const vector3&); // 0x18002
    void SetPosition(nVector3D*); // 0x1810a
    void SetQuickSlotArtefact(bool); // 0xb68f
    void SetRadius(float); // 0x19680
    void SetReasonOfDeath(const char*); // 0xb54c
    void SetRelEnergy(float); // 0x1b25a
    void SetRelSpeed(const nVector3D&); // 0x18c20
    void SetReplenished(bool); // 0x18d08
    void SetRollRotation(float); // 0xb75d
    void SetRotAirConst(float); // 0xb3b7
    void SetRotInertia(float); // 0xb38f
    void SetSpeed(const vector3&); // 0xb22d
    void SetSpeed(nVector3D*); // 0xb1ef
    void SetStability(float); // 0xb3cb
    virtual bool SetState(const char*, double); // 0x192d8
    void SetStoss(nVector3D*); // 0xb431
    void SetTurboMove(bool); // 0x1b4d5
    void SetTurnBack(bool); // 0x18cf4
    virtual void SetUseEnergyPaid(bool); // 0x13d76
    void SetUseableTest(const char*); // 0xb65e
    void SetUseableTester(short); // 0xb647
    void SetVehicleClass(const char*); // 0x13bfe
    void SetViewerDataValid(bool); // 0xb604
    void SetVisible(bool); // 0xb5d4
    void SetVisualizeCinematic(bool); // 0xb5af
    void SetVisualizeCmdBuffer(bool); // 0xb59b
    void SetVisualizePhysics(bool); // 0xb573
    void SetVisualizeWay(bool); // 0xb587
    void SetWantedDir(float, float, vector3&); // 0x13cd5
    void SetWeaponWorks(bool); // 0x1b28c
    void SetYawRotation(float); // 0xb735
    void StorePreMovePosition(); // 0x17dc5
    virtual bool TakeOutArtefact(N1*); // 0x13d8a
    virtual void TestCommand(double); // 0x1b386
    virtual bool Trigger(void*); // 0x138f1
    void TriggerManually(); // 0xa306
    virtual void TriggerRecord(double); // 0x13a37
    virtual void UpdateChannels(double); // 0x1a1e4
    virtual void UpdateLocalFromNetwork(); // 0x17a0d
    virtual void UpdateNetworkFromLocal(); // 0x17900
    void UpdateOctreeNode(); // 0x18d1c
    void UpdateSimpleCountChannels(nChannelServer*, double); // 0x1a137
    virtual bool UseEnergyPaid() const; // 0x13d83
    bool ValidViewerData(); // 0xb611
    virtual void Visualize(nGfxServer*); // 0x198f5
    virtual void WriteCustomData(nDataPDU&); // 0x17b73
    float get_rel_speed(); // 0x19f85
    void get_speed_parts(float&, nContainer, nContainer); // 0x1a014
    void init_simple_count_channel(const char*, bool, float, float, float, float, float, float, float, float); // 0x1a9fb
    static nKernelServer* nContainer::ks; // 0xb53ec
    static nClass* nContainer::local_cl; // 0xb53e8

    // Nebula Script Commands (120)
    // [SVCL] v_setvehicleclass_s  (handler 0x14a5d)
    // [GVCL] s_getvehicleclass_v  (handler 0x14a80)
    // [IVCL] b_isvehicleclass_s  (handler 0x14aaa)
    // [SPOS] v_setposition_fff  (handler 0x14aed)
    // [GPOS] fff_getposition_v  (handler 0x14b45)
    // [SDIR] v_setdirection_fff  (handler 0x14bba)
    // [GDIR] fff_getdirection_v  (handler 0x14c44)
    // [ISHC] b_ishandcontrol_v  (handler 0x14cd6)
    // [STHC] v_sethandcontrol_b  (handler 0x14d01)
    // [SSPD] v_setspeed_fff  (handler 0x14d27)
    // [GSPD] fff_getspeed_v  (handler 0x14d77)
    // [SRSP] v_setrelspeed_fff  (handler 0x14de7)
    // [ARSP] v_addrelspeed_fff  (handler 0x14e3f)
    // [SMAS] v_setmass_f  (handler 0x14e97)
    // [GMAS] f_getmass_v  (handler 0x14ebc)
    // [SRTI] v_setrotinertia_f  (handler 0x14ee6)
    // [GRTI] f_getrotinertia_v  (handler 0x14f0b)
    // [SACO] v_setairconst_f  (handler 0x14f35)
    // [GACO] f_getairconst_v  (handler 0x14f5a)
    // [SRAC] v_setrotairconst_f  (handler 0x14f84)
    // [GRAC] f_getrotairconst_v  (handler 0x14fa9)
    // [SSTB] v_setstability_f  (handler 0x14fd3)
    // [GSTB] f_getstability_v  (handler 0x14ff8)
    // [SRAD] v_setradius_f  (handler 0x15022)
    // [GRAD] f_getradius_v  (handler 0x15049)
    // [SEGY] v_setenergy_f  (handler 0x15073)
    // [GEGY] f_getenergy_v  (handler 0x15098)
    // [SREN] v_setrelenergy_f  (handler 0x150c2)
    // [GREN] f_getrelenergy_v  (handler 0x150e9)
    // [SXEY] v_setmaxenergy_f  (handler 0x15114)
    // [GXEY] f_getmaxenergy_v  (handler 0x15139)
    // [RDCE] b_reduceenergy_f  (handler 0x15163)
    // [ADDE] v_addenergy_f  (handler 0x151b4)
    // [SARM] v_setarmor_sf  (handler 0x151e3)
    // [GARM] f_getarmor_s  (handler 0x15214)
    // [GROD] s_getreasonofdeath_v  (handler 0x15257)
    // [SVSP] v_setvisualizephysics_b  (handler 0x1527d)
    // [GVSP] b_getvisualizephysics_v  (handler 0x152a1)
    // [SVSW] v_setvisualizeway_b  (handler 0x152cd)
    // [GVSW] b_getvisualizeway_v  (handler 0x152f1)
    // [SVSB] v_setvisualizecmdbuffer_b  (handler 0x1531d)
    // [GVSB] b_getvisualizecmdbuffer_v  (handler 0x15341)
    // [SVCN] v_setvisualizecinematic_b  (handler 0x1536d)
    // [GVCN] b_getvisualizecinematic_v  (handler 0x15391)
    // [SVBL] v_setvisible_b  (handler 0x153bd)
    // [ACMD] v_addcommand_bfffbfffsf  (handler 0x153e1)
    // [ACML] v_addcommandlocal_bfffbfffsf  (handler 0x15427)
    // [CCML] v_clearcommandlist_v  (handler 0x154b7)
    // [SN8C] ssssssss_shownextcommands_v  (handler 0x154c0)
    // [SAFO] v_setartefactowner_s  (handler 0x155a5)
    // [GAFO] o_getartefactowner_v  (handler 0x15627)
    // [SAFM] v_setartefactmode_b  (handler 0x15652)
    // [GAFM] b_getartefactmode_v  (handler 0x15679)
    // [SAFU] v_setartefactuse_b  (handler 0x156a5)
    // [GAFU] b_getartefactuse_v  (handler 0x156c9)
    // [SAUD] v_setartefactusagedelay_f  (handler 0x156f5)
    // [GAUD] f_getartefactusagedelay_v  (handler 0x1571c)
    // [SUTE] v_setuseabletest_s  (handler 0x15747)
    // [GUTE] s_getuseabletest_v  (handler 0x15787)
    // [SUTR] v_setuseabletester_s  (handler 0x157c1)
    // [GUTR] s_getuseabletester_v  (handler 0x158b3)
    // [SQSA] v_setquickslotartefact_b  (handler 0x1590f)
    // [GQSA] b_getquickslotartefact_v  (handler 0x15933)
    // [SCRG] v_setcharges_i  (handler 0x1595f)
    // [GCRG] i_getcharges_v  (handler 0x15984)
    // [SMCG] v_setmaxcharges_i  (handler 0x159b4)
    // [GMCG] i_getmaxcharges_v  (handler 0x159d9)
    // [SAUE] v_setartefactuseenergy_f  (handler 0x15a09)
    // [GAUE] f_getartefactuseenergy_v  (handler 0x15a2e)
    // [SCRT] v_setcreator_s  (handler 0x15a58)
    // [GCRT] o_getcreator_v  (handler 0x15add)
    // [ACHV] v_addchildvehicle_s  (handler 0x15b0b)
    // [RCHV] v_removechildvehicle_o  (handler 0x15b92)
    // [SPAV] v_setparentvehicle_s  (handler 0x15bb9)
    // [GPAV] o_getparentvehicle_v  (handler 0x15c40)
    // [GFTV] o_getfirstvehicle_v  (handler 0x15c6e)
    // [GNXV] o_getnextvehicle_o  (handler 0x15c9c)
    // [ALIV] v_alignvehicle_offffff  (handler 0x15ce2)
    // [SDRL] v_setdrall_fff  (handler 0x15da4)
    // [SFCA] v_setfocusallowed_b  (handler 0x15e18)
    // [GFCA] b_getfocusallowed_v  (handler 0x15e3e)
    // [CTUP] v_countup_sf  (handler 0x15e6a)
    // [CTDN] v_countdown_sf  (handler 0x15ec7)
    // [CTUD] v_countupanddown_sfff  (handler 0x15f24)
    // [SIQS] v_setinsidequickslot_b  (handler 0x15f9b)
    // [IIPS] b_isinparentsystem_v  (handler 0x15fbf)
    // [ICLC] b_iscollected_v  (handler 0x15ff2)
    // [IKLD] b_iskilled_v  (handler 0x16022)
    // [IENW] b_isengineworking_v  (handler 0x1604e)
    // [IAAB] b_isatabyss_v  (handler 0x1607c)
    // [IAFD] b_isanimfinished_v  (handler 0x160d4)
    // [ISVB] b_isvisible_v  (handler 0x16100)
    // [ITBM] b_isturbomove_v  (handler 0x1612c)
    // [IEZR] b_isenergyzero_v  (handler 0x16157)
    // [ICLE] b_iscommandlistempty_v  (handler 0x16193)
    // [ICLD] b_iscollided_v  (handler 0x161c3)
    // [IMVB] b_ismoveable_v  (handler 0x161ee)
    // [IRTB] b_isrotateable_v  (handler 0x1621a)
    // [IIQS] b_isinsidequickslot_v  (handler 0x16246)
    // [ICRS] b_iscrashed_v  (handler 0x16272)
    // [SFFG] v_setforcedfallflag_b  (handler 0x1629d)
    // [GFFG] b_getforcedfallflag_v  (handler 0x162c1)
    // [SCSQ] v_setcinematicsequence_s  (handler 0x162ed)
    // [GCSQ] o_getcinematicsequence_v  (handler 0x16314)
    // [GCSN] s_getcinematicsequencename_v  (handler 0x16342)
    // [ITTB] b_istimetoturnback_v  (handler 0x1636f)
    // [IRPL] b_isreplenished_v  (handler 0x1639a)
    // [GCLV] o_getcollvehicle_v  (handler 0x163c5)
    // [SINS] v_setinshop_b  (handler 0x163f0)
    // [IINS] b_isinshop_v  (handler 0x16416)
    // [SAPR] v_setartefactprice_i  (handler 0x16441)
    // [GAPR] i_getartefactprice_v  (handler 0x1646b)
    // [GAVC] s_getavoidcollisionkind_v  (handler 0x16496)
    // [GAVD] s_getavoidcollisiondirection_v  (handler 0x164c0)
    // [ENEM] v_enableemitting_b  (handler 0x164ea)
    // [IEEN] b_isemittingenabled_v  (handler 0x16534)
    // [SPOP] v_setemitterpopulation_i  (handler 0x16510)
    // [GGGE] o_getgarage_v  (handler 0x16560)
    // [SUEP] v_setuseenergypaid_b  (handler 0x1658e)
    // [TRIG] v_triggermanually_v  (handler 0x165b5)
};
