#pragma once
// Auto-generated from nnetwork.dll (Project Nomads, Oct 2002)
// Nebula class: ncommserver | Superclass: nroot | sizeof: 304 bytes
// RVA: n_init=0xba19 n_new=0xba56 n_initcmds=0xba76

class nCommServer : public nroot {
public:
    nCommServer(const nCommServer&); // 0xb126
    nCommServer(); // 0x9032
    virtual ~nCommServer(); // 0x922b
    nCommServer& operator=(const nCommServer&); // 0xb2c1
    virtual short AskSessions(bool, const char*, int); // 0x954f
    void CheckConnection(); // 0xaee4
    virtual void CloseSession(); // 0x9788
    virtual bool ConnectionLost(); // 0xaf65
    virtual nPDU* CreateEntity(nPDU*::PDUType); // 0x9c7d
    void CreateTargetMachine(short); // 0x9992
    bool DeadReckon(nEntityStatePDU*, float, bool); // 0xa1d4
    virtual bool Disconnected() const; // 0x998b
    N1::nTargetMachineNode* FindTargetMachine(short); // 0x9afe
    void FlushDataToNetwork(); // 0x9b49
    short GetClientID() const; // 0xb4b7
    float GetDRThreshold() const; // 0xa769
    virtual const nList& GetEntities() const; // 0x9cc2
    unsigned long GetFreeID(); // 0x9b2a
    const char* GetPrediction() const; // 0xa804
    const char* GetSmoothing() const; // 0xa8b3
    double GetTransmissionTime() const; // 0xa762
    void HideStats(); // 0xad1e
    bool IsConnected() const; // 0xb4bf
    bool IsHost() const; // 0xaecb
    virtual bool JoinSession(short); // 0x966e
    virtual void LockSession(bool); // 0x9966
    virtual bool OpenSession(const char*, int); // 0x93fa
    bool PredictPath(nEntityStatePDU*, float, bool); // 0xa217
    void PrintEntities(); // 0xad95
    void PrintGhosts(); // 0xae30
    void ReceiveData(); // 0x9ccd
    void RemoveTargetMachine(short); // 0x9a6c
    void ResetStats(); // 0xad61
    void SendData(); // 0x9eb2
    virtual bool SessionFull(); // 0x98e6
    virtual bool SessionLocked(); // 0x997c
    virtual bool SessionStarted(); // 0x98e6
    void SetConnected(bool); // 0xb4c6
    void SetDRThreshold(float); // 0x35a2
    void SetPrediction(const char*); // 0xa770
    void SetRegularTransmission(bool); // 0xa748
    void SetSmoothing(const char*); // 0xa81f
    void SetTransmissionTime(double); // 0xa755
    void ShowStats(); // 0xad09
    void SmoothPath(nEntityStatePDU*); // 0xa3dc
    void ToggleStats(); // 0xad2d
    void Trigger(); // 0x934f
    void UpdateLocalPDUs(); // 0xa5df
    void UpdateRemotePDUs(); // 0xa6e1
    void UpdateStatistics(); // 0xa8ce
    virtual short VoteNextHost(); // 0xaed2
    static nKernelServer* nCommServer::ks; // 0x162d8
    static nClass* nCommServer::local_cl; // 0x162d4

    // Nebula Script Commands (21)
    // [CSOS] v_opensession_si  (handler 0xbc59)
    // [CSAS] i_asksessions_bsi  (handler 0xbca7)
    // [CSJS] v_joinsession_i  (handler 0xbd28)
    // [CSCS] v_closesession_v  (handler 0xbd4c)
    // [RGTR] v_setregulartransmission_b  (handler 0xbd55)
    // [SDRT] v_setdrthreshold_f  (handler 0xbd7b)
    // [GDRT] f_getdrthreshold_v  (handler 0xbda2)
    // [SHST] v_showstats_v  (handler 0xbdcd)
    // [HDST] v_hidestats_v  (handler 0xbdd6)
    // [TGST] v_togglestats_v  (handler 0xbddf)
    // [RSST] v_resetstats_v  (handler 0xbde8)
    // [PREN] v_printentities_v  (handler 0xbdf1)
    // [PRGH] v_printghosts_v  (handler 0xbdfa)
    // [STTT] v_settransmissiontime_f  (handler 0xbe03)
    // [GTTT] f_gettransmissiontime_v  (handler 0xbe2b)
    // [STPR] v_setprediction_s  (handler 0xbe56)
    // [GTPR] s_getprediction_v  (handler 0xbe79)
    // [STSM] v_setsmoothing_s  (handler 0xbea3)
    // [GTSM] s_getsmoothing_v  (handler 0xbec6)
    // [GCID] i_getclientid_v  (handler 0xbef0)
    // [ISHO] b_ishost_v  (handler 0xbf20)
};
