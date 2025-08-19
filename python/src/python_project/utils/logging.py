import logging
import sys
from pathlib import Path
from typing import Optional, Union

FORMAT = "%(asctime)s | %(levelname)-7s | %(name)-8s | %(message)s"
DATEFMT = "%Y-%m-%d %H:%M:%S"
LOG_FMT = logging.Formatter(fmt=FORMAT, datefmt=DATEFMT)


def set_log_config(level: Union[str, int] = logging.INFO):
    """Sets basic logging config and format"""

    logging.basicConfig(
        format=FORMAT,
        datefmt=DATEFMT,
        level=level,
        stream=sys.stdout,
        force=True,
    )

    for logger in [logging.getLogger(name) for name in logging.root.manager.loggerDict]:
        logger.setLevel(level)

    return


def get_logger(name: str, verbose: Optional[bool] = None) -> logging.Logger:
    """Get the logger of a given name and level, adding a stream handler to stdout if none exists"""

    log_level = logging.INFO if verbose is None else logging.DEBUG if verbose is True else logging.WARNING

    # Reset root logger in case it was configured elsewhere
    # logging.root.handlers = []
    logger = logging.getLogger(name)
    logger.setLevel(log_level)
    logger.propagate = False

    # Set a handler for console output
    # if not logger.hasHandlers():
    if not any(isinstance(h, logging.StreamHandler) for h in logger.handlers):
        stream_handler = logging.StreamHandler(sys.stdout)
        stream_handler.setFormatter(LOG_FMT)
        stream_handler.setLevel(log_level)
        logger.addHandler(stream_handler)

    return logger


def add_log_fh(logger: logging.Logger, logfile: str) -> logging.Handler:
    """Add a filehandler to a given logger"""

    Path(logfile).parent.mkdir(parents=True, exist_ok=True)
    file_handler = logging.FileHandler(logfile, mode="w")
    file_handler.setFormatter(LOG_FMT)
    file_handler.setLevel(logging.DEBUG)
    logger.addHandler(file_handler)
    logger.setLevel(logging.DEBUG)
    return file_handler
