FROM node:12.17.0-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run tsc

## this is stage two , where the app actually runs

FROM node:12.17.0-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /usr/src/app/dist ./dist
RUN npm run migratedb
## EXPOSE 3000 # No need with the bot
CMD npm start