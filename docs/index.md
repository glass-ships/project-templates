# Project Templates

Starting points for new projects, with tests, linting and CI already set up.

<div class="grid cards" markdown>

- **[Python](python/index.md)**

  A Python package managed with [uv](https://docs.astral.sh/uv/): a [Typer](https://typer.tiangolo.com/) command-line app, a [FastAPI](https://fastapi.tiangolo.com/) server, and logging and profiling utilities.

- **[Frontend](frontend/index.md)**

  A React and TypeScript app built with [Vite](https://vite.dev/) and [bun](https://bun.sh/): UI components, hooks, utilities, light and dark themes, and unit, end-to-end and accessibility tests.

</div>

## Repository layout

| Folder                                 | What's in it                                                                              |
| -------------------------------------- | ----------------------------------------------------------------------------------------- |
| `python/`                              | The Python package, its tests and scripts                                                 |
| `frontend/`                            | The React app and its tests                                                               |
| `frontend-vue/`                        | Useful composables, utilities, and components for Vue                                     |
| `docs/`                                | This site. The frontend API reference in `docs/frontend/api/` is generated; don't edit it |
| `.github/workflows/`, `.gitlab-ci.yml` | CI for GitHub and GitLab: tests on every change, and this site deployed from `main`       |

## Building these docs

The site is built with [Zensical](https://zensical.org/) from `docs/zensical.toml`. The frontend API reference is generated from the code first:

```sh
uv sync --extra dev --project python         # once: installs Zensical and mkdocstrings
cd frontend && bun run docs && cd ..         # writes docs/frontend/api/
uv run --project python zensical serve -f docs/zensical.toml          # preview at http://localhost:8000
uv run --project python zensical build --strict -f docs/zensical.toml  # builds into docs/site/
```

`make docs` runs the generate and build steps, and `make docs-serve` the generate and preview steps.

`--strict` stops the build on warnings such as broken links, as CI does. Add `--clean` after changing Python docstrings: the build cache only notices changes to the pages, so without it the Python API reference can be out of date.
