"""Checks that a jupyter notebook, or notebooks within a directory, run without error
To use, call `$ python nbtest.py <NBPATH>`
where <NBPATH> is the path (abs or rel) to the notebook or directory of notebooks
Author: glass-ships
Last updated: 2019
"""

import logging
import os
import sys

import nbformat
from nbconvert.preprocessors import ExecutePreprocessor

from python_project.utils.logging import setup_logging

logger = logging.getLogger("nbtest")


# @profile
def run_notebook(notebook: str) -> tuple[nbformat.NotebookNode, list]:
    nb_name, _ = os.path.splitext(os.path.basename(notebook))
    dirname = os.path.dirname(notebook)

    with open(notebook) as f:
        nb = nbformat.read(f, as_version=4)

    proc = ExecutePreprocessor(timeout=600, kernel_name="python3")
    proc.allow_errors = True

    proc.preprocess(nb, {"metadata": {"path": "/"}})
    output_path = os.path.join(dirname, f"{nb_name}_test.ipynb")
    with open(output_path, mode="w") as f:
        nbformat.write(nb, f)

    errors = []
    for cell in nb.cells:
        if "outputs" in cell:
            for output in cell["outputs"]:
                if output.output_type == "error":
                    errors.append(output)

    os.remove(output_path)

    return nb, errors


def collect_notebooks(path: str) -> list[str]:  # noqa: ARG001
    """Collect all notebooks in a directory"""
    notebooks = []
    fp = os.path.abspath(sys.argv[1])
    if os.path.isfile(fp) and fp.endswith(".ipynb"):
        notebooks.append(fp)
    elif os.path.isdir(fp):
        for file in os.listdir(fp):
            if file.endswith(".ipynb"):
                notebooks.append(os.path.join(fp, file))
        if len(notebooks) == 0:
            raise SystemExit(f"Could not find notebooks in directory: '{sys.argv[1]}'")
    else:
        raise SystemExit(
            "Invalid argument: ",
            sys.argv[1],
            "\n Please input a jupyter notebook or directory of notebooks.",
        )
    return notebooks


if __name__ == "__main__":
    setup_logging(level="DEBUG", rotate=False)
    if len(sys.argv) == 1:
        raise SystemExit(
            "Please provide a notebook or directory of notebooks to test.\n"
            "Usage:\n"
            "\tpython nbtest.py <path to notebook/directory of notebooks>"
        )
    notebooks = collect_notebooks(sys.argv[1])
    for notebook in notebooks:
        nb, errors = run_notebook(notebook)
        if errors:
            raise SystemExit(f"Notebook execution failed. Errors: {errors}")
        elif not errors:
            print("Notebook execution successful.")
