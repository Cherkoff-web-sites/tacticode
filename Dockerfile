# Backend+Frontend in one container (build from repo root)
FROM node:20-alpine AS frontend-build

WORKDIR /app
COPY prod/package*.json ./
RUN npm install
COPY prod/ ./
RUN npm run build

FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache curl
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend/ ./

# Serve frontend static files from backend
COPY --from=frontend-build /app/dist /app/public

EXPOSE 4000
HEALTHCHECK --interval=10s --timeout=5s --start-period=60s --retries=5 \
  CMD curl -fsS http://127.0.0.1:4000/api/health || exit 1
CMD ["node", "src/server.js"]
