# Adhesion sync (optional)

The adhesion mechanism works with **zero automation**: a maintainer reads each `adhesion`-labelled
issue and adds a row to `SIGNATORIES.md`. If you want this automated, add a workflow that, on issue
labelled `adhesion`, parses the Issue Form fields and opens a PR appending the row. Kept manual by
default so the signatory list stays human-reviewed (avoids spam/impersonation in a legal context).
