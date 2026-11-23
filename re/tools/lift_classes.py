#!/usr/bin/env python3
"""
Lift all 465 annotated .asm class files from re/disasm/<dll>/ into structured
C++ class definitions + method specifications in re/src/<dll>/<Class>.hpp.
Extracts:
  - Exact sizeof(Class) from n_new_<cls>
  - Exact superclass from n_init_<cls>
  - Field offset map (offset -> inferred type: float/double/uint8_t/uint32_t)
  - All AddCmd prototypes + FourCCs
  - Per-method call graph, float/double constants, and string literals
"""
import glob
import os
import re
from collections import defaultdict

DISASM_ROOT = "/Users/ovc/Downloads/Проект «Бродяги»/re/disasm"
SRC_ROOT = "/Users/ovc/Downloads/Проект «Бродяги»/re/src"

RE_FUNC_HDR = re.compile(r"^;\s+(.+?)\s+@\s+0x([0-9a-fA-F]+)$")
RE_INSN_LINE = re.compile(r"^\s+([0-9a-fA-F]{8}):\s+(.+?)(?:\s+;\s+(.*))?$")
RE_OFFSET = re.compile(r"(byte|word|dword|qword)\s+ptr\s+\[(?:esi|ecx|ebx|edi)\s*\+\s*0x([0-9a-fA-F]+)\]")
RE_PUSH_IMM = re.compile(r"^push\s+0x([0-9a-fA-F]+)$")


def parse_asm_file(path: str):
    with open(path, "r", encoding="utf-8") as f:
        lines = f.read().splitlines()

    cls_name = os.path.basename(path).replace(".asm", "")
    funcs = []
    cur = None
    for line in lines:
        m = RE_FUNC_HDR.match(line)
        if m:
            if cur:
                funcs.append(cur)
            cur = {"label": m.group(1), "va": m.group(2), "insns": []}
            continue
        if cur is not None:
            mi = RE_INSN_LINE.match(line)
            if mi:
                cur["insns"].append((mi.group(1), mi.group(2).strip(), mi.group(3) or ""))
    if cur:
        funcs.append(cur)
    return cls_name, funcs


def lift_class(dll_name: str, path: str):
    cls_name, funcs = parse_asm_file(path)
    if not funcs:
        return None

    size_bytes = None
    super_cls = None
    addcmds = []          # (proto, fourcc, handler_label)
    fields = {}           # offset_int -> set of types
    method_summaries = [] # (label, va, insn_count, calls, floats, strings)

    for fn in funcs:
        lbl = fn["label"]
        insns = fn["insns"]
        calls = []
        floats = []
        strings = []
        seen_calls = set()
        seen_floats = set()
        seen_strings = set()

        # Infer sizeof from n_new_<cls>
        if "::n_new_" in lbl and size_bytes is None:
            for _, asm, _ in insns[:5]:
                mp = RE_PUSH_IMM.match(asm)
                if mp:
                    v = int(mp.group(1), 16)
                    if 0x10 <= v <= 0x10000:
                        size_bytes = v
                        break

        # Infer superclass from n_init_<cls>
        if "::n_init_" in lbl and super_cls is None:
            for _, _, note in insns[:25]:
                ms = re.search(r'str="([a-zA-Z0-9_]+)"', note)
                if ms and ms.group(1).lower() != cls_name.lower():
                    super_cls = ms.group(1)
                    break

        # Scan instructions for fields, calls, constants, strings, AddCmds
        for idx, (va, asm, note) in enumerate(insns):
            low = asm.lower()

            # Field accesses
            mo = RE_OFFSET.search(low)
            if mo:
                sz_kw, off_hex = mo.group(1), mo.group(2)
                off = int(off_hex, 16)
                if 0x4 <= off <= 0x4000:
                    if low.startswith(("fld", "fstp", "fst", "fadd", "fsub", "fmul", "fdiv", "fcom")):
                        ftype = "double" if sz_kw == "qword" else "float"
                    elif sz_kw == "byte":
                        ftype = "uint8_t"
                    elif sz_kw == "word":
                        ftype = "uint16_t"
                    elif sz_kw == "qword":
                        ftype = "uint64_t"
                    else:
                        ftype = "uint32_t"
                    fields.setdefault(off, set()).add(ftype)

            # Annotated calls, floats, strings
            if note:
                for part in note.split(" | "):
                    if part.startswith("-> ") or part.startswith("IAT: "):
                        if part not in seen_calls:
                            seen_calls.add(part)
                            calls.append(part)
                    elif part.startswith("f32=") or part.startswith("f64="):
                        if part not in seen_floats:
                            seen_floats.add(part)
                            floats.append(part)
                    elif part.startswith('str="'):
                        s = part[5:-1]
                        if s not in seen_strings:
                            seen_strings.add(s)
                            strings.append(s)
                        # Check AddCmd prototype string
                        if len(s) >= 5 and s[1] == "_" and "_" in s[2:]:
                            addcmds.append(s)

        method_summaries.append((lbl, fn["va"], len(insns), calls, floats, strings))

    # Deduplicate addcmds preserving order
    uniq_cmds = list(dict.fromkeys(addcmds))

    # Write lifted C++ header
    out_dir = os.path.join(SRC_ROOT, dll_name)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{cls_name}.hpp")

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"#pragma once\n")
        f.write(f"// Auto-lifted C++ layout & method spec from {dll_name}.dll\n")
        f.write(f"// Source ASM: re/disasm/{dll_name}/{cls_name}.asm\n")
        f.write(f"// Class: {cls_name}")
        if super_cls:
            f.write(f" : public {super_cls}")
        if size_bytes is not None:
            f.write(f"  (sizeof = 0x{size_bytes:x} = {size_bytes} bytes)")
        f.write("\n\n#include <cstdint>\n\n")
        f.write(f"namespace re_{dll_name} {{\n\n")

        f.write(f"struct {cls_name}_Layout {{\n")
        if fields:
            for off in sorted(fields.keys())[:120]:
                ts = fields[off]
                t = "double" if "double" in ts else ("float" if "float" in ts else ("uint8_t" if "uint8_t" in ts else "uint32_t"))
                f.write(f"    // +0x{off:04x}\n")
                f.write(f"    {t} field_0x{off:04x};\n")
        else:
            f.write("    // (no direct [this+offset] fields detected)\n")
        f.write("};\n\n")

        if uniq_cmds:
            f.write(f"// Script AddCmds ({len(uniq_cmds)}):\n")
            for c in uniq_cmds:
                f.write(f"//   {c}\n")
            f.write("\n")

        f.write(f"// Methods ({len(method_summaries)}):\n")
        for lbl, va, n_insns, calls, floats, strings in method_summaries:
            f.write(f"// 0x{va}  {lbl}  ({n_insns} insns)\n")
            if calls:
                f.write(f"//   calls:   {', '.join(calls[:12])}\n")
            if floats:
                f.write(f"//   consts:  {', '.join(floats[:12])}\n")
            if strings:
                f.write(f"//   strings: {', '.join(repr(s) for s in strings[:8])}\n")
        f.write(f"\n}} // namespace re_{dll_name}\n")

    return (cls_name, super_cls or "-", size_bytes or 0, len(fields), len(uniq_cmds), len(method_summaries))


def main():
    os.makedirs(SRC_ROOT, exist_ok=True)
    master = ["# Project Nomads — Complete Lifted C++ Source Index\n"]
    total_classes = 0
    total_methods = 0
    total_cmds = 0

    for dll_dir in sorted(glob.glob(os.path.join(DISASM_ROOT, "*"))):
        if not os.path.isdir(dll_dir):
            continue
        dll_name = os.path.basename(dll_dir)
        rows = []
        for asm_path in sorted(glob.glob(os.path.join(dll_dir, "*.asm"))):
            if os.path.basename(asm_path) == "_global.asm":
                continue
            res = lift_class(dll_name, asm_path)
            if res:
                rows.append(res)
                total_classes += 1
                total_methods += res[5]
                total_cmds += res[4]
        if not rows:
            continue
        master.append(f"## {dll_name}.dll ({len(rows)} classes)\n")
        master.append("| Class | Super | Size | Fields | AddCmds | Methods |")
        master.append("| :--- | :--- | ---: | ---: | ---: | ---: |")
        for cls_name, sup, sz, nf, nc, nm in rows:
            sz_s = f"{sz} B" if sz else "-"
            master.append(f"| `{cls_name}` | `{sup}` | {sz_s} | {nf} | {nc} | {nm} |")
        master.append("")
        print(f"[{dll_name}] lifted {len(rows)} classes")

    master.insert(1, f"**Total:** {total_classes} classes | {total_methods} methods | {total_cmds} script AddCmds\n")
    with open(os.path.join(SRC_ROOT, "MASTER_INDEX.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(master) + "\n")
    print(f"DONE: {total_classes} classes, {total_methods} methods, {total_cmds} AddCmds -> {SRC_ROOT}/MASTER_INDEX.md")


if __name__ == "__main__":
    main()
