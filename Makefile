up:
	docker compose up -d

down:	
	docker compose down -v

delete:
	docker compose down -v --rmi all

build:
	docker compose build --no-cache

delPm2:
	pm2 delete deployt-docker-orch

pm2Logs:
	pm2 logs deployt-docker-orch

startPm2:
	cd docker-orch && pm2 start pnpm --name "deployt-docker-orch" -- start

start:
	make delPm2 && \
	cd docker-builder && make build && \
	cd .. && make startPm2 \
	cd .. && docker compose up -d 

stop:
	make down && \
	pm2 stop deployt-docker-orch
