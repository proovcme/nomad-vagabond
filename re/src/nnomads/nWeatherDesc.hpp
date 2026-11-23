#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nWeatherDesc.asm
// Class: nWeatherDesc : public ncontainer  (sizeof = 0xec8 = 3784 bytes)

#include <cstdint>

namespace re_nnomads {

struct nWeatherDesc_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x00c8
    uint8_t field_0x00c8;
    // +0x0110
    uint32_t field_0x0110;
    // +0x0114
    uint32_t field_0x0114;
    // +0x01f0
    uint32_t field_0x01f0;
    // +0x0208
    uint32_t field_0x0208;
    // +0x0224
    uint32_t field_0x0224;
    // +0x0228
    uint32_t field_0x0228;
    // +0x0254
    uint32_t field_0x0254;
    // +0x0258
    uint32_t field_0x0258;
    // +0x0264
    uint32_t field_0x0264;
    // +0x0268
    uint32_t field_0x0268;
    // +0x0278
    uint32_t field_0x0278;
    // +0x027c
    float field_0x027c;
    // +0x0eb0
    float field_0x0eb0;
    // +0x0eb4
    float field_0x0eb4;
    // +0x0eb8
    float field_0x0eb8;
    // +0x0ebc
    float field_0x0ebc;
    // +0x0ec0
    uint32_t field_0x0ec0;
    // +0x0ec4
    uint8_t field_0x0ec4;
};

// Script AddCmds (9):
//   v_setclouddescpath_s
//   v_setareaofeffect_f
//   v_setdefaultflag_b
//   s_getclouddescpath_v
//   f_getareaofeffect_v
//   b_isdefault_v
//   v_setcritterspeed_f
//   b_islanded_v
//   v_setlanded_b

// Methods (28):
// 0x1000c30b  nWeatherDesc::nWeatherDesc()  (23 insns)
//   calls:   -> nContainer::nContainer()
// 0x1000c36e  nWeatherDesc::operator=  (22 insns)
//   calls:   -> nContainer::operator=
// 0x1000c42c  nWeatherDesc::GetCloudDescPath  (6 insns)
//   calls:   IAT: nkernel.dll!n_strdup
// 0x1000c442  nWeatherDesc::GetCloudDesc  (11 insns)
// 0x1000c467  nWeatherDesc::GetWeight  (2 insns)
// 0x1000c46e  nWeatherDesc::GetAreaOfEffect  (2 insns)
// 0x1000c475  nWeatherDesc::SetChannelIndex  (3 insns)
// 0x1000c482  nWeatherDesc::IsDefault  (667 insns)
//   calls:   -> nCloudDescData::nCloudDescData(), -> nRealWorld::GetViewerMatrix, -> nWeatherDesc::SetWeight, IAT: MSVCRT.dll!sprintf, IAT: nkernel.dll!n_free
//   consts:  f32=1
//   strings: '/world', '/data/sky/visual/mixdir/weathermixer', '/sys/servers/channel', '/data/sky/visual/meshdir/pos/spheremixer', '/data/sky/visual/mixdir/clouddesc', '/../thumbwars', '%s%s', 'weather%d'
// 0x1001c080  nWeatherDesc::n_init_nweatherdesc  (15 insns)
//   strings: 'ncontainer'
// 0x1001c0ab  nWeatherDesc::n_fini_nweatherdesc  (5 insns)
// 0x1001c0bd  nWeatherDesc::n_new_nweatherdesc  (10 insns)
//   calls:   -> nWeatherDesc::nWeatherDesc()
// 0x1001c0d7  nWeatherDesc::n_version_nweatherdesc  (2 insns)
// 0x1001c0dd  nWeatherDesc::nWeatherDesc()  (16 insns)
//   calls:   -> nContainer::nContainer()
// 0x1001c11a  nWeatherDesc::~nWeatherDesc()  (17 insns)
//   calls:   IAT: nkernel.dll!n_free, -> nContainer::~nContainer()
// 0x1001c149  nWeatherDesc::ResolveCloudDescPath  (9 insns)
// 0x1001c165  nWeatherDesc::SetCloudDescPath  (15 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x1001c196  nWeatherDesc::SetWeight  (4 insns)
// 0x1001c1a5  nWeatherDesc::SetAreaOfEffect  (4 insns)
// 0x1001c1b4  nWeatherDesc::SetDefaultFlag  (4 insns)
// 0x1001c1cb  nWeatherDesc::CalcWeightForPos  (105 insns)
//   calls:   -> nContainer::GetPosition
//   consts:  f32=0
//   strings: 'v_setclouddescpath_s', 'v_setareaofeffect_f', 'v_setdefaultflag_b', 's_getclouddescpath_v', 'f_getareaofeffect_v', 'b_isdefault_v'
// 0x1001c319  nWeatherDesc::cmd_setclouddescpath (v_setclouddescpath_s)  (10 insns)
//   calls:   -> nWeatherDesc::SetCloudDescPath
// 0x1001c33c  nWeatherDesc::cmd_setareaofeffect (v_setareaofeffect_f)  (16 insns)
//   calls:   -> nWeatherDesc::SetAreaOfEffect
// 0x1001c368  nWeatherDesc::cmd_setdefaultflag (v_setdefaultflag_b)  (12 insns)
//   calls:   -> nWeatherDesc::SetDefaultFlag
// 0x1001c38e  nWeatherDesc::cmd_getclouddescpath (s_getclouddescpath_v)  (15 insns)
//   calls:   IAT: nkernel.dll!n_strdup
// 0x1001c3be  nWeatherDesc::cmd_getareaofeffect (f_getareaofeffect_v)  (11 insns)
// 0x1001c3e8  nWeatherDesc::cmd_isdefault (b_isdefault_v)  (19 insns)
//   consts:  f32=-1
// 0x1001c423  nWeatherDesc::SaveCmds  (96 insns)
//   calls:   -> nContainer::SaveCmds, IAT: nkernel.dll!n_strdup, -> nContainer::nContainer()
// 0x100674f3  nWeatherDesc::GetChannelIndex  (36 insns)
//   strings: 'v_setcritterspeed_f', 'b_islanded_v', 'v_setlanded_b'

} // namespace re_nnomads
