#pragma once
// Phase 3: Native C++17 Story, Trigger & Subtitle Engine
// Re-implements nBookHandler + nEventHandler + nWalkOverCheck + nSubtitlePlayer.

#include <cmath>
#include <deque>
#include <functional>
#include <iostream>
#include <string>
#include <vector>

#include "ncollide.hpp"

namespace nebula {

struct DialogueLine {
    std::string soundPath;     // e.g. "book:chapter00/part01/sound/tut_bas01.wav"
    std::string subtitleBmp;   // e.g. "book/chapter00/part01/subtitle/omu_c00p01_basaltface01.bmp"
    float       durationSec = 5.5f;
};

struct WalkoverTrigger {
    std::string eventName;
    Vec3c       pos;
    float       radius = 15.0f;
    bool        fired  = false;
};

class nStoryEngine {
public:
    std::vector<WalkoverTrigger> triggers;
    std::deque<DialogueLine>     queue;
    DialogueLine                 activeLine;
    bool                         hasActiveLine = false;
    float                        lineTimer     = 0.0f;

    std::function<void(const std::string&)> onPlayVoice;
    std::function<void(const std::string&)> onShowSubtitleBmp;
    std::function<void()>                   onHideSubtitle;

    void reset() {
        triggers.clear();
        queue.clear();
        hasActiveLine = false;
        lineTimer = 0.0f;
        if (onHideSubtitle) onHideSubtitle();
    }

    void setupChapter00Part01() {
        reset();
        // Exact walkover trigger positions from book/chapter00/part01/encounters/intro.n & loadbasaltonisland.n
        triggers.push_back({"playertrifftbasalt", {-7747.0f, -126.5f, -5862.0f}, 24.0f, false});
        triggers.push_back({"cruiser_wreck",      {-7675.9f, -118.1f, -5932.2f}, 18.0f, false});

        // Opening narrator line (c00p01spr01.wav + omu_c00p01_speaker01.bmp)
        enqueue({"book:chapter00/part01/sound/c00p01spr01.wav",
                 "book/chapter00/part01/subtitle/omu_c00p01_speaker01.bmp", 6.5f});
        enqueue({"book:chapter00/part01/sound/c00p01spr02.wav",
                 "book/chapter00/part01/subtitle/omu_c00p01_speaker02.bmp", 6.5f});
    }

    void enqueue(const DialogueLine& line) {
        queue.push_back(line);
        if (!hasActiveLine) advanceLine();
    }

    void skipCurrentLine() {
        if (hasActiveLine) advanceLine();
    }

    void update(float dt, const Vec3c& playerPos) {
        // 1. Check walkover triggers
        for (auto& tr : triggers) {
            if (tr.fired) continue;
            float dx = playerPos.x - tr.pos.x;
            float dy = playerPos.y - tr.pos.y;
            float dz = playerPos.z - tr.pos.z;
            if (dx*dx + dy*dy + dz*dz <= tr.radius * tr.radius) {
                tr.fired = true;
                fireEvent(tr.eventName);
            }
        }

        // 2. Advance subtitle/voice queue
        if (hasActiveLine) {
            lineTimer -= dt;
            if (lineTimer <= 0.0f) {
                advanceLine();
            }
        }
    }

private:
    void fireEvent(const std::string& ev) {
        std::cout << "[nStoryEngine] Trigger fired: " << ev << "\n";
        if (ev == "playertrifftbasalt") {
            queue.clear();
            enqueue({"book:chapter00/part01/sound/tut_bas01.wav",
                     "book/chapter00/part01/subtitle/omu_c00p01_basaltface01.bmp", 6.0f});
            enqueue({"book:chapter00/part01/sound/tut_bas02.wav",
                     "book/chapter00/part01/subtitle/omu_c00p01_basaltface02.bmp", 6.0f});
            enqueue({"book:chapter00/part01/sound/tut_bas03.wav",
                     "book/chapter00/part01/subtitle/omu_c00p01_basaltface03.bmp", 6.0f});
            enqueue({"book:chapter00/part01/sound/tut_bas04.wav",
                     "book/chapter00/part01/subtitle/omu_c00p01_basaltface04.bmp", 6.0f});
        } else if (ev == "cruiser_wreck") {
            enqueue({"book:chapter00/part01/sound/c00p01spr03.wav",
                     "book/chapter00/part01/subtitle/omu_c00p01_speaker03.bmp", 6.0f});
        }
    }

    void advanceLine() {
        if (queue.empty()) {
            hasActiveLine = false;
            if (onHideSubtitle) onHideSubtitle();
            return;
        }
        activeLine = queue.front();
        queue.pop_front();
        hasActiveLine = true;
        lineTimer = activeLine.durationSec;
        if (onPlayVoice && !activeLine.soundPath.empty()) onPlayVoice(activeLine.soundPath);
        if (onShowSubtitleBmp && !activeLine.subtitleBmp.empty()) onShowSubtitleBmp(activeLine.subtitleBmp);
    }
};

} // namespace nebula
