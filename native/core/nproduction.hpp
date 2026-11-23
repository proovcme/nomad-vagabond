#pragma once
// Module 14: Production, Hangars & Heavy Aircraft (nFactory, nGarage, nAirship3, nBomber)
// Verified against:
//   - re/src/nnomads/nfactory.hpp   (12 AddCmds)
//   - re/src/nnomads/ngarage.hpp    (9 AddCmds)
//   - re/src/nnomads/nairship3.hpp  (18 AddCmds)
//   - re/src/nnomads/nbomber.hpp    (1 AddCmd)

#include <array>
#include <string>
#include <unordered_map>
#include <vector>

#include "nkernel.hpp"
#include "nworld.hpp"

namespace nebula {

class nFactoryNode : public nEntity {
public:
    struct Slot {
        float buildCounter = 0.0f;
        bool  building = false;
        int   productCount = 0;
        std::string productName;
        nEntity* productObj = nullptr;
    };
    std::unordered_map<int, Slot> slots;
    bool fastBuild = false;

    bool isWorking() const {
        for (const auto& [k, s] : slots) {
            if (s.building) return true;
        }
        return false;
    }
};

class nGarageNode : public nFactoryNode {
public:
    float approachPos[3] = {0, 0, 0};
    bool  visualizeGarage = false;
    std::string appearPosName;
    std::string removePosName;
    bool  outputVehicle = false;
};

class nAirship3Node : public nRoot {
public:
    float maxSpeed = 20.0f;
    float accelTime = 3.0f;
    float decelTime = 4.0f;
    float maxVertSpeed = 10.0f;
    float vertAccelTime = 2.0f;
    float maxYawRot = 60.0f;
    float yawAccelTime = 1.5f;
    float maxRoll = 20.0f;
    float rollTime = 1.0f;
};

class nBomberNode : public nRoot {
public:
    float relPos[3] = {0, -2.0f, 0};
};

inline void registerProductionModule14(nKernelServer& ks) {
    // 1. nFactory (from re/src/nnomads/nfactory.hpp)
    auto regFac = [&](const std::string& clsName, const std::string& sup, auto factoryFn) {
        auto* cl = ks.registerClass(clsName, sup, factoryFn);
        cl->addCmdProto("v_setbuildcounter_if", "SBCT", [](nRoot* o, nCmd& c) {
            if (auto* f = dynamic_cast<nFactoryNode*>(o); f && c.inArgs.size() >= 2)
                f->slots[c.inArgs[0].iVal].buildCounter = c.inArgs[1].fVal;
        });
        cl->addCmdProto("f_getbuildcounter_i", "GBCT", [](nRoot* o, nCmd& c) {
            float v = 0.0f;
            if (auto* f = dynamic_cast<nFactoryNode*>(o); f && !c.inArgs.empty()) {
                auto it = f->slots.find(c.inArgs[0].iVal);
                if (it != f->slots.end()) v = it->second.buildCounter;
            }
            c.outArgs.push_back(nArg::fromFloat(v));
        });
        cl->addCmdProto("v_setbuilding_ib", "SBLD", [](nRoot* o, nCmd& c) {
            if (auto* f = dynamic_cast<nFactoryNode*>(o); f && c.inArgs.size() >= 2)
                f->slots[c.inArgs[0].iVal].building = c.inArgs[1].bVal;
        });
        cl->addCmdProto("b_getbuilding_i", "GBLD", [](nRoot* o, nCmd& c) {
            bool v = false;
            if (auto* f = dynamic_cast<nFactoryNode*>(o); f && !c.inArgs.empty()) {
                auto it = f->slots.find(c.inArgs[0].iVal);
                if (it != f->slots.end()) v = it->second.building;
            }
            c.outArgs.push_back(nArg::fromBool(v));
        });
        cl->addCmdProto("v_setproductcount_ii", "SPCT", [](nRoot* o, nCmd& c) {
            if (auto* f = dynamic_cast<nFactoryNode*>(o); f && c.inArgs.size() >= 2)
                f->slots[c.inArgs[0].iVal].productCount = c.inArgs[1].iVal;
        });
        cl->addCmdProto("i_getproductcount_i", "GPCT", [](nRoot* o, nCmd& c) {
            int v = 0;
            if (auto* f = dynamic_cast<nFactoryNode*>(o); f && !c.inArgs.empty()) {
                auto it = f->slots.find(c.inArgs[0].iVal);
                if (it != f->slots.end()) v = it->second.productCount;
            }
            c.outArgs.push_back(nArg::fromInt(v));
        });
        cl->addCmdProto("v_setproductname_is", "SPNM", [](nRoot* o, nCmd& c) {
            if (auto* f = dynamic_cast<nFactoryNode*>(o); f && c.inArgs.size() >= 2)
                f->slots[c.inArgs[0].iVal].productName = c.inArgs[1].sVal;
        });
        cl->addCmdProto("o_getproduct_i", "GPRD", [](nRoot* o, nCmd& c) {
            nRoot* p = nullptr;
            if (auto* f = dynamic_cast<nFactoryNode*>(o); f && !c.inArgs.empty()) {
                auto it = f->slots.find(c.inArgs[0].iVal);
                if (it != f->slots.end()) p = it->second.productObj;
            }
            c.outArgs.push_back(nArg::fromObject(p));
        });
        cl->addCmdProto("b_destroyproduct_i", "DPRD", [](nRoot* o, nCmd& c) {
            bool ok = false;
            if (auto* f = dynamic_cast<nFactoryNode*>(o); f && !c.inArgs.empty()) {
                auto it = f->slots.find(c.inArgs[0].iVal);
                if (it != f->slots.end() && it->second.productObj) {
                    it->second.productObj->visible = false;
                    it->second.productObj = nullptr;
                    ok = true;
                }
            }
            c.outArgs.push_back(nArg::fromBool(ok));
        });
        cl->addCmdProto("b_isworking_v", "IWRK", [](nRoot* o, nCmd& c) {
            auto* f = dynamic_cast<nFactoryNode*>(o);
            c.outArgs.push_back(nArg::fromBool(f && f->isWorking()));
        });
        cl->addCmdProto("v_setfastbuild_b", "SFBL", [](nRoot* o, nCmd& c) {
            if (auto* f = dynamic_cast<nFactoryNode*>(o); f && !c.inArgs.empty()) f->fastBuild = c.inArgs[0].bVal;
        });
        cl->addCmdProto("b_isfastbuild_v", "IFBL", [](nRoot* o, nCmd& c) {
            auto* f = dynamic_cast<nFactoryNode*>(o);
            c.outArgs.push_back(nArg::fromBool(f && f->fastBuild));
        });
        return cl;
    };
    regFac("nfactory", "nhouse", []() { return std::make_unique<nFactoryNode>(); });

    // 2. nGarage (from re/src/nnomads/ngarage.hpp)
    auto* clGar = regFac("ngarage", "nfactory", []() { return std::make_unique<nGarageNode>(); });
    clGar->addCmdProto("v_setapproachpos_fff", "SAPP", [](nRoot* o, nCmd& c) {
        if (auto* g = dynamic_cast<nGarageNode*>(o); g && c.inArgs.size() >= 3) {
            g->approachPos[0] = c.inArgs[0].fVal; g->approachPos[1] = c.inArgs[1].fVal; g->approachPos[2] = c.inArgs[2].fVal;
        }
    });
    clGar->addCmdProto("v_setvisualizegarage_b", "SVZG", [](nRoot* o, nCmd& c) {
        if (auto* g = dynamic_cast<nGarageNode*>(o); g && !c.inArgs.empty()) g->visualizeGarage = c.inArgs[0].bVal;
    });
    clGar->addCmdProto("b_getvisualizegarage_v", "GVZG", [](nRoot* o, nCmd& c) {
        auto* g = dynamic_cast<nGarageNode*>(o); c.outArgs.push_back(nArg::fromBool(g && g->visualizeGarage));
    });
    clGar->addCmdProto("v_setappearposname_s", "SAPN", [](nRoot* o, nCmd& c) {
        if (auto* g = dynamic_cast<nGarageNode*>(o); g && !c.inArgs.empty()) g->appearPosName = c.inArgs[0].sVal;
    });
    clGar->addCmdProto("s_getappearposname_v", "GAPN", [](nRoot* o, nCmd& c) {
        auto* g = dynamic_cast<nGarageNode*>(o); c.outArgs.push_back(nArg::fromString(g ? g->appearPosName : ""));
    });
    clGar->addCmdProto("v_setremoveposname_s", "SRPN", [](nRoot* o, nCmd& c) {
        if (auto* g = dynamic_cast<nGarageNode*>(o); g && !c.inArgs.empty()) g->removePosName = c.inArgs[0].sVal;
    });
    clGar->addCmdProto("s_getremoveposname_v", "GRPN", [](nRoot* o, nCmd& c) {
        auto* g = dynamic_cast<nGarageNode*>(o); c.outArgs.push_back(nArg::fromString(g ? g->removePosName : ""));
    });
    clGar->addCmdProto("v_setoutputvehicle_b", "SOVH", [](nRoot* o, nCmd& c) {
        if (auto* g = dynamic_cast<nGarageNode*>(o); g && !c.inArgs.empty()) g->outputVehicle = c.inArgs[0].bVal;
    });
    clGar->addCmdProto("b_isoutputvehicle_v", "IOVH", [](nRoot* o, nCmd& c) {
        auto* g = dynamic_cast<nGarageNode*>(o); c.outArgs.push_back(nArg::fromBool(g && g->outputVehicle));
    });

    // 3. nAirship3 (from re/src/nnomads/nairship3.hpp)
    auto* clAir = ks.registerClass("nairship3", "nengine", []() { return std::make_unique<nAirship3Node>(); });
    clAir->addCmdProto("v_setmaxspeed_f", "SXSP", [](nRoot* o, nCmd& c) { if (auto* a = dynamic_cast<nAirship3Node*>(o); a && !c.inArgs.empty()) a->maxSpeed = c.inArgs[0].fVal; });
    clAir->addCmdProto("f_getmaxspeed_v", "GXSP", [](nRoot* o, nCmd& c) { auto* a = dynamic_cast<nAirship3Node*>(o); c.outArgs.push_back(nArg::fromFloat(a ? a->maxSpeed : 20.0f)); });
    clAir->addCmdProto("v_setacceltime_f", "SATM", [](nRoot* o, nCmd& c) { if (auto* a = dynamic_cast<nAirship3Node*>(o); a && !c.inArgs.empty()) a->accelTime = c.inArgs[0].fVal; });
    clAir->addCmdProto("f_getacceltime_v", "GATM", [](nRoot* o, nCmd& c) { auto* a = dynamic_cast<nAirship3Node*>(o); c.outArgs.push_back(nArg::fromFloat(a ? a->accelTime : 3.0f)); });
    clAir->addCmdProto("v_setdeceltime_f", "SDTM", [](nRoot* o, nCmd& c) { if (auto* a = dynamic_cast<nAirship3Node*>(o); a && !c.inArgs.empty()) a->decelTime = c.inArgs[0].fVal; });
    clAir->addCmdProto("f_getdeceltime_v", "GDTM", [](nRoot* o, nCmd& c) { auto* a = dynamic_cast<nAirship3Node*>(o); c.outArgs.push_back(nArg::fromFloat(a ? a->decelTime : 4.0f)); });
    clAir->addCmdProto("v_setmaxvertspeed_f", "SMVS", [](nRoot* o, nCmd& c) { if (auto* a = dynamic_cast<nAirship3Node*>(o); a && !c.inArgs.empty()) a->maxVertSpeed = c.inArgs[0].fVal; });
    clAir->addCmdProto("f_getmaxvertspeed_v", "GMVS", [](nRoot* o, nCmd& c) { auto* a = dynamic_cast<nAirship3Node*>(o); c.outArgs.push_back(nArg::fromFloat(a ? a->maxVertSpeed : 10.0f)); });
    clAir->addCmdProto("v_setvertacceltime_f", "SVAT", [](nRoot* o, nCmd& c) { if (auto* a = dynamic_cast<nAirship3Node*>(o); a && !c.inArgs.empty()) a->vertAccelTime = c.inArgs[0].fVal; });
    clAir->addCmdProto("f_getvertacceltime_v", "GVAT", [](nRoot* o, nCmd& c) { auto* a = dynamic_cast<nAirship3Node*>(o); c.outArgs.push_back(nArg::fromFloat(a ? a->vertAccelTime : 2.0f)); });
    clAir->addCmdProto("v_setmaxyawrotation_f", "SXYR", [](nRoot* o, nCmd& c) { if (auto* a = dynamic_cast<nAirship3Node*>(o); a && !c.inArgs.empty()) a->maxYawRot = c.inArgs[0].fVal; });
    clAir->addCmdProto("f_getmaxyawrotation_v", "GXYR", [](nRoot* o, nCmd& c) { auto* a = dynamic_cast<nAirship3Node*>(o); c.outArgs.push_back(nArg::fromFloat(a ? a->maxYawRot : 60.0f)); });
    clAir->addCmdProto("v_setyawacceltime_f", "SYAT", [](nRoot* o, nCmd& c) { if (auto* a = dynamic_cast<nAirship3Node*>(o); a && !c.inArgs.empty()) a->yawAccelTime = c.inArgs[0].fVal; });
    clAir->addCmdProto("f_getyawacceltime_v", "GYAT", [](nRoot* o, nCmd& c) { auto* a = dynamic_cast<nAirship3Node*>(o); c.outArgs.push_back(nArg::fromFloat(a ? a->yawAccelTime : 1.5f)); });
    clAir->addCmdProto("v_setmaxroll_f", "SMRL", [](nRoot* o, nCmd& c) { if (auto* a = dynamic_cast<nAirship3Node*>(o); a && !c.inArgs.empty()) a->maxRoll = c.inArgs[0].fVal; });
    clAir->addCmdProto("f_getmaxroll_v", "GMRL", [](nRoot* o, nCmd& c) { auto* a = dynamic_cast<nAirship3Node*>(o); c.outArgs.push_back(nArg::fromFloat(a ? a->maxRoll : 20.0f)); });
    clAir->addCmdProto("v_setrolltime_f", "SMRT", [](nRoot* o, nCmd& c) { if (auto* a = dynamic_cast<nAirship3Node*>(o); a && !c.inArgs.empty()) a->rollTime = c.inArgs[0].fVal; });
    clAir->addCmdProto("f_getrolltime_v", "GMRT", [](nRoot* o, nCmd& c) { auto* a = dynamic_cast<nAirship3Node*>(o); c.outArgs.push_back(nArg::fromFloat(a ? a->rollTime : 1.0f)); });

    // 4. nBomber (from re/src/nnomads/nbomber.hpp)
    auto* clBmb = ks.registerClass("nbomber", "nservice", []() { return std::make_unique<nBomberNode>(); });
    clBmb->addCmdProto("v_setrelpos_fff", "SRPS", [](nRoot* o, nCmd& c) {
        if (auto* b = dynamic_cast<nBomberNode*>(o); b && c.inArgs.size() >= 3) {
            b->relPos[0] = c.inArgs[0].fVal; b->relPos[1] = c.inArgs[1].fVal; b->relPos[2] = c.inArgs[2].fVal;
        }
    });
}

} // namespace nebula
