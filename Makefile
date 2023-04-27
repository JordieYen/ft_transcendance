COMPOSE_YML = ./docker-compose.yml

.PHONY: all build_up down build clean fclean ps

all: build_up

build_up:
			docker-compose -f $(COMPOSE_YML) up --build -d

down:
			docker-compose -f $(COMPOSE_YML) down

build:
			docker-compose -f $(COMPOSE_YML) build --no-cache

clean:	down
		docker image prune -a -f
		docker volume prune -f
		docker network prune -f

fclean:	clean
		docker system prune -a -f

ps:
		docker-compose -f $(COMPOSE_YML) ps

re: fclean build_up


