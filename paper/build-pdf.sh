#!/usr/bin/env bash
# Generate a clean, citable PDF of the position paper from the Markdown snapshot.
# Dependency-free: renders MD -> minimal styled HTML -> Chrome headless print-to-pdf.
# Run AFTER paper/build-paper.sh (i.e. from the canonical), at finalisation.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

md_to_html () { # $1=md $2=html $3=title
  python3 - "$1" "$2" "$3" <<'PY'
import sys, re, html
md_path, html_path, title = sys.argv[1], sys.argv[2], sys.argv[3]
src = open(md_path, encoding="utf-8").read()
out = []
for raw in src.split("\n"):
    line = raw.rstrip()
    if not line.strip():
        out.append(""); continue
    if line.startswith("> "):
        out.append("<blockquote>"+html.escape(line[2:])+"</blockquote>"); continue
    m = re.match(r'^(#{1,4})\s+(.*)', line)
    if m:
        lvl = len(m.group(1)); out.append(f"<h{lvl}>"+html.escape(m.group(2))+f"</h{lvl}>"); continue
    if re.match(r'^[-*]\s+', line):
        out.append("<li>"+html.escape(re.sub(r'^[-*]\s+','',line))+"</li>"); continue
    if re.match(r'^\d+\.\s+', line):
        out.append("<li>"+html.escape(re.sub(r'^\d+\.\s+','',line))+"</li>"); continue
    out.append("<p>"+html.escape(line)+"</p>")
body = "\n".join(out)
# bold/italic/code (after escaping)
body = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', body)
body = re.sub(r'`(.+?)`', r'<code>\1</code>', body)
doc = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>{html.escape(title)}</title>
<style>@page{{margin:2cm}}body{{font-family:Georgia,'Times New Roman',serif;line-height:1.5;color:#16222e;max-width:none}}
h1{{font-size:20pt;color:#0f2740}}h2{{font-size:15pt;color:#0f2740;border-bottom:1px solid #ccc;padding-bottom:3px}}h3{{font-size:12pt;color:#1f5fae}}
blockquote{{background:#fff8e1;border-left:3px solid #ffc107;padding:6px 12px;color:#6a5400;font-size:10pt}}
code{{background:#f0f4f8;padding:1px 4px;font-family:Menlo,monospace;font-size:9pt}}li{{margin:2px 0}}p{{margin:6px 0}}</style></head>
<body>{body}</body></html>"""
open(html_path,"w",encoding="utf-8").write(doc)
PY
}

for lang in en it; do
  md="$DIR/position-paper.$lang.md"
  [ -f "$md" ] || continue
  md_to_html "$md" "$DIR/.pp-$lang.html" "EDPB Position Paper ($lang)"
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
    --print-to-pdf="$DIR/position-paper.$lang.pdf" "file://$DIR/.pp-$lang.html" >/dev/null 2>&1 && echo "PDF: position-paper.$lang.pdf" || echo "PDF $lang failed"
  rm -f "$DIR/.pp-$lang.html"
done
