import sys, re
for path in sys.argv[1:]:
    lines = open(path, encoding="utf-8").read().split("\n")
    out, truncated = [], False
    for ln in lines:
        s = ln.strip()
        # Truncate from the first internal marker to end of file
        if re.match(r'^#+\s*\*{0,2}Scheda\s*[2-9]', s) or \
           re.match(r'^\*{0,2}(Nota interna|Internal note)\b.*(da rimuovere|to be removed|prima della presentazione|before submission)', s, re.I) or \
           re.match(r'^\\?-{0,2}gws[_\\]*boundary', s):
            truncated = True
            break
        # Drop standalone tab markers (e.g. "# **Scheda 1**")
        if re.match(r'^#+\s*\*{0,2}Scheda\s*\d*\*{0,2}\s*$', s):
            continue
        # Drop any stray MIME boundary lines
        if re.search(r'gws[_\\]*boundary', s):
            continue
        out.append(ln)
    # trim trailing blanks
    while out and out[-1].strip() == "":
        out.pop()
    open(path, "w", encoding="utf-8").write("\n".join(out) + "\n")
    print(f"{path}: {'truncated internal content + ' if truncated else ''}cleaned ({len(out)} lines)")
