# Project Nomads — Карта подсистем и всех 169 проприетарных классов

## 1. Core World & Campaign Orchestration (11 классов, 155 скриптовых команд)

| Класс | DLL | Родитель | `sizeof` | `AddCmd` | C++ экспорты |
|---|---|---|---:|---:|---:|
| `nbookhandler` | `nnomads` | `nroot` | 248 | 10 | 0 |
| `ncinedummy` | `nnomads` | `ncontainer` | 3768 | 1 | 0 |
| `ncookiehandler` | `nnomads` | `nroot` | 84 | 6 | 0 |
| `nDataHandler` | `nnomads` | `nroot` | 192 | 7 | 26 |
| `neventhandler` | `nnomads` | `nroot` | 128 | 6 | 0 |
| `nfeedbackhandler` | `nnomads` | `nroot` | 1616 | 13 | 0 |
| `nRealWorld` | `nnomads` | `nroot` | 1576 | 92 | 190 |
| `nsearchhandler` | `nnomads` | `nroot` | 236 | 11 | 0 |
| `nsession` | `nnomads` | `nroot` | 96 | 3 | 0 |
| `nstoresavepos` | `nnomads` | `nservice` | 88 | 0 | 0 |
| `nuser` | `nnomads` | `nroot` | 96 | 6 | 0 |

## 2. Entity Framework & State Machine (18 классов, 241 скриптовых команд)

| Класс | DLL | Родитель | `sizeof` | `AddCmd` | C++ экспорты |
|---|---|---|---:|---:|---:|
| `naudio` | `nnomads` | `nservice` | 112 | 2 | 0 |
| `ncharaudio` | `nnomads` | `naudio` | 132 | 9 | 0 |
| `nclan` | `nnomads` | `nstatenode` | 5408 | 38 | 0 |
| `nContainer` | `nnomads` | `nstatenode` | 3760 | 120 | 293 |
| `ndebris` | `nnomads` | `ncontainer` | 3760 | 0 | 0 |
| `ndistancechecker` | `nnomads` | `nservice` | 92 | 0 | 0 |
| `nmodartefact` | `nnomads` | `ncontainer` | 3776 | 6 | 0 |
| `nnavpoint` | `nnomads` | `ncontainer` | 3800 | 5 | 0 |
| `nore` | `nnomads` | `ncontainer` | 3768 | 4 | 0 |
| `nservice` | `nnomads` | `nroot` | 88 | 0 | 0 |
| `nservicedata` | `nnomads` | `nroot` | 68 | 0 | 0 |
| `nspawn` | `nnomads` | `nservice` | 88 | 0 | 0 |
| `nspawnpoint` | `nnomads` | `ncontainer` | 3768 | 4 | 0 |
| `nStateNode` | `nnomads` | `nnetnode` | 528 | 33 | 88 |
| `nstatewatch` | `nnomads` | `nservice` | 144 | 12 | 0 |
| `ntimer` | `nnomads` | `nservice` | 88 | 0 | 0 |
| `ntriggerobject` | `nnomads` | `ncontainer` | 3784 | 2 | 0 |
| `nvisual` | `nnomads` | `nservice` | 144 | 6 | 0 |

## 3. Physics, Movement & Vehicle Engines (25 классов, 167 скриптовых команд)

| Класс | DLL | Родитель | `sizeof` | `AddCmd` | C++ экспорты |
|---|---|---|---:|---:|---:|
| `nairplane3` | `nnomads` | `nengine3` | 168 | 20 | 0 |
| `nairship3` | `nnomads` | `nengine3` | 160 | 18 | 0 |
| `navoidcollision` | `nnomads` | `nservice` | 108 | 8 | 0 |
| `nbuoyancy` | `nnomads` | `nservice` | 128 | 20 | 0 |
| `ncritterengine` | `nnomads` | `nservice` | 284 | 4 | 0 |
| `ncritterengine2` | `nnomads` | `nengine3` | 100 | 2 | 0 |
| `nengine2` | `nnomads` | `nservice` | 164 | 8 | 0 |
| `nengine3` | `nnomads` | `nservice` | 92 | 0 | 0 |
| `nflakengine2` | `nnomads` | `nengine2` | 184 | 8 | 0 |
| `nflakmoving` | `nnomads` | `nmoving` | 96 | 0 | 0 |
| `ninterpolate` | `nnomads` | `nservice` | 104 | 5 | 0 |
| `nipolapproachgarage` | `nnomads` | `ninterpolate` | 104 | 0 | 0 |
| `njumpengine` | `nnomads` | `nservice` | 88 | 0 | 0 |
| `nmaennelengine3` | `nnomads` | `nairplane3` | 172 | 2 | 0 |
| `nmaennelwalk2` | `nnomads` | `nengine2` | 184 | 12 | 0 |
| `nmissileengine2` | `nnomads` | `nengine2` | 164 | 10 | 0 |
| `nmissileengine3` | `nnomads` | `nservice` | 104 | 8 | 0 |
| `nmoving` | `nnomads` | `nservice` | 96 | 4 | 0 |
| `nphysics` | `nnomads` | `nservice` | 92 | 6 | 0 |
| `nphysicshandler` | `nnomads` | `nroot` | 92 | 4 | 0 |
| `nsimpleengine2` | `nnomads` | `nengine2` | 164 | 12 | 0 |
| `nstationengine` | `nnomads` | `nengine2` | 164 | 0 | 0 |
| `nstationengine3` | `nnomads` | `nservice` | 92 | 2 | 0 |
| `nswimmingengine` | `nnomads` | `nengine3` | 128 | 12 | 0 |
| `nswingengine` | `nnomads` | `nservice` | 92 | 2 | 0 |

## 4. Collision & Damage (13 классов, 34 скриптовых команд)

| Класс | DLL | Родитель | `sizeof` | `AddCmd` | C++ экспорты |
|---|---|---|---:|---:|---:|
| `ncollcheck2` | `nnomads` | `nservice` | 156 | 6 | 0 |
| `ncollhandle2` | `nnomads` | `nservice` | 96 | 6 | 0 |
| `ncollhandler2` | `nnomads` | `nroot` | 20608 | 2 | 0 |
| `ncollidedata` | `nnomads` | `nservicedata` | 104 | 0 | 0 |
| `ncrittercollhandle` | `nnomads` | `ncollhandle2` | 116 | 3 | 0 |
| `ncritterdamage` | `nnomads` | `nservice` | 112 | 2 | 0 |
| `nmissilecollcheck` | `nnomads` | `nservice` | 144 | 2 | 0 |
| `nmissilecollhandle` | `nnomads` | `nservice` | 88 | 0 | 0 |
| `nmnlcollhandle2` | `nnomads` | `ncollhandle2` | 200 | 5 | 0 |
| `nstationcollhandle2` | `nnomads` | `ncollhandle2` | 100 | 0 | 0 |
| `nwalkcollhandle2` | `nnomads` | `nmnlcollhandle2` | 220 | 8 | 0 |
| `nwalkovercheck` | `nnomads` | `ncollcheck2` | 156 | 0 | 0 |
| `nwalkoverhandle` | `nnomads` | `ncollhandle2` | 96 | 0 | 0 |

## 5. Gameplay: Islands, Buildings, Artifacts & Economy (24 классов, 109 скриптовых команд)

| Класс | DLL | Родитель | `sizeof` | `AddCmd` | C++ экспорты |
|---|---|---|---:|---:|---:|
| `nartefactstorage` | `nnomads` | `nhouse` | 3920 | 8 | 0 |
| `nartefacttransformer` | `nnomads` | `nhouse` | 3944 | 6 | 0 |
| `nbuild` | `nnomads` | `nservice` | 148 | 14 | 0 |
| `nbuildartefact` | `nnomads` | `nbuild` | 148 | 0 | 0 |
| `nbuildflak` | `nnomads` | `nbuild` | 148 | 0 | 0 |
| `nbuildtradeartefact` | `nnomads` | `nbuildartefact` | 148 | 0 | 0 |
| `nbuildvehicle` | `nnomads` | `nbuild` | 148 | 0 | 0 |
| `ncollectartefact` | `nnomads` | `nservice` | 96 | 2 | 0 |
| `ncollectore` | `nnomads` | `nsquadronwatchtarget` | 104 | 2 | 0 |
| `nconsumption` | `nnomads` | `nservice` | 92 | 2 | 0 |
| `nenergycollector` | `nnomads` | `nservice` | 96 | 2 | 0 |
| `nfactory` | `nnomads` | `nhouse` | 3912 | 12 | 0 |
| `ngarage` | `nnomads` | `nfactory` | 3944 | 15 | 0 |
| `nHouse` | `nnomads` | `ncontainer` | 3888 | 19 | 56 |
| `nislanddrive` | `nnomads` | `nhouse` | 3912 | 1 | 0 |
| `npawnshop` | `nnomads` | `nfactory` | 3928 | 11 | 0 |
| `nplacehouse` | `nnomads` | `nuseartefact` | 92 | 2 | 0 |
| `npowersupply` | `nnomads` | `nservice` | 92 | 2 | 0 |
| `nreplenish` | `nnomads` | `nservice` | 100 | 4 | 0 |
| `nsilo` | `nnomads` | `nservice` | 92 | 2 | 0 |
| `nstation` | `nnomads` | `ncontainer` | 3984 | 3 | 0 |
| `nunloadore` | `nnomads` | `nbehaviour` | 92 | 2 | 0 |
| `nuseartefact` | `nnomads` | `nservice` | 88 | 0 | 0 |
| `nwatchusingartefact` | `nnomads` | `nservice` | 88 | 0 | 0 |

## 6. Gameplay: Units, Combat, Weapons & Spells (22 классов, 280 скриптовых команд)

| Класс | DLL | Родитель | `sizeof` | `AddCmd` | C++ экспорты |
|---|---|---|---:|---:|---:|
| `nattack` | `nnomads` | `nsquadronwatchtarget` | 120 | 8 | 0 |
| `nautonom` | `nnomads` | `ncontainer` | 4408 | 53 | 0 |
| `nbombard` | `nnomads` | `nsquadronwatchtarget` | 104 | 2 | 0 |
| `nbomber` | `nnomads` | `nvehicle` | 4712 | 2 | 0 |
| `ncritter` | `nnomads` | `ncontainer` | 3784 | 2 | 0 |
| `ncritter2` | `nnomads` | `nvehicle` | 4776 | 1 | 0 |
| `nenergyeffect` | `nnomads` | `nservice` | 104 | 6 | 0 |
| `nexplosion` | `nnomads` | `nenergyeffect` | 212 | 7 | 0 |
| `nfiremachinegun` | `nnomads` | `nfireweapon` | 184 | 18 | 0 |
| `nfiremissile` | `nnomads` | `nfireweapon` | 712 | 16 | 0 |
| `nfireweapon` | `nnomads` | `nservice` | 88 | 0 | 0 |
| `nflak` | `nnomads` | `nvehicle` | 4720 | 8 | 0 |
| `nheal` | `nnomads` | `nenergyeffect` | 104 | 0 | 0 |
| `nmaennel` | `nnomads` | `nvehicle` | 5352 | 78 | 0 |
| `nmgrender` | `nnomads` | `nanimnode` | 468 | 16 | 0 |
| `nmissile` | `nnomads` | `nautonom` | 4416 | 2 | 0 |
| `nplacespellaction` | `nnomads` | `nuseartefact` | 112 | 10 | 0 |
| `nsammler` | `nnomads` | `nvehicle` | 4704 | 7 | 0 |
| `nsimplespell` | `nnomads` | `nuseartefact` | 92 | 2 | 0 |
| `nskritattack` | `nnomads` | `nservice` | 140 | 12 | 0 |
| `nvehicle` | `nnomads` | `nautonom` | 4696 | 23 | 0 |
| `nvehicleemitter` | `nnomads` | `nservice` | 136 | 7 | 0 |

## 7. AI, Steering & Command Lists (12 классов, 21 скриптовых команд)

| Класс | DLL | Родитель | `sizeof` | `AddCmd` | C++ экспорты |
|---|---|---|---:|---:|---:|
| `nbehaviour` | `nnomads` | `nservice` | 88 | 0 | 0 |
| `ncommandlist` | `nnomads` | `nroot` | 112 | 0 | 0 |
| `nfightermanager` | `nnomads` | `ntaskmanager` | 3164 | 0 | 0 |
| `nfreesteer` | `nnomads` | `nsteer` | 116 | 0 | 0 |
| `nnavpointsteer` | `nnomads` | `nsteer` | 116 | 0 | 0 |
| `nsammlermanager` | `nnomads` | `ntaskmanager` | 1628 | 0 | 0 |
| `nskritmanager` | `nnomads` | `nservice` | 88 | 0 | 0 |
| `nsquadronwatchtarget` | `nnomads` | `nwatchtarget` | 100 | 4 | 0 |
| `nsteer` | `nnomads` | `nservice` | 116 | 14 | 0 |
| `ntaskmanager` | `nnomads` | `nservice` | 1628 | 0 | 0 |
| `ntestpossess` | `nnomads` | `nservice` | 104 | 2 | 0 |
| `nwatchtarget` | `nnomads` | `nservice` | 92 | 1 | 0 |

## 8. Camera, Cinematics & Subtitles (11 классов, 29 скриптовых команд)

| Класс | DLL | Родитель | `sizeof` | `AddCmd` | C++ экспорты |
|---|---|---|---:|---:|---:|
| `nAnimSequence` | `nnomads` | `nroot` | 816 | 16 | 28 |
| `ncharcinematicplayer` | `nnomads` | `ncinematicplayer` | 88 | 0 | 0 |
| `nchaseviewer` | `nnomads` | `nviewer2` | 1192 | 0 | 0 |
| `ncinematicplayer` | `nnomads` | `nservice` | 88 | 0 | 0 |
| `nfreeviewer` | `nnomads` | `nviewer2` | 448 | 1 | 0 |
| `nsubtitle` | `nnomads` | `ncontainer` | 4824 | 6 | 0 |
| `nsubtitleaudio` | `nnomads` | `naudio` | 112 | 0 | 0 |
| `nsubtitleplayer` | `nnomads` | `ncinematicplayer` | 88 | 0 | 0 |
| `nsubtitlevisual` | `nnomads` | `nvisual` | 144 | 0 | 0 |
| `nviewer2` | `nnomads` | `nroot` | 172 | 0 | 0 |
| `nviewerdata` | `nnomads` | `nservice` | 104 | 6 | 0 |

## 9. GUI, Menus, HUD & Quickslots (19 классов, 114 скриптовых команд)

| Класс | DLL | Родитель | `sizeof` | `AddCmd` | C++ экспорты |
|---|---|---|---:|---:|---:|
| `nGuiBar` | `nnomads` | `nroot` | 428 | 39 | 49 |
| `nguicharacterentry` | `nnomads` | `nguistandardmenuentry` | 264 | 4 | 0 |
| `nguiloadsaveentry` | `nnomads` | `nguistandardmenuentry` | 244 | 0 | 0 |
| `nguiloadsavepanel` | `nnomads` | `nguipanel` | 400 | 4 | 0 |
| `nguimenu` | `nnomads` | `nroot` | 240 | 18 | 0 |
| `nGuiMenuEntry` | `nnomads` | `nroot` | 208 | 7 | 22 |
| `nGuiMenuHandler` | `nnomads` | `nroot` | 408 | 19 | 36 |
| `nguipanel` | `nnomads` | `nguimenu` | 328 | 11 | 0 |
| `nguisessionentry` | `nnomads` | `nguistandardmenuentry` | 220 | 0 | 0 |
| `nguisessionspanel` | `nnomads` | `nguipanel` | 328 | 0 | 0 |
| `nguistandardmenu` | `nnomads` | `nguimenu` | 240 | 0 | 0 |
| `nGuiStandardMenuEntry` | `nnomads` | `nguimenuentry` | 216 | 4 | 13 |
| `nhousemenu` | `nnomads` | `nmenu` | 104 | 0 | 0 |
| `nmenu` | `nnomads` | `nservice` | 104 | 8 | 0 |
| `nquickslotmanager` | `nnomads` | `nservice` | 88 | 0 | 0 |
| `nstandardmenu` | `nnomads` | `nmenu` | 104 | 0 | 0 |
| `nstoragemenu` | `nnomads` | `nmenu` | 104 | 0 | 0 |
| `ntrademenu` | `nnomads` | `nmenu` | 104 | 0 | 0 |
| `ntransformmenu` | `nnomads` | `nmenu` | 104 | 0 | 0 |

## 10. Weather & Nature (nnature.dll) (10 классов, 75 скриптовых команд)

| Класс | DLL | Родитель | `sizeof` | `AddCmd` | C++ экспорты |
|---|---|---|---:|---:|---:|
| `nCloudDesc` | `nnature` | `nvisnode` | 288 | 24 | 37 |
| `ncloudrender` | `nnature` | `nanimnode` | 1440 | 14 | 0 |
| `nClouds` | `nnature` | `nvisnode` | 340 | 7 | 50 |
| `ngrassrender` | `nnature` | `nanimnode` | 376 | 8 | 0 |
| `ngroundplane` | `nnature` | `nvisnode` | 204 | 0 | 0 |
| `nleafrender` | `nnature` | `nanimnode` | 372 | 6 | 0 |
| `nmeshsway` | `nnature` | `nanimnode` | 288 | 10 | 0 |
| `nweather` | `nnomads` | `nservice` | 112 | 0 | 0 |
| `nWeatherDesc` | `nnomads` | `ncontainer` | 3784 | 6 | 21 |
| `nweatherhandler` | `nnomads` | `nroot` | 648 | 0 | 0 |

## 11. Networking (nnetwork.dll) (4 классов, 23 скриптовых команд)

| Класс | DLL | Родитель | `sizeof` | `AddCmd` | C++ экспорты |
|---|---|---|---:|---:|---:|
| `nCommServer` | `nnetwork` | `nroot` | 304 | 21 | 54 |
| `nNetNode` | `nnetwork` | `nroot` | 80 | 2 | 15 |
| `nNetwork2` | `nnetwork` | `nroot` | None | 0 | 59 |
| `nsocket2` | `nnetwork` | `nnetwork2` | 336 | 0 | 0 |
