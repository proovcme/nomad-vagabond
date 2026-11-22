"""Local content workbench. Serve the game and allow revision-checked saves of one data file."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "src/content/passage.js"
LOCK = threading.Lock()

def revision(raw):
    return hashlib.sha256(raw).hexdigest()

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def respond(self, code, value, kind="text/plain; charset=utf-8"):
        body = value.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", kind)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if urlsplit(self.path).path != "/_workshop/production":
            return super().do_GET()
        raw = CONTENT.read_bytes()
        doc = json.loads(raw.decode().removeprefix("export default ").strip().removesuffix(";"))
        self.respond(200, json.dumps({"doc":doc,"revision":revision(raw)},ensure_ascii=False), "application/json")

    def do_PUT(self):
        if self.path != "/_workshop/production":
            return self.respond(404,"Неизвестный документ")
        port = self.server.server_port
        host = self.headers.get("Host","")
        if host not in (f"localhost:{port}",f"127.0.0.1:{port}") or self.headers.get("Origin") != "http://"+host:
            return self.respond(403,"Запись доступна из локальной мастерской")
        try:
            size = int(self.headers.get("Content-Length", 0))
            if not 0 < size <= 2_000_000:
                return self.respond(413,"Предел документа — 2 МБ")
            raw = self.rfile.read(size)
            doc = json.loads(raw)
            result = subprocess.run(["node",str(ROOT/"workshop/check.mjs"),"--stdin"],input=raw,capture_output=True,timeout=10)
            if result.returncode:
                return self.respond(422,result.stderr.decode()[:2000])
            content = ("export default "+json.dumps(doc,ensure_ascii=False,indent=2,allow_nan=False)+";\n").encode()
            with LOCK:
                if self.headers.get("If-Match") != revision(CONTENT.read_bytes()):
                    return self.respond(409,"Проект изменился в другой вкладке. Скачайте черновик и откройте свежую версию.")
                with tempfile.NamedTemporaryFile(dir=CONTENT.parent,delete=False) as tmp:
                    tmp.write(content)
                os.replace(tmp.name,CONTENT)
            return self.respond(200,json.dumps({"revision":revision(content)}),"application/json")
        except (ValueError, OSError, subprocess.TimeoutExpired) as exc:
            return self.respond(400,str(exc))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port",type=int,default=5191)
    server = ThreadingHTTPServer(("127.0.0.1",parser.parse_args().port),Handler)
    print(f"http://127.0.0.1:{server.server_port}/workshop/",flush=True)
    server.serve_forever()
