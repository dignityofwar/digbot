FROM node:16-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

RUN npx mikro-orm cache:generate

COPY . .
RUN npm run build

FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /usr/src/app/temp ./temp
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
