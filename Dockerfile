FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

ENV NODE_ENV=production
ENV GMAIL_PASSWORD=$GMAIL_PASSWORD

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]

