#pragma once
// Auto-generated from nnetwork.dll (Project Nomads, Oct 2002)
// Nebula class: nnetwork2 | Superclass: nroot | sizeof: None bytes
// RVA: n_init=0x1b5d n_new=0x1de4 n_initcmds=None

class nNetwork2 : public nroot {
public:
    nNetwork2(const nNetwork2&); // 0x1fd5
    nNetwork2(); // 0x237c
    virtual ~nNetwork2(); // 0x24b5
    nNetwork2& operator=(const nNetwork2&); // 0x216e
    virtual bool AddMachine(short, unsigned long, short, unsigned long, bool); // 0x2780
    virtual bool AddToBuffer(const char*, short, short); // 0x3082
    virtual void AskLatency(); // 0x31ea
    virtual void CalcSendReceiveStatistics(short, long); // 0x339c
    virtual bool CheckRemoteStart(bool&); // 0x25a4
    virtual bool DebugReceive(char*, nNetwork2, short&); // 0x2a40
    virtual bool Dispatch(nCmd*); // 0x35f1
    virtual nMachineNode2* FindLocalMachineNode(); // 0x2900
    virtual nMachineNode2* FindMachineNode(short); // 0x28b7
    virtual bool FlushBuffer(); // 0x2fe9
    short GetBufferUser(); // 0x1fa7
    int GetDropMsg(); // 0x35af
    virtual void GetGUID(unsigned char*); // 0x258f
    short GetHostID(); // 0x1f68
    virtual bool GetLatencyInfo(short, double*, nNetwork2, nNetwork2, nNetwork2); // 0x3271
    nList* GetMachineList(); // 0x1f83
    virtual short GetMaxMachineID(); // 0x2871
    short GetMaxNumMachines(); // 0x1f93
    virtual short GetMaxPathNumber(char*); // 0x25b0
    virtual short GetNumMachines(); // 0x2942
    virtual double GetSendDelay(); // 0x1f26
    virtual n_sendreceiveinfo* GetSendReceiveStatistics(); // 0x3523
    char* GetSessionName(); // 0x1f43
    virtual void HandleProtocolMessage(char*, int, short); // 0x2ee4
    virtual void InitSendReceiveStatistics(); // 0x353c
    virtual bool InsertSystemMessage(short, short, short, char*); // 0x2e12
    virtual bool IsBufferEmpty(); // 0x357f
    virtual bool IsConnected(short); // 0x297c
    bool IsHost(); // 0x1f47
    bool IsJoined(); // 0x1f4e
    virtual bool IsLAN() const; // 0x2673
    bool IsLocked(); // 0x1f55
    virtual bool LockSession(bool); // 0x26ce
    void ObtainMachineData(); // 0x1f6d
    nList* ObtainProtocolList(); // 0x1faf
    virtual void PrepareMessage(short, void*); // 0x358f
    virtual bool Receive(short&, char*&, nNetwork2, nNetwork2); // 0x2d36
    void ReleaseMachineData(); // 0x1f79
    void ReleaseProtocolList(); // 0x1fc8
    virtual bool RemoveMachine(short); // 0x2824
    virtual bool Send(void*, short, short, bool); // 0x2c66
    void SetBufferUser(short); // 0x1f98
    void SetDropMsg(int); // 0x35a2
    virtual bool SetGUID(unsigned char*); // 0x2556
    virtual void SetHost(bool); // 0x26dd
    void SetHostID(short); // 0x1f5c
    virtual void SetLAN(bool); // 0x2666
    void SetMaxNumMachines(short); // 0x1f87
    virtual void SetSendDelay(double); // 0x1f19
    void SetSessionName(const char*); // 0x1f2d
    virtual bool SimulateSendBug(); // 0x35b6
    virtual void Trigger(); // 0x260c
    static nKernelServer* nNetwork2::ks; // 0x162bc
    static nClass* nNetwork2::local_cl; // 0x162b8
};
