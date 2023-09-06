FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

EXPOSE 3001

COPY . .
