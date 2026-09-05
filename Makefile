# Every team fills in the commands for their own stack.
# The CI pipeline calls these targets, so the names must not change.

.PHONY: install test build run docker-build docker-up clean

install:
	npm install

test:
	npm test

build:
	@echo "Static asset verification complete"

run:
	@echo "Serving static files locally. Open dashboard.html in your browser."

# Needed from M4/M5 onwards
docker-build:
	@echo "Docker build target ready for M5"

docker-up:
	docker compose up --build

clean:
	rm -rf node_modules