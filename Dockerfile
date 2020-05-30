FROM node:12-slim

WORKDIR /usr/src/app

COPY package*.json ./

COPY . ./

RUN npm install --only=production

RUN npm install -g serve

RUN npm run build

EXPOSE 8080

CMD ["serve", "-s", "-l", "8080", "./build"]
