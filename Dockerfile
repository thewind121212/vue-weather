# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_WEATHER_API_URL
ARG VITE_WEATHER_API_KEY

RUN if [ -z "$VITE_WEATHER_API_URL" ]; then \
      echo "ERROR: VITE_WEATHER_API_URL is required."; \
      exit 1; \
    fi

RUN if [ -z "$VITE_WEATHER_API_KEY" ]; then \
      echo "ERROR: VITE_WEATHER_API_KEY is required."; \
      exit 1; \
    fi

ENV VITE_WEATHER_API_URL=${VITE_WEATHER_API_URL}
ENV VITE_WEATHER_API_KEY=${VITE_WEATHER_API_KEY}

COPY package.json package-lock.json* ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.cjs ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

RUN printf "VITE_WEATHER_API_URL=%s\nVITE_WEATHER_API_KEY=%s\n" "${VITE_WEATHER_API_URL}" "${VITE_WEATHER_API_KEY}" > .env.production

RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4141

ENV BUN_INSTALL=/usr/local/bun
RUN apk add --no-cache curl bash && \
  curl -fsSL https://bun.sh/install | bash && \
  ln -sf /usr/local/bun/bin/bun /usr/local/bin/bun && \
  ln -sf /usr/local/bun/bin/bunx /usr/local/bin/bunx && \
  npm install -g pm2@5

COPY --from=builder /app/dist ./dist
COPY server.js ./server.js
COPY ecosystem.config.cjs ./ecosystem.config.cjs

RUN chown -R node:node /app
USER node

EXPOSE 4141

CMD ["pm2-runtime", "ecosystem.config.cjs", "--only", "vue-weather"]
