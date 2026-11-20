"""Build the self-contained Final_Production-Demos pages.

The knowledge graph (kg.js) and briefs (briefs.js) are the single source of
truth; this script inlines them so every page works offline as one file.
Run from this folder:  python3 build.py
"""
from pathlib import Path

SRC = Path(__file__).parent
OUT = SRC.parent
KG = (SRC / "kg.js").read_text(encoding="utf-8")
BRIEFS = (SRC / "briefs.js").read_text(encoding="utf-8")

PAGES = {
    "index.html": "index.html",
    "map.html": "1_concept_map.html",
    "studio.html": "2_design_studio.html",
}


def build() -> None:
    for src_name, out_name in PAGES.items():
        html = (SRC / src_name).read_text(encoding="utf-8")
        html = html.replace("/*__KG__*/", KG).replace("/*__BRIEFS__*/", BRIEFS)
        if "/*__" in html:
            raise ValueError(f"Unreplaced placeholder in {src_name}")
        (OUT / out_name).write_text(html, encoding="utf-8")
        print(f"built {out_name}")


if __name__ == "__main__":
    build()
