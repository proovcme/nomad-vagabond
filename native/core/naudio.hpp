#pragma once
// Module 12: Native Audio Subsystem (nAudioServer2 / nDSoundServer2 / nSoundNode / nAudio)
// Verified against:
//   - re/src/ndsound/nAudioServer2.hpp & ndsoundserver2.hpp
//   - re/src/nnebula/nSoundNode.hpp
//   - re/src/nnomads/naudio.hpp

#include <algorithm>
#include <functional>
#include <iostream>
#include <string>

#include "nkernel.hpp"

namespace nebula {

class nAudioServer2Node : public nRoot {
public:
    std::string mode = "dev(0)-bps(16)-hz(44100)-chn(32)";
    bool opened = false;
    float masterVolume = 1.0f;
    float sfxVolume    = 1.0f;
    float musicVolume  = 0.8f;

    std::function<void(int, int)> onFlushAudio;
    std::function<void(float)>    onVolumeChanged;
};

class nSoundNodeObj : public nRoot {
public:
    std::string file;
    std::string velocityChannel = "velocity";
    std::string triggerChannel  = "soundtrigger";
    bool  ambient  = false;
    bool  looping  = false;
    float volume   = 1.0f;
    float freq     = 1.0f;
    float minDist  = 5.0f;
    float maxDist  = 250.0f;
};

class nAudioService : public nRoot {
public:
    std::string audioNodeName;
};

struct AudioHooks {
    std::function<void(int, int)> onFlushAudio;
    std::function<void(float)>    onVolumeChanged;
};

inline void registerAudioModule12(nKernelServer& ks, AudioHooks* hooks = nullptr) {
    auto regSrv = [&](const std::string& clsName, const std::string& sup) {
        auto* cl = ks.registerClass(clsName, sup, [hooks]() {
            auto s = std::make_unique<nAudioServer2Node>();
            if (hooks) {
                s->onFlushAudio = hooks->onFlushAudio;
                s->onVolumeChanged = hooks->onVolumeChanged;
            }
            return s;
        });
        cl->addCmdProto("v_setmode_s", "SMOD", [](nRoot* o, nCmd& c) {
            if (auto* s = dynamic_cast<nAudioServer2Node*>(o); s && !c.inArgs.empty()) s->mode = c.inArgs[0].sVal;
        });
        cl->addCmdProto("b_openaudio_v", "OPNA", [](nRoot* o, nCmd& c) {
            auto* s = dynamic_cast<nAudioServer2Node*>(o);
            if (s) s->opened = true;
            c.outArgs.push_back(nArg::fromBool(true));
        });
        cl->addCmdProto("v_closeaudio_v", "CLSA", [](nRoot* o, nCmd&) {
            if (auto* s = dynamic_cast<nAudioServer2Node*>(o)) s->opened = false;
        });
        cl->addCmdProto("v_setmastervolume_f", "SMVL", [](nRoot* o, nCmd& c) {
            if (auto* s = dynamic_cast<nAudioServer2Node*>(o); s && !c.inArgs.empty()) {
                s->masterVolume = std::clamp(c.inArgs[0].fVal, 0.0f, 1.0f);
                if (s->onVolumeChanged) s->onVolumeChanged(s->masterVolume);
            }
        });
        cl->addCmdProto("f_getmastervolume_v", "GMVL", [](nRoot* o, nCmd& c) {
            auto* s = dynamic_cast<nAudioServer2Node*>(o);
            c.outArgs.push_back(nArg::fromFloat(s ? s->masterVolume : 1.0f));
        });
        cl->addCmdProto("v_flushaudio_ii", "FLSH", [](nRoot* o, nCmd& c) {
            if (auto* s = dynamic_cast<nAudioServer2Node*>(o)) {
                int a = (c.inArgs.size() >= 1) ? c.inArgs[0].iVal : 0;
                int b = (c.inArgs.size() >= 2) ? c.inArgs[1].iVal : 0;
                if (s->onFlushAudio) s->onFlushAudio(a, b);
            }
        });
    };
    regSrv("naudioserver2", "nroot");
    regSrv("ndsoundserver2", "naudioserver2");

    auto* clSnd = ks.registerClass("nsoundnode", "nvisnode", []() { return std::make_unique<nSoundNodeObj>(); });
    clSnd->addCmdProto("v_setfile_s", "SFIL", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nSoundNodeObj*>(o); s && !c.inArgs.empty()) s->file = c.inArgs[0].sVal;
    });
    clSnd->addCmdProto("s_getfile_v", "GFIL", [](nRoot* o, nCmd& c) {
        auto* s = dynamic_cast<nSoundNodeObj*>(o);
        c.outArgs.push_back(nArg::fromString(s ? s->file : ""));
    });
    clSnd->addCmdProto("v_setambient_b", "SAMB", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nSoundNodeObj*>(o); s && !c.inArgs.empty()) s->ambient = c.inArgs[0].bVal;
    });
    clSnd->addCmdProto("v_setlooping_b", "SLOP", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nSoundNodeObj*>(o); s && !c.inArgs.empty()) s->looping = c.inArgs[0].bVal;
    });
    clSnd->addCmdProto("v_setvolume_f", "SVOL", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nSoundNodeObj*>(o); s && !c.inArgs.empty()) s->volume = c.inArgs[0].fVal;
    });
    clSnd->addCmdProto("v_setfreq_f", "SFRQ", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nSoundNodeObj*>(o); s && !c.inArgs.empty()) s->freq = c.inArgs[0].fVal;
    });
    clSnd->addCmdProto("v_setminmaxdist_ff", "SMMD", [](nRoot* o, nCmd& c) {
        if (auto* s = dynamic_cast<nSoundNodeObj*>(o); s && c.inArgs.size() >= 2) {
            s->minDist = c.inArgs[0].fVal; s->maxDist = c.inArgs[1].fVal;
        }
    });

    auto* clAud = ks.registerClass("naudio", "nservice", []() { return std::make_unique<nAudioService>(); });
    clAud->addCmdProto("v_setaudio_s", "SAUD", [](nRoot* o, nCmd& c) {
        if (auto* a = dynamic_cast<nAudioService*>(o); a && !c.inArgs.empty()) a->audioNodeName = c.inArgs[0].sVal;
    });
    clAud->addCmdProto("s_getaudio_v", "GAUD", [](nRoot* o, nCmd& c) {
        auto* a = dynamic_cast<nAudioService*>(o);
        c.outArgs.push_back(nArg::fromString(a ? a->audioNodeName : ""));
    });
}

} // namespace nebula
