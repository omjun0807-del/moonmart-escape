#!/usr/bin/env python3
"""Build MOON MART v1.5 from verified legacy layers without touching saved-game code.

The original v0.8 HTML is still extracted from the repository ZIP by deploy.yml.
The restore preloader MUST run before the original inline game bootstrap.
All remaining enhancement modules are bundled in their original execution order.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path("_site")
INDEX = ROOT / "index.html"
MODULES = [
    ("v09-world", "09"),
    ("v10-experience", "10"),
    ("v11-aligned", "11"),
    ("v12-immersive", "12"),
    ("v13-playable-focus", "13"),
]
CSS_MODULES = [name for name, _ in MODULES] + ["v15-polish"]
JS_MODULES = [name for name, _ in MODULES] + ["v15-polish"]

def main() -> None:
    text = INDEX.read_text(encoding="utf-8")
    assert 'v14-restore-preload.js?v=14' in text, "v1.4 preboot restore missing"
    assert 'id="sceneCamera"' in text and "moon_mart_escape_ep01_v1" in text
    restore_pos = text.index('v14-restore-preload.js?v=14')
    game_pos = text.index("const STORAGE='moon_mart_escape_ep01_v1'")
    assert restore_pos < game_pos, "Safe backup restore must precede core game initialization"

    bundle_scripts = []
    bundle_styles = []
    for name in CSS_MODULES:
        source = ROOT / (name + ".css")
        assert source.is_file() and source.stat().st_size > 50, f"Missing CSS: {source}"
        bundle_styles.append(f"\n/* ---- {name}.css ---- */\n" + source.read_text(encoding="utf-8"))
    for name in JS_MODULES:
        source = ROOT / (name + ".js")
        assert source.is_file() and source.stat().st_size > 50, f"Missing JS: {source}"
        # Semi-colon between IIFEs protects both assignment and bundling boundaries.
        bundle_scripts.append(f"\n;\n/* ---- {name}.js ---- */\n" + source.read_text(encoding="utf-8"))

    for name, version in MODULES:
        css = f'<link rel="stylesheet" href="{name}.css?v={version}">'
        js = f'<script defer src="{name}.js?v={version}"></script>'
        assert text.count(css) == 1, f"Old stylesheet link missing or duplicated: {css}"
        assert text.count(js) == 1, f"Old script tag missing or duplicated: {js}"
        text = text.replace(css, "", 1).replace(js, "", 1)

    text = text.replace("</head>", '<link rel="stylesheet" href="v15-runtime.css?v=15"></head>', 1)
    text = text.replace("</body>", '<script defer src="v15-runtime.js?v=15"></script></body>', 1)
    assert text.count('v15-runtime.css') == 1 and text.count('v15-runtime.js') == 1
    assert not re.search(r'<script\b[^>]*\bsrc="v(?:09|10|11|12|13)-', text)
    assert not re.search(r'<link\b[^>]*\bhref="v(?:09|10|11|12|13)-', text)
    assert "v14-restore-preload.js?v=14" in text
    assert text.index("v14-restore-preload.js") < text.index("const STORAGE='moon_mart_escape_ep01_v1'")
    assert text.index('v15-runtime.js') > text.index("const STORAGE='moon_mart_escape_ep01_v1'")

    (ROOT / "v15-runtime.css").write_text("".join(bundle_styles), encoding="utf-8")
    (ROOT / "v15-runtime.js").write_text("".join(bundle_scripts), encoding="utf-8")
    INDEX.write_text(text, encoding="utf-8")

    # The old versions are only build inputs now; avoid shipping duplicate dead assets.
    for name in set(CSS_MODULES + JS_MODULES):
        for ext in (".css", ".js"):
            stale = ROOT / (name + ext)
            if stale.exists():
                stale.unlink()
    print("v1.5 bundle complete: scripts", len(bundle_scripts), "styles", len(bundle_styles))
    print("Bundled JS bytes:", (ROOT / "v15-runtime.js").stat().st_size)
    print("Bundled CSS bytes:", (ROOT / "v15-runtime.css").stat().st_size)

if __name__ == "__main__":
    main()
