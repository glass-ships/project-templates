import logging
import sys
from pathlib import Path

import typer

from python_project.exceptions import CustomException
from python_project.utils.logging import setup_logging

app = typer.Typer()
setup_logging(level="DEBUG")
logger = logging.getLogger(__name__)

class CustomHelpTyper(typer.Typer):
    def get_help_option_names(self) -> tuple[str, ...]:
        return ("-h", "--help")


@app.callback(invoke_without_command=True)
def callback(version: bool | None = typer.Option(None, "--version", is_eager=True)):
    if version:
        from python_project import __version__

        typer.echo(f"python_project {__version__}")
        raise typer.Exit()


@app.command("logger")
def logger_command():
    logger.debug("This is a debug message.")
    logger.info("This is an info message.")
    logger.warning("This is a warning message.")
    logger.error("This is an error message.")
    logger.critical("This is a critical message.")

@app.command("log_exception")
def log_exception():
    try:
        int("a")
    except ValueError:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = Path(exc_tb.tb_frame.f_code.co_filename).name
        logger.error(f"Oh no! Something went wrong:\n\t[{fname}:{exc_tb.tb_lineno}] {exc_type.__name__}: {exc_obj}")


@app.command("custom_exception")
def custom_exception():
    try:
        raise CustomException("Something bad happened", custom_kwarg="some_value")
    except CustomException as exc:
        logger.error(f"Caught CustomException with custom_kwarg={exc.custom_kwarg}")


@app.command("deprecated")
def deprecated():
    from python_project.utils.deprecated import deprecated as deprecated_decorator

    @deprecated_decorator("This function is deprecated. Use another_function instead.")
    def old_function():
        return "This is the old function."

    typer.echo(old_function())
