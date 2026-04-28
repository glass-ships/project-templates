import os
import shutil
import subprocess
from pathlib import Path


def build_frontend(cleanup=False):
    if shutil.which("bun"):
        tool = "bun"
    elif shutil.which("npm"):
        tool = "npm"
    else:
        raise RuntimeError("npm/bun is not installed. Please install either npm or bun.")

    client_folder = (Path(__file__).parent.parent / "frontend").resolve()

    os.chdir(client_folder)

    node_modules = client_folder / "node_modules"
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
