# Project Nomads — Полная спецификация ресурсов и бинарных форматов

## 1. Бинарные форматы движка (The Nebula Device 1)

| Формат | Magic | Назначение | Статус парсера |
|---|---|---|---|
| `.npk` | `0KPN` (`NPK0`) | Виртуальный архив (`DIR_`, `FILE`, `DEND`, `DATA`), без сжатия | Готов (`nebula_assets.hpp`) |
| `.nvx` | `1XVN` (`NVX1`) | Меши: вершины (`COORD/NORM/RGBA/UV0..3/JW`), winged edges, uint16 индексы | Готов (включая `0x8b` веса костей) |
| `.ntx` | `1XTN` (`NTX1`) | Текстуры с мипмапами: только 2 формата — `3` (`R5G6B5`) и `4` (`A4R4G4B4`) | Готов (`nebula_assets.hpp`) |
| `.n` (bin) | `0BON` (`NOB0`) | Бинарный граф сцены (`_new`, `_sel`, FourCC + uint16 len + payload) | Готов (`nebula_assets.hpp`) |
| `.nax` | `0XAN` (`NAX0`) | Кривые скелетной и узловой анимации (`CHDR` + `CDTV` float4 / `CDTP` int16) | **Специфицирован, нужно подключить к GPU-скиннингу** |
| `.bmp` | `BM` | Русский UI (`locale/if_*.bmp` + альфа `ifa_*.bmp`), субтитры, цели миссий | Готов (`ngui.hpp`) |
| `.wav` | `RIFF` | Музыка, озвучка кампании (250 файлов), звуки эффектов (144 в `data.npk`) | Готов (`NSSound` / CoreAudio) |

## 2. Скелетные анимации героя (`char_john.n/character.nax` — 45 состояний)

```text
boden_drehenlinks, boden_drehenrechts, boden_laufzur, boden_run, boden_simplecount, boden_stehen, c04p07joh01_c04p07joh01, eject_eject, fliegen_ansaug, fliegen_highspeed, fliegen_highspeed_will_l, fliegen_highspeed_will_r, fliegen_highspeed_will_v, fliegen_highspeed_will_z, fliegen_jumpintofly, fliegen_medium, fliegen_medium_will_l, fliegen_medium_will_r, fliegen_medium_will_v, fliegen_medium_will_z, fliegen_null, fliegen_null_will_l, fliegen_null_will_r, fliegen_null_will_v, fliegen_null_will_z, fliegen_simplecount, fliegen_slow, fliegen_slow_will_l, fliegen_slow_will_r, fliegen_slow_will_v, fliegen_slow_will_z, hop_hop, hoplanden_hoplanden, jumpruntofly_jumpruntofly, landen_landen, randsprung_randsprung, slitter_slitter, sprung_sprung, stand_drehenlinks, stand_drehenrechts, stand_laufzur, stand_run, stand_stehen, stand_stehen_schiessen, wirbel_wirbel
```

## 3. Каталог прототипов в `data.npk` (всего 744 директорий, 6861 файлов)

- **Прочие объекты и эффекты**: 267 прототипов (примеры: `_main.n, a_ammo.n, a_arte_pplant.n, a_barrel01.n, a_barrel02.n, a_barrel03.n, a_barrel04.n, a_bild.n`)
- **Летательная техника и корабли**: 51 прототипов (примеры: `a_bomber03.n, a_sammler.n, a_stuka.n, bomber01.n, bomber02.n, bomber03.n, bomber03_garage.n, bomber03_garage_player.n`)
- **Руины, скалы и руда**: 28 прототипов (примеры: `a_brocken00.n, a_brocken01.n, a_brocken02.n, a_brocken03.n, a_brocken06.n, a_brocken08.n, a_brocken09.n, a_brocken10.n`)
- **Постройки, башни, фабрики и артефакты**: 110 прототипов (примеры: `a_factory01.n, a_factory02.n, a_factory03.n, a_g_lighthouse01_destr.n, a_lighthouse.n, a_wreck_gun.n, artefactpress01.n, artefakt_grabber.n`)
- **Персонажи (герои и NPC)**: 13 прототипов (примеры: `char_byldan.n, char_dusty.n, char_goliath.n, char_john.n, char_nomade.n, char_npc_tenzen.n, char_npc_travayne.n, char_preston.n`)
- **Острова и локации**: 142 прототипов (примеры: `differenzmaschine_island.n, fab_island.n, fab_island_m.n, fab_island_xl.n, first_island.n, first_npc_island.n, firstisland_c03p06.n, flak_island.n`)
- **Интерфейс и меню**: 18 прототипов (примеры: `if_credits.n, if_ebar.n, if_emptyslot.n, if_hilfe.n, if_intro.n, if_marker.n, if_menu.n, if_possesicons.n`)
- **Растительность**: 27 прототипов (примеры: `kaktus01.n, kaktus02.n, kaktus03.n, kaktus05.n, tree10.n, tree11.n, tree12.n, tree13.n`)
- **Shared Library (`lib/`) — шейдеры, листва, эффекты, шрифты**: 1 прототипов (примеры: `lib`)
- **Небо, облака и погода**: 87 прототипов (примеры: `sky.n, skybox01.n, skybox02.n, skybox03.n, skybox04.n, skybox05.n, template_cloud.n, template_wolkenhuette.n`)

## 4. Кампания (`Run/book/`) и мультиплеер (`Run/mplevels/`)

- **chapter00** (1 частей): `part01`
- **chapter01** (6 частей): `part00, part01, part02, part03, part04, part05`
- **chapter02** (10 частей): `part01, part02, part03, part04, part05, part06, part07, part08, part09, part10`
- **chapter03** (10 частей): `part00a, part00b, part01, part02, part03, part04, part05, part07, part08, part09`
- **chapter04** (8 частей): `part01, part02, part03, part04, part05, part06, part07, part08`
- **Мультиплеерные карты (`mplevels/`)**: 73 (`bonus.n, empty.bmp, pspbrwse.jbf, slot1, slot1.bmp, slot1.n, slot1.tcl, slot10, slot10.bmp, slot10.n`)
- **Всего частей кампании**: 35