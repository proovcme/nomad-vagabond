#!/usr/bin/env python3
"""
Full PE32 + objdump annotated disassembler for Project Nomads DLLs.
Produces per-class .asm files with:
  - Demangled MSVC C++ class/method names (Exports + Vftables)
  - Resolved IAT calls (e.g. nnebula.dll, nkernel.dll, msvcrt.dll)
  - Inline IEEE-754 float/double constants from .rdata
  - Inline C-string literals from .rdata
"""
import os
import re
import struct
import subprocess
import sys
from collections import defaultdict

RUN_BIN = "/Users/ovc/Downloads/Проект «Бродяги»/extracted/Run/bin/win32"
OUT_ROOT = "/Users/ovc/Downloads/Проект «Бродяги»/re/disasm"
DLLS = [
    "nnomads.dll",
    "nnature.dll",
    "nnetwork.dll",
    "nnebula.dll",
    "ndirect3d8.dll",
    "ncollide.dll",
    "nopcode.dll",
    "nparticle.dll",
    "nkernel.dll",
    "ndsound.dll",
    "ndinput8.dll",
    "launchclient.exe",
    "launchhost.exe",
]


def demangle_msvc_short(sym: str):
    """Return (class_name, method_name, readable_label) from an MSVC decorated name."""
    if not sym.startswith("?"):
        return ("_global", sym, sym)
    s = sym[1:]
    # Special names: ??0 (ctor), ??1 (dtor), ??_7 (vftable), ??_G (scalar deleting dtor), ??4 (operator=)
    if s.startswith("?0"):
        rest = s[2:]
        cls = rest.split("@@")[0]
        return (cls, cls + "::ctor", f"{cls}::{cls}()")
    if s.startswith("?1"):
        rest = s[2:]
        cls = rest.split("@@")[0]
        return (cls, cls + "::dtor", f"{cls}::~{cls}()")
    if s.startswith("?_7"):
        rest = s[3:]
        cls = rest.split("@@")[0]
        return (cls, "vftable", f"{cls}::`vftable'")
    if s.startswith("?_G"):
        rest = s[3:]
        cls = rest.split("@@")[0]
        return (cls, "scalar_dtor", f"{cls}::`scalar deleting destructor'")
    if s.startswith("?4"):
        rest = s[2:]
        cls = rest.split("@@")[0]
        return (cls, "operator=", f"{cls}::operator=")
    if s.startswith("?"):
        parts = s.split("@@")[0].split("@")
        cls = parts[1] if len(parts) > 1 and parts[1] else "_global"
        return (cls, parts[0], sym)

    parts = s.split("@@")[0].split("@")
    if len(parts) >= 2 and parts[1]:
        method = parts[0]
        cls = parts[1]
        return (cls, method, f"{cls}::{method}")
    return ("_global", parts[0], parts[0])


class PEImage:
    def __init__(self, path: str):
        self.path = path
        with open(path, "rb") as f:
            self.data = f.read()
        pe_off = struct.unpack_from("<I", self.data, 0x3C)[0]
        assert self.data[pe_off:pe_off + 4] == b"PE\x00\x00"
        self.num_sections = struct.unpack_from("<H", self.data, pe_off + 6)[0]
        opt_size = struct.unpack_from("<H", self.data, pe_off + 20)[0]
        opt_off = pe_off + 24
        self.image_base = struct.unpack_from("<I", self.data, opt_off + 28)[0]

        # Data directories
        dd_off = opt_off + 96
        self.export_rva, self.export_sz = struct.unpack_from("<II", self.data, dd_off)
        self.import_rva, self.import_sz = struct.unpack_from("<II", self.data, dd_off + 8)

        # Sections
        sec_off = opt_off + opt_size
        self.sections = []
        for i in range(self.num_sections):
            o = sec_off + i * 40
            name = self.data[o:o + 8].rstrip(b"\x00").decode("latin1", errors="ignore")
            vsize, vrva, rsize, roff = struct.unpack_from("<IIII", self.data, o + 8)
            chars = struct.unpack_from("<I", self.data, o + 36)[0]
            self.sections.append((name, vrva, max(vsize, rsize), roff, rsize, chars))

        self.exports_by_va = {}      # va -> (cls, method, label, raw_sym)
        self.vftables = {}           # va -> cls
        self.iat_by_va = {}          # iat_va -> "dll!sym"
        self._parse_exports()
        self._parse_imports()

    def rva_to_off(self, rva: int):
        for name, vrva, vsize, roff, rsize, chars in self.sections:
            if vrva <= rva < vrva + rsize:
                return roff + (rva - vrva)
        return None

    def va_to_off(self, va: int):
        if va < self.image_base:
            return None
        return self.rva_to_off(va - self.image_base)

    def read_cstr_rva(self, rva: int, max_len: int = 128):
        off = self.rva_to_off(rva)
        if off is None:
            return None
        end = self.data.find(b"\x00", off, min(len(self.data), off + max_len))
        if end == -1:
            return None
        return self.data[off:end].decode("latin1", errors="replace")

    def read_printable_cstr_va(self, va: int):
        off = self.va_to_off(va)
        if off is None:
            return None
        # Only from non-code sections (.rdata / .data)
        rva = va - self.image_base
        in_data = False
        for name, vrva, vsize, roff, rsize, chars in self.sections:
            if vrva <= rva < vrva + rsize:
                if name in (".rdata", ".data"):
                    in_data = True
                break
        if not in_data:
            return None
        end = self.data.find(b"\x00", off, min(len(self.data), off + 96))
        if end == -1 or end - off < 2:
            return None
        raw = self.data[off:end]
        if all(32 <= b < 127 for b in raw):
            return raw.decode("ascii")
        return None

    def read_float_va(self, va: int):
        off = self.va_to_off(va)
        if off is None or off + 4 > len(self.data):
            return None
        return struct.unpack_from("<f", self.data, off)[0]

    def read_double_va(self, va: int):
        off = self.va_to_off(va)
        if off is None or off + 8 > len(self.data):
            return None
        return struct.unpack_from("<d", self.data, off)[0]

    def is_in_text(self, va: int):
        rva = va - self.image_base
        for name, vrva, vsize, roff, rsize, chars in self.sections:
            if name == ".text":
                return vrva <= rva < vrva + vsize
        return False

    def _parse_exports(self):
        if not self.export_rva:
            return
        off = self.rva_to_off(self.export_rva)
        if off is None:
            return
        num_funcs, num_names, funcs_rva, names_rva, ords_rva = struct.unpack_from("<IIIII", self.data, off + 20)
        f_off = self.rva_to_off(funcs_rva)
        n_off = self.rva_to_off(names_rva)
        o_off = self.rva_to_off(ords_rva)
        if None in (f_off, n_off, o_off):
            return
        for i in range(num_names):
            name_rva = struct.unpack_from("<I", self.data, n_off + i * 4)[0]
            ord_idx = struct.unpack_from("<H", self.data, o_off + i * 2)[0]
            func_rva = struct.unpack_from("<I", self.data, f_off + ord_idx * 4)[0]
            sym = self.read_cstr_rva(name_rva, 512)
            if not sym:
                continue
            va = self.image_base + func_rva
            cls, method, label = demangle_msvc_short(sym)
            if method == "vftable":
                self.vftables[va] = cls
            else:
                # Keep first or more specific symbol
                if va not in self.exports_by_va:
                    self.exports_by_va[va] = (cls, method, label, sym)

        # Also scan exported vftables to discover non-exported virtual methods
        for vf_va, cls in self.vftables.items():
            vf_off = self.va_to_off(vf_va)
            if vf_off is None:
                continue
            for idx in range(64):
                if vf_off + (idx + 1) * 4 > len(self.data):
                    break
                ptr = struct.unpack_from("<I", self.data, vf_off + idx * 4)[0]
                if not self.is_in_text(ptr):
                    break
                if ptr not in self.exports_by_va:
                    m = f"vfunc_{idx:02d}"
                    self.exports_by_va[ptr] = (cls, m, f"{cls}::{m}", f"{cls}::vtable[{idx}]")

    def _parse_imports(self):
        if not self.import_rva:
            return
        off = self.rva_to_off(self.import_rva)
        if off is None:
            return
        idx = 0
        while True:
            o = off + idx * 20
            ilt_rva, ts, fwd, name_rva, iat_rva = struct.unpack_from("<IIIII", self.data, o)
            if ilt_rva == 0 and name_rva == 0 and iat_rva == 0:
                break
            dll_name = self.read_cstr_rva(name_rva) or "unknown.dll"
            thunk_rva = ilt_rva if ilt_rva else iat_rva
            t_off = self.rva_to_off(thunk_rva)
            if t_off is not None:
                j = 0
                while True:
                    val = struct.unpack_from("<I", self.data, t_off + j * 4)[0]
                    if val == 0:
                        break
                    slot_va = self.image_base + iat_rva + j * 4
                    if val & 0x80000000:
                        self.iat_by_va[slot_va] = f"{dll_name}!ord_{val & 0xFFFF}"
                    else:
                        sym = self.read_cstr_rva(val + 2, 512) or f"rva_{val:x}"
                        _, _, lbl = demangle_msvc_short(sym)
                        self.iat_by_va[slot_va] = f"{dll_name}!{lbl}"
                    j += 1
            idx += 1


RE_INSN = re.compile(r"^\s*([0-9a-fA-F]+):\s+((?:[0-9a-fA-F]{2}\s)+)\s*(.*)$")
RE_HEX_ADDR = re.compile(r"0x([0-9a-fA-F]{7,8})")


def disassemble_dll(dll_name: str):
    dll_path = os.path.join(RUN_BIN, dll_name)
    base = dll_name.replace(".dll", "").replace(".exe", "")
    out_dir = os.path.join(OUT_ROOT, base)
    os.makedirs(out_dir, exist_ok=True)

    pe = PEImage(dll_path)
    print(f"[{dll_name}] exports+vfuncs={len(pe.exports_by_va)}, iat={len(pe.iat_by_va)}, vftables={len(pe.vftables)}")

    proc = subprocess.run(
        ["objdump", "-d", "--x86-asm-syntax=intel", dll_path],
        capture_output=True, text=True, check=True
    )

    insns = []  # (va, text)
    for line in proc.stdout.splitlines():
        m = RE_INSN.match(line)
        if not m:
            continue
        va = int(m.group(1), 16)
        asm = m.group(3).strip()
        # Strip noisy objdump symbol comment <foo+0x123>
        asm = re.sub(r"\s*<[^>]+>$", "", asm)
        insns.append((va, asm))

    # Also discover all Nebula n_init_<cls> / n_new_<cls> classes, their AddCmd handlers, and vftables!
    nebula_inits = {}  # lower_cls -> (init_va, new_va)
    for va, (cls, method, label, raw_sym) in list(pe.exports_by_va.items()):
        if raw_sym.startswith("n_init_"):
            c = raw_sym[len("n_init_"):]
            nebula_inits.setdefault(c, [None, None])[0] = va
        elif raw_sym.startswith("n_new_"):
            c = raw_sym[len("n_new_"):]
            nebula_inits.setdefault(c, [None, None])[1] = va

    # Map lower_cls -> canonical CamelCase name if exported, else lower_cls
    canon_cls = {}
    for va, (cls, method, label, raw_sym) in pe.exports_by_va.items():
        if cls != "_global":
            canon_cls[cls.lower()] = cls
    for vf_va, cls in pe.vftables.items():
        canon_cls[cls.lower()] = cls

    # Quick instruction index by VA for scanning n_init_ / n_new_
    insn_by_va = {va: i for i, (va, _) in enumerate(insns)}

    # 1) Assign n_init_ / n_fini_ / n_new_ / n_version_ to their class instead of _global
    for va, (cls, method, label, raw_sym) in list(pe.exports_by_va.items()):
        for pref in ("n_init_", "n_fini_", "n_new_", "n_version_"):
            if raw_sym.startswith(pref):
                c = raw_sym[len(pref):]
                cname = canon_cls.get(c, c)
                pe.exports_by_va[va] = (cname, raw_sym, f"{cname}::{raw_sym}", raw_sym)
                break

    # 2) Scan each n_init_<cls> (and its n_initcmds helper) for AddCmd(proto, fourcc, handler_va)
    # Pattern: push <handler_va>; push <fourcc>; push <proto_str_va>
    cmd_handlers_found = 0
    vftables_found = 0

    def scan_addcmds(start_va: int, cname: str, max_insns: int = 250):
        nonlocal cmd_handlers_found
        idx = insn_by_va.get(start_va)
        if idx is None:
            return
        pushes = []
        for k in range(idx, min(len(insns), idx + max_insns)):
            iva, iasm = insns[k]
            low = iasm.lower()
            if low.startswith("push\t0x") or low.startswith("push 0x"):
                m_h = RE_HEX_ADDR.search(iasm)
                if m_h:
                    val = int(m_h.group(1), 16)
                    pushes.append(val)
                    s = pe.read_printable_cstr_va(val)
                    if s and "_" in s and len(s) >= 5 and s[1] == "_" and len(pushes) >= 3:
                        # pushes[-3] = handler_va, pushes[-2] = fourcc, pushes[-1] = proto_str
                        hva = pushes[-3]
                        if pe.is_in_text(hva) and hva not in pe.exports_by_va:
                            cmd_name = s.split("_")[1]
                            pe.exports_by_va[hva] = (cname, f"cmd_{cmd_name}", f"{cname}::cmd_{cmd_name} ({s})", s)
                            cmd_handlers_found += 1
                    continue
            if low.startswith("call\t0x") or low.startswith("call 0x"):
                # Follow single-level n_initcmds helper if called right inside n_init_
                m_t = RE_HEX_ADDR.search(iasm)
                if m_t and k - idx < 25:
                    tva = int(m_t.group(1), 16)
                    if pe.is_in_text(tva) and tva not in pe.exports_by_va and max_insns == 250:
                        scan_addcmds(tva, cname, 400)
            if low.startswith("ret") and k > idx + 3:
                break

    def scan_vftable_from_new(new_va: int, cname: str):
        nonlocal vftables_found
        idx = insn_by_va.get(new_va)
        if idx is None:
            return
        # Check n_new_ and any ctor it calls within 25 insns
        candidates = [idx]
        for k in range(idx, min(len(insns), idx + 25)):
            iva, iasm = insns[k]
            if iasm.lower().startswith("call\t0x") or iasm.lower().startswith("call 0x"):
                m_t = RE_HEX_ADDR.search(iasm)
                if m_t:
                    tva = int(m_t.group(1), 16)
                    if tva in insn_by_va:
                        candidates.append(insn_by_va[tva])
            if iasm.lower().startswith("ret"):
                break
        for cidx in candidates:
            for k in range(cidx, min(len(insns), cidx + 45)):
                iva, iasm = insns[k]
                m_vf = re.search(r"mov\s+dword ptr \[e[a-z]{2}\],\s*0x([0-9a-fA-F]{7,8})", iasm)
                if m_vf:
                    vf_va = int(m_vf.group(1), 16)
                    vf_off = pe.va_to_off(vf_va)
                    if vf_off is not None and not pe.is_in_text(vf_va):
                        first_ptr = struct.unpack_from("<I", pe.data, vf_off)[0]
                        if pe.is_in_text(first_ptr):
                            if vf_va not in pe.vftables:
                                pe.vftables[vf_va] = cname
                                vftables_found += 1
                            for slot in range(64):
                                if vf_off + (slot + 1) * 4 > len(pe.data):
                                    break
                                ptr = struct.unpack_from("<I", pe.data, vf_off + slot * 4)[0]
                                if not pe.is_in_text(ptr):
                                    break
                                if ptr not in pe.exports_by_va:
                                    m = f"vfunc_{slot:02d}"
                                    pe.exports_by_va[ptr] = (cname, m, f"{cname}::{m}", f"{cname}::vtable[{slot}]")
                            return
                if iasm.lower().startswith("ret"):
                    break

    for c, (init_va, new_va) in nebula_inits.items():
        cname = canon_cls.get(c, c)
        if init_va:
            scan_addcmds(init_va, cname)
        if new_va:
            scan_vftable_from_new(new_va, cname)

    print(f"  [{dll_name}] discovered {len(nebula_inits)} Nebula classes, +{cmd_handlers_found} cmd handlers, +{vftables_found} vftables")

    # Build sorted list of function start VAs in .text
    func_starts = sorted(va for va in pe.exports_by_va.keys() if pe.is_in_text(va))
    func_set = set(func_starts)

    # Group instructions into functions
    class_funcs = defaultdict(list)  # cls -> [(va, method, label, raw_sym, [(iva, iasm, note)])]
    cur_func = None
    cur_lines = []

    def flush():
        if cur_func is not None:
            va, cls, method, label, raw_sym = cur_func
            class_funcs[cls].append((va, method, label, raw_sym, list(cur_lines)))

    for va, asm in insns:
        if va in func_set:
            flush()
            cls, method, label, raw_sym = pe.exports_by_va[va]
            cur_func = (va, cls, method, label, raw_sym)
            cur_lines = []
        if cur_func is None:
            continue

        # Annotate instruction
        notes = []
        low = asm.lower()
        # Check indirect IAT call/jmp
        m_iat = re.search(r"dword ptr \[0x([0-9a-fA-F]{7,8})\]", asm)
        if m_iat:
            addr = int(m_iat.group(1), 16)
            if addr in pe.iat_by_va:
                notes.append(f"IAT: {pe.iat_by_va[addr]}")
            elif any(low.startswith(op) for op in ("fld", "fmul", "fadd", "fsub", "fdiv", "fcom", "fcomp", "fstp")):
                fv = pe.read_float_va(addr)
                if fv is not None:
                    notes.append(f"f32={fv:.7g}")
        m_q = re.search(r"qword ptr \[0x([0-9a-fA-F]{7,8})\]", asm)
        if m_q:
            addr = int(m_q.group(1), 16)
            if any(low.startswith(op) for op in ("fld", "fmul", "fadd", "fsub", "fdiv", "fcom", "fcomp")):
                dv = pe.read_double_va(addr)
                if dv is not None:
                    notes.append(f"f64={dv:.10g}")

        # Direct call/jmp target
        if low.startswith("call\t0x") or low.startswith("call 0x") or low.startswith("jmp\t0x") or low.startswith("jmp 0x"):
            m_t = RE_HEX_ADDR.search(asm)
            if m_t:
                tva = int(m_t.group(1), 16)
                if tva in pe.exports_by_va:
                    notes.append(f"-> {pe.exports_by_va[tva][2]}")

        # Immediate string or vftable reference
        if not notes and (low.startswith("push\t0x") or low.startswith("push 0x") or ", 0x" in low):
            for m_h in RE_HEX_ADDR.finditer(asm):
                addr = int(m_h.group(1), 16)
                if addr in pe.vftables:
                    notes.append(f"vftable:{pe.vftables[addr]}")
                elif addr in pe.exports_by_va:
                    notes.append(f"sym:{pe.exports_by_va[addr][2]}")
                else:
                    s = pe.read_printable_cstr_va(addr)
                    if s:
                        notes.append(f'str="{s}"')

        cur_lines.append((va, asm, " | ".join(notes)))

    flush()

    # Write per-class .asm files + INDEX.md
    index_lines = [f"# {dll_name} Annotated Disassembly Index\n",
                   f"Classes: {len(class_funcs)} | Functions: {sum(len(v) for v in class_funcs.values())}\n"]
    for cls in sorted(class_funcs.keys()):
        safe_cls = re.sub(r"[^A-Za-z0-9_.-]", "_", cls)
        out_path = os.path.join(out_dir, f"{safe_cls}.asm")
        funcs = class_funcs[cls]
        index_lines.append(f"- **{cls}** ({len(funcs)} funcs) -> `{safe_cls}.asm`")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(f"; ============================================================================\n")
            f.write(f"; Class: {cls}  ({dll_name})\n")
            f.write(f"; Methods: {len(funcs)}\n")
            f.write(f"; ============================================================================\n\n")
            for va, method, label, raw_sym, lines in funcs:
                f.write(f"; ----------------------------------------------------------------------------\n")
                f.write(f"; {label}  @ 0x{va:08x}\n")
                f.write(f"; Raw: {raw_sym}\n")
                f.write(f"; ----------------------------------------------------------------------------\n")
                for iva, iasm, note in lines:
                    if note:
                        f.write(f"  {iva:08x}:  {iasm:<44s} ; {note}\n")
                    else:
                        f.write(f"  {iva:08x}:  {iasm}\n")
                f.write("\n")

    with open(os.path.join(out_dir, "INDEX.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(index_lines) + "\n")
    print(f"  -> Wrote {len(class_funcs)} class files to {out_dir}")


if __name__ == "__main__":
    for dll in DLLS:
        disassemble_dll(dll)
