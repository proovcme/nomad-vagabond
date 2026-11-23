#pragma once
// Auto-lifted C++ layout & method spec from nnebula.dll
// Source ASM: re/disasm/nnebula/nGfxServer.asm
// Class: nGfxServer : public nroot  (sizeof = 0xc80 = 3200 bytes)

#include <cstdint>

namespace re_nnebula {

struct nGfxServer_Layout {
    // +0x0004
    float field_0x0004;
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
    float field_0x0030;
    // +0x0034
    float field_0x0034;
    // +0x0038
    float field_0x0038;
    // +0x003c
    float field_0x003c;
    // +0x004c
    uint32_t field_0x004c;
    // +0x0078
    uint8_t field_0x0078;
    // +0x0079
    uint8_t field_0x0079;
    // +0x007c
    uint32_t field_0x007c;
    // +0x01a4
    uint32_t field_0x01a4;
    // +0x01a8
    uint32_t field_0x01a8;
    // +0x01ac
    uint32_t field_0x01ac;
    // +0x01b0
    uint32_t field_0x01b0;
    // +0x01b4
    uint32_t field_0x01b4;
    // +0x01b8
    uint32_t field_0x01b8;
    // +0x01bc
    uint32_t field_0x01bc;
    // +0x01c0
    uint32_t field_0x01c0;
    // +0x01c4
    float field_0x01c4;
    // +0x01c8
    float field_0x01c8;
    // +0x01cc
    float field_0x01cc;
    // +0x01d0
    float field_0x01d0;
    // +0x01d4
    float field_0x01d4;
    // +0x01d8
    float field_0x01d8;
    // +0x01e0
    double field_0x01e0;
    // +0x01e8
    uint32_t field_0x01e8;
    // +0x054c
    uint32_t field_0x054c;
    // +0x0550
    uint32_t field_0x0550;
    // +0x0554
    uint32_t field_0x0554;
    // +0x0558
    uint32_t field_0x0558;
    // +0x055c
    uint32_t field_0x055c;
    // +0x0560
    uint32_t field_0x0560;
    // +0x0564
    uint32_t field_0x0564;
    // +0x0568
    uint32_t field_0x0568;
    // +0x056c
    uint32_t field_0x056c;
    // +0x0570
    uint32_t field_0x0570;
    // +0x0574
    uint32_t field_0x0574;
    // +0x0578
    uint32_t field_0x0578;
    // +0x0588
    uint32_t field_0x0588;
    // +0x0a9c
    uint32_t field_0x0a9c;
    // +0x0aa0
    uint32_t field_0x0aa0;
    // +0x0ab4
    uint32_t field_0x0ab4;
    // +0x0ac8
    uint32_t field_0x0ac8;
    // +0x0adc
    uint32_t field_0x0adc;
    // +0x0af0
    uint32_t field_0x0af0;
    // +0x0b04
    uint32_t field_0x0b04;
    // +0x0b18
    uint32_t field_0x0b18;
    // +0x0b2c
    uint32_t field_0x0b2c;
    // +0x0b40
    uint32_t field_0x0b40;
    // +0x0b54
    uint32_t field_0x0b54;
    // +0x0b68
    uint32_t field_0x0b68;
    // +0x0b7c
    uint32_t field_0x0b7c;
    // +0x0b90
    uint8_t field_0x0b90;
    // +0x0b94
    uint32_t field_0x0b94;
    // +0x0b98
    uint32_t field_0x0b98;
    // +0x0c7c
    uint32_t field_0x0c7c;
};

// Script AddCmds (18):
//   b_setdisplaymode_s
//   s_getdisplaymode_v
//   b_opendisplay_v
//   v_closedisplay_v
//   b_isdisplayopen_v
//   v_setviewvolume_ffffff
//   v_setclearcolor_ffff
//   b_screenshot_s
//   b_scaledscreenshot_sii
//   v_begincursors_i
//   v_setcursor_isii
//   v_endcursors_v
//   v_showcursor_v
//   v_hidecursor_v
//   v_setcurrentcursor_i
//   i_getcurrentcursor_v
//   v_setmaxtexturesize_i
//   i_getmaxtexturesize_v

// Methods (87):
// 0x10006d64  nGfxServer::n_init_ngfxserver  (15 insns)
//   strings: 'nroot'
// 0x10006d8f  nGfxServer::n_fini_ngfxserver  (5 insns)
// 0x10006da1  nGfxServer::n_new_ngfxserver  (10 insns)
//   calls:   -> nGfxServer::nGfxServer()
// 0x10006dbb  nGfxServer::n_version_ngfxserver  (2 insns)
// 0x10007256  nGfxServer::SetCurrentPixelShader  (13 insns)
//   calls:   -> nGfxServer::SetStats
// 0x1000727a  nGfxServer::GetCurrentPixelShader  (2 insns)
// 0x10007281  nGfxServer::SetCurrentVertexBubble  (13 insns)
//   calls:   -> nGfxServer::SetStats
// 0x100072a5  nGfxServer::GetCurrentVertexBubble  (2 insns)
// 0x100072ac  nGfxServer::SetCurrentTexture  (34 insns)
//   calls:   -> nGfxServer::SetStats, -> nTexture::GetByteSize
// 0x10007307  nGfxServer::GetCurrentTexture  (3 insns)
// 0x10007315  nGfxServer::nGfxServer()  (223 insns)
//   calls:   -> nRoot::nRoot()
// 0x10007673  nGfxServer::operator=  (251 insns)
//   calls:   -> nRoot::operator=, IAT: nkernel.dll!n_free
// 0x10007b40  nGfxServer::nGfxServer()  (210 insns)
//   consts:  f32=-0.1, f32=0.1
//   strings: 'gfx_triangles', 'gfx_framerate', 'gfx_modelviews', 'gfx_lights', 'gfx_textures', 'gfx_texturesize', 'gfx_pshader_switches', 'gfx_mesh_switches'
// 0x10007e90  nGfxServer::~nGfxServer()  (93 insns)
// 0x10008004  nGfxServer::releaseResources  (58 insns)
//   calls:   -> nRoot::GetHead
// 0x100080b3  nGfxServer::SetViewVolume  (16 insns)
// 0x100080f0  nGfxServer::GetViewVolume  (22 insns)
// 0x10008139  nGfxServer::SetMatrix  (45 insns)
//   calls:   -> nGfxServer::SetStats
// 0x100081a3  nGfxServer::GetMatrix  (28 insns)
// 0x100081e5  nGfxServer::PushMatrix  (37 insns)
// 0x10008255  nGfxServer::PopMatrix  (45 insns)
// 0x100082fb  nGfxServer::FindTexture  (25 insns)
//   calls:   -> nGfxServer::getResourceID
// 0x1000833c  nGfxServer::FindPixelShader  (25 insns)
//   calls:   -> nGfxServer::getResourceID
// 0x1000837d  nGfxServer::FindVertexBuffer  (25 insns)
//   calls:   -> nGfxServer::getResourceID
// 0x100083be  nGfxServer::FindIndexBuffer  (25 insns)
//   calls:   -> nGfxServer::getResourceID
// 0x100083ff  nGfxServer::NewVertexPool  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'gfx/ngfx_main.cc'
// 0x10008422  nGfxServer::NewVertexBuffer  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'gfx/ngfx_main.cc'
// 0x10008445  nGfxServer::NewIndexBuffer  (33 insns)
//   calls:   -> nGfxServer::getResourceID
//   strings: 'nindexbuffer'
// 0x100084a2  nGfxServer::Screenshot  (71 insns)
//   calls:   -> nBmpFile::nBmpFile(), -> nImageFile::SetWidth, -> nImageFile::SetHeight, -> nBmpFile::Open, IAT: nkernel.dll!nn_malloc, -> nBmpFile::WriteLine, IAT: nkernel.dll!n_free, -> nBmpFile::Close, -> nBmpFile::~nBmpFile()
//   strings: 'wb', 'gfx/ngfx_main.cc'
// 0x1000857d  nGfxServer::ScaledScreenshot  (71 insns)
//   calls:   -> nBmpFile::nBmpFile(), -> nImageFile::SetWidth, -> nImageFile::SetHeight, -> nBmpFile::Open, IAT: nkernel.dll!nn_malloc, -> nBmpFile::WriteLine, IAT: nkernel.dll!n_free, -> nBmpFile::Close, -> nBmpFile::~nBmpFile()
//   strings: 'wb', 'gfx/ngfx_main.cc'
// 0x10008642  nGfxServer::SetLight  (19 insns)
// 0x10008675  nGfxServer::GetNumLights  (2 insns)
// 0x1000867c  nGfxServer::GetLight  (4 insns)
// 0x1000868d  nGfxServer::SetClearColor  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x100086b0  nGfxServer::GetClearColor  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x100086d3  nGfxServer::NewTexture  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x100086f6  nGfxServer::NewPixelShader  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x10008719  nGfxServer::getResourceID  (64 insns)
//   calls:   IAT: MSVCRT.dll!sprintf
//   strings: 'res%d'
// 0x100087ab  nGfxServer::BeginScene  (36 insns)
//   calls:   -> nGfxServer::BeginStats, -> nGfxServer::SetStats, -> nGfxServer::SetCurrentTexture
// 0x1000880a  nGfxServer::EndScene  (32 insns)
//   calls:   -> nGfxServer::SetStats, -> nGfxServer::EndStats
//   consts:  f64=0
// 0x10008860  nGfxServer::BeginStats  (13 insns)
// 0x100088a5  nGfxServer::SetStats  (58 insns)
// 0x1000895e  nGfxServer::EndStats  (26 insns)
// 0x100089dc  nGfxServer::Trigger  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x100089ff  nGfxServer::OpenDisplay  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x10008a22  nGfxServer::CloseDisplay  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x10008a45  nGfxServer::IsDisplayOpen  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x10008a68  nGfxServer::SetState  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x10008a8b  nGfxServer::Rgba  (1 insns)
// 0x10008a8e  nGfxServer::Coord  (1 insns)
// 0x10008a91  nGfxServer::SetClipPlane  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x10008ab4  nGfxServer::BeginText  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x10008ad7  nGfxServer::TextPos  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x10008afa  nGfxServer::Text  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x10008b1d  nGfxServer::EndText  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x10008b40  nGfxServer::GetDisplayDesc  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x10008b63  nGfxServer::GetFontDesc  (7 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'Pure virtual function called.', 'gfx/ngfx_main.cc'
// 0x10008b86  nGfxServer::SetMaxTextureSize  (11 insns)
//   calls:   -> nGfxServer::releaseResources
// 0x10008ba6  nGfxServer::GetMaxTextureSize  (436 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: MSVCRT.dll!sprintf
//   consts:  f32=0
//   strings: '/sys/var/%s', 'nenv'
// 0x10009836  nGfxServer::getModeTag  (92 insns)
//   calls:   IAT: nkernel.dll!n_strncpy2, IAT: MSVCRT.dll!strtok, IAT: MSVCRT.dll!strchr
// 0x10009921  nGfxServer::SetDisplayMode  (218 insns)
//   calls:   -> nGfxServer::getModeTag, IAT: nkernel.dll!n_strncpy2, IAT: MSVCRT.dll!atoi, IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup, IAT: MSVCRT.dll!sprintf
//   strings: 'win', 'dev', 'type', 'bpp', 'zbuf', 'sbuf', 'title', 'icon'
// 0x10009ba5  nGfxServer::GetDisplayMode  (2 insns)
// 0x10009ba9  nGfxServer::BeginCursors  (20 insns)
// 0x10009be1  nGfxServer::SetCursor  (41 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x10009c52  nGfxServer::EndCursors  (13 insns)
//   calls:   -> nGfxServer::LoadCursors
// 0x10009c77  nGfxServer::LoadCursors  (68 insns)
//   calls:   IAT: MSVCRT.dll!sprintf, -> nTexture::SetTexture, IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'cursor%d', 'gfx/ngfx_cursor.cc'
// 0x10009d3d  nGfxServer::SetCurrentCursor  (3 insns)
// 0x10009d4a  nGfxServer::GetCurrentCursor  (2 insns)
// 0x10009d51  nGfxServer::ShowCursor  (2 insns)
// 0x10009d59  nGfxServer::HideCursor  (172 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
//   strings: 'b_setdisplaymode_s', 's_getdisplaymode_v', 'b_opendisplay_v', 'v_closedisplay_v', 'b_isdisplayopen_v', 'v_setviewvolume_ffffff', 'ffffff_getviewvolume_v', 'v_setclearcolor_ffff'
// 0x10009fc4  nGfxServer::cmd_setdisplaymode (b_setdisplaymode_s)  (23 insns)
// 0x1000a032  nGfxServer::cmd_closedisplay (v_closedisplay_v)  (3 insns)
// 0x1000a066  nGfxServer::cmd_setviewvolume (v_setviewvolume_ffffff)  (104 insns)
// 0x1000a19e  nGfxServer::cmd_setclearcolor (v_setclearcolor_ffff)  (76 insns)
// 0x1000a27c  nGfxServer::cmd_screenshot (b_screenshot_s)  (23 insns)
// 0x1000a2bf  nGfxServer::cmd_scaledscreenshot (b_scaledscreenshot_sii)  (36 insns)
// 0x1000a321  nGfxServer::cmd_begincursors (v_begincursors_i)  (10 insns)
//   calls:   -> nGfxServer::BeginCursors
// 0x1000a344  nGfxServer::cmd_setcursor (v_setcursor_isii)  (27 insns)
//   calls:   -> nGfxServer::SetCursor
// 0x1000a38f  nGfxServer::cmd_endcursors (v_endcursors_v)  (2 insns)
//   calls:   -> nGfxServer::EndCursors
// 0x1000a398  nGfxServer::cmd_showcursor (v_showcursor_v)  (3 insns)
// 0x1000a3a4  nGfxServer::cmd_hidecursor (v_hidecursor_v)  (3 insns)
// 0x1000a3b0  nGfxServer::cmd_setcurrentcursor (v_setcurrentcursor_i)  (10 insns)
//   calls:   -> nGfxServer::SetCurrentCursor
// 0x1000a3d3  nGfxServer::cmd_getcurrentcursor (i_getcurrentcursor_v)  (13 insns)
//   calls:   -> nGfxServer::GetCurrentCursor
// 0x1000a3fe  nGfxServer::cmd_setmaxtexturesize (v_setmaxtexturesize_i)  (11 insns)
// 0x1000a425  nGfxServer::cmd_getmaxtexturesize (i_getmaxtexturesize_v)  (34 insns)
//   calls:   IAT: nkernel.dll!n_free, IAT: nkernel.dll!n_strdup
// 0x10013949  nGfxServer::Begin  (1 insns)
// 0x10034b87  nGfxServer::GetColorFormat  (2 insns)

} // namespace re_nnebula
