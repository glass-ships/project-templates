import os
import shutil
import subprocess
from pathlib import Path

# python/scripts/build_frontend.py -> the repo root -> frontend/
FRONTEND_DIR = Path(__file__).resolve().parents[2] / "frontend"


def build_frontend(cleanup=False):
    if shutil.which("bun"):
        tool = "bun"
    elif shutil.which("npm"):
        tool = "npm"
    else:
        raise RuntimeError("npm/bun is not installed. Please install either npm or bun.")

    os.chdir(FRONTEND_DIR)

    node_modules = FRONTEND_DIR / "node_modules"
    if not node_modules.exists():
        print("Installing node modules...")
        subprocess.run([tool, "install"], check=True)

    subprocess.run([tool, "run", "build"], check=True)

    if cleanup:
        print("Cleaning up...")
        shutil.rmtree(node_modules)
        print("node_modules folders removed.")

    print("Done.")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Build the webview client.")
    parser.add_argument("--cleanup", action="store_true", help="Remove the node_modules directory.")
    args = parser.parse_args()
    build_frontend(
        cleanup=args.cleanup,
    )
