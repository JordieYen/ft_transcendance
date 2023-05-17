COMPOSE_YML = ./docker-compose.yml

all: 		build_up

build_up:
			docker-compose --verbose -f $(COMPOSE_YML) up --build

build:
			docker-compose -f $(COMPOSE_YML) build --no-cache

down:
			docker-compose -f $(COMPOSE_YML) down

clean:		down
			docker image prune -a -f
			docker volume prune -f
			docker network prune -f

fclean:		clean
			docker system prune -a -f

ps:
			docker-compose -f $(COMPOSE_YML) ps

restart:
			docker-compose restart

re: 		fclean build_up

.PHONY:		all build_up down build clean fclean ps
