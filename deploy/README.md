# Nomad static release

Public URL: https://locia.work/nomad/
Runtime: static Babylon.js8.56.2; no game server, accounts or private APIs.

Build an isolated directory:

```sh
python3 scripts/build_release.py /tmp/nomad-release-NEXT
```

The build runs `node scripts/validate_artifacts.mjs`: fourteen checks covering world surface overlaps, rock intrusion into the hangar, GLB winding, mounted lights, powered mechanisms, construction, instruments, aircraft takeoff and bays, role contracts, explosion pools and pilot floor clearance. It stops on a failing check. No arbitrary geometry is automatically deleted. These checks do not prove artistic quality or absence of every camera-dependent artifact.

Upload the release into `/var/www/nomad/releases/<unique-id>/`, copy `deploy/nomad.caddy` to `/root/nomad-route.caddy` and `scripts/activate_release.py` to `/root/nomad-activate-release.py`, then run the activation script with the absolute release directory. It checks SHA-256 for every manifest file, saves the previous Caddy configuration under `/root/nomad-deploy-<UTC>/`, validates Caddy, atomically switches `current`, and reloads Caddy. Validation/reload failure restores the prior route and symlink.

Only index.html, src, vendor and runtime assets are packaged. Candidate characters, unused scanned coast-rock source, test pages, scripts, local reports and backups are excluded. QA checkpoints are restricted to localhost in the packaged main.js. Photo views remain available. Static resources revalidate through ETag/Last-Modified so updates do not leave stale ES modules.

Useful validation:

```sh
node scripts/validate_runtime.mjs
node scripts/validate_collisions.mjs --hangar
node scripts/validate_construction.mjs
node scripts/validate_surfaces.mjs --self-test
node scripts/validate_surfaces.mjs --with-glb
```

Performance probe: `?shot=arch_vagabond&hud=0&profile=1&quality=medium`. Body `data-profile` exposes rolling frame/CPU/GPU timings after warm-up. GPU timer availability depends on browser hardware. Measure at the same render resolution. Default medium uses a bounded local shadow map and painted sky; volumetric cloud integration and SSAO are reserved for high/ultra. The approved sky artwork and moons are present at every quality.

Current limitations: desktop keyboard/mouse controls; no touch flight controls. This is a playable development build, not an art-quality acceptance or a cross-device 60 FPS guarantee.
