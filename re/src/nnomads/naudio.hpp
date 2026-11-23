#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/naudio.asm
// Class: naudio : public nservice  (sizeof = 0x70 = 112 bytes)

#include <cstdint>

namespace re_nnomads {

struct naudio_Layout {
    // +0x004c
    uint32_t field_0x004c;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint32_t field_0x005c;
    // +0x0060
    uint32_t field_0x0060;
    // +0x0064
    uint32_t field_0x0064;
    // +0x0068
    uint32_t field_0x0068;
    // +0x006c
    uint8_t field_0x006c;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x0208
    uint32_t field_0x0208;
    // +0x02bc
    uint32_t field_0x02bc;
    // +0x0308
    uint32_t field_0x0308;
};

// Script AddCmds (2):
//   v_setaudio_s
//   s_getaudio_v

// Methods (11):
// 0x1003bafe  naudio::n_init_naudio  (15 insns)
//   strings: 'nservice'
// 0x1003bb29  naudio::n_fini_naudio  (5 insns)
// 0x1003bb3b  naudio::n_new_naudio  (10 insns)
// 0x1003bb52  naudio::n_version_naudio  (16 insns)
// 0x1003bb7e  naudio::vfunc_00  (30 insns)
//   calls:   IAT: nkernel.dll!n_free
// 0x1003bbcb  naudio::vfunc_16  (71 insns)
//   calls:   -> nStateNode::GetPrototype, IAT: nkernel.dll!n_printf, -> nContainer::SetCurrentAudioNode, -> nStateNode::AttachService, -> nStateNode::TriggerRecord
// 0x1003bc9f  naudio::vfunc_17  (78 insns)
//   calls:   -> nContainer::SetCurrentAudioNode, -> nStateNode::NetImport, -> nRealWorld::GetGlobalTime
//   consts:  f32=0
// 0x1003bd7d  naudio::vfunc_18  (105 insns)
//   calls:   -> nContainer::GetMatrix44, -> nRealWorld::GetGlobalTime, -> nContainer::UpdateSimpleCountChannels, -> nContainer::ResetSimpleCountChannels, -> nconsumption::vfunc_37
//   strings: 'v_setaudio_s', 's_getaudio_v'
// 0x1003bebc  naudio::cmd_setaudio (v_setaudio_s)  (23 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1003bef8  naudio::vfunc_11  (41 insns)
//   calls:   -> ncollidedata::vfunc_11
// 0x1004c897  naudio::cmd_getaudio (s_getaudio_v)  (13 insns)

} // namespace re_nnomads
