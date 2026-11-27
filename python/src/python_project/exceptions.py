"""Custom exceptions for PROJECT_NAME"""


class BaseError(Exception):
    """Base exception class for PROJECT_NAME exceptions"""


class CustomError(BaseError):
    """Generic custom exception class

    Usage:
    ```
    try:
        raise CustomError('Something bad happened', custom_kwarg='value')
    except CustomError as exc:
        print(f'Сaught CustomError exception with custom_kwarg={exc.custom_kwarg}')
    ```
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args)
        self.custom_kwarg = kwargs.get("custom_kwarg")


class AnotherCustomError(CustomError):
    """Another custom exception class"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.another_custom_kwarg = kwargs.get("another_custom_kwarg")
