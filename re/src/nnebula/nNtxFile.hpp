#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nNtxFile.asm
// Class: nNtxFile

#include <cstdint>

namespace re_nnebula {

struct nNtxFile_Layout {
    // +0x0004
    uint32_t field_0x0004;
    // +0x0006
    uint32_t field_0x0006;
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
    uint8_t field_0x001c;
    // +0x001d
    uint8_t field_0x001d;
    // +0x0020
    uint32_t field_0x0020;
    // +0x0024
    uint32_t field_0x0024;
    // +0x0028
    uint32_t field_0x0028;
    // +0x002c
    uint32_t field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0044
    uint8_t field_0x0044;
    // +0x0054
    uint32_t field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
};

// Methods (38):
// 0x10006eba  nNtxFile::operator=  (11 insns)
// 0x1000b03b  nNtxFile::nNtxFile()  (26 insns)
//   strings: '/sys/servers/file2'
// 0x1000b083  nNtxFile::SetNumBlocks  (33 insns)
// 0x1000b0c9  nNtxFile::GetNumBlocks  (2 insns)
// 0x1000b0cd  nNtxFile::SetCurrentBlock  (3 insns)
// 0x1000b0d7  nNtxFile::GetCurrentBlock  (2 insns)
// 0x1000b0db  nNtxFile::FindBlock  (22 insns)
// 0x1000b111  nNtxFile::FreeBlocks  (11 insns)
// 0x1000b12a  nNtxFile::SetWidth  (6 insns)
// 0x1000b13e  nNtxFile::GetWidth  (5 insns)
// 0x1000b14c  nNtxFile::SetHeight  (6 insns)
// 0x1000b160  nNtxFile::GetHeight  (5 insns)
// 0x1000b16e  nNtxFile::SetDepth  (6 insns)
// 0x1000b182  nNtxFile::GetDepth  (5 insns)
// 0x1000b190  nNtxFile::SetMipLevel  (6 insns)
// 0x1000b1a4  nNtxFile::GetMipLevel  (5 insns)
// 0x1000b1b2  nNtxFile::SetType  (6 insns)
// 0x1000b1c6  nNtxFile::GetType  (5 insns)
// 0x1000b1d4  nNtxFile::SetFormat  (6 insns)
// 0x1000b1e7  nNtxFile::GetFormat  (5 insns)
// 0x1000b1f4  nNtxFile::GetSize  (5 insns)
// 0x1000b202  nNtxFile::GetBytesPerRow  (14 insns)
// 0x1000b221  nNtxFile::GetBytesPerPixel  (18 insns)
// 0x1000b248  nNtxFile::readInt  (12 insns)
// 0x1000b25f  nNtxFile::writeInt  (7 insns)
// 0x1000b271  nNtxFile::readBlockHeader  (32 insns)
//   calls:   -> nNtxFile::readInt
// 0x1000b2ce  nNtxFile::writeBlockHeader  (81 insns)
// 0x1000b37f  nNtxFile::readFileHeader  (28 insns)
//   calls:   -> nNtxFile::readInt, -> nNtxFile::SetNumBlocks, -> nNtxFile::readBlockHeader
// 0x1000b3c2  nNtxFile::writeFileHeader  (37 insns)
//   calls:   -> nNtxFile::updateDataBlockOffsets, -> nNtxFile::writeBlockHeader
// 0x1000b419  nNtxFile::updateDataBlockOffsets  (57 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'gfx/nntxfile.cc'
// 0x1000b4aa  nNtxFile::OpenWrite  (28 insns)
//   calls:   -> nNtxFile::writeFileHeader, IAT: nkernel.dll!n_printf
// 0x1000b4f9  nNtxFile::CloseWrite  (15 insns)
// 0x1000b51b  nNtxFile::WriteBlock  (19 insns)
// 0x1000b54b  nNtxFile::OpenRead  (28 insns)
//   calls:   -> nNtxFile::readFileHeader, IAT: nkernel.dll!n_printf
//   strings: 'rb'
// 0x1000b59a  nNtxFile::CloseRead  (15 insns)
// 0x1000b5bc  nNtxFile::ReadBlock  (40 insns)
// 0x1000b61c  nNtxFile::nNtxFile()  (7 insns)
// 0x1000be46  nNtxFile::~nNtxFile()  (2004 insns)
//   calls:   IAT: MSVCRT.dll!qsort, IAT: nkernel.dll!n_strncpy2, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!strtok, -> nVertexBuffer::LockVertices, IAT: nkernel.dll!nn_malloc, IAT: MSVCRT.dll!atof, IAT: MSVCRT.dll!atoi, -> nVertexBuffer::JointWeight1, -> nVertexBuffer::JointWeight2, -> nVertexBuffer::JointWeight3, -> nVertexBuffer::JointWeight4
//   consts:  f32=255
//   strings: '_ro', '_rw', 'vn', 'rgba', 'vt', 'vt1', 'vt2', 'vt3'

} // namespace re_nnebula
