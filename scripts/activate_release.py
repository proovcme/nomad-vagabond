#!/usr/bin/env python3
"""Run on the VPS after uploading one complete Nomad release."""
import datetime, hashlib, json, pathlib, subprocess, sys
release=pathlib.Path(sys.argv[1]).resolve()
base=pathlib.Path('/var/www/nomad')
if release.parent != base/'releases':
    raise SystemExit('Unexpected release directory')
manifest=json.loads((release/'release.json').read_text())['files']
for name,record in manifest.items():
    p=release/name
    if hashlib.sha256(p.read_bytes()).hexdigest()!=record['sha256']:
        raise SystemExit(f'Hash mismatch: {name}')
config=pathlib.Path('/etc/caddy/Caddyfile')
original=config.read_text()
anchor='\timport /etc/caddy/korovan.conf\n'
include='\timport /etc/caddy/nomad.conf\n'
if include not in original and original.count(anchor)!=1:
    raise SystemExit('Caddy import anchor is ambiguous')
stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
backup=pathlib.Path('/root')/f'nomad-deploy-{stamp}'
backup.mkdir()
(backup/'Caddyfile.before').write_text(original)
current=base/'current'
previous=str(current.resolve()) if current.exists() else None
(backup/'previous-release.txt').write_text(previous or '(first release)')
fragment=pathlib.Path('/etc/caddy/nomad.conf')
if fragment.exists(): (backup/'nomad.conf.before').write_bytes(fragment.read_bytes())
route_source=pathlib.Path('/root/nomad-route.caddy').read_bytes()
pending=base/'current.next'
switched=False
reload_attempted=False

def restore_routes():
    config.write_text(original)
    saved=backup/'nomad.conf.before'
    if saved.exists(): fragment.write_bytes(saved.read_bytes())
    elif fragment.exists(): fragment.unlink()

try:
    fragment.write_bytes(route_source)
    config.write_text(original if include in original else original.replace(anchor,anchor+include))
    subprocess.run(['caddy','validate','--config',str(config),'--adapter','caddyfile'],check=True)
    # A stopped earlier attempt may leave only this temporary symlink behind.
    # Never remove a real directory or ordinary file at the expected link path.
    if pending.is_symlink(): pending.unlink()
    elif pending.exists(): raise RuntimeError('current.next is not a symlink')
    pending.symlink_to(release)
    pending.replace(current)
    switched=True
    reload_attempted=True
    subprocess.run(['systemctl','reload','caddy'],check=True)
except Exception:
    restore_routes()
    if pending.is_symlink(): pending.unlink()
    if switched:
        if previous:
            pending.symlink_to(previous)
            pending.replace(current)
        elif current.is_symlink():
            current.unlink()
    if reload_attempted:
        # Restore the previously running route if Caddy accepted any part of a
        # failed reload. Preserve the original exception if recovery also fails.
        try: subprocess.run(['systemctl','reload','caddy'],check=False)
        except OSError: pass
    raise
print(json.dumps({'release':str(release),'verifiedFiles':len(manifest),'backup':str(backup),'previous':previous}))
