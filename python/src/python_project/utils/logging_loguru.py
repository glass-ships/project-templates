import sys
from typing import Union

import loguru

LOGURU_FORMAT = " ".join(
    [
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green>",
        "<level>{level: <8}</level>",
        "<cyan>{name: <18}</cyan>",
        "<level>{message}</level>",
    ]
)
LOGURU_FORMAT_SIMPLE = "{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name: <16} | {message}"


def get_logger(filename: str | None = None, level: Union[str, int] = "INFO"):
    logger = loguru.logger
    logger.remove()
    logger.add(
        sink=sys.stderr,
        level=level,
        format=LOGURU_FORMAT,
        colorize=True,
    )
    if filename:
        fp = f"logs/{filename}"
        logger.add(
            sink=fp + "_{time:YYYYMMDD_HHmmss}.log",
            level=level,
            format=LOGURU_FORMAT_SIMPLE,
        )
    return logger
