FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY prisma ./prisma

RUN pnpm dlx prisma generate

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]