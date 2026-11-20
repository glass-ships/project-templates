"""Custom exceptions for PROJECT_NAME"""


class _BaseException(Exception):
    """Base class for PROJECT_NAME exceptions"""


class CustomException(_BaseException):
    """Generic custom exception class

    Usage:
    ```
    try:
        raise CustomException('Something bad happened', custom_kwarg='value')
    except CustomException as exc:
        print(f'Сaught CustomException exception with custom_kwarg={exc.custom_kwarg}')
    ```
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args)
        self.custom_kwarg = kwargs.get("custom_kwarg")


class AnotherCustomException(CustomException):
    """Another custom exception class"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.another_custom_kwarg = kwargs.get("another_custom_kwarg")
