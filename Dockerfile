# Backend tacticode — для App с типом Docker
# Сборка из корня репо (backend/, prod/ в корне)
FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --production

COPY backend/ ./
CMD ["node", "src/server.js"]
