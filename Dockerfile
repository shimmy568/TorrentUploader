FROM node:8.10.0-alpine
EXPOSE 8080

WORKDIR /app/
COPY package*.json ./

RUN npm i

COPY config.json .
COPY src src
COPY public public
COPY views views

CMD [ "npm", "start" ]