#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nBuildArea.asm
// Class: nBuildArea

#include <cstdint>

namespace re_nnomads {

struct nBuildArea_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint32_t field_0x0010;
    // +0x0eb0
    uint8_t field_0x0eb0;
    // +0x0eb8
    uint32_t field_0x0eb8;
    // +0x0ebc
    uint8_t field_0x0ebc;
    // +0x0ec0
    uint32_t field_0x0ec0;
    // +0x0ec4
    uint32_t field_0x0ec4;
    // +0x0ec8
    uint32_t field_0x0ec8;
    // +0x0ed0
    double field_0x0ed0;
    // +0x0ed8
    uint8_t field_0x0ed8;
    // +0x0ed9
    uint8_t field_0x0ed9;
    // +0x0ee0
    double field_0x0ee0;
    // +0x0f14
    float field_0x0f14;
    // +0x0f18
    uint8_t field_0x0f18;
    // +0x0f1c
    uint32_t field_0x0f1c;
    // +0x0f2c
    uint32_t field_0x0f2c;
    // +0x0f30
    uint8_t field_0x0f30;
    // +0x1130
    uint8_t field_0x1130;
    // +0x14ac
    float field_0x14ac;
    // +0x14b0
    float field_0x14b0;
};

// Methods (24):
// 0x10012bd8  nBuildArea::nBuildArea()  (15 insns)
// 0x10012bfa  nBuildArea::operator=  (14 insns)
// 0x10012c16  nBuildArea::vfunc_00  (40 insns)
//   calls:   -> nBuildArea::~nBuildArea()
// 0x10012e37  nBuildArea::vfunc_18  (44 insns)
//   calls:   -> nHouse::~nHouse()
// 0x1001fb63  nBuildArea::nBuildArea()  (9 insns)
// 0x1001fb7f  nBuildArea::~nBuildArea()  (2 insns)
//   calls:   -> nBuildArea::Clear
// 0x1001fb8a  nBuildArea::AddBuildingClass  (26 insns)
//   calls:   -> nBuildSlotRing::nBuildSlotRing()
// 0x1001fbca  nBuildArea::SetBuildingClass  (58 insns)
//   calls:   -> nBuildSlotRing::GetBuildingClass
// 0x1001fc42  nBuildArea::HasBuildingClass  (56 insns)
//   calls:   -> nBuildSlotRing::GetBuildingClass
// 0x1001fcb7  nBuildArea::GetBuildingClass  (2 insns)
//   calls:   -> nBuildSlotRing::GetBuildingClass
// 0x1001fcbf  nBuildArea::BuildingClassForth  (25 insns)
// 0x1001fcf8  nBuildArea::BuildingClassBack  (25 insns)
// 0x1001fd33  nBuildArea::Clear  (28 insns)
// 0x1001fd6c  nBuildArea::IsEmpty  (10 insns)
// 0x1001fd81  nBuildArea::Add  (5 insns)
// 0x1001fd90  nBuildArea::Has  (5 insns)
// 0x1001fd9f  nBuildArea::MoveTo  (5 insns)
// 0x1001fdae  nBuildArea::GetCurrent  (3 insns)
// 0x1001fdb6  nBuildArea::Forth  (3 insns)
// 0x1001fdbe  nBuildArea::Back  (3 insns)
// 0x1001fdc6  nBuildArea::Remove  (3 insns)
// 0x1001fdce  nBuildArea::HasSlots  (7 insns)
// 0x1001fddc  nBuildArea::MoveToFirst  (88 insns)
//   calls:   -> nContainer::nContainer()
// 0x10079be2  nBuildArea::vfunc_32  (1 insns)
//   calls:   IAT: nnetwork.dll!nNetNode::MarkShadowAll

} // namespace re_nnomads
