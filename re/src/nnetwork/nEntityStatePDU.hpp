#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nEntityStatePDU.asm
// Class: nEntityStatePDU

#include <cstdint>

namespace re_nnetwork {

struct nEntityStatePDU_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x0050
    float field_0x0050;
    // +0x0054
    float field_0x0054;
    // +0x0058
    float field_0x0058;
    // +0x005c
    float field_0x005c;
    // +0x0060
    float field_0x0060;
    // +0x0064
    float field_0x0064;
    // +0x00b0
    float field_0x00b0;
    // +0x00b4
    float field_0x00b4;
    // +0x00b8
    float field_0x00b8;
    // +0x00bc
    float field_0x00bc;
    // +0x00c0
    float field_0x00c0;
    // +0x00c4
    uint32_t field_0x00c4;
    // +0x00c8
    uint32_t field_0x00c8;
    // +0x00ca
    uint32_t field_0x00ca;
    // +0x00cc
    float field_0x00cc;
    // +0x00d0
    float field_0x00d0;
    // +0x00d4
    uint32_t field_0x00d4;
    // +0x00d8
    uint32_t field_0x00d8;
    // +0x00dc
    uint32_t field_0x00dc;
    // +0x00e0
    uint32_t field_0x00e0;
    // +0x00e4
    uint32_t field_0x00e4;
    // +0x00ec
    float field_0x00ec;
    // +0x00f0
    float field_0x00f0;
    // +0x00f4
    float field_0x00f4;
    // +0x00f8
    double field_0x00f8;
    // +0x016c
    float field_0x016c;
    // +0x0170
    float field_0x0170;
    // +0x0174
    float field_0x0174;
    // +0x0178
    uint32_t field_0x0178;
    // +0x017c
    float field_0x017c;
};

// Methods (38):
// 0x10007692  nEntityStatePDU::nEntityStatePDU()  (101 insns)
//   calls:   -> nDataPDU::nDataPDU()
//   consts:  f64=0.1
// 0x100077d1  nEntityStatePDU::~nEntityStatePDU()  (2 insns)
//   calls:   -> nDataPDU::~nDataPDU()
// 0x100077dc  nEntityStatePDU::GetType  (3 insns)
// 0x100077e0  nEntityStatePDU::SetPosition  (10 insns)
// 0x100077f1  nEntityStatePDU::GetPosition  (2 insns)
// 0x100077f5  nEntityStatePDU::SetOrientation  (10 insns)
// 0x10007808  nEntityStatePDU::GetOrientation  (2 insns)
// 0x1000780c  nEntityStatePDU::SetVelocity  (10 insns)
// 0x10007820  nEntityStatePDU::GetVelocity  (2 insns)
// 0x10007827  nEntityStatePDU::SetAppearance  (3 insns)
// 0x10007836  nEntityStatePDU::GetAppearance  (2 insns)
// 0x1000783e  nEntityStatePDU::SetEnergy  (3 insns)
// 0x1000784b  nEntityStatePDU::GetEnergy  (2 insns)
// 0x10007852  nEntityStatePDU::Save  (28 insns)
//   calls:   -> nDataPDU::Save
// 0x100078a6  nEntityStatePDU::Restore  (28 insns)
//   calls:   -> nDataPDU::Restore
// 0x100078fa  nEntityStatePDU::Pack  (139 insns)
//   calls:   -> nDataPDU::Pack
//   consts:  f32=180, f32=0.3183099, f32=182.0389
// 0x10007a7e  nEntityStatePDU::Unpack  (153 insns)
//   calls:   -> nDataPDU::Unpack
//   consts:  f32=0.005555556, f32=3.141593, f32=0.005493332
// 0x10007c63  nEntityStatePDU::SetTimestamp  (6 insns)
//   calls:   -> nPDU::SetTimestamp
// 0x10007c74  nEntityStatePDU::SaveDRData  (25 insns)
// 0x10007cbe  nEntityStatePDU::SetLastPosition  (10 insns)
// 0x10007cd2  nEntityStatePDU::GetLastPosition  (2 insns)
// 0x10007cd9  nEntityStatePDU::SetPredictedPosition  (10 insns)
// 0x10007ced  nEntityStatePDU::GetPredictedPosition  (2 insns)
// 0x10007cf4  nEntityStatePDU::SetRecentPosition  (10 insns)
// 0x10007d08  nEntityStatePDU::GetRecentPosition  (2 insns)
// 0x10007d0f  nEntityStatePDU::SetSmoothingTime  (3 insns)
// 0x10007d1c  nEntityStatePDU::GetSmoothingTime  (2 insns)
// 0x10007d23  nEntityStatePDU::SetCurrentStatistic  (6 insns)
//   calls:   -> nNetworkStatistic::SetCurrent
// 0x10007d32  nEntityStatePDU::SetLastOrientation  (10 insns)
// 0x10007d48  nEntityStatePDU::GetLastOrientation  (2 insns)
// 0x10007d4f  nEntityStatePDU::SetPredictedOrientation  (10 insns)
// 0x10007d65  nEntityStatePDU::GetPredictedOrientation  (2 insns)
// 0x10007d6c  nEntityStatePDU::SetRecentOrientation  (10 insns)
// 0x10007d82  nEntityStatePDU::GetRecentOrientation  (2 insns)
// 0x10007d89  nEntityStatePDU::SetLastVelocity  (10 insns)
// 0x10007d9d  nEntityStatePDU::GetLastVelocity  (2 insns)
// 0x10007da4  nEntityStatePDU::nEntityStatePDU()  (111 insns)
//   calls:   -> nDataPDU::nDataPDU()
// 0x10007f78  nEntityStatePDU::operator=  (90 insns)
//   calls:   -> nDataPDU::operator=

} // namespace re_nnetwork
