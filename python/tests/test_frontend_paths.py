"""The Python side finds the frontend where it really is: its source folder, and the folder it builds to."""

import importlib.util
import re
from pathlib import Path

from python_project.api import main as api_main

REPO = Path(__file__).resolve().parents[2]


def test_api_serves_the_frontend_from_where_vite_builds_it():
    vite_config = (REPO / "frontend" / "vite.config.ts").read_text()
    match = re.search(r'outDir:\s*"([^"]+)"', vite_config)
    assert match, "no build.outDir in vite.config.ts"

    assert api_main.FRONTEND_DIR.resolve() == (REPO / "frontend" / match[1]).resolve()


def test_build_script_finds_the_frontend():
    spec = importlib.util.spec_from_file_location("build_frontend", REPO / "python" / "scripts" / "build_frontend.py")
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    assert (module.FRONTEND_DIR / "package.json").is_file()
