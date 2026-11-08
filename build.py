"""Build index.html from the source files.

Usage:  python3 build.py
Reads src/page.html and src/engine.js, writes index.html (one self-contained page).
"""
from pathlib import Path

root = Path(__file__).parent
page = (root / "src" / "page.html").read_text(encoding="utf-8")
engine = (root / "src" / "engine.js").read_text(encoding="utf-8")
engine = engine[: engine.index("if (typeof module")]  # drop the Node.js export used for testing

body = page.replace("/*ENGINE*/", engine)
body = body.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', "")

doc = (
    "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n"
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n"
    "<meta name=\"robots\" content=\"noindex, nofollow\">\n"
    "<style>html,body{margin:0;padding:0;background:#474747}</style>\n</head>\n<body>\n"
    + body + "\n</body>\n</html>\n"
)
(root / "index.html").write_text(doc, encoding="utf-8")
print(f"built index.html ({len(doc):,} bytes)")
