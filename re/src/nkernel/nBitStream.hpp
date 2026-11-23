#pragma once
// Auto-lifted C++ layout & method spec from nkernel.dll
// Source ASM: re/disasm/nkernel/nBitStream.asm
// Class: nBitStream

#include <cstdint>

namespace re_nkernel {

struct nBitStream_Layout {
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
    // +0x0018
    uint32_t field_0x0018;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0020
    uint8_t field_0x0020;
    // +0x0021
    uint8_t field_0x0021;
};

// Methods (33):
// 0x10007936  nBitStream::nBitStream()  (13 insns)
// 0x1000795c  nBitStream::nBitStream()  (35 insns)
// 0x100079b0  nBitStream::~nBitStream()  (8 insns)
// 0x100079c5  nBitStream::Clear  (13 insns)
// 0x100079e0  nBitStream::WriteBool  (3 insns)
//   calls:   -> nBitStream::WriteBit
// 0x100079ec  nBitStream::ReadBool  (1 insns)
//   calls:   -> nBitStream::ReadBit
// 0x100079f1  nBitStream::WriteInt  (35 insns)
//   calls:   -> nBitStream::WriteBit
//   consts:  f32=0
// 0x10007a41  nBitStream::ReadInt  (30 insns)
//   calls:   -> nBitStream::ReadBit
// 0x10007a7e  nBitStream::WriteFloat  (4 insns)
//   calls:   -> nBitStream::WriteInt
// 0x10007a8c  nBitStream::ReadFloat  (9 insns)
//   calls:   -> nBitStream::ReadInt
// 0x10007a9f  nBitStream::WriteCustom  (24 insns)
// 0x10007ad8  nBitStream::nBitStream()  (29 insns)
// 0x10007b20  nBitStream::ReadCustom  (24 insns)
// 0x10007b59  nBitStream::ReadBitStream  (5 insns)
//   calls:   -> nBitStream::ReadCustom
// 0x10007b6b  nBitStream::WriteBitStream  (5 insns)
//   calls:   -> nBitStream::WriteCustom
// 0x10007b7d  nBitStream::vfunc_00  (50 insns)
// 0x10007bf1  nBitStream::Set  (29 insns)
// 0x10007c31  nBitStream::WriteBit  (20 insns)
// 0x10007c64  nBitStream::Get  (2 insns)
// 0x10007c68  nBitStream::SetSize  (29 insns)
// 0x10007ca6  nBitStream::ReadBit  (25 insns)
// 0x10007cdb  nBitStream::GetSize  (2 insns)
// 0x10007cdf  nBitStream::SetPos  (13 insns)
// 0x10007cfb  nBitStream::GetPos  (4 insns)
// 0x10007d05  nBitStream::BitsLeft  (5 insns)
// 0x10007d12  nBitStream::BeginWrite  (18 insns)
// 0x10007d3b  nBitStream::EndWrite  (2 insns)
// 0x10007d40  nBitStream::BeginRead  (4 insns)
// 0x10007d4d  nBitStream::EndRead  (2 insns)
// 0x10007d52  nBitStream::IsWriteable  (2 insns)
// 0x10007d56  nBitStream::IsReadable  (2 insns)
// 0x10007d5a  nBitStream::Print  (45 insns)
//   calls:   -> n_printf
//   strings: '%4.d: ', '%d'
// 0x10007dbf  nBitStream::operator=  (19 insns)

} // namespace re_nkernel
