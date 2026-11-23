# Project Nomads (macOS Apple Silicon `arm64`) — Детальный лог разработки и реверс-инжиниринга

> Живой журнал работ: от распаковки `NOMADS.iso` и полного вскрытия 11 оригинальных Windows DLL до нативного порта C++17 / Objective-C++ / Metal / `Tcl.framework` без Wine. Обновляется после каждого завершённого этапа.

---

## Хронология этапов

### Этап 0 — Распаковка дистрибутива и инвентаризация ассетов
- Распакован образ `NOMADS.iso` (`Setup.exe`, Wise Installation System) → `extracted/` (**2 352 файла, 758.3 MB, 100% CRC32 верифицировано**).
- Подтверждено, что `Additional/Add_Data.pck` содержит только GameSpy Arcade; 100% игровых ассетов находятся в `extracted/Run/` + `data.npk` (**6 861 файл**) + `data1.npk` (**3 файла**).
- Проведён первичный анализ бинарников в `extracted/Run/bin/win32/`: игровые модули `nnomads.dll` (768 KB, 158 классов), `nnature.dll` (100 KB, 7 классов), `nnetwork.dll` (96 KB, 4 класса) — чистый OS-независимый C++ с полными MSVC-экспортами и нулевым числом Win32 GUI/DirectX импортов.

### Этап 1 — Архитектурная спецификация и генерация каркаса классов
- Извлечены полные таблицы экспортов, иерархий классов и `AddCmd`:
  - `re/spec_nnomads.json` (158 классов, 1 156 `AddCmd`, 1 963 C++ экспорта),
  - `re/spec_nnature.json` (7 классов, 69 `AddCmd`),
  - `re/spec_nnetwork.json` (4 класса, 23 `AddCmd`),
  - `re/CLASS_TREE.md` и 169 сгенерированных C++-заголовков в `re/include/`.
- Написаны архитектурные спецификации `re/architecture/01_SUBSYSTEMS_AND_CLASSES.md`, `02_RESOURCE_AND_FORMAT_SPEC.md`, `03_GAME_LOOP_AND_BUILD_PLAN.md`.

### Этап 2 — Ядро Nebula Device 1 и парсеры бинарных форматов
- Реализовано нативное ядро движка в `native/core/`:
  - `nkernel.hpp` — `nKernelServer`, `nRoot`, `nClass`, `nCmd`/`nCmdProto`, `nEnv`.
  - `ngen_classes.hpp` — авторегистрация всех **252** классов Nebula + Nomads/Nature/Network и **1 248** `AddCmd`.
  - `nfileserver.hpp` — `nFileServer`/`nFileServer2`/`nNpkFileServer` (`setassign`, `getassign`, `manglepath`, прозрачное монтирование `NPK0`).
  - `ntclserver.hpp` — мост с системным `Tcl.framework` (`new`, `delete`, `sel`, `psel`, `exists`, `dir`, `get`, `unknown`).
- Реализованы бинарные парсеры в `native/viewer/nebula_assets.hpp`:
  - `NPK0` (архивы `data.npk` / `data1.npk`),
  - `NVX1` (все форматы вершин, включая 4-костный скиннинг `0x8b`),
  - `NTX1` (`R5G6B5` и `A4R4G4B4`),
  - `NOB0` (граф сцены `_main.n`, наследование текстур и `detailMap`, дедупликация LOD `nflipflop`, извлечение скелета `SANF`/`ADJN`).
- Реализована `native/nnature/nnature.hpp` — C++17 реализация 7 классов `nnature.dll`.

### Этап 3 — Скелетная анимация `NAX0`, физика, GUI и игровой цикл (Модули 1–7)
- **Скиннинг (`native/core/nanim.hpp`):** парсер `NAX0` (`CHDR`, `CDTV`, `CDTP` упакованные `uint16`-кватернионы), CPU-скиннинг по 4 костям, `outWorldPose` для крепления ранца (`backpack.n` на кость #2). Исправлена конвенция кватернионов Nebula (row-major → сопряжение `(-qx, -qy, -qz, qw)` в column-major).
- **Коллизии и герой (`ncollide.hpp`, `nplayer.hpp`):** AABB + точный Möller–Trumbore raycast по треугольникам островов (`67 938` треугольников на Миссии 1), контроллер героя (`-Z` вперёд), джетпак, 3rd-person камера, управление трекпадом MacBook.
- **Модуль 1 (`nbook.hpp`):** `nCookieHandler`, `nEventHandler` (`addhandler`/`addhandler2` `and`/`or`), `nBookHandler` (загружает `book/story.tcl`, регистрирует все 30 частей кампании).
- **Модуль 2 (`ncinematics.hpp` + `nworld.hpp`):** `nAnimSequence` + `nCinematicPlayer`/`nSubtitlePlayer` (137-секундная вступительная катсцена `intro_camera`, 8 `p_shark`, `intro_subtitle`, `cam_erwach`, очистка префикса `<carrier>#` в аудио-ключах).
- **GUI (`ngui.hpp`):** `nGuiMenuHandler`, `nGuiStandardMenu`, `nGuiMenuEntry`, загрузчик 8/24-bit BMP + alpha-BMP (`locale/if_*.bmp` + `ifa_*.bmp`). Убран лишний фон/шестерёнки из главного меню (подтверждено по оригиналу на Windows — чистый чёрный фон до загрузки миссии).
- **Модуль 3 (`ngameplay.hpp`):** `nGuiBar`, `nHouse`, `nBuild`, `nArtefactBelt` (подбор `F`, постройка `B` с реальным событием `guntowergebaut`).
- **Модуль 4 (`ncombat.hpp`):** `nFireMachineGun`, `nFireMissile`, `nExplosion`, `nAttack`, фракции, ИИ-истребители, авто-турели, снаряды и взрывы (стрельба `X`, проверено сбитие 4 `p_shark_tut` → `C0P1sharkkills=4`).
- **Модуль 5 (`nisland.hpp`):** `nNavPoint`, `nStation`, `nIslandDrive`, `nIslandFlightSystem`, сохранение/загрузка `F5`/`F9` (проверен точный round-trip 275/275 сущностей и cookies).
- **Модуль 7 (`nparticles.hpp`):** 3D-частицы (пламя джетпака, следы самолётов, дым обломков), переключение глав по `F6`.
- **Единый бандл:** `native/build_app.sh` собирает нативный `arm64` `Project Nomads.app` (Cocoa + Metal + Tcl + `NSSound`).

### Этап 4 — Динамический аудит и Модуль 8 (иерархия островов и алиасы)
- Проведён полный динамический аудит на `demo.tcl` + меню + Миссия 1: изначально **94.68%** (`20 976 / 22 154`), выявлены 1 178 заглушек.
- В **Модуле 8** (`nworld.hpp`, `main.mm`) реализованы:
  - `alignvehicle` (`ALIV`) + `addchildvehicle` (`ACHV`) + `setswingparamsx/y/z` + `setcharges` (`SCRG`) — все **115/115** деревьев, руин и построек на островах встали на реальные мировые координаты родительских островов и движутся/качаются вместе с ними.
  - `nRealWorld::setalias` (`SALS`) — все 13 алиасов `meta_*` динамически разрешаются под выбранного героя (`john_aliases` / `goliath_aliases` / `susie_aliases`).
  - `nopcodeserver.addcollclass` / `addcolltype` (16 классов, 256 пар коллизий) и `nclan.setclancolor` / `setnoticeenergy`.
- Покрытие выросло до **98.84%** (`21 898 / 22 154`).

### Этап 5 — Полное вскрытие всех 11 DLL и построчная сверка математики углов
- Написан аннотированный дизассемблер `re/tools/disasm_all.py` поверх Apple LLVM `objdump` (`coff-i386`, PE Export/IAT, автоподстановка вызовов, строк и `f32`/`f64` из `.rdata`, распознавание `n_init_*`/`n_new_*`/vftable/`AddCmd`).
- Написан лифтер `re/tools/lift_classes.py` → поднято **454 класса, 8 314 методов, 1 811 `AddCmd`** со всех 11 DLL (`nnomads`, `nnebula`, `nnature`, `nnetwork`, `ndirect3d8`, `ncollide`, `nopcode`, `nparticle`, `nkernel`, `ndsound`, `ndinput8`) в `re/src/MASTER_INDEX.md`.
- **Построчная сверка x87 FPU вскрыла и исправила 3 бага с углами/кватернионами:**
  1. `nContainer::AlignVehicle` (`0x10018a91`), `nMatrix3D::SetEuler` (`0x10012aae` + транспонирование `0x10013eb9`), `n3DNode::updateMatrix` (`0x1001e9bc`) — везде row-major `Rx * Ry * Rz` = column-major **`Rz * Ry * Rx`** (исправлено с `Ry * Rx * Rz` в `nworld.hpp` и `main.mm`).
  2. `nnebula.dll` `0x1001ecd1` (`matrix44(quaternion)`) — исправлено сопряжение `(-qx, -qy, -qz, qw)` для узлов `QXYZW` в `nebula_assets.hpp`.
  3. `ncombat.hpp` — исправлен разворот ИИ-истребителей (`atan2(-vx, -vz)` вместо `atan2(vx, vz)`).
- Из `nmaennelwalk2.asm`, `njumpengine.asm`, `nchaseviewer.asm` и `data.n/char_john.n/_main.n` перенесены точные параметры ходьбы (`8 м/с`, макс. угол склона `50°` со скатыванием `10 м/с`, кулдаун прыжка `0.5 с`, джетпак `30 м/с`, `180°/с`).

### Этап 6 — Построчные Модули 9–11 (время суток, экономика, полёты, баллистика)
- **Модуль 9 (`neconomy.hpp`, `nworld.hpp`, `main.mm`):**
  - `nRealWorld::SetTimeOfDay` / `SetDayPeriod` / `update_timeofday` (`86400 с/сутки`, из `nRealWorld.asm` `0x100741d3..0x10074259`).
  - `nLightNode` (`nlightnode.asm`), `nSammler` (`nsammler.asm`), `nPawnShop` (`npawnshop.asm`), радиальное меню зданий `nHouseMenu` (`nhousemenu.asm`, открывается по `E`).
- **Модуль 10 (`nflight.hpp`, `main.mm`):**
  - `nAirplane3` (все 18 команд + параметры `j_scout01`: `min=40`, `max=70`, `accel=3.5с`, `decel=5с`, `yaw=120°/с`, `pitch/roll=70°`).
  - `nIslandDrive` (`nislanddrive.asm` `0x1002fbd1`, ось вперёд `(0,0,-1)`) — пилотирование всего острова с синхронным движением всех дочерних объектов.
- **Модуль 11 (`ncombat.hpp`, `ngameplay.hpp`, `ngui.hpp`, `nworld.hpp`):**
  - Калибровка турелей по `j_guntower01.n/_main.n` (`700 м/с`, `0.1429 с`, дальность `650 м`, урон `12`).
  - Регистрация `nGuiBar`, `nGuiStandardMenu::setmouseoverselect`, `nContainer::setaction`, `n3DNode`, `nDataHandler::loadpermanent`, `nSceneGraph2::setmiplod`.
  - **Покрытие реальным C++ на Миссии 1 достигло `99.40%` (22 020 / 22 154, 134 заглушки).**

### Этап 7 — Построчное восстановление рендер-конвейера (`ndirect3d8` + `nShaderNode` + `nIpol` + `nnature`)
- **Исправление видимости ассетов и 4× MSAA (`nebula_assets.hpp`, `nworld.hpp`, `main.mm`):**
  - Разрешён `SRDO=1` для `nmeshsway`, `nleafrender`, `ncloudrender`; отсечены неактивные ветки состояний под `visual/` (`destroyed`/`invis`/`artefact`/`missy`).
  - Поддержаны `.addvisual` (`visual/invis` ↔ `visual/normal`) для всех кораблей катсцен; включён **4× MSAA** и `farZ = 18000`.
- **Пункт 1 — 226 реальных шейдеров (`data.n/shaders.n/_main.n`) + `nFogNode`:**
  - Парсер `parseShaderLibrary` загружает все **226/226** `nShaderNode` (`107` additive, `15` alphaTest, `150` noZWrite) и привязывает их через `nlinknode` (`STGT`).
  - Двухпроходный Metal-рендер: Проход 1 (непрозрачные + `alphatest` с точным `SARF`), Проход 2 (прозрачные, облака и аддитивный пайплайн `_meshAddPSO` `ONE, ONE`).
- **Пункт 2 — `nIpol` и кривые погоды (`data.n/weather_normal.n/_main.n`):**
  - Загружаются 9-точечные суточные кривые `licht1_color`, `amb_color`, `fog_color`, `fog_rangeani` (`0..86400 с`).
  - Автоматически вращаются `nIpol`-пропеллеры и турбины (`j_scout01`, `flieger01`, `j_powerplant01`).
- **Пункт 3 — `nnature` GPU-биллборды + `nMeshSway` + `nChannelServer`:**
  - Point-sprite `NVX1` (`numIndices == 0`: облака `wolke10`, листва `tree14`) рендерятся как настоящие камерно-ориентированные GPU-биллборды в `mesh_vs`.
  - Реализован `nChannelServer` (`/sys/servers/channel`: `windstrength`, `winddir`), управляющий гармоническим покачиванием деревьев `nMeshSway`.

### Этап 8 — Публикация в отдельной ветке GitHub и Модуль 12 (Аудио + UI)
- Порт и база реверс-инжиниринга вынесены в отдельную orphan-ветку [`macos-native-port`](https://github.com/proovcme/nomad-vagabond/tree/macos-native-port) репозитория `proovcme/nomad-vagabond` (коммит `d85ff68`, 662 чистых файла).
- **Модуль 12 (`native/core/naudio.hpp`, `ngameplay.hpp`, `nworld.hpp`, `main.mm`):**
  - Реализованы `nAudioServer2` / `nDSoundServer2` (`setmode`, `openaudio`, `closeaudio`, `setmastervolume`, `flushaudio`), `nSoundNode` (`setfile`, `setambient`, `setlooping`, `setvolume`, `setfreq`, `setminmaxdist`), `nAudio` (`setaudio`).
  - Добиты оставшиеся команды `nGuiBar` (`setleftpos`, `setmiddlepos`, `setmiddleoffset`, `setrightpos`, `setextension`), `nContainer::setvisualization`, `nTexArrayNode::settexture`, `nMeshNode::setfilename`, `nLinkNode::settarget`.
  - **Покрытие реальным C++ на полном прогоне Миссии 1 достигло `99.59%` (22 063 / 22 154, осталось 91 заглушка, макс. 4 вызова на команду).**

---

## Текущий статус и следующие подсистемы
- [x] Ядро Nebula Device 1 + `NPK0`/`NVX1`/`NTX1`/`NOB0`/`NAX0` + `Tcl.framework`
- [x] Полный дизассемблер и C++-лифтинг всех 11 DLL (454 класса, 8 314 методов)
- [x] Рендер-конвейер 1-в-1 (`ndirect3d8` 226 шейдеров, 4× MSAA, `nFogNode`, `weather_normal.n`, `nIpol`, GPU-биллборды `nCloudRender`/`nLeafRender`, `nMeshSway`)
- [x] Кампания, катсцены, физика героя, коллизии, боёвка, полёт самолётов и островов, радиальное меню, экономика, аудио-сервер (`99.59%` покрытия C++)
- [ ] **Модуль 13 (следующий):** `nGuiLoadSavePanel` (загрузка/сохранение слотов из меню) + 3D-рендер HUD-шкал `nGuiBar` и радиального колеса `nHouseMenu`
- [ ] **Модуль 14:** ИИ-эскадрильи, формации, `nBomber` / `nAirship3` / `nFactory` / `nGarage`
- [ ] **Модуль 15:** Сетевой стек `nnetwork.dll` (4 класса, 23 `AddCmd`)
