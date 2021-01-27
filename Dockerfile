FROM node:12.17.0-alpine AS build
WORKDIR /app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
COPY . .
RUN npm install
RUN touch config.json && echo "{}" > ./config.json
RUN npm run tsc

## this is stage two , where the app actually runs

FROM node:12.17.0-alpine

WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --production
COPY --from=build /app/dist ./dist
# COPY --from=build /app/knexfile.js .
# RUN npm run migratedb
## EXPOSE 3000 # No need with the bot
CMD npm start
