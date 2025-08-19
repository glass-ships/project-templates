import os
import logging
from pathlib import Path

# import pytest

from python_project.utils.logging import add_log_fh, get_logger, set_log_config


def test_logger():
    logger = get_logger("test_logger")
    assert logger is not None
    assert isinstance(logger, logging.Logger)
    assert logger.level == logging.INFO
    assert logger.name == "test_logger"
    assert len(logger.handlers) == 1
    assert isinstance(logger.handlers[0], logging.StreamHandler)

    set_log_config(logging.DEBUG)
    assert logger.level == logging.DEBUG

    logfile = "test.log"
    add_log_fh(logger, logfile)
    assert len(logger.handlers) == 2
    assert isinstance(logger.handlers[1], logging.FileHandler)
    logger.info("Test log message")
    assert logger.handlers[1].baseFilename == str(Path(logfile).absolute())

    os.remove(logfile)
