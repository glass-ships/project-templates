from pathlib import Path

import uvicorn
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException
from starlette.types import Scope

from python_project.api import example
from python_project.api.middleware.logging_middleware import LoggingMiddleware

# Repo root (python/src/python_project/api/main.py -> 4 folders up), and the folder the frontend
# builds to (build.outDir in frontend/vite.config.ts)
ROOT_DIR = Path(__file__).resolve().parents[4]
FRONTEND_DIR = ROOT_DIR / "dist"

PREFIX = "/api"

app = FastAPI(
    docs_url="/docs",
    redoc_url="/redoc",
)

app.description = """
# Python Project API

This is an example API server built with FastAPI as a backend for the Python project.
"""


app.include_router(example.router, prefix=PREFIX)

##################
### Middleware ###
##################

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)

##############
### ROUTES ###
##############


@app.get("/api")
async def _api():
    return RedirectResponse(url="/docs")


################
### Frontend ###
################


class FrontendFiles(StaticFiles):
    """The built frontend, where a path that isn't a file gets index.html.

    The frontend has its own routes (e.g. /nexus), which only exist in the browser. Sending them
    index.html lets those pages load when opened from a link or refreshed. Paths under /api, and
    paths with a file extension (a missing /logo.png), still get a 404.
    """

    async def get_response(self, path: str, scope: Scope) -> Response:
        try:
            return await super().get_response(path, scope)
        except HTTPException as exc:
            is_api = path == "api" or path.startswith("api/")
            is_file = "." in path.rsplit("/", 1)[-1]
            if exc.status_code != 404 or is_api or is_file:
                raise
            return await super().get_response("index.html", scope)


# Mounted last, so the API routes above come first
if FRONTEND_DIR.exists():
    app.mount("", FrontendFiles(directory=FRONTEND_DIR, html=True), name="frontend")
else:
    print("Warning: Frontend not built. Please run 'bun run build' in the 'frontend' directory.")

    @app.get("/")
    async def _root():
        return RedirectResponse(url="/docs")


def run():
    uvicorn.run("python_project.api.main:app", host="127.0.0.1", port=9000, reload=True)


if __name__ == "__main__":
    run()
