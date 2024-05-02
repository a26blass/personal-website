FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

ENV NODE_ENV=production

# For local testing purposes, can inject email password directly into docker env
ENV EMAIL_PASSWORD=$EMAIL_PASSWORD

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]

