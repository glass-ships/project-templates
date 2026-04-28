from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from python_project.api import example
from python_project.api.middleware.logging_middleware import LoggingMiddleware

# Project root directory to find and include built frontend files
ROOT_DIR = Path(__file__).parent.parent.parent.parent
print(f"Root directory: {ROOT_DIR}")

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

# If we have a frontend built, serve it as static files
if ROOT_DIR.joinpath("static").exists():
    app.mount("", StaticFiles(directory=ROOT_DIR.joinpath("static"), html=True), name="static")
else:
    print("Warning: Frontend not built. Please run 'bun run build' in the 'frontend' directory.")


##############
### ROUTES ###
##############


@app.get("/")
async def _root():
    return RedirectResponse(url="/docs")


@app.get("/api")
async def _api():
    return RedirectResponse(url="/docs")


def run():
    uvicorn.run("python_project.api.main:app", host="127.0.0.1", port=9000, reload=True)


if __name__ == "__main__":
    run()
