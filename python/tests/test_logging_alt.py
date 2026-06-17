import logging

from python_project.utils.logging_alt import log_to_file, setup_logging


def _clear_root_handlers() -> None:
    root = logging.getLogger()
    for handler in list(root.handlers):
        root.removeHandler(handler)
        handler.close()


def test_log_to_file_adds_and_removes_file_handler(tmp_path, monkeypatch):
    _clear_root_handlers()
    try:
        setup_logging(rotate=False)

        logfile = tmp_path / "logging_alt_context.log"
        resolved_logfile = str(logfile.resolve())

        with log_to_file(str(logfile)):
            logging.getLogger().info("message written in context")
            active_file_handlers = [
                handler
                for handler in logging.getLogger().handlers
                if isinstance(handler, logging.FileHandler)
                and handler.baseFilename == resolved_logfile
            ]
            assert len(active_file_handlers) == 1

        assert all(
            not (
                isinstance(handler, logging.FileHandler)
                and handler.baseFilename == resolved_logfile
            )
            for handler in logging.getLogger().handlers
        )
        assert "message written in context" in logfile.read_text(encoding="utf-8")
    finally:
        _clear_root_handlers()
