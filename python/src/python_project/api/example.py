import logging
from contextlib import asynccontextmanager

from fastapi import APIRouter


@asynccontextmanager
async def lifespan(app):
    logging.info("Performing system startup tasks.")
    yield
    logging.info("Server shutting down.")


router = APIRouter(lifespan=lifespan, tags=["files"], responses={404: {"description": "Not Found"}})


@router.get("/test")
async def _test():
    return {"message": "Hello, World!"}
