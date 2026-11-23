#pragma once
// Module 2 (Decompiled from nnomads.dll & verified against book/*/cinematics/*.n):
//   - nAnimSequence (sizeof=816, 16 AddCmd): keyframed translate, rotate, quaternion,
//     visual cues (subtitle BMPs / animations), audio cues (voice WAVs), and channel keys.

#include <algorithm>
#include <cmath>
#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>

#include "nanim.hpp"
#include "nkernel.hpp"

namespace nebula {

struct KeyVec3 { float t; float x, y, z; };
struct KeyQuat { float t; float x, y, z, w; };
struct KeyStr  { float t; std::string val; };
struct KeyChan { float t; int idx; float val; };

class nAnimSequence : public nRoot {
public:
    std::unordered_map<int, std::string> channelNames;
    std::vector<KeyVec3> translates;
    std::vector<KeyVec3> rotates;
    std::vector<KeyQuat> quaternions;
    std::vector<KeyStr>  visuals;
    std::vector<KeyStr>  audios;
    std::vector<KeyChan> channels;

    bool        vehicleRelated = false;
    std::string generatorProto;
    std::string generatorName;
    float       idleTime = 0.0f;

    float duration() const {
        float d = 0.0f;
        if (!translates.empty())  d = std::max(d, translates.back().t);
        if (!quaternions.empty()) d = std::max(d, quaternions.back().t);
        if (!visuals.empty())     d = std::max(d, visuals.back().t);
        if (!audios.empty())      d = std::max(d, audios.back().t);
        return d;
    }

    bool sampleTranslate(float t, float& ox, float& oy, float& oz) const {
        if (translates.empty()) return false;
        if (t <= translates.front().t) {
            ox = translates.front().x; oy = translates.front().y; oz = translates.front().z;
            return true;
        }
        if (t >= translates.back().t) {
            ox = translates.back().x; oy = translates.back().y; oz = translates.back().z;
            return true;
        }
        auto it = std::upper_bound(translates.begin(), translates.end(), t,
                                   [](float val, const KeyVec3& k) { return val < k.t; });
        const auto& b = *it;
        const auto& a = *(it - 1);
        float f = (b.t > a.t) ? (t - a.t) / (b.t - a.t) : 0.0f;
        ox = a.x + (b.x - a.x) * f;
        oy = a.y + (b.y - a.y) * f;
        oz = a.z + (b.z - a.z) * f;
        return true;
    }

    bool sampleQuaternion(float t, Quat& outQ) const {
        if (quaternions.empty()) return false;
        if (t <= quaternions.front().t) {
            const auto& k = quaternions.front();
            outQ = {k.x, k.y, k.z, k.w};
            return true;
        }
        if (t >= quaternions.back().t) {
            const auto& k = quaternions.back();
            outQ = {k.x, k.y, k.z, k.w};
            return true;
        }
        auto it = std::upper_bound(quaternions.begin(), quaternions.end(), t,
                                   [](float val, const KeyQuat& k) { return val < k.t; });
        const auto& b = *it;
        const auto& a = *(it - 1);
        float f = (b.t > a.t) ? (t - a.t) / (b.t - a.t) : 0.0f;
        outQ = Quat::nlerp({a.x, a.y, a.z, a.w}, {b.x, b.y, b.z, b.w}, f);
        return true;
    }

    // Collects all string cues whose timestamp falls in (prevT, curT] (or == 0 at start)
    void collectVisualCues(float prevT, float curT, std::vector<std::string>& out) const {
        for (const auto& k : visuals) {
            if ((prevT < 0.0f && k.t <= curT) || (k.t > prevT && k.t <= curT)) {
                out.push_back(k.val);
            }
        }
    }

    void collectAudioCues(float prevT, float curT, std::vector<std::string>& out) const {
        for (const auto& k : audios) {
            if ((prevT < 0.0f && k.t <= curT) || (k.t > prevT && k.t <= curT)) {
                out.push_back(k.val);
            }
        }
    }
};

inline void registerCinematics(nKernelServer& ks) {
    auto* cl = ks.registerClass("nanimsequence", "nroot", []() { return std::make_unique<nAnimSequence>(); });
    cl->addCmdProto("v_setchannelname_is", "SCHN", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nAnimSequence*>(o); s && c.inArgs.size() >= 2)
            s->channelNames[c.inArgs[0].iVal] = c.inArgs[1].sVal;
    });
    cl->addCmdProto("s_getchannelname_i", "GCHN", [](nRoot* o, nCmd& c) {
        std::string res;
        if (auto* s = dynamic_cast<nAnimSequence*>(o); s && !c.inArgs.empty()) {
            auto it = s->channelNames.find(c.inArgs[0].iVal);
            if (it != s->channelNames.end()) res = it->second;
        }
        c.outArgs.push_back(nArg::fromString(res));
    });
    cl->addCmdProto("v_addtranslate_ffff", "ADTK", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nAnimSequence*>(o); s && c.inArgs.size() >= 4)
            s->translates.push_back({c.inArgs[0].fVal, c.inArgs[1].fVal, c.inArgs[2].fVal, c.inArgs[3].fVal});
    });
    cl->addCmdProto("v_addrotate_ffff", "ADRK", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nAnimSequence*>(o); s && c.inArgs.size() >= 4)
            s->rotates.push_back({c.inArgs[0].fVal, c.inArgs[1].fVal, c.inArgs[2].fVal, c.inArgs[3].fVal});
    });
    cl->addCmdProto("v_addquaternion_fffff", "ADQK", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nAnimSequence*>(o); s && c.inArgs.size() >= 5)
            s->quaternions.push_back({c.inArgs[0].fVal, c.inArgs[1].fVal, c.inArgs[2].fVal, c.inArgs[3].fVal, c.inArgs[4].fVal});
    });
    cl->addCmdProto("v_addvisual_fs", "ADVK", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nAnimSequence*>(o); s && c.inArgs.size() >= 2)
            s->visuals.push_back({c.inArgs[0].fVal, c.inArgs[1].sVal});
    });
    cl->addCmdProto("v_addaudio_fs", "ADAK", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nAnimSequence*>(o); s && c.inArgs.size() >= 2)
            s->audios.push_back({c.inArgs[0].fVal, c.inArgs[1].sVal});
    });
    cl->addCmdProto("v_addchannel_fif", "ADCH", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nAnimSequence*>(o); s && c.inArgs.size() >= 3)
            s->channels.push_back({c.inArgs[0].fVal, c.inArgs[1].iVal, c.inArgs[2].fVal});
    });
    cl->addCmdProto("v_setvehiclerelated_b", "SVRL", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nAnimSequence*>(o); s && !c.inArgs.empty()) s->vehicleRelated = c.inArgs[0].bVal;
    });
    cl->addCmdProto("b_isvehiclerelated_v", "IVRL", [](nRoot* o, nCmd& c) {
        auto* s = dynamic_cast<nAnimSequence*>(o);
        c.outArgs.push_back(nArg::fromBool(s && s->vehicleRelated));
    });
    cl->addCmdProto("v_setgeneratorproto_s", "SGPT", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nAnimSequence*>(o); s && !c.inArgs.empty()) s->generatorProto = c.inArgs[0].sVal;
    });
    cl->addCmdProto("v_setgeneratorname_s", "SGNM", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nAnimSequence*>(o); s && !c.inArgs.empty()) s->generatorName = c.inArgs[0].sVal;
    });
    cl->addCmdProto("s_getgeneratorproto_v", "GGPT", [](nRoot* o, nCmd& c) {
        auto* s = dynamic_cast<nAnimSequence*>(o);
        c.outArgs.push_back(nArg::fromString(s ? s->generatorProto : ""));
    });
    cl->addCmdProto("s_getgeneratorname_v", "GGNM", [](nRoot* o, nCmd& c) {
        auto* s = dynamic_cast<nAnimSequence*>(o);
        c.outArgs.push_back(nArg::fromString(s ? s->generatorName : ""));
    });
    cl->addCmdProto("v_setidletime_f", "STIT", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nAnimSequence*>(o); s && !c.inArgs.empty()) s->idleTime = c.inArgs[0].fVal;
    });
    cl->addCmdProto("f_getidletime_v", "GTIT", [](nRoot* o, nCmd& c) {
        auto* s = dynamic_cast<nAnimSequence*>(o);
        c.outArgs.push_back(nArg::fromFloat(s ? s->idleTime : 0.0f));
    });
}

} // namespace nebula
