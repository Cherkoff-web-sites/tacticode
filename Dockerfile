# Backend+Frontend in one container (build from repo root)
FROM node:20-alpine AS frontend-build

WORKDIR /app
COPY prod/package*.json ./
RUN npm install
COPY prod/ ./
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Serve frontend static files from backend
COPY --from=frontend-build /app/dist /app/public

EXPOSE 4000
HEALTHCHECK --interval=10s --timeout=5s --start-period=120s --retries=10 \
  CMD node -e "require('http').get('http://127.0.0.1:4000/api/health', (r) => {if (r.statusCode !== 200) process.exit(1)}).on('error', () => process.exit(1))"
CMD ["node", "src/server.js"]
