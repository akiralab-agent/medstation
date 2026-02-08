# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine AS production

RUN npm install -g serve

COPY --from=build /app/dist /app

ENV PORT=8080

EXPOSE 8080

CMD ["sh", "-c", "serve -s /app -l $PORT"]
