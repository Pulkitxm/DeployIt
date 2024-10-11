IMAGE_NAME=pulkitxm/vercel-builder-test
CONTAINER_NAME=test-vercel-builder
DOCKERFILE_PATH=Dockerfile
ENV_FILE=.env
DESTINATION_DIR=output
BUILD_FOLDER=build

help:
	@echo "Makefile commands:"
	@echo "  build      - Build Docker image"
	@echo "  run        - Run Docker container"
	@echo "  stop       - Stop Docker container"
	@echo "  clean      - Remove Docker container and image"
	@echo "  logs       - View container logs"
	@echo "  shell      - Open shell inside running container"
	@echo "  check      - Check if Docker container is running"

build:
	@echo "Building Docker image..."
	docker build -t $(IMAGE_NAME) -f $(DOCKERFILE_PATH) .

buildf:
	@echo "Building Docker image..."
	docker build -t $(IMAGE_NAME) --no-cache -f $(DOCKERFILE_PATH) .
	@echo ""

run: stop
	@echo "Running Docker container..."
	docker run --env-file $(ENV_FILE) --name $(CONTAINER_NAME) $(IMAGE_NAME)
	@echo ""

stop:
	@echo "Stopping Docker container..."
	-docker stop $(CONTAINER_NAME)
	-docker rm $(CONTAINER_NAME)
	@echo ""

reset:
	@echo "Removing Docker container..."
	-docker rm $(CONTAINER_NAME)
	@echo ""

	@echo "Removing Docker image..."
	-docker rmi $(IMAGE_NAME)
	@echo ""

clean: stop
	@echo "Removing Docker image..."
	rm -rf build dist project DESTINATION_DIR
	@echo ""

logs:
	@echo "Showing logs..."
	docker logs -f $(CONTAINER_NAME)
	@echo ""

shell:
	@echo "Opening shell inside running container..."
	docker exec -it $(CONTAINER_NAME) sh
	@echo ""

copy:
	@echo "Copying build artifacts to $(DESTINATION_DIR)..."
	rm -rf $(DESTINATION_DIR)
	docker cp $(CONTAINER_NAME):'/app/$(BUILD_FOLDER)' '$(DESTINATION_DIR)'
	@echo ""

serve:
	@echo "Serving build artifacts..."
	serve -s $(DESTINATION_DIR)
	@echo ""

check:
	@echo "Checking if Docker container is running..."
	docker inspect --format '{{ .State.Running }}' $(CONTAINER_NAME) > /dev/null 2>&1
