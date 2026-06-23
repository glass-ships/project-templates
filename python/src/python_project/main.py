import os
import sys
from typing import Optional

import typer

from python_project.utils.logging import get_logger
from python_project.utils.logging_loguru import get_logger as get_loguru_logger


app = typer.Typer()
logger = get_logger("main", level="DEBUG")
loguru_logger = get_loguru_logger("main", level="DEBUG")


class CustomHelpTyper(typer.Typer):
    def get_help_option_names(self) -> tuple[str, ...]:
        return ("-h", "--help")


@app.callback(invoke_without_command=True)
def callback(version: Optional[bool] = typer.Option(None, "--version", is_eager=True)):
    if version:
        from python_project import __version__

        typer.echo(f"python_project {__version__}")
        raise typer.Exit()


@app.command("log_exception")
def log_exception():
    try:
        int("a")
    except BaseException:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        logger.error(f"Oh no! Something went wrong:\n\t[{fname}:{exc_tb.tb_lineno}] {exc_type.__name__}: {exc_obj}")


@app.command("custom_exception")
def custom_exception():
    from python_project.exceptions import CustomException

    try:
        raise CustomException("Something bad happened", custom_kwarg="some_value")
    except CustomException as exc:
        logger.error(f"Caught CustomException with custom_kwarg={exc.custom_kwarg}")


@app.command("loguru_exception")
def loguru_exception():
    try:
        int("a")
    except BaseException:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        loguru_logger.error(
            f"Oh no! Something went wrong:\n\t[{fname}:{exc_tb.tb_lineno}] {exc_type.__name__}: {exc_obj}"
        )
