ROOTDIR = $(shell pwd)
RUN = uv --project backend run
VERSION = $(shell uv --project src/python_project version -s)
SCHEMADIR = $(ROOTDIR)/backend/src/monarch_py/datamodels


# This nifty grep/sort/awk pipeline collects all comments headed by the double "#" symbols next to each target and recycles them as comments
.PHONY: help
help: ## Print this help message
	@grep -hE '^[[:alnum:]_/.-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "\033[36m%-25s\033[0m %s\n", $$1, $$2}'

### Installation and Setup ###

.PHONY: fresh 
fresh: clean all ## Clean and install everything


.PHONY: all
all: install model docs ## Install everything


.PHONY: install
install: install-backend install-frontend ## Install backend and frontend


.PHONY: install-backend
install-backend: ## Install backend
	cd python && \
		uv pip install .[dev]


.PHONY: install-frontend
install-frontend: ## Install frontend
	cd src/react_project && \
		bun install


### Documentation ###

.PHONY: docs
docs: ## Generate documentation
	# Add Documentation Generation Here

### Testing ###

.PHONY: test
test: test-backend test-frontend ## Run all tests


.PHONY: test-backend
test-backend: ## Run backend tests
	$(RUN) pytest src/python_project/tests


# Requires adding test script to package.json
.PHONY: test-frontend
test-frontend:  ## Run frontend tests 
	cd src/react_project && \
		bun run test


### Development ###

.PHONY: dev-api
dev-api: ## Run api in development mode
	# cd src/python_project && \
	# 	uv run uvicorn src.monarch_py.api.main:app --reload


.PHONY: dev-frontend
dev-frontend: ## Run frontend in development mode
	cd src/react_project && \
		bun run dev


### Docker ###

.PHONY: docker-build
docker-build: ## Build docker image
	cd backend && \
		docker build --rm --tag $(IMAGE_URL):$(IMAGE_VERSION) .


.PHONY: docker-push
docker-push: ## Push docker image
	docker push $(IMAGE_URL):$(IMAGE_VERSION)


### Linting, Formatting, and Cleaning ###

.PHONY: clean
clean: ## remove local files from python installation etc.
	rm -f `find . -type f -name '*.py[co]' -o -name '_version.py'` \
	rm -rf `find . -name __pycache__ -o -name "*.egg-info"` \
		**/.ipynb_checkpoints \
		.ruff_cache \
		.pytest_cache \
		.coverage htmlcov \
		build dist \
		src/react_project/dist \
		src/python_project/.venv 

.PHONY: lint
lint: lint-frontend lint-backend ## Lint all code


.PHONY: lint-backend
lint-backend: ## Lint backend code
	$(RUN) ruff check --diff --exit-zero python
	$(RUN) ruff format --check --diff python


.PHONY: lint-frontend
lint-frontend: ## Lint frontend code
	# cd frontend && \
	# 	bun run lint


.PHONY: format
format: format-frontend format-backend ## Format all code


.PHONY: format-backend
format-backend: ## Format backend code
	$(RUN) ruff check --fix --exit-zero python
	$(RUN) ruff format python


.PHONY: format-frontend
format-frontend: ## Format frontend code
	cd src/react_project && \
		bun run lint
