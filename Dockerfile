# Backend tacticode — для App с типом Docker
# Сборка из корня репо (backend/, prod/ в корне)
FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --production

COPY backend/ ./
EXPOSE 4000
HEALTHCHECK --interval=10s --timeout=5s --start-period=60s --retries=5 \
  CMD node -e "require('http').get('http://127.0.0.1:4000/api/health', (r) => {if (r.statusCode !== 200) process.exit(1)}).on('error', () => process.exit(1))"
CMD ["node", "src/server.js"]
