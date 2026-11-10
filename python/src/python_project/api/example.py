import logging
from contextlib import asynccontextmanager

from fastapi import APIRouter

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app):
    logger.info("Performing system startup tasks.")
    yield
    logger.info("Server shutting down.")


router = APIRouter(lifespan=lifespan, tags=["files"], responses={404: {"description": "Not Found"}})


@router.get("/test")
async def _test():
    return {"message": "Hello, World!"}
