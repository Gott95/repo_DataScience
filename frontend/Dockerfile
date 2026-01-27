# Etapa 1: Construcción (Build)
FROM node:18-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
ARG VITE_API_URL

ENV VITE_API_URL=$VITE_API_URL

RUN npm run build


# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine


COPY --from=build /app/dist /usr/share/nginx/html


RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]