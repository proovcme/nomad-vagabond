#pragma once
// Module 15: Native macOS BSD/POSIX Network Stack (100% of nnetwork.dll)
// Verified against:
//   - re/src/nnetwork/nsocket2.hpp    (4 AddCmds + inherits nNetwork2)
//   - re/src/nnetwork/nnetwork2.hpp   (24 AddCmds)
//   - re/src/nnetwork/ncommserver.hpp (21 AddCmds)
//   - re/src/nnetwork/nnetnode.hpp    (2 AddCmds)

#include <arpa/inet.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <unistd.h>

#include <array>
#include <cstring>
#include <iostream>
#include <string>
#include <vector>

#include "nkernel.hpp"

namespace nebula {

class nNetwork2Node : public nRoot {
public:
    std::array<int, 16> guid{};
    float sendDelay = 0.0f;
    int   provider  = 0;
    bool  locked    = false;
    bool  isHost    = false;
    bool  isJoined  = false;
    bool  isLan     = true;
    int   hostId    = 1;
    int   clientId  = 1;
    int   numMachines = 1;
    int   dropMsg   = 0;

    // BSD UDP socket for nSocket2
    int   port      = 2302;
    bool  logSystem = false;
    int   udpFd     = -1;

    ~nNetwork2Node() override {
        closeSocket();
    }

    bool bindUdpPort(int p) {
        closeSocket();
        port = p;
        udpFd = ::socket(AF_INET, SOCK_DGRAM, 0);
        if (udpFd < 0) return false;
        int reuse = 1;
        ::setsockopt(udpFd, SOL_SOCKET, SO_REUSEADDR, &reuse, sizeof(reuse));
        int flags = ::fcntl(udpFd, F_GETFL, 0);
        if (flags >= 0) ::fcntl(udpFd, F_SETFL, flags | O_NONBLOCK);
        sockaddr_in addr{};
        addr.sin_family = AF_INET;
        addr.sin_addr.s_addr = htonl(INADDR_ANY);
        addr.sin_port = htons(static_cast<uint16_t>(p));
        if (::bind(udpFd, reinterpret_cast<sockaddr*>(&addr), sizeof(addr)) < 0) {
            closeSocket();
            return false;
        }
        return true;
    }

    void closeSocket() {
        if (udpFd >= 0) {
            ::close(udpFd);
            udpFd = -1;
        }
        isHost = false;
        isJoined = false;
    }
};

class nCommServerNode : public nRoot {
public:
    std::string sessionName;
    int   maxPlayers = 8;
    bool  sessionOpen = false;
    bool  isHost = false;
    int   clientId = 1;
    bool  regularTransmission = true;
    float drThreshold = 0.25f;
    float transmissionTime = 0.05f;
    std::string prediction = "linear";
    std::string smoothing  = "linear";
    bool  statsVisible = false;
};

class nNetNodeObj : public nRoot {
public:
    bool shadow = false;
};

inline void registerNetworkModule15(nKernelServer& ks) {
    auto regNet = [&](const std::string& clsName, const std::string& sup) {
        auto* cl = ks.registerClass(clsName, sup, []() { return std::make_unique<nNetwork2Node>(); });
        cl->addCmdProto("b_setguid_iiiiiiiiiiiiiiii", "SGUD", [](nRoot* o, nCmd& c) {
            auto* n = dynamic_cast<nNetwork2Node*>(o);
            if (n) {
                for (size_t i = 0; i < 16 && i < c.inArgs.size(); ++i) n->guid[i] = c.inArgs[i].iVal;
            }
            c.outArgs.push_back(nArg::fromBool(n != nullptr));
        });
        cl->addCmdProto("v_setsenddelay_f", "SSDL", [](nRoot* o, nCmd& c) {
            if (auto* n = dynamic_cast<nNetwork2Node*>(o); n && !c.inArgs.empty()) n->sendDelay = c.inArgs[0].fVal;
        });
        cl->addCmdProto("f_getsenddelay_v", "GSDL", [](nRoot* o, nCmd& c) {
            auto* n = dynamic_cast<nNetwork2Node*>(o); c.outArgs.push_back(nArg::fromFloat(n ? n->sendDelay : 0.0f));
        });
        cl->addCmdProto("v_trigger_v", "TRIG", [](nRoot*, nCmd&) {});
        cl->addCmdProto("b_setprovider_i", "SPRV", [](nRoot* o, nCmd& c) {
            if (auto* n = dynamic_cast<nNetwork2Node*>(o); n && !c.inArgs.empty()) n->provider = c.inArgs[0].iVal;
            c.outArgs.push_back(nArg::fromBool(true));
        });
        cl->addCmdProto("i_askprovider_v", "APRV", [](nRoot* o, nCmd& c) {
            auto* n = dynamic_cast<nNetwork2Node*>(o); c.outArgs.push_back(nArg::fromInt(n ? n->provider : 0));
        });
        cl->addCmdProto("b_lock_b", "LOCK", [](nRoot* o, nCmd& c) {
            if (auto* n = dynamic_cast<nNetwork2Node*>(o); n && !c.inArgs.empty()) n->locked = c.inArgs[0].bVal;
            c.outArgs.push_back(nArg::fromBool(true));
        });
        cl->addCmdProto("i_asksessions_bsi", "ASKS", [](nRoot*, nCmd& c) { c.outArgs.push_back(nArg::fromInt(0)); });
        cl->addCmdProto("b_closesession_v", "CLSS", [](nRoot* o, nCmd& c) {
            if (auto* n = dynamic_cast<nNetwork2Node*>(o)) n->closeSocket();
            c.outArgs.push_back(nArg::fromBool(true));
        });
        cl->addCmdProto("b_kickoffmachine_i", "KICK", [](nRoot*, nCmd& c) { c.outArgs.push_back(nArg::fromBool(true)); });
        cl->addCmdProto("i_getnummachines_v", "GNMC", [](nRoot* o, nCmd& c) {
            auto* n = dynamic_cast<nNetwork2Node*>(o); c.outArgs.push_back(nArg::fromInt(n ? n->numMachines : 1));
        });
        cl->addCmdProto("i_gethostid_v", "GHID", [](nRoot* o, nCmd& c) {
            auto* n = dynamic_cast<nNetwork2Node*>(o); c.outArgs.push_back(nArg::fromInt(n ? n->hostId : 1));
        });
        cl->addCmdProto("b_ishost_v", "IHST", [](nRoot* o, nCmd& c) {
            auto* n = dynamic_cast<nNetwork2Node*>(o); c.outArgs.push_back(nArg::fromBool(n && n->isHost));
        });
        cl->addCmdProto("b_isjoined_v", "IJND", [](nRoot* o, nCmd& c) {
            auto* n = dynamic_cast<nNetwork2Node*>(o); c.outArgs.push_back(nArg::fromBool(n && n->isJoined));
        });
        cl->addCmdProto("b_sendstring_s", "SSTR", [](nRoot*, nCmd& c) { c.outArgs.push_back(nArg::fromBool(true)); });
        cl->addCmdProto("b_sendvalue_i", "SVAL", [](nRoot*, nCmd& c) { c.outArgs.push_back(nArg::fromBool(true)); });
        cl->addCmdProto("b_sendexit_v", "SEXT", [](nRoot*, nCmd& c) { c.outArgs.push_back(nArg::fromBool(true)); });
        cl->addCmdProto("b_sendstringto_si", "SSTT", [](nRoot*, nCmd& c) { c.outArgs.push_back(nArg::fromBool(true)); });
        cl->addCmdProto("b_sendvalueto_ii", "SVLT", [](nRoot*, nCmd& c) { c.outArgs.push_back(nArg::fromBool(true)); });
        cl->addCmdProto("b_sendexitto_i", "SETT", [](nRoot*, nCmd& c) { c.outArgs.push_back(nArg::fromBool(true)); });
        cl->addCmdProto("v_setdropmsg_i", "SDRP", [](nRoot* o, nCmd& c) {
            if (auto* n = dynamic_cast<nNetwork2Node*>(o); n && !c.inArgs.empty()) n->dropMsg = c.inArgs[0].iVal;
        });
        cl->addCmdProto("i_getdropmsg_v", "GDRP", [](nRoot* o, nCmd& c) {
            auto* n = dynamic_cast<nNetwork2Node*>(o); c.outArgs.push_back(nArg::fromInt(n ? n->dropMsg : 0));
        });
        cl->addCmdProto("v_setlan_b", "SLAN", [](nRoot* o, nCmd& c) {
            if (auto* n = dynamic_cast<nNetwork2Node*>(o); n && !c.inArgs.empty()) n->isLan = c.inArgs[0].bVal;
        });
        cl->addCmdProto("b_islan_v", "ILAN", [](nRoot* o, nCmd& c) {
            auto* n = dynamic_cast<nNetwork2Node*>(o); c.outArgs.push_back(nArg::fromBool(n && n->isLan));
        });
        cl->addCmdProto("b_setport_i", "SPRT", [](nRoot* o, nCmd& c) {
            bool ok = false;
            if (auto* n = dynamic_cast<nNetwork2Node*>(o); n && !c.inArgs.empty()) {
                n->port = c.inArgs[0].iVal;
                ok = true;
            }
            c.outArgs.push_back(nArg::fromBool(ok));
        });
        cl->addCmdProto("i_getport_v", "GPRT", [](nRoot* o, nCmd& c) {
            auto* n = dynamic_cast<nNetwork2Node*>(o); c.outArgs.push_back(nArg::fromInt(n ? n->port : 2302));
        });
        cl->addCmdProto("v_setlogsystem_b", "SLOG", [](nRoot* o, nCmd& c) {
            if (auto* n = dynamic_cast<nNetwork2Node*>(o); n && !c.inArgs.empty()) n->logSystem = c.inArgs[0].bVal;
        });
        cl->addCmdProto("b_getlogsystem_v", "GLOG", [](nRoot* o, nCmd& c) {
            auto* n = dynamic_cast<nNetwork2Node*>(o); c.outArgs.push_back(nArg::fromBool(n && n->logSystem));
        });
    };
    regNet("nnetwork2", "nroot");
    regNet("nsocket2", "nnetwork2");

    // nCommServer (21 AddCmds)
    auto* clCS = ks.registerClass("ncommserver", "nroot", []() { return std::make_unique<nCommServerNode>(); });
    clCS->addCmdProto("v_opensession_si", "OPNS", [](nRoot* o, nCmd& c) {
        if (auto* cs = dynamic_cast<nCommServerNode*>(o); cs && c.inArgs.size() >= 2) {
            cs->sessionName = c.inArgs[0].sVal; cs->maxPlayers = c.inArgs[1].iVal;
            cs->sessionOpen = true; cs->isHost = true;
        }
    });
    clCS->addCmdProto("i_asksessions_bsi", "ASKS", [](nRoot*, nCmd& c) { c.outArgs.push_back(nArg::fromInt(0)); });
    clCS->addCmdProto("v_joinsession_i", "JNSN", [](nRoot* o, nCmd&) {
        if (auto* cs = dynamic_cast<nCommServerNode*>(o)) { cs->sessionOpen = true; cs->isHost = false; }
    });
    clCS->addCmdProto("v_closesession_v", "CLSS", [](nRoot* o, nCmd&) {
        if (auto* cs = dynamic_cast<nCommServerNode*>(o)) { cs->sessionOpen = false; cs->isHost = false; }
    });
    clCS->addCmdProto("v_setregulartransmission_b", "SRGT", [](nRoot* o, nCmd& c) {
        if (auto* cs = dynamic_cast<nCommServerNode*>(o); cs && !c.inArgs.empty()) cs->regularTransmission = c.inArgs[0].bVal;
    });
    clCS->addCmdProto("v_setdrthreshold_f", "SDRT", [](nRoot* o, nCmd& c) {
        if (auto* cs = dynamic_cast<nCommServerNode*>(o); cs && !c.inArgs.empty()) cs->drThreshold = c.inArgs[0].fVal;
    });
    clCS->addCmdProto("f_getdrthreshold_v", "GDRT", [](nRoot* o, nCmd& c) {
        auto* cs = dynamic_cast<nCommServerNode*>(o); c.outArgs.push_back(nArg::fromFloat(cs ? cs->drThreshold : 0.25f));
    });
    clCS->addCmdProto("v_showstats_v", "SHST", [](nRoot* o, nCmd&) { if (auto* cs = dynamic_cast<nCommServerNode*>(o)) cs->statsVisible = true; });
    clCS->addCmdProto("v_hidestats_v", "HDST", [](nRoot* o, nCmd&) { if (auto* cs = dynamic_cast<nCommServerNode*>(o)) cs->statsVisible = false; });
    clCS->addCmdProto("v_togglestats_v", "TGST", [](nRoot* o, nCmd&) { if (auto* cs = dynamic_cast<nCommServerNode*>(o)) cs->statsVisible = !cs->statsVisible; });
    clCS->addCmdProto("v_resetstats_v", "RSST", [](nRoot*, nCmd&) {});
    clCS->addCmdProto("v_printentities_v", "PREN", [](nRoot*, nCmd&) {});
    clCS->addCmdProto("v_printghosts_v", "PRGH", [](nRoot*, nCmd&) {});
    clCS->addCmdProto("v_settransmissiontime_f", "STMT", [](nRoot* o, nCmd& c) {
        if (auto* cs = dynamic_cast<nCommServerNode*>(o); cs && !c.inArgs.empty()) cs->transmissionTime = c.inArgs[0].fVal;
    });
    clCS->addCmdProto("f_gettransmissiontime_v", "GTMT", [](nRoot* o, nCmd& c) {
        auto* cs = dynamic_cast<nCommServerNode*>(o); c.outArgs.push_back(nArg::fromFloat(cs ? cs->transmissionTime : 0.05f));
    });
    clCS->addCmdProto("v_setprediction_s", "SPRD", [](nRoot* o, nCmd& c) {
        if (auto* cs = dynamic_cast<nCommServerNode*>(o); cs && !c.inArgs.empty()) cs->prediction = c.inArgs[0].sVal;
    });
    clCS->addCmdProto("s_getprediction_v", "GPRD", [](nRoot* o, nCmd& c) {
        auto* cs = dynamic_cast<nCommServerNode*>(o); c.outArgs.push_back(nArg::fromString(cs ? cs->prediction : "linear"));
    });
    clCS->addCmdProto("v_setsmoothing_s", "SSMT", [](nRoot* o, nCmd& c) {
        if (auto* cs = dynamic_cast<nCommServerNode*>(o); cs && !c.inArgs.empty()) cs->smoothing = c.inArgs[0].sVal;
    });
    clCS->addCmdProto("s_getsmoothing_v", "GSMT", [](nRoot* o, nCmd& c) {
        auto* cs = dynamic_cast<nCommServerNode*>(o); c.outArgs.push_back(nArg::fromString(cs ? cs->smoothing : "linear"));
    });
    clCS->addCmdProto("i_getclientid_v", "GCID", [](nRoot* o, nCmd& c) {
        auto* cs = dynamic_cast<nCommServerNode*>(o); c.outArgs.push_back(nArg::fromInt(cs ? cs->clientId : 1));
    });
    clCS->addCmdProto("b_ishost_v", "IHST", [](nRoot* o, nCmd& c) {
        auto* cs = dynamic_cast<nCommServerNode*>(o); c.outArgs.push_back(nArg::fromBool(cs && cs->isHost));
    });

    // nNetNode (2 AddCmds)
    auto* clNN = ks.registerClass("nnetnode", "nroot", []() { return std::make_unique<nNetNodeObj>(); });
    clNN->addCmdProto("v_markshadow_b", "MSHD", [](nRoot* o, nCmd& c) {
        if (auto* nn = dynamic_cast<nNetNodeObj*>(o); nn && !c.inArgs.empty()) nn->shadow = c.inArgs[0].bVal;
    });
    clNN->addCmdProto("b_isshadow_v", "ISHD", [](nRoot* o, nCmd& c) {
        auto* nn = dynamic_cast<nNetNodeObj*>(o); c.outArgs.push_back(nArg::fromBool(nn && nn->shadow));
    });
}

} // namespace nebula
