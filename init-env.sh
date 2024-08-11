#!/bin/zsh

env_local() {
  export COMPOSE_ENV_FILES=./workspaces/main-service/.env.local,./workspaces/auth-service/.env.local,./workspaces/notification-service/.env.local
  echo "*****************************"
  echo "********* Env Local *********"
  echo "*****************************"
}

env_dev() {
  export COMPOSE_ENV_FILES=./workspaces/main-service/.env,./workspaces/auth-service/.env,./workspaces/notification-service/.env;
  echo "***************************"
  echo "********* Env Dev *********"
  echo "***************************"
}

env_prod() {
  export COMPOSE_ENV_FILES=./workspaces/main-service/.env.prod,./workspaces/auth-service/.env.prod,./workspaces/notification-service/.env.prod;
  echo "****************************"
  echo "********* Env Prod *********"
  echo "****************************"
}