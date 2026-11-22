# Бродяга

Browser prototype of a free interpretation of Project Nomads: floating islands, propeller aircraft, a cave hangar and a mobile island base. Babylon.js 7.32, local ES modules and local GLBs; no build step.

## Run

```sh
python3 scripts/dev_server.py
```

Open http://127.0.0.1:5188/ . The development server disables stale module caching.

## Mission 01 — Свой дом в небе

Damaged cargo aircraft → learn throttle/course/altitude → land at the cave hangar → emergency power → upper deck by lift or stairs → generator → air defense → fighter interception (one scout then two escorts) → return → radar → island helm → reach the safe sector and brake.

Lessons advance from actions, resources, construction and actual kills. Navigation uses the compass and radio, without world-space rings.

- Aircraft: W/S throttle/brake, A/D yaw, arrows up/down pitch, Q/R roll, Shift boost. Space/left mouse guns, F/right mouse secondary weapon. E landing assistance near the runway; G exit when parked.
- Deck: WASD walk, drag left mouse or use arrows to look. E interact. B construction after emergency power. E at the lift travels between decks; the side staircase is also walkable.
- Island helm: E at console, W thrust, A/D course, S brake, Space/C altitude, G return to the deck.
- Esc pause, M chart, F1 controls.

Construction has three sockets and one of each type in the first mission: generator30 scrap/4 power; turret35 scrap/2 power; radar25 scrap/1 power. Starting80 pays for generator+turret; each destroyed enemy yields20 scrap. Generator repairs island integrity, turret assists but cannot finish a target for the player, radar unlocks the safe route.

## World generation

`src/islandGenerator.js` generates seeded forest/industrial cap and keel geometry with a shared closed edge, an analytic matching height field and material blending. Each island is8960 triangles and two terrain draws. Main base uses a unified SDF rock shell with a cave and stair channel (`src/rockShell.js`), about29k triangles, generated in~0.12s in the measured local Node run.

Rock materials use a shared generated painted albedo and triplanar projection at a fixed metre scale. Lighting uses a local prefiltered HDR environment, neutral tone mapping and a single gamma path. Clouds use an atmosphere shader rather than sphere stacks; damaged-engine smoke uses soft alpha billboards.

## Checks

```sh
node scripts/validate_runtime.mjs
node scripts/validate_island_generator.mjs
node scripts/validate_collisions.mjs --hangar
python3 scripts/repair_building_surfaces.py --report artifacts/first-pass/models/final-surface-audit.json
```

`?qa=1` exposes development checkpoints. They set up test situations; they are not evidence of an uninterrupted first-mission playthrough. `?metrics=1` writes sampled canvas metrics to the body's DOM dataset. Neither appears on the normal route.

Fixed camera views: `?shot=arch_vagabond`, `arch_forest`, `arch_industrial`, `arch_panorama`, `arch_flight`, `arch_shipyard`.

This remains a prototype: desktop keyboard/mouse controls, no touch flight controls, no save system, preliminary mission pacing and audio. Dense imported vegetation and shadow passes still require a measured performance pass before release.

## Art direction pass

The shared style is painted golden sandstone, olive/yellow-green meadow tops, blue atmosphere and cool distance. `archipelagoLandmarks.js` adds the split abandoned shipyard beside the first route (broken bridge, tilted tower, wreck, wind pennant and swinging hook). `skyLife.js` adds sparse autumn leaves and distant birds. These scenery cues add no navigation rings or extra mission requirements.

### Небо и материалы
Рисованные облачные течения, расколотая луна с обломками, тёплая подсветка ангара и последовательные огни полосы. Общие текстуры стали, палубы и ткани находятся в `assets/textures/nomad/`.
Просмотр: `?shot=arch_sky&hud=0`, `?shot=arch_hangar&hud=0`.

### Строительство и проверки
B открывает вид сверху. ЛКМ выбирает свободное место на палубе; повторный ЛКМ, Enter или кнопка подтверждают установку. Зелёный силуэт разрешает строительство, красный объясняет причину запрета. 1–3 выбирают рекомендуемые места, Esc возвращает камеру.

Перед упаковкой автоматически проверяются пересекающиеся поверхности мира и моделей зданий. Команда вручную: `node scripts/validate_surfaces.mjs --with-glb`. Документация публикации: `deploy/README.md`.


### Four-aircraft hangar
The menu’s «Ангар · свободный вылет» starts in the powered hangar with all four original aircraft. Walk to a plane and press E; the ground crew moves it onto the runway. W accelerates, Up/Space rotates, S brakes. Each variant has its own acceleration, rotation/liftoff speeds, mass and turn response. Cargo: hover and hold F to winch three crates, then land at home. Fighter: intercept two scouts. Attacker: destroy two flak positions. Bomber: bomb two fuel depots with F. The first tutorial mission remains a separate menu entry.

The period airframes use the original GLBs with fitted canopy frames, variant-specific propeller spinners and period liveries. The original four pin-up designs in `assets/textures/nomad/squadron-nose-art.webp` were generated for this project and normalized into one alpha atlas. Preview with `?shot=arch_airframe&airframe=fighter&hud=0` or use `cargo`, `attacker` and `bomber`.

Pre-release artifact gate: `node scripts/validate_artifacts.mjs`. Packaging runs it automatically.


### Babylon 8 and static lighting
Engine and glTF loader are self-hosted, pinned to Babylon.js8.56.2; provenance and checksums: `vendor/babylon-version.json`. No engine CDN request. Native procedural mesh indices use Babylon clockwise front faces with outward physical normals. The generated terrain/top and cave shell now follow the same convention as the engine’s built-in meshes.

`node scripts/bake_static_lighting.mjs` traces24 cosine-weighted visibility rays and5 sun-disc rays at sampled vertices. Large walls/decks are subdivided at3m spacing without changing their shape. The offline cache covers27 static terrain/rock/architecture meshes of the shipped seed. PBR reads independent vertex irradiance and visibility attributes; repeated albedo UVs do not carry baked lighting. Moving carrier sunlight and aircraft remain dynamically lit. New procedural seeds compute missing vertex bakes in7ms work slices while loading. The cache is checked against all static occluder geometry before release. This is bounded diffuse occlusion, one-bounce colour transfer and static sun visibility, not full-scene path-traced GI; foliage, moving aircraft and newly constructed objects still rely on live lights/shadows.

### Мастерская игры

Запуск из корня проекта: `npm run workshop`. Адрес: <http://127.0.0.1:5191/workshop/>. Для предпросмотра нужны WebGL и современный настольный браузер. Сервер слушает только локальную машину.

- **Модели и материалы.** Начните с катера, моноплана или острова. Редактируйте детали, размеры, сечения и покрытие. Сохраняйте исходники как `.nomad.json` в `workshop/projects/`. Экспорт GLB включает текстуры. Игровые GLB лежат в `assets/`, идентификаторы загрузчика — в `src/engine/assetManager.js`.
- **Сценарий, сюжет, персонажи и радио.** В первой миссии точки заданы относительно корпуса крейсера. У точки можно выбрать реплику. Для новой озвучки положите MP3 в `assets/audio/fog-passage/`. Радио с изменённым текстом остаётся с субтитрами до синхронизации записи.
- **Ролики и эффекты.** Предпросмотр использует ту же функцию камеры и те же эффекты взрывов, что и игра. Можно переставить планы, поменять якорь, координаты, длительность и поле зрения, просмотреть по времени и записать видео WebM. Модели в окне превиза показываются в постановочной сцене. Кнопка «В игру» открывает игровой свет, окружение и полёт.
- **Сохранение.** «Записать в проект» обновляет `src/content/passage.js` после проверки связей и наличия записей. Игра читает этот файл при следующем открытии. Конфликт двух редакторов предлагает сохранить отдельный черновик. Новые главы в разделе «Сюжет» — рабочие записи; самостоятельные игровые механики реализуются в коде уровня.
- **Атлас интербеллума.** Каталог и тексты находятся в `src/content/references.js`. Игрок открывает книгу из меню и паузы. В мастерской у каждой записи есть отдельная заметка для художника или сценариста. Фото ZR-3 и радиотелетайпа — Library of Congress, National Photo Company Collection, LC-DIG-ppmsca-40794 и LC-USZ62-42074, «No known restrictions on publication». Остальные карточки ведут к каталогам учреждений и издателя.
- **Проверки.** `npm run workshop:check` проверяет связи, аудиофайлы, допустимые параметры сцен и заполнение атласа. Эта проверка входит в сборку игры. Инструменты разработки в публичную игровую сборку не копируются.

Экспортёр GLB мастерской — официальный `babylonjs-serializers` 8.56.2, Apache-2.0 (см. `vendor/BABYLON-LICENSE.txt`).

Для воспроизводимой сборки отдельной модели установите зависимости проекта (`npm install` и `npx playwright install chromium`). Команда `npm run asset:build -- workshop/projects/harbor-launch.nomad.json harbor-launch` создаёт GLB, исходник и PNG вида из мастерской и повторно открывает GLB загрузчиком Babylon. Модель доступна уровням как `workshop/harbor-launch` через обычный `AssetManager`. Для нового изделия используйте собственный ID; повторная сборка обновляет файлы этого ID.

Браузерная проверка открытой мастерской: `npm run workshop:smoke`. Она записывает WebM, проверяет анимации персонажа, сборку модели и возврат из атласа в игру.
