#pragma once
// Auto-lifted C++ layout & method spec from nnetwork.dll
// Source ASM: re/disasm/nnetwork/nDataPDU.asm
// Class: nDataPDU

#include <cstdint>

namespace re_nnetwork {

struct nDataPDU_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    float field_0x0008;
    // +0x0038
    uint32_t field_0x0038;
    // +0x0040
    uint32_t field_0x0040;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint8_t field_0x004c;
};

// Methods (33):
// 0x10007193  nDataPDU::nDataPDU()  (13 insns)
//   calls:   -> nPDU::nPDU()
// 0x100071b9  nDataPDU::~nDataPDU()  (25 insns)
//   calls:   -> nPDU::~nPDU()
// 0x100071f2  nDataPDU::GetType  (3 insns)
// 0x100071f6  nDataPDU::SetSizeCustom  (94 insns)
// 0x100072e1  nDataPDU::GetSizeCustom  (2 insns)
// 0x100072e9  nDataPDU::BeginWriteCustom  (2 insns)
// 0x100072f1  nDataPDU::EndWriteCustom  (2 insns)
// 0x100072f9  nDataPDU::BeginReadCustom  (2 insns)
// 0x10007301  nDataPDU::EndReadCustom  (2 insns)
// 0x10007309  nDataPDU::IsWriteable  (2 insns)
// 0x10007311  nDataPDU::IsReadable  (2 insns)
// 0x10007319  nDataPDU::WriteBool  (10 insns)
//   calls:   -> nPDU::SetChanged
// 0x10007335  nDataPDU::ReadBool  (2 insns)
// 0x1000733d  nDataPDU::WriteByte  (12 insns)
//   calls:   -> nPDU::SetChanged
// 0x1000735d  nDataPDU::ReadByte  (4 insns)
// 0x10007368  nDataPDU::WriteShort  (12 insns)
//   calls:   -> nPDU::SetChanged
// 0x10007388  nDataPDU::ReadShort  (4 insns)
// 0x10007393  nDataPDU::WriteLong  (11 insns)
//   calls:   -> nPDU::SetChanged
// 0x100073b1  nDataPDU::ReadLong  (4 insns)
// 0x100073bc  nDataPDU::WriteFloat  (12 insns)
//   calls:   -> nPDU::SetChanged
// 0x100073dc  nDataPDU::ReadFloat  (2 insns)
// 0x100073e4  nDataPDU::WriteString  (18 insns)
//   calls:   -> nPDU::SetChanged
// 0x10007410  nDataPDU::ReadString  (28 insns)
// 0x1000744e  nDataPDU::IsPresentCustom  (2 insns)
// 0x10007452  nDataPDU::Save  (6 insns)
// 0x10007464  nDataPDU::Restore  (12 insns)
// 0x10007481  nDataPDU::Pack  (66 insns)
//   calls:   -> nPDU::Pack
// 0x1000752f  nDataPDU::nDataPDU()  (19 insns)
//   calls:   -> nPDU::nPDU()
// 0x10007562  nDataPDU::Unpack  (61 insns)
//   calls:   -> nPDU::CheckTypeAndID, -> nPDU::Unpack, -> nDataPDU::SetSizeCustom
// 0x100075fa  nDataPDU::operator=  (18 insns)
//   calls:   -> nPDU::operator=
// 0x10007627  nDataPDU::vfunc_00  (41 insns)
//   calls:   -> nDataPDU::~nDataPDU()
// 0x10007683  nDataPDU::SetCurrentStatistic  (6 insns)
//   calls:   -> nNetworkStatistic::SetCurrent
// 0x100080a4  nDataPDU::vfunc_16  (168 insns)
//   calls:   -> nDataPDU::~nDataPDU()
//   consts:  f64=1.907348633e-06

} // namespace re_nnetwork
