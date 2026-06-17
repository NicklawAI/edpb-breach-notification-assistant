#!/usr/bin/env python3
"""Inline scripts into a single self-contained dist/index.html for offline use."""
import re, pathlib
root = pathlib.Path(__file__).parent
html = (root / "index.html").read_text(encoding="utf-8")
for src in ["src/data.js", "src/i18n.js", "src/app.js"]:
    code = (root / src).read_text(encoding="utf-8")
    html = html.replace(f'<script src="{src}"></script>', f"<script>\n{code}\n</script>")
(root / "dist").mkdir(exist_ok=True)
(root / "dist" / "index.html").write_text(html, encoding="utf-8")
print(f"dist/index.html written ({len(html)} bytes, self-contained, offline)")
