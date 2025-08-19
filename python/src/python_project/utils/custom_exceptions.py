"""Custom exceptions for PROJECT_NAME"""

class PROJECT_NAMEBaseException:
    """Base class for PROJECT_NAME exceptions"""

class CustomException(PROJECT_NAMEBaseException):
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
        self.custom_kwarg = kwargs.get('custom_kwarg')
