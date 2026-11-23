#pragma once
// Auto-generated from nnomads.dll (Project Nomads, Oct 2002)
// Nebula class: nstatenode | Superclass: nnetnode | sizeof: 528 bytes
// RVA: n_init=0xd695 n_new=0xd6d2 n_initcmds=0xe1c8

class nStateNode : public nnetnode {
public:
    nStateNode(const nStateNode&); // 0x7927
    nStateNode(); // 0xd6ec
    virtual ~nStateNode(); // 0xd844
    nStateNode& operator=(const nStateNode&); // 0x7af9
    virtual void Activate(nRealWorld*); // 0xd930
    void ActivateServices(); // 0xf151
    virtual void AnnounceState(const char*); // 0xf319
    virtual void AnnounceStateWithTimeOffset(const char*, double); // 0xf33e
    void AttachService(nService*, int); // 0xf13b
    virtual void Deactivate(); // 0xd9d7
    static N1::nStateTransitionEvent* nStateNode::EventMap; // 0xa94b0
    virtual const char* GetAnnouncedState() const; // 0xf365
    double GetAudioStateStarted(); // 0x7d9f
    nClan* GetClan(); // 0x7db8
    short GetClanID(); // 0x7e74
    const nCommServer* GetCommServer(); // 0x7ee2
    double GetCreationTime() const; // 0xdd3c
    const char* GetEventSlot(nEventSlot::Type); // 0xdc05
    short GetIndexOfState(const char*); // 0xf39a
    double GetLifeTime() const; // 0xdd28
    long GetMachineID() const; // 0xf0d5
    virtual long GetNetworkID() const; // 0xf0c3
    nPDU* GetNetworkObject() const; // 0xf0bc
    int GetObjectId(); // 0x7efa
    nRoot* GetPrototype(); // 0x7ddd
    virtual nAnimSequence* GetRecord() const; // 0xdb24
    virtual double GetRecordStartTime() const; // 0xdb4f
    nServiceData* GetServiceData(nServiceType); // 0xf12d
    bool GetShowStateSwitch(); // 0x7d70
    const char* GetState(); // 0xf2fe
    const char* GetStateOfIndex(short); // 0xf416
    float GetStateProgress() const; // 0xf47a
    double GetStateStarted(); // 0x7d77
    const char* GetSymbolicName(); // 0xdbab
    bool GetThrowEvents(); // 0xdb63
    N1* GetVehiclePrototype(); // 0x7dfc
    double GetVisualStateStarted(); // 0x7d8b
    nRealWorld* GetWorld(); // 0x7e7c
    bool HasState(const char*); // 0xf451
    virtual void Initialize(); // 0xd91e
    bool IsCinematicFinished() const; // 0x7edb
    bool IsFirstFrame(); // 0x7ec7
    bool IsLifeTimeOver(); // 0xdd43
    virtual bool IsNetworkObjectValid(nPDU*) const; // 0x13dcf
    bool IsPaused() const; // 0x7d5c
    virtual bool IsRecording() const; // 0xdb3b
    bool IsRemoveable(); // 0x7e9f
    bool IsStateTimeOver(); // 0x7eb3
    static double nStateNode::MAX_RECORDINTERVAL; // 0x7d308
    virtual void NetExport(); // 0x4a64
    virtual void NetImport(nPDU*); // 0x31dae
    virtual void NetRelease(); // 0xf086
    nServiceData* NewServiceData(nServiceType, const char*, nServiceData); // 0xf0e4
    virtual bool SaveCmds(nFileServer*); // 0xea46
    virtual void SetAnnouncedState(); // 0xf374
    void SetAudioStateStarted(double); // 0x7d92
    void SetCinematicFinished(bool); // 0x7ece
    void SetClan(nClan*); // 0x7da6
    void SetClanID(short); // 0x7e65
    void SetCreationTime(double); // 0xdd2f
    void SetEventSlot(nEventSlot::Type, const char*); // 0xdbcb
    void SetFirstFrame(bool); // 0x7eba
    void SetLifeTime(double); // 0xdd1b
    void SetNetworkObject(nPDU*); // 0xf09b
    void SetObjectId(int); // 0x7eed
    void SetPaused(bool); // 0x7d4f
    void SetPrototype(nRoot*); // 0x7dce
    virtual void SetRecordStartTime(double); // 0xdb42
    void SetRemoveable(bool); // 0x7e8c
    void SetShowStateSwitch(bool); // 0x7d63
    virtual bool SetState(const char*, double); // 0xf1a5
    void SetStateProgress(float); // 0xf46d
    void SetStateTimeOver(bool); // 0x7ea6
    void SetSymbolicName(const char*); // 0xdb6a
    void SetThrowEvents(bool); // 0xdb56
    void SetVehiclePrototype(N1*); // 0x7ded
    void SetVisualStateStarted(double); // 0x7d7e
    virtual void StartRecord(nAnimSequence*); // 0xdaea
    virtual void StopRecord(); // 0xdb1c
    bool ThrowEvent(nEventSlot::Type); // 0xdc18
    void ThrowStateTransitionEvent(const char*, nStateNode); // 0xdc62
    virtual bool Trigger(void*); // 0xda7a
    virtual void TriggerRecord(double); // 0x415ce
    virtual void UpdateChannels(double); // 0x415ce
    virtual void UpdateLocalFromNetwork(); // 0x4a64
    virtual void UpdateNetworkFromLocal(); // 0x4a64
    static nKernelServer* nStateNode::kernelServer; // 0xb53dc

    // Nebula Script Commands (33)
    // [STST] v_setstate_s  (handler 0xe4b3)
    // [GTST] s_getstate_v  (handler 0xe4dd)
    // [ANST] v_announcestate_s  (handler 0x783fb)
    // [ASTW] v_announcestatewithtimeoffset_sf  (handler 0xe507)
    // [GANS] s_getannouncedstate_v  (handler 0xe53a)
    // [SRMV] v_setremoveable_b  (handler 0xe564)
    // [GRMB] b_isremoveable_v  (handler 0xe58e)
    // [GRID] i_getclanid_v  (handler 0xe5ba)
    // [GPTO] o_getprototype_v  (handler 0xe5ea)
    // [GCLN] o_getclan_v  (handler 0xe615)
    // [ISTO] b_isstatetimeover_v  (handler 0xe640)
    // [ISFF] b_isfirstframe_v  (handler 0xe66c)
    // [SPSD] v_setpaused_b  (handler 0xe698)
    // [IPSD] b_ispaused_v  (handler 0xe6bc)
    // [ICFN] b_iscinematicfinished_v  (handler 0xe6e8)
    // [SCFN] v_setcinematicfinished_b  (handler 0xe714)
    // [SSSS] v_setshowstateswitch_b  (handler 0xe738)
    // [GSSS] b_getshowstateswitch_v  (handler 0xe75c)
    // [SRST] v_setrecordstarttime_f  (handler 0xe788)
    // [GRST] f_getrecordstarttime_v  (handler 0xe7b4)
    // [SSMN] v_setsymbolicname_s  (handler 0xe7e2)
    // [GSMN] s_getsymbolicname_v  (handler 0xe805)
    // [STHR] v_setthrowevents_b  (handler 0xe82f)
    // [GTHR] b_getthrowevents_v  (handler 0xe855)
    // [SEVS] v_seteventslot_ss  (handler 0xe880)
    // [GEVS] s_geteventslot_s  (handler 0xe8bd)
    // [THRW] b_throwevent_s  (handler 0xe903)
    // [GMID] i_getmachineid_v  (handler 0xe94a)
    // [SCTM] v_setcreationtime_f  (handler 0xe975)
    // [GCTM] f_getcreationtime_v  (handler 0xe99d)
    // [SLFT] v_setlifetime_f  (handler 0xe9c8)
    // [GLFT] f_getlifetime_v  (handler 0xe9f0)
    // [ILTO] b_islifetimeover_v  (handler 0xea1b)
};
