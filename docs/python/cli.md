# Command-line app

`src/python_project/main.py` is a [Typer](https://typer.tiangolo.com/) app, installed as the `my_app` command (see `[project.scripts]` in `pyproject.toml`).

```sh
uv run my_app --help
uv run my_app --version        # python_project 0.1.0
uv run my_app logger
```

Its commands are examples of the package's utilities. Replace them with your own.

| Command | Shows |
| --- | --- |
| `logger` | A message at each level, in the [logging](logging.md) format |
| `loguru` | The same, with the [loguru setup](logging.md#loguru) |
| `log_exception` | Logging a caught exception with its file and line |
| `custom_exception` | Raising and catching a [`CustomException`](reference.md#python_project.exceptions.CustomException) with extra data |
| `deprecated` | Calling a function marked with the [`deprecated`](reference.md#python_project.utils.deprecated.deprecated) decorator |

## Add a command

```python
@app.command("greet")
def greet(name: str, shout: bool = False):
    """Say hello."""
    message = f"Hello, {name}!"
    typer.echo(message.upper() if shout else message)
```

```sh
uv run my_app greet Ada --shout
```

Typer turns the parameters into arguments and options, and the docstring into the command's help.

`main.py` calls `setup_logging(level="DEBUG", rotate=False)` when it's imported, so every command logs at debug level to the console only. Change that call to log less, or to also write a log file.
