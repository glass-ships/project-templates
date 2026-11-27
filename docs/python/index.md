# Python

A Python package in `python/`, managed with [uv](https://docs.astral.sh/uv/). It needs Python 3.13 or newer; uv installs it if you don't have it.

## Set up

```sh
cd python
uv sync --extra dev
```

This creates `python/.venv` with the package and the `dev` extra: pytest, ruff, and Zensical and mkdocstrings for these docs. Run anything in it with `uv run`, or activate it with `source .venv/bin/activate`.

`uv.lock` is gitignored, so `uv sync` resolves the newest versions `pyproject.toml` allows. Commit it, and use `uv sync --locked` in CI, to pin them.

## Layout

```
python/
  pyproject.toml           dependencies, entry points, ruff settings
  src/python_project/
    main.py                the command-line app (my_app)
    api/                   the API server (my_api)
    exceptions.py          base classes for the package's own exceptions
    utils/                 logging, profiling and deprecation helpers
  tests/
  scripts/
```

## Rename the package

The template's names are placeholders. Search for and replace:

- `python_project`: the import name (also the folder `src/python_project/`)
- `PYTHON_PROJECT`: the distribution name in `pyproject.toml`
- `PROJECT_NAME`: in docstrings, log messages, and the default log file `~/PROJECT_NAME.log`
- `my_app` and `my_api`: the command names, under `[project.scripts]`

## Test, lint and format

```sh
uv run pytest tests
uv run ruff check .            # add --fix to fix what it can
uv run ruff format .           # or --check, as CI does
```

CI runs all three on Python 3.13, 3.14 and 3.15. The pre-commit hooks in `.pre-commit-config.yaml` run ruff on commit.

## Next

- [Command-line app](cli.md)
- [API server](api-server.md)
- [Logging](logging.md)
- [API reference](reference.md)
