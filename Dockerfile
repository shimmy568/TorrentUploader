FROM node:8.10.0-alpine
EXPOSE 8080

WORKDIR /app/
COPY package*.json .

RUN npm i

COPY src src

CMD [ "npm", "start" ]