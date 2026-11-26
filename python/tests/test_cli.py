import pytest
from typer.testing import CliRunner

from python_project.main import app

runner = CliRunner()


@pytest.mark.parametrize("flag", ["-h", "--help"])
def test_help_options(flag):
    result = runner.invoke(app, [flag])

    assert result.exit_code == 0, result.output
    assert "Commands" in result.output
