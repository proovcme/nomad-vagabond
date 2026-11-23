#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nBuildSlotRing.asm
// Class: nBuildSlotRing

#include <cstdint>

namespace re_nnomads {

struct nBuildSlotRing_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0008
    uint32_t field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0014
    uint32_t field_0x0014;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    uint32_t field_0x0020;
};

// Methods (17):
// 0x1001f7f0  nBuildSlotRing::nBuildSlotRing()  (46 insns)
// 0x1001f85a  nBuildSlotRing::~nBuildSlotRing()  (9 insns)
//   calls:   -> nBuildSlotRing::Clear
// 0x1001f873  nBuildSlotRing::GetBuildingClass  (2 insns)
// 0x1001f877  nBuildSlotRing::IsEmpty  (4 insns)
// 0x1001f881  nBuildSlotRing::Has  (24 insns)
// 0x1001f8b8  nBuildSlotRing::Add  (25 insns)
// 0x1001f8f4  nBuildSlotRing::Remove  (43 insns)
// 0x1001f956  nBuildSlotRing::GetCurrent  (2 insns)
// 0x1001f95a  nBuildSlotRing::GetCount  (21 insns)
// 0x1001f986  nBuildSlotRing::Forth  (25 insns)
// 0x1001f9bf  nBuildSlotRing::Back  (25 insns)
// 0x1001f9fa  nBuildSlotRing::MoveTo  (22 insns)
// 0x1001fa2e  nBuildSlotRing::Clear  (28 insns)
// 0x1001fa65  nBuildSlotRing::MoveToFirst  (12 insns)
// 0x1001fa7f  nBuildSlotRing::nBuildSlotRing()  (26 insns)
// 0x1001fab8  nBuildSlotRing::operator=  (25 insns)
// 0x1001faeb  nBuildSlotRing::vfunc_00  (48 insns)
//   calls:   -> nBuildSlotRing::Clear

} // namespace re_nnomads
