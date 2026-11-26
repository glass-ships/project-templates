# Logging

The package has two interchangeable logging setups with the same functions and the same output format. Pick one and delete the other.

- `utils/logging.py` uses the standard library's `logging`. No extra dependency.
- `utils/logging_loguru.py` uses [loguru](https://loguru.readthedocs.io/), and routes standard `logging` records (from third-party libraries) through it too.

Both log to the console, and by default also to `~/PROJECT_NAME.log`, which rotates at midnight and keeps 15 old files:

```
2026-11-26 12:48:14 | INFO | python_project.main | This is an info message.
```

## Standard logging

Call `setup_logging` once, where the program starts (as `main.py` does), not in library modules:

```python
from python_project.utils.logging import setup_logging

setup_logging(level="DEBUG", rotate=True, logger_levels={"httpx": "WARNING"})
```

Then log as usual in any module:

```python
import logging

logger = logging.getLogger(__name__)
logger.info("Started")
```

`logger_levels` sets the level of individual loggers, more or less verbose than `level`: use it to quiet a chatty library, or to see debug messages from one module only.

## Loguru

```python
from python_project.utils.logging_loguru import setup_logging

setup_logging(level="DEBUG", rotate=True, logger_levels={"httpx": "WARNING"})
```

```python
from loguru import logger

logger.info("Started")
```

## Log to a file for a while

Both setups have `log_to_file`, which also sends everything to a file until the `with` block ends:

```python
from python_project.utils.logging import log_to_file

with log_to_file("run.log"):
    logger.info("Goes to the console and run.log")
```

`add_log_fh` and `remove_log_fh` do the same without a `with` block. See the [API reference](reference.md#logging) for every option.
