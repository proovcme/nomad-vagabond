#pragma once
// Auto-lifted C++ layout & method spec from nopcode.dll
// Source ASM: re/disasm/nopcode/nopcodeserver.asm
// Class: nopcodeserver : public ncollideserver  (sizeof = 0x264 = 612 bytes)

#include <cstdint>

namespace re_nopcode {

struct nopcodeserver_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0006
    uint8_t field_0x0006;
    // +0x0008
    float field_0x0008;
    // +0x000c
    float field_0x000c;
    // +0x0010
    float field_0x0010;
    // +0x0014
    float field_0x0014;
    // +0x0018
    float field_0x0018;
    // +0x001c
    float field_0x001c;
    // +0x0020
    float field_0x0020;
    // +0x0024
    float field_0x0024;
    // +0x0028
    float field_0x0028;
    // +0x002c
    float field_0x002c;
    // +0x0030
    uint32_t field_0x0030;
    // +0x0034
    uint32_t field_0x0034;
    // +0x0040
    uint32_t field_0x0040;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint32_t field_0x0048;
    // +0x004c
    uint32_t field_0x004c;
    // +0x01f4
    float field_0x01f4;
    // +0x01fc
    uint8_t field_0x01fc;
    // +0x0204
    uint8_t field_0x0204;
    // +0x021c
    uint32_t field_0x021c;
    // +0x0220
    uint32_t field_0x0220;
};

// Methods (6):
// 0x10001000  nopcodeserver::n_init_nopcodeserver  (10 insns)
//   strings: 'ncollideserver'
// 0x10001021  nopcodeserver::n_fini_nopcodeserver  (5 insns)
// 0x10001033  nopcodeserver::n_new_nopcodeserver  (10 insns)
// 0x1000104d  nopcodeserver::n_version_nopcodeserver  (2 insns)
// 0x10001d35  nopcodeserver::vfunc_00  (26 insns)
//   calls:   IAT: opcode11.dll!Container::~Container(), IAT: opcode11.dll!AABBSphereCollider@Opcode::~AABBSphereCollider@Opcode(), IAT: opcode11.dll!AABBRayCollider@Opcode::~AABBRayCollider@Opcode(), IAT: opcode11.dll!AABBTreeCollider@Opcode::~AABBTreeCollider@Opcode()
// 0x10001d93  nopcodeserver::vfunc_15  (1848 insns)
//   calls:   IAT: opcode11.dll!OPCODE_Model@Opcode::OPCODE_Model@Opcode(), IAT: nkernel.dll!n_free, IAT: opcode11.dll!OPCODE_Model@Opcode::~OPCODE_Model@Opcode(), IAT: nkernel.dll!nn_malloc, -> nClass::vfunc_37, -> nClass::vfunc_38, -> nClass::vfunc_39, IAT: opcode11.dll!OPCODECREATE@Opcode::OPCODECREATE@Opcode(), IAT: opcode11.dll!OPCODE_Model::Build, -> nClass::vfunc_40, IAT: opcode11.dll!AABBTreeCollider::Collide, IAT: opcode11.dll!AABBRayCollider::Collide
//   consts:  f32=1, f32=0.3333333, f64=1e-07, f32=0.0001, f32=-0.0001, f32=1.0001
//   strings: '/sys/servers/collide', 'opcode11/nopcodeshape.cc'

} // namespace re_nopcode
