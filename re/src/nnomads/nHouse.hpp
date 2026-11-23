#pragma once
// Auto-lifted C++ layout & method spec from nnomads.dll
// Source ASM: re/disasm/nnomads/nHouse.asm
// Class: nHouse : public ncontainer  (sizeof = 0xf30 = 3888 bytes)

#include <cstdint>

namespace re_nnomads {

struct nHouse_Layout {
    // +0x0004
    float field_0x0004;
    // +0x0008
    double field_0x0008;
    // +0x000c
    uint32_t field_0x000c;
    // +0x0010
    uint8_t field_0x0010;
    // +0x0012
    uint32_t field_0x0012;
    // +0x001c
    uint32_t field_0x001c;
    // +0x0044
    uint8_t field_0x0044;
    // +0x00a0
    uint32_t field_0x00a0;
    // +0x0114
    uint32_t field_0x0114;
    // +0x01bc
    uint32_t field_0x01bc;
    // +0x0304
    uint32_t field_0x0304;
    // +0x0308
    uint32_t field_0x0308;
    // +0x0554
    float field_0x0554;
    // +0x0564
    float field_0x0564;
    // +0x05e4
    float field_0x05e4;
    // +0x05e8
    float field_0x05e8;
    // +0x05ec
    float field_0x05ec;
    // +0x05f0
    uint8_t field_0x05f0;
    // +0x0df4
    float field_0x0df4;
    // +0x0df8
    float field_0x0df8;
    // +0x0e08
    uint8_t field_0x0e08;
    // +0x0e64
    uint8_t field_0x0e64;
    // +0x0eb0
    uint8_t field_0x0eb0;
    // +0x0eb4
    uint32_t field_0x0eb4;
    // +0x0eb8
    uint8_t field_0x0eb8;
    // +0x0ebc
    uint32_t field_0x0ebc;
    // +0x0ec0
    uint32_t field_0x0ec0;
    // +0x0ec4
    uint32_t field_0x0ec4;
    // +0x0eec
    uint32_t field_0x0eec;
    // +0x0efc
    uint32_t field_0x0efc;
    // +0x0f14
    uint8_t field_0x0f14;
    // +0x0f15
    uint8_t field_0x0f15;
    // +0x0f18
    float field_0x0f18;
    // +0x0f1c
    float field_0x0f1c;
    // +0x0f28
    float field_0x0f28;
    // +0x0f2c
    uint32_t field_0x0f2c;
    // +0x0f40
    uint8_t field_0x0f40;
    // +0x0f88
    uint8_t field_0x0f88;
    // +0x131c
    uint32_t field_0x131c;
    // +0x1344
    uint32_t field_0x1344;
};

// Script AddCmds (26):
//   c_house/nhs_head.cc
//   b_searchunlockedisland_v
//   b_searchlockedisland_v
//   b_nearbuildground_v
//   v_setbuildingclass_s
//   s_getbuildingclass_v
//   v_setvisualizepossessarea_b
//   b_getvisualizepossessarea_v
//   v_removefromisland_v
//   b_removebuilding_v
//   v_setsleepmode_b
//   b_getsleepmode_v
//   v_sethousemenuradius_f
//   f_gethousemenuradius_v
//   v_sethousemenucentre_fff
//   v_sethousemenuangle_f
//   f_gethousemenuangle_v
//   b_isoccupied_v
//   v_setbuildstation_s
//   __buildslotradius_%s
//   v_setmodnumber_i
//   i_getmodnumber_v
//   v_setmodmaximum_i
//   i_getmodmaximum_v
//   v_setmodparameter_s
//   s_getmodparameter_v

// Methods (72):
// 0x10012c70  nHouse::nHouse()  (59 insns)
//   calls:   -> nContainer::nContainer()
// 0x10012d70  nHouse::operator=  (52 insns)
//   calls:   -> nContainer::operator=
// 0x1001c6d6  nHouse::IsNetworkObjectValid  (8 insns)
// 0x1001d9ed  nHouse::cmd_sethousemenucentre (v_sethousemenucentre_fff)  (31 insns)
// 0x1001f6d5  nHouse::SetHouseMenuRadius  (10 insns)
// 0x1001ffb7  nHouse::Trigger  (17 insns)
//   calls:   -> nContainer::Trigger
// 0x1002b6cb  nHouse::nHouse()  (46 insns)
//   calls:   -> nContainer::nContainer()
// 0x1002b767  nHouse::~nHouse()  (15 insns)
//   calls:   -> nContainer::~nContainer()
// 0x1002b795  nHouse::SetVisualizePossessArea  (3 insns)
// 0x1002b7a2  nHouse::GetVisualizePossessArea  (2 insns)
// 0x1002b7a9  nHouse::SetViewerPos  (10 insns)
// 0x1002b7bd  nHouse::GetViewerPos  (2 insns)
// 0x1002b7c4  nHouse::SetViewerDir  (10 insns)
// 0x1002b7da  nHouse::GetViewerDir  (2 insns)
// 0x1002b7e1  nHouse::NetExport  (63 insns)
//   calls:   -> nStateNode::GetClan, -> nStateNode::GetPrototype, -> nDataHandler::GetIndexByProto, -> nStateNode::SetNetworkObject
// 0x1002b893  nHouse::UpdateNetworkFromLocal  (20 insns)
//   calls:   -> nStateNode::GetNetworkObject
// 0x1002b8c5  nHouse::UpdateLocalFromNetwork  (24 insns)
//   calls:   -> nStateNode::GetNetworkObject
// 0x1002b902  nHouse::GetCustomDataSize  (5 insns)
//   calls:   -> nContainer::GetCustomDataSize
// 0x1002b912  nHouse::WriteCustomData  (120 insns)
//   calls:   -> nStateNode::GetState, -> nStateNode::GetIndexOfState, -> nContainer::GetPosition, -> nContainer::GetDirection, -> nContainer::GetMatrix44, -> nHouse::GetBuildState, -> nContainer::WriteCustomData
// 0x1002ba5f  nHouse::ReadCustomData  (136 insns)
//   calls:   -> nStateNode::GetState, -> nStateNode::GetIndexOfState, -> nStateNode::GetStateOfIndex, -> nContainer::SetDirection, -> nHouse::SetBuildState, -> nContainer::ReadCustomData, -> nContainer::GetMatrix44, -> nContainer::SetPosition
//   strings: 'nstation'
// 0x1002bbd8  nHouse::TriggerRecord  (153 insns)
//   calls:   -> nContainer::GetLastRecordTime, -> nContainer::GetPosition, -> nAnimSequence::AddTranslate, -> nContainer::GetDirection, -> nAnimSequence::AddRotate, IAT: MSVCRT.dll!sprintf, -> nAnimSequence::AddVisual, -> nAnimSequence::AddAudio, -> nRealWorld::GetVChannelName, -> nAnimSequence::SetChannelName, -> nAnimSequence::AddChannel, -> nContainer::SetLastRecordTime
//   consts:  f64=0.25, f64=0
//   strings: 'visual/%s', 'audio/%s', '/world'
// 0x1002bd91  nHouse::SupportMenuAction  (127 insns)
//   calls:   -> nContainer::IsVehicleClass, -> nStateNode::GetClan, -> nRealWorld::IsEnemy, IAT: nkernel.dll!n_printf
//   strings: 'concret.technical.static.building', 'concret.technical.static.building.pawnshop', 'concret.technical.static.building.garage', 'concret.technical.static.building.artefactstorage', 'concret.technical.static.building.flakbuilding', 'concret.technical.static.building.artefacttransformer', 'concret.technical.static.building.factory', 'concret.technical.static.building.powerplant'
// 0x1002bf26  nHouse::HasMenu  (71 insns)
//   calls:   -> nContainer::IsVehicleClass
//   strings: 'concret.technical.static.building'
// 0x1002bfd0  nHouse::SetSleepMode  (3 insns)
// 0x1002bfdd  nHouse::GetSleepMode  (2 insns)
// 0x1002bfe4  nHouse::SetHouseMenuCentre  (10 insns)
// 0x1002bff8  nHouse::GetHouseMenuCentre  (9 insns)
// 0x1002c019  nHouse::CalcHouseMenuCentre  (21 insns)
//   calls:   -> nContainer::IsVehicleClass
//   strings: 'concret.technical.static.building.artefacttransformer'
// 0x1002c054  nHouse::GetHouseMenuRadius  (2 insns)
// 0x1002c05b  nHouse::CalcHouseMenuRadius  (15 insns)
//   calls:   -> nContainer::IsVehicleClass
//   consts:  f32=1.2
//   strings: 'concret.technical.static.building.artefacttransformer'
// 0x1002c086  nHouse::SetHouseMenuAngle  (3 insns)
// 0x1002c093  nHouse::GetHouseMenuAngle  (2 insns)
// 0x1002c09a  nHouse::CalcHouseMenuAngle  (2 insns)
// 0x1002c0a2  nHouse::SetArtefactMode  (9 insns)
//   calls:   -> nContainer::SetArtefactMode
// 0x1002c0c4  nHouse::GetAimOffset  (13 insns)
//   calls:   -> nContainer::GetCorrectRadius
//   consts:  f32=0.5, f32=3, f32=0
// 0x1002c0f3  nHouse::GetBuildSlotRadius  (137 insns)
//   consts:  f32=5.01, f32=15, f32=7.5, f32=9, f32=10
//   strings: 'Typ1', 'Typ2', 'Typ3', 'Typ4', 'TypX'
// 0x1002c23d  nHouse::n_init_nhouse  (26 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort
//   strings: 'ncontainer', 'cannot initialize house class', 'c_house/nhs_head.cc'
// 0x1002c298  nHouse::n_fini_nhouse  (14 insns)
// 0x1002c2bb  nHouse::n_new_nhouse  (10 insns)
//   calls:   -> nHouse::nHouse()
// 0x1002c2d5  nHouse::n_version_nhouse  (105 insns)
//   strings: 'b_searchunlockedisland_v', 'b_searchlockedisland_v', 'b_nearbuildground_v', 'v_setbuildingclass_s', 's_getbuildingclass_v', 'v_setvisualizepossessarea_b', 'b_getvisualizepossessarea_v', 'v_removefromisland_v'
// 0x1002c492  nHouse::cmd_searchunlockedisland (b_searchunlockedisland_v)  (14 insns)
// 0x1002c4c0  nHouse::cmd_isoccupied (b_isoccupied_v)  (14 insns)
// 0x1002c4ee  nHouse::cmd_nearbuildground (b_nearbuildground_v)  (14 insns)
// 0x1002c51c  nHouse::cmd_getbuildingclass (s_getbuildingclass_v)  (15 insns)
// 0x1002c549  nHouse::cmd_setvisualizepossessarea (v_setvisualizepossessarea_b)  (12 insns)
// 0x1002c570  nHouse::cmd_getvisualizepossessarea (b_getvisualizepossessarea_v)  (14 insns)
// 0x1002c59e  nHouse::cmd_removefromisland (v_removefromisland_v)  (37 insns)
//   calls:   IAT: nkernel.dll!n_printf
//   strings: 'nstation'
// 0x1002c601  nHouse::cmd_removebuilding (b_removebuilding_v)  (14 insns)
// 0x1002c62f  nHouse::cmd_setsleepmode (v_setsleepmode_b)  (12 insns)
// 0x1002c656  nHouse::cmd_getsleepmode (b_getsleepmode_v)  (50 insns)
// 0x1002c6ed  nHouse::cmd_sethousemenuradius (v_sethousemenuradius_f)  (13 insns)
// 0x1002c718  nHouse::cmd_gethousemenuradius (f_gethousemenuradius_v)  (14 insns)
// 0x1002c746  nHouse::cmd_sethousemenuangle (v_sethousemenuangle_f)  (15 insns)
//   consts:  f32=3.141593, f32=0.005555556
// 0x1002c77c  nHouse::cmd_gethousemenuangle (f_gethousemenuangle_v)  (16 insns)
//   consts:  f32=180, f32=0.3183099
// 0x1002c7b6  nHouse::cmd_setbuildstation (v_setbuildstation_s)  (11 insns)
// 0x1002c7dd  nHouse::SaveCmds  (187 insns)
//   calls:   -> nContainer::SaveCmds
//   consts:  f32=180, f32=0.3183099
// 0x1002ca09  nHouse::UpdateChannels  (48 insns)
//   calls:   -> nRealWorld::GetUserClan, -> nContainer::UpdateChannels
// 0x1002ca8a  nHouse::Visualize  (368 insns)
//   calls:   -> nContainer::GetMatrix44, -> nContainer::GetPosition, -> nStateNode::GetPrototype, -> nContainer::DrawCross, -> nContainer::DrawLine, -> nContainer::Visualize
//   consts:  f32=0.5
//   strings: 'visual', 'possessarea', 'radius'
// 0x1002ced0  nHouse::SearchUnlockedIsland  (59 insns)
//   calls:   -> nStateNode::GetClan, -> nContainer::IsVehicleClass, IAT: nkernel.dll!n_printf
//   strings: 'concret.nature.island'
// 0x1002cf7a  nHouse::SearchLockedIsland  (57 insns)
//   calls:   -> nStateNode::GetClan, -> nContainer::IsVehicleClass, IAT: nkernel.dll!n_printf
//   strings: 'concret.nature.island'
// 0x1002d01b  nHouse::NearBuildGround  (41 insns)
//   calls:   -> nStateNode::GetClan, -> nContainer::IsVehicleClass
//   strings: 'concret.nature.island'
// 0x1002d085  nHouse::SetBuildState  (54 insns)
//   calls:   -> nContainer::IsVehicleClass, IAT: nkernel.dll!n_printf, -> nStateNode::GetClan
//   strings: 'concret.nature.island'
// 0x1002d11c  nHouse::IsOccupied  (47 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!sprintf, IAT: MSVCRT.dll!atof, -> nRealWorld::FindVehicle
//   strings: '__buildslotradius_%s', 'concret.technical'
// 0x1002d1a3  nHouse::SetBuildStation  (11 insns)
// 0x1002d1c7  nHouse::SetBuildStation  (4 insns)
// 0x1002d1d9  nHouse::GetBuildStation  (6 insns)
// 0x1002d1ef  nHouse::SetBuildingClass  (36 insns)
// 0x1002d246  nHouse::GetBuildingClass  (2 insns)
// 0x1002d24d  nHouse::RemoveFromIsland  (35 insns)
//   calls:   -> nContainer::GetPosition, -> nContainer::SetPosition
//   consts:  f32=1.5
//   strings: 'nstation'
// 0x1002d2ac  nHouse::SetRemoveBuilding  (3 insns)
// 0x1002d2b9  nHouse::GetRemoveBuilding  (41 insns)
//   calls:   -> nHouse::nHouse()
// 0x10031640  nHouse::GetBuildState  (435 insns)
//   calls:   IAT: nkernel.dll!n_printf, IAT: MSVCRT.dll!abort, -> nStateNode::GetNetworkObject, -> nContainer::AddEnergy, -> nStateNode::GetClan
//   strings: 'collected', 'cannot convert unknown paramID', 'container/nmodartefact_main.cc', 'backpack', 'booster', 'maennelenergy', 'vehicleenergy', 'clanenergy'

} // namespace re_nnomads
