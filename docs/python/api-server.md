# API server

`src/python_project/api/` is a [FastAPI](https://fastapi.tiangolo.com/) server, installed as the `my_api` command.

```sh
uv run my_api
```

It runs at <http://127.0.0.1:9000> and restarts when the code changes.

| Path | What it is |
| --- | --- |
| `/docs` | Interactive API docs (Swagger UI). `/api` redirects here, and so does `/` until the frontend is built |
| `/redoc` | The same docs, in ReDoc |
| `/api/test` | An example route: `{"message": "Hello, World!"}` |

## Layout

- `api/main.py` creates the app, adds the middleware, includes the routers under `/api`, and defines `run()`, which `my_api` calls.
- `api/example.py` is an example router, with a `lifespan` function for startup and shutdown tasks.
- `api/middleware/logging_middleware.py` is a place to log each request. Its logging lines are commented out: uncomment what you need.

CORS allows every origin. Narrow `allow_origins` in `main.py` before deploying.

## Add routes

Make a router in a new module:

```python title="api/users.py"
from fastapi import APIRouter

router = APIRouter(tags=["users"])


@router.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"id": user_id}
```

and include it in `api/main.py`, next to the example:

```python
from python_project.api import users

app.include_router(users.router, prefix=PREFIX)  # served at /api/users/{user_id}
```

## With the frontend

The frontend's dev server (`bun run dev`) forwards requests for `/api` to this server on port 9000, so run both and the frontend can call `/api/...` directly.

Once the frontend is built, the server serves it too, from `dist/` at the repo root: `/` shows the app, and the frontend's own pages such as `/nexus` load when opened directly. Build it with `bun run build` in `frontend/`, or:

```sh
uv run python scripts/build_frontend.py      # add --cleanup to delete node_modules afterwards
```

The server checks for the build when it starts, so restart it after the first build.
