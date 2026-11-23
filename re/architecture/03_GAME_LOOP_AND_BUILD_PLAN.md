# Project Nomads — Логика игры, главный цикл и поэтапный план сборки

## 1. Главный цикл игры (`nRealWorld::StartGame` → `Trigger`)

```text
nomads.exe (50 строк)
 └─► nKernelServer + nFileServer2 (NPK0) + nTclServer (Tcl 8.x)
      └─► scripts/demo.tcl
           ├─► scripts/nsh.tcl, commands.tcl, envinit.tcl, menuaction.tcl, menu2.tcl, scriptlib.tcl, alias.tcl
           ├─► create_servers / init_servers (gfx, sgraph, channel, input, audio, collide, anim, character, shadow)
           ├─► create_handlers / init_handlers (/world = nRealWorld, /game/handler/{data,book,event,cookie,feedback,search})
           ├─► scripts/input.tcl (привязка клавиш и мыши/тачпада)
           ├─► scripts/newmenu.tcl (построение всех меню в /world/gui/menus/*)
           └─► /world.startgame  ◄── 60 FPS игровой цикл:
                1. Input & GUI       (nInputServer, nGuiMenuHandler — если меню открыто, рендер меню)
                2. Time & Events     (nTimeServer, nTimer, nEventHandler, nBookHandler::Trigger)
                3. AI & CommandLists (nBehaviour, nCommandList, nTaskManager, nFighterManager, nSammlerManager)
                4. Physics & Engines (nPhysicsHandler → nMaennelWalk2 / nAirplane3 / nStationEngine3 / nFlakEngine2 / nMissileEngine3)
                5. Collisions        (nOpcodeServer + nCollHandler2 → nCollCheck2 / nWalkOverCheck → nCollHandle2)
                6. Gameplay Services (nPowerSupply, nConsumption, nFireWeapon, nBuild, nUseArtefact, nExplosion, nHeal)
                7. Camera & Audio    (nChaseViewer / nFreeViewer, nAudioServer2, nSubtitlePlayer)
                8. Animation         (nAnimServer + nCharacterServer: семплинг NAX0 → матрицы костей nJoint2 → скиннинг)
                9. Render (Metal)    (nSceneGraph2 + n3DNode + nMeshNode + nnature::nClouds + nParticle + nGuiBar + nGuiMenuHandler)
```

## 2. Как устроена каждая сущность в игре (Data-Driven FSM)

Каждый объект в `data.npk` (остров, башня, самолёт, герой, артефакт) описывается в своём `_main.n` тремя ветками:
- **`visual/`** — 3D-иерархия (`n3dnode`, `nflipflop` LOD, `nmeshnode` `.nvx`, `ntexarraynode` `.ntx`, `ncharacternode` + `njoint2` + `.nax`, `nipol`).
- **`vhcl/`** — конечный автомат (`nStateNode` / `nContainer` / `nStation` / `nHouse` / `nVehicle` / `nMaennel`). Внутри лежат состояния (`normal`, `walk`, `fly`, `build`, `explode`, `cinematic`), а в каждом состоянии — модули-сервисы (`nService`):
  - `nVisual`, `nAudio`, `nCollCheck2`, `nCollHandle2`, `nMoving`, `nStateWatch`, `nBehaviour`, `nFireWeapon`, `nBuild`, `nPowerSupply` и т.д.
  - Переключение состояния делается вызовом `.announcestate "<state>"` — и движок автоматически активирует сервисы нового состояния и деактивирует старые!
- **`audio/`** — звуковые узлы (`nsoundnode`) по состояниям.

## 3. Поэтапный план сборки полной нативной игры (`arm64` / Metal)

| Фаза | Подсистемы | Что получаем на экране |
|---|---|---|
| **Фаза 0 (Готово)** | `nKernelServer`, `nNpkFileServer`, `nTclServer`, `Metal 3D`, `nnature`, `nGuiMenuHandler`, `nRealWorld` (спавн `intro.n`) | Нативный `arm64` бинарник, оригинальное русское меню с шестерёнками, звук, загрузка всех 260 объектов Миссии 1, полёт с тачпада |
| **Фаза 1 — Анимации** | `NAX0` парсер (`CHDR`/`CDTV`/`CDTP`), иерархия костей `nJoint2` из `_main.n`, GPU/CPU-скиннинг по `0x8b`, `nIpol` | **Живые анимированные герои** (`boden_stehen` на экране выбора вместо T-позы!), крутящиеся пропеллеры, локаторы, анимации построек |
| **Фаза 2 — Герой и физика** | `nOpcodeServer` (треугольная коллизия по `collide.nvx`), `nMaennelWalk2`, `nJumpEngine`, `nChaseViewer` | Выбранный герой (Джон/Сьюзи/Голиаф) стоит на стартовом острове, бегает, прыгает, летает на ранце с живыми анимациями и камерой от 3-го лица |
| **Фаза 3 — Сюжет и кампания** | `nBookHandler`, `nEventHandler`, `nCookieHandler`, `nTimer`, `nSubtitlePlayer`, `story.tcl` | Полная скриптовая логика всех **35 частей кампании** (5 глав): кат-сцены, триггеры, русская озвучка, субтитры, цели миссий, сохранения |
| **Фаза 4 — Строительство и острова** | `nHouse`, `nBuild*`, `nPlaceHouse`, `nUseArtefact`, `nPowerSupply`, `nSilo`, `nIslandDrive`, `nGuiBar`, `nQuickSlotManager` | Подбор артефактов, инвентарь/пояс, строительство башен и фабрик, энергия, руда, управление полётом острова |
| **Фаза 5 — Бой, техника и ИИ** | `nAirplane3`, `nFlak`, `nFireWeapon`, `nMissile`, `nExplosion`, `nCommandList`, `nBehaviour`, `nCritter2` | Полёты на самолётах, стрельба из турелей и пушек, вражеские эскадрильи по готовым `/commandlists/*`, урон и взрывы |
| **Фаза 6 — Сборка `Project Nomads.app`** | 3D-звук (`CoreAudio`), частицы (`nParticle`), иконка, бандл `.app` | Самостоятельное нативное macOS-приложение |
