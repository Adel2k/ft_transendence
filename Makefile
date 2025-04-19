BLACK			= \e[30m
RED				= \e[31m
GREEN			= \e[32m
YELLOW			= \e[33m
BLUE			= \e[34m
MAGENTA			= \e[35m
CYAN			= \e[36m
WHITE			= \e[37m
RESET			= \e[0m

BOLD			= \e[1m
DIM				= \e[2m
UNDERLINE		= \e[4m
BLINK			= \e[5m
REVERSE			= \e[7m
HIDDEN			= \e[8m

BG_BLACK		= \e[40m
BG_RED			= \e[41m
BG_GREEN		= \e[42m
BG_YELLOW		= \e[43m
BG_BLUE			= \e[44m
BG_MAGENTA		= \e[45m
BG_CYAN			= \e[46m
BG_WHITE		= \e[47m

all: build

re: clean all

build:
	@echo "${GREEN}${BOLD}Building up containers...${RESET}"
	@docker-compose up -d --build 
	@echo "${GREEN}✅ Done...${RESET}\n"
	@echo "$(BG_BLUE)╔════════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(BG_BLUE)║                       ${BLACK}${BOLD}🎉WELCOME TO🎉$(RESET)$(BG_BLUE)                       ║$(RESET)"
	@echo "$(BG_BLUE)║                       ${BLACK}${BOLD}FT_Gmbrdilos🦏$(RESET)$(BG_BLUE)                       ║$(RESET)"
	@echo "$(BG_BLUE)╚════════════════════════════════════════════════════════════╝$(RESET)"

front:
	@echo "${GREEN}${BOLD}Starting front container..${RESET}"
	@docker-compose -f docker-compose.yml up -d --build --no-deps frontend
nginx:
	@echo "${GREEN}${BOLD}Starting nginx container..${RESET}"
	@docker-compose -f docker-compose.yml up -d --build --no-deps nginx

backend:
	@echo "${GREEN}${BOLD}Starting backend container..${RESET}"
	@docker-compose -f docker-compose.yml up -d --build backend

up:
	@echo "${YELLOW}${BOLD}Starting up containers...${RESET}"
	@docker-compose up
	@echo "${GREEN}✅ Done...${RESET}"

down:
	@echo "${YELLOW}${BOLD}Shutting down containers...${RESET}"
	@docker-compose down
	@echo "${GREEN}✅ Done...${RESET}"

clean: down
	@echo "${RED}${BOLD}Cleaning up containers, images and networks...${RESET}"
	@docker-compose down --rmi all
	@docker system prune --force --all
	@echo "${GREEN}✅ Done...${RESET}"

fclean: down
	@echo "${RED}${BOLD}Cleaning up containers, volumes, images and networks...${RESET}"
	@docker-compose down --rmi all
	@docker system prune --volumes --force --all
	@echo "${GREEN}✅ Done...${RESET}"

.PHONY: all re up down front backend nginx build clean fclean