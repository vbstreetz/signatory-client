dev:
	@docker-compose -f docker-compose-dev.yml -p sc-dev up --build

build:
	@docker-compose -f docker-compose-build.yml -p sc-build build

run:
	@docker-compose -f docker-compose-release.yml -p sc-release pull
	@docker-compose -f docker-compose-release.yml -p sc-release up

push:
	@docker-compose -f docker-compose-build.yml -p sc-build push

.PHONY: push run build dev
