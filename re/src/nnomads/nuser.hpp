#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nuser.asm
// Class: nuser : public nroot  (sizeof = 0x60 = 96 bytes)

#include <cstdint>

namespace re_nnomads {

struct nuser_Layout {
    // +0x0004
    uint8_t field_0x0004;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0044
    uint32_t field_0x0044;
    // +0x0048
    uint8_t field_0x0048;
    // +0x004c
    float field_0x004c;
    // +0x0050
    float field_0x0050;
    // +0x0054
    float field_0x0054;
    // +0x0058
    uint32_t field_0x0058;
    // +0x005c
    uint8_t field_0x005c;
    // +0x005d
    uint8_t field_0x005d;
    // +0x005e
    uint8_t field_0x005e;
};

// Script AddCmds (6):
//   v_setactive_b
//   b_isactive_v
//   v_setwon_b
//   b_haswon_v
//   v_setloosed_b
//   b_hasloosed_v

// Methods (21):
// 0x1006c6d3  nuser::n_init_nuser  (15 insns)
//   strings: 'nroot'
// 0x1006c6fe  nuser::n_fini_nuser  (5 insns)
// 0x1006c710  nuser::n_new_nuser  (30 insns)
// 0x1006c760  nuser::vfunc_00  (27 insns)
// 0x1006c7aa  nuser::vfunc_14  (13 insns)
// 0x1006c7c8  nuser::vfunc_15  (52 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!atoi
//   strings: '/sys/servers/comm'
// 0x1006c865  nuser::vfunc_16  (23 insns)
//   calls:   IAT: nkernel.dll!n_printf
// 0x1006c8a0  nuser::vfunc_19  (11 insns)
// 0x1006c8bd  nuser::vfunc_20  (2 insns)
// 0x1006c8c1  nuser::vfunc_21  (11 insns)
// 0x1006c8de  nuser::vfunc_22  (2 insns)
// 0x1006c8e2  nuser::vfunc_23  (11 insns)
// 0x1006c8ff  nuser::vfunc_24  (2 insns)
// 0x1006c903  nuser::vfunc_28  (56 insns)
//   calls:   IAT: MSVCRT.dll!atoi
// 0x1006c9a8  nuser::vfunc_25  (10 insns)
// 0x1006c9b9  nuser::vfunc_26  (2 insns)
// 0x1006c9bd  nuser::vfunc_27  (59 insns)
//   consts:  f32=0.01
//   strings: 'v_setactive_b', 'b_isactive_v', 'v_setwon_b', 'b_haswon_v', 'v_setloosed_b', 'b_hasloosed_v'
// 0x1006cad7  nuser::cmd_setwon (v_setwon_b)  (12 insns)
// 0x1006cafb  nuser::cmd_haswon (b_haswon_v)  (14 insns)
// 0x1006cb26  nuser::cmd_setloosed (v_setloosed_b)  (12 insns)
// 0x1006cb4a  nuser::cmd_hasloosed (b_hasloosed_v)  (14 insns)

} // namespace re_nnomads
