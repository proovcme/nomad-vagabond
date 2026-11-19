#!/usr/bin/env python3
"""Build an isolated static release; no credentials, QA pages or local artifacts."""
import hashlib, json, pathlib, shutil, subprocess, sys
root=pathlib.Path(__file__).resolve().parents[1]
subprocess.run(['node',str(root/'scripts/validate_artifacts.mjs')],cwd=root,check=True)
out=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else '/tmp/nomad-release')
if out.exists():
    raise SystemExit(f'Release directory already exists: {out}')
out.mkdir(parents=True)
for name in ['src','vendor','assets']:
    shutil.copytree(root/name,out/name,ignore=shutil.ignore_patterns('.DS_Store','character_candidates','coast_rocks_01','*.original.glb'))
shutil.copy2(root/'index.html',out/'index.html')
p=out/'src/main.js'
s=p.read_text().replace("if (urlParams.get('qa') === '1') {", "if (['localhost','127.0.0.1'].includes(location.hostname) && urlParams.get('qa') === '1') {")
p.write_text(s)
manifest={str(p.relative_to(out)):{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(out.rglob('*')) if p.is_file()}
(out/'release.json').write_text(json.dumps({'files':manifest},indent=2)+'\n')
print(json.dumps({'directory':str(out),'files':len(manifest),'bytes':sum(v['bytes'] for v in manifest.values())}))
