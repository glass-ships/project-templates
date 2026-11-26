import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from python_project.api.main import FrontendFiles


@pytest.fixture
def client(tmp_path):
    """an app serving a fake frontend build"""
    (tmp_path / "index.html").write_text("<p>app</p>")
    (tmp_path / "app.js").write_text("js")
    app = FastAPI()
    app.mount("", FrontendFiles(directory=tmp_path, html=True))
    return TestClient(app)


def test_serves_the_built_files(client):
    response = client.get("/app.js")

    assert response.status_code == 200
    assert response.text == "js"


@pytest.mark.parametrize("path", ["/", "/nexus", "/blog/a-post"])
def test_sends_index_html_for_the_frontends_own_pages(client, path):
    response = client.get(path)

    assert response.status_code == 200
    assert response.text == "<p>app</p>"


@pytest.mark.parametrize("path", ["/missing.png", "/assets/missing.js", "/api", "/api/missing"])
def test_still_404s_for_missing_files_and_api_paths(client, path):
    assert client.get(path).status_code == 404
