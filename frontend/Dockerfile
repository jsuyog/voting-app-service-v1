#Big 2.5 GB single stage Dockerfile for frontend application
# FROM node:18

# WORKDIR /app

# COPY package.json .
# COPY src ./src
# COPY public ./public

# RUN npm install
# RUN npm run build

# EXPOSE 80

# CMD ["npx", "serve", "-s", "build", "-l", "80"]

# multi-stage Dockerfile to reduce image size

# Stage 1 — Build
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 2 — Serve
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
