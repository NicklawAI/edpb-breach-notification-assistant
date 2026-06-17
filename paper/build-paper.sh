#!/usr/bin/env bash
# Reproducible export of the position paper from the canonical Google Docs.
# Regenerate the repo snapshot cleanly (no manual editing -> no drift).
# Requires gws-cli authenticated for the Google account owning the docs.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GWS="${GWS:-$HOME/.bun/bin/gws}"
DOC_EN="1j_EviybY26zvKFckELPB5nwFt1pk5HhGxEYK4EcUaQA"
DOC_IT="1Mlu56eJNZKmC0LyWH-5FIIAPfKtEDn3Cspo9CoVgWUM"
STAMP="$(date -u +%Y-%m-%d)"

draft_header () { # $1 = lang
  cat <<HDR
<!-- AUTO-GENERATED from the canonical Google Doc. Do not edit by hand; run paper/build-paper.sh. -->
> **CONSULTATION DRAFT - $STAMP** - pending co-author review. The canonical, authoritative version is the Google Doc linked below. This snapshot is versioned in the repository for citation and reproducibility.
> Canonical $1: see README "Position paper" links.

HDR
}

export_doc () { # $1=docid $2=outfile $3=lang
  "$GWS" drive files export --params "{\"fileId\":\"$1\",\"mimeType\":\"text/markdown\"}" --output "$DIR/.raw-$3.md" >/dev/null 2>&1 || {
    "$GWS" drive files export --params "{\"fileId\":\"$1\",\"mimeType\":\"text/markdown\"}" >/dev/null 2>&1; mv -f download.bin "$DIR/.raw-$3.md"; }
  { draft_header "$3"; cat "$DIR/.raw-$3.md"; } > "$DIR/$2"
  rm -f "$DIR/.raw-$3.md"
  echo "wrote $2"
}

export_doc "$DOC_EN" "position-paper.en.md" "EN"
[ -n "${DOC_IT}" ] && export_doc "$DOC_IT" "position-paper.it.md" "IT" || echo "skip IT (set full DOC_IT id)"
# Strip Google Doc tab markers, internal notes and MIME export artifacts (keep public snapshot clean)
python3 "$DIR/strip-internal.py" "$DIR/position-paper.en.md" "$DIR/position-paper.it.md" 2>/dev/null || true

# Optional PDF if pandoc present
if command -v pandoc >/dev/null 2>&1; then
  for f in position-paper.en.md position-paper.it.md; do
    [ -f "$DIR/$f" ] && pandoc "$DIR/$f" -o "$DIR/${f%.md}.pdf" 2>/dev/null && echo "pdf ${f%.md}.pdf" || true
  done
else echo "pandoc not found - skipping PDF (snapshot MD is the citable artefact)"; fi
