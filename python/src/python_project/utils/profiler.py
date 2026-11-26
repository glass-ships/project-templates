import cProfile
import pstats
from collections.abc import Callable
from functools import wraps


def profile(
    output_file: str | None = None,
    sort_by: str | pstats.SortKey | list[str | pstats.SortKey] | tuple[str | pstats.SortKey, ...] = "cumulative",
    lines_to_print: int | None = None,
    strip_dirs: bool = False,
) -> Callable[[Callable], Callable]:
    """Decorator that profiles each call of a function with cProfile and writes the stats to a file.

    Based on the profile decorator by Giampaolo Rodola:
    http://code.activestate.com/recipes/577817-profile-decorator/

    Args:
        output_file: File to write the stats to. Defaults to `<function name>.prof`.
        sort_by: How to sort the stats: a string or `pstats.SortKey`, or a list of them. See
            https://docs.python.org/3/library/profile.html#pstats.Stats.sort_stats
        lines_to_print: Number of lines to print, or None for all of them. Sorted by "cumulative",
            the slowest calls come first, so a small number keeps just those.
        strip_dirs: Whether to remove the leading path from file names, to shorten the output.

    Returns:
        The decorator. The decorated function returns what the original returns.

    Example:
        ```python
        @profile(lines_to_print=20)
        def slow_function(): ...
        ```
    """

    def inner(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            _output_file = output_file or func.__name__ + ".prof"
            pr = cProfile.Profile()
            pr.enable()
            retval = func(*args, **kwargs)
            pr.disable()
            pr.dump_stats(_output_file)

            with open(_output_file, "w") as f:
                ps = pstats.Stats(pr, stream=f)
                if strip_dirs:
                    ps.strip_dirs()
                if isinstance(sort_by, (tuple, list)):
                    ps.sort_stats(*sort_by)
                else:
                    ps.sort_stats(sort_by)
                if lines_to_print is not None:
                    ps.print_stats(lines_to_print)
                else:
                    ps.print_stats()
            return retval

        return wrapper

    return inner
