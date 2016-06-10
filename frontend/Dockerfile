FROM node:latest

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/src
RUN mkdir -p /usr/src/app/build
RUN mkdir -p /usr/src/app/config

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app
RUN npm install

COPY ./server.js /usr/src/app
COPY ./webpack-production.config.js /usr/src/app
COPY ./webpack-dev-server.config.js /usr/src/app
COPY ./config /usr/src/app/config
COPY ./src /usr/src/app/src

COPY ./build /usr/src/app/build

EXPOSE 3000

CMD [ "node", "./server.js", "production" ]
