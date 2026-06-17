"""
Custom logging setup for PROJECT_NAME with optional log rotation and enhanced formatting.
Configures the root logger to log to both console and a rotating file, with a custom format that includes timestamps, log levels, and source modules.
"""

import logging
import logging.handlers
import os
import sys
from contextlib import contextmanager
from typing import Iterator, Literal


class OriginFormatter(logging.Formatter):
    """Display the source module for root logger records."""

    def format(self, record):
        record.origin = record.module if record.name == "root" else record.name
        return super().format(record)


def setup_logging(
    level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO",
    rotate: bool = True,
):
    """Configure logging with a custom format and optional timed rotating file handler.

    Arguments
    ---------
    rotate: bool
        If True, add a TimedRotatingFileHandler that rotates logs at midnight and keeps 15 backups.
    reset_handlers: bool
        If True, remove existing handlers from the root logger before adding new ones.
        This prevents duplicate logs if setup_logging is called multiple times.
    """
    logging.getLogger().setLevel(level)

    # Shorten level names to 4 characters for better log formatting
    logging.addLevelName(logging.DEBUG, "DBUG")
    logging.addLevelName(logging.INFO, "INFO")
    logging.addLevelName(logging.WARNING, "WARN")
    logging.addLevelName(logging.ERROR, "ERR")
    logging.addLevelName(logging.CRITICAL, "CRIT")

    _fmt = "%(asctime)s | %(levelname)-4s | %(origin)-12s | %(message)s"
    _date_fmt = "%Y-%m-%d %H:%M:%S"
    LOG_FMT = OriginFormatter(fmt=_fmt, datefmt=_date_fmt)

    if rotate:
        # Setup timed rotating file handler
        fh = logging.handlers.TimedRotatingFileHandler(
            os.path.join(os.path.expanduser("~"), "PROJECT_NAME.log"), when="midnight", backupCount=15
        )
        fh.setLevel(level)
        fh.setFormatter(LOG_FMT)
        logging.getLogger().addHandler(fh)

    # Setup stream handler
    sh = logging.StreamHandler(sys.stdout)
    sh.setLevel(level)
    sh.setFormatter(LOG_FMT)
    logging.getLogger().addHandler(sh)


def add_log_fh(logfile: str, mode: Literal["w", "a"] = "w") -> logging.Handler:
    """Add a file handler to the root logger, replacing any existing one for the same file.

    mode follows FileHandler semantics, typically "w" (overwrite) or "a" (append).
    """

    resolved_logfile = os.path.abspath(logfile)
    os.makedirs(os.path.dirname(resolved_logfile), exist_ok=True)

    # Keep only one open handler per logfile so callers can toggle logging on/off.
    remove_log_fh(resolved_logfile)

    file_handler = logging.FileHandler(resolved_logfile, mode=mode)
    file_handler.setFormatter(logging.getLogger().handlers[0].formatter)  # Use the same format as existing handlers
    logging.getLogger().addHandler(file_handler)

    return file_handler


def remove_log_fh(logfile: str):
    """Remove a file handler from the root logger that matches the given logfile."""

    resolved_logfile = os.path.abspath(logfile)

    for handler in logging.getLogger().handlers:
        if not isinstance(handler, logging.FileHandler):
            continue

        if os.path.abspath(handler.baseFilename) != resolved_logfile:
            continue

        logging.getLogger().removeHandler(handler)


@contextmanager
def log_to_file(logfile: str, mode: Literal["w", "a"] = "w") -> Iterator[None]:
    """Context manager to temporarily add a file handler to the root logger.

    The file handler is removed when the context exits, even if an exception occurs.
    """

    handler = add_log_fh(logfile, mode=mode)
    try:
        yield
    finally:
        logging.getLogger().removeHandler(handler)
