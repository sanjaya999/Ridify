FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
<<<<<<< HEAD
RUN npm install
=======


>>>>>>> d283ae9 (Update environment variables and refactor Upload component for hardcoded location)
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80