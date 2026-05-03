#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.yml"
ICON_PULL="⬇️ "
ICON_UP="🚀 "
ICON_PRUNE="🧹 "
ICON_DONE="✅ "

JSON_FILE="${SCRIPT_DIR}/deploy.json"

if [ ! -f "${JSON_FILE}" ]; then
  echo "Missing deploy.json file in ${SCRIPT_DIR}" >&2
  exit 1
fi

IMG_TAG=$(jq -r '.IMG_TAG' "${JSON_FILE}")
FE_IP=$(jq -r '.FE_IP' "${JSON_FILE}")
FE_CONTAINER_NAME=$(jq -r '.FE_CONTAINER_NAME' "${JSON_FILE}")

if [ -z "${IMG_TAG}" ] || [ -z "${FE_IP}" ] || [ -z "${FE_CONTAINER_NAME}" ]; then
  echo "deploy.json must contain non-empty IMG_TAG, FE_IP, and FE_CONTAINER_NAME fields." >&2
  exit 1
fi

export IMG_TAG
export FE_IP
export FE_CONTAINER_NAME

if [ ! -f "${ENV_FILE}" ]; then
  echo "Missing .env file in ${SCRIPT_DIR}" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but not installed or not on PATH." >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose V2 is required (docker compose command)." >&2
  exit 1
fi

export GITHUB_REPOSITORY_OWNER="${GITHUB_REPOSITORY_OWNER:-thewind121212}"

echo "${ICON_PULL}Pulling latest images..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" pull

echo "${ICON_UP}Starting services..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d --remove-orphans

echo "📋 Docker services status:"
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" ps

echo "📜 Recent container logs (tail 100 lines per service):"
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" logs --tail=100

echo "${ICON_PRUNE}Cleaning unused images..."
docker image prune -f >/dev/null

echo "${ICON_DONE}Deployment completed."
