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

all: fast

fast:
	@docker-compose down
	@docker-compose up --build

re: clean build

up:
	@echo "${YELLOW}${BOLD}Starting up containers...${RESET}"
	@docker-compose up
	@echo "${GREEN}✅ Done...${RESET}"

ps:
	@echo "${YELLOW}${BOLD}Listing containers...${RESET}"
	@docker ps
	@echo "${GREEN}✅ Done...${RESET}"

down:
	@echo "${YELLOW}${BOLD}Shutting down containers...${RESET}"
	@docker-compose down
	@echo "${GREEN}✅ Done...${RESET}"

# =========================== Building ==========================

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
vault:
	@echo "${GREEN}${BOLD}Starting vault container..${RESET}"
	@docker-compose -f docker-compose.yml up -d --build --no-deps vault
nginx:
	@echo "${GREEN}${BOLD}Starting nginx container..${RESET}"
	@docker-compose -f docker-compose.yml up -d --build --no-deps nginx
backend:
	@echo "${GREEN}${BOLD}Starting backend container..${RESET}"
	@docker-compose -f docker-compose.yml up -d --build backend

# =========================== Logs ==========================

logs:
	@echo "${YELLOW}${BOLD}Showing logs...${RESET}"
	@docker-compose logs -f
	@echo "${GREEN}✅ Done...${RESET}"
logs-backend:
	@echo "${YELLOW}${BOLD}Showing backend logs...${RESET}"
	@docker-compose logs -f backend
	@echo "${GREEN}✅ Done...${RESET}"
logs-frontend:
	@echo "${YELLOW}${BOLD}Showing frontend logs...${RESET}"
	@docker-compose logs -f frontend
	@echo "${GREEN}✅ Done...${RESET}"
logs-nginx:
	@echo "${YELLOW}${BOLD}Showing nginx logs...${RESET}"
	@docker-compose logs -f nginx
	@echo "${GREEN}✅ Done...${RESET}"
logs-vault:
	@echo "${YELLOW}${BOLD}Showing vault: logs...${RESET}"
	@docker-compose logs -f vault
	@echo "${GREEN}✅ Done...${RESET}"
# =========================== exec ==========================

exec-back:
	@echo "${YELLOW}${BOLD}Executing command in backend container...${RESET}"
	@docker exec -it backend sh 
	@echo "${GREEN}✅ Done...${RESET}"
exec-front:	
	@echo "${YELLOW}${BOLD}Executing command in frontend container...${RESET}"
	@docker exec -it frontend sh 
	@echo "${GREEN}✅ Done...${RESET}"
exec-nginx:	
	@echo "${YELLOW}${BOLD}Executing command in nginx container...${RESET}"
	@docker exec -it nginx sh 
	@echo "${GREEN}✅ Done...${RESET}"
exec-vault:	
	@echo "${YELLOW}${BOLD}Executing command in vault container...${RESET}"
	@docker exec -it vault sh 
	@echo "${GREEN}✅ Done...${RESET}"
# =========================== deleting ==========================

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