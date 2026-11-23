#pragma once
// Auto-generated from nnetwork.dll (Project Nomads, Oct 2002)
// Nebula class: nnetnode | Superclass: nroot | sizeof: 80 bytes
// RVA: n_init=0x1000 n_new=0x107e n_initcmds=0x19f3

class nNetNode : public nroot {
public:
    nNetNode(const nNetNode&); // 0x18af
    nNetNode(); // 0x196f
    virtual ~nNetNode(); // 0x1989
    nNetNode& operator=(const nNetNode&); // 0x18e4
    short GetNetName(); // 0x189c
    bool IsNetValid() const; // 0x18ab
    bool IsShadow(); // 0x188c
    void MarkShadow(bool); // 0x1882
    virtual void MarkShadowAll(bool); // 0x1994
    virtual bool SaveCmds(nFileServer*); // 0x1a7e
    void SetNetName(short); // 0x1890
    void SetNetValid(bool); // 0x18a1
    static nKernelServer* nNetNode::ks; // 0x162b4
    static nClass* nNetNode::local_cl; // 0x162b0

    // Nebula Script Commands (2)
    // [M_SH] v_markshadow_b  (handler 0x1a34)
    // [I_SH] b_isshadow_v  (handler 0x1a55)
};
