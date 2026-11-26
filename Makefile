ROOTDIR = $(shell pwd)
# --extra dev on every run: without it, uv would remove the dev tools (pytest, ruff, zensical) from the venv
RUN = uv run --project python --extra dev
VERSION = $(shell uv version --short --project python)


# This nifty grep/sort/awk pipeline collects all comments headed by the double "#" symbols next to each target and recycles them as comments
.PHONY: help
help: ## Print this help message
	@grep -hE '^[[:alnum:]_/.-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "\033[36m%-25s\033[0m %s\n", $$1, $$2}'

### Installation and Setup ###

.PHONY: fresh
fresh: clean all ## Clean and install everything


.PHONY: all
all: install docs ## Install everything and build the docs


.PHONY: install
install: install-backend install-frontend ## Install backend and frontend


.PHONY: install-backend
install-backend: ## Install backend
	cd python && \
		uv sync --extra dev


.PHONY: install-frontend
install-frontend: ## Install frontend
	cd frontend && \
		bun install


### Documentation ###

.PHONY: docs
docs: ## Build the docs site into docs/site/ (generates the frontend API reference first)
	cd frontend && bun run docs
	# --clean: the cache only tracks the pages, so it misses docstring changes in the Python code
	$(RUN) zensical build --strict --clean -f docs/zensical.toml


.PHONY: docs-serve
docs-serve: ## Preview the docs site at http://localhost:8000
	cd frontend && bun run docs
	rm -rf docs/.cache # see docs: serve has no --clean
	$(RUN) zensical serve -f docs/zensical.toml

### Testing ###

.PHONY: test
test: test-backend test-frontend ## Run all tests


.PHONY: test-backend
test-backend: ## Run backend tests
	cd python && \
		uv run --extra dev pytest tests


.PHONY: test-frontend
test-frontend: ## Run frontend type check, unit and end-to-end tests
	cd frontend && \
		bun run test:types && \
		bun run test:unit && \
		bun run test:e2e


### Development ###

.PHONY: dev-api
dev-api: ## Run the api, restarting on changes (http://127.0.0.1:9000)
	$(RUN) my_api


.PHONY: dev-frontend
dev-frontend: ## Run the frontend dev server (http://localhost:5173)
	cd frontend && \
		bun run dev


### Docker ###
# There's no Dockerfile yet: add one to python/, and set IMAGE_URL (e.g. make docker-build IMAGE_URL=registry/name)

IMAGE_VERSION ?= $(VERSION)

.PHONY: docker-build
docker-build: ## Build docker image
	cd python && \
		docker build --rm --tag $(IMAGE_URL):$(IMAGE_VERSION) .


.PHONY: docker-push
docker-push: ## Push docker image
	docker push $(IMAGE_URL):$(IMAGE_VERSION)


### Linting, Formatting, and Cleaning ###

.PHONY: clean
clean: ## Remove build output, caches, the frontend and docs builds, and python/.venv
	rm -f `find . -path ./frontend/node_modules -prune -o -type f \( -name '*.py[co]' -o -name '_version.py' \) -print`
	rm -rf `find . -path ./frontend/node_modules -prune -o \( -name __pycache__ -o -name "*.egg-info" -o -name .ipynb_checkpoints \) -print`
	rm -rf \
		.ruff_cache python/.ruff_cache \
		.pytest_cache python/.pytest_cache \
		.coverage htmlcov \
		build dist \
		docs/site docs/frontend/api \
		python/.venv

.PHONY: lint
lint: lint-frontend lint-backend ## Lint all code


.PHONY: lint-backend
lint-backend: ## Lint backend code
	$(RUN) ruff check python
	$(RUN) ruff format --check --diff python


.PHONY: lint-frontend
lint-frontend: ## Lint frontend code
	cd frontend && \
		bun run test:lint && \
		bun run test:format


.PHONY: format
format: format-frontend format-backend ## Format all code


.PHONY: format-backend
format-backend: ## Format backend code
	$(RUN) ruff check --fix --exit-zero python
	$(RUN) ruff format python


.PHONY: format-frontend
format-frontend: ## Format frontend code
	cd frontend && \
		bun run lint && \
		bun run format
