DOCKER_REPO=index.docker.io
IMAGE_NAME=eufast/tile-server
IMAGE_TAG=0.1.0

# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help


# DOCKER TASKS
# Build the container
build: ## Build the container
	docker build -t $(IMAGE_NAME) .

# Docker publish
publish: tag ## Publish the taged container
	docker push $(DOCKER_REPO)/$(IMAGE_NAME):$(IMAGE_TAG)

# Docker tagging
tag: ## Generate container tag
	docker tag $(IMAGE_NAME) $(DOCKER_REPO)/$(IMAGE_NAME):$(IMAGE_TAG)

run-local: ## Run as a local docker container
	docker run -p 3000:3000 -ti $(DOCKER_REPO)/$(IMAGE_NAME):$(IMAGE_TAG)
