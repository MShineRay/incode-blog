FROM node:latest

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/src
RUN mkdir -p /usr/src/app/tools
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install

COPY ./src /usr/src/app/src
COPY ./tools /usr/src/app/tools

EXPOSE 3000

CMD [ "npm", "start" ]
