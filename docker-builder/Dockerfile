FROM node:latest

WORKDIR /app

COPY package*.json .

RUN npm install

COPY src/ ./src/
COPY tsconfig.json ./tsconfig.json

CMD ["npm", "start"]
