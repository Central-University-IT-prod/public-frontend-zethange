FROM node:alpine AS builder

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm@latest
RUN pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine

COPY --from=builder /app/dist/ /usr/share/nginx/html

EXPOSE 80
CMD ["nginx","-g","daemon off;"]