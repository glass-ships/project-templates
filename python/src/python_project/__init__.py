try:
    from importlib import metadata
except ImportError: # for Python<3.8
    import importlib_metadata as metadata

try:
    __version__ = metadata.version(__name__)
except metadata.PackageNotFoundError:
    # package is not installed
    __version__ = "0.1.0"  # pragma: no cover
