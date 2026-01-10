# Etapa 1: Construcción (Build)
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine
# Copiamos lo construido a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Configuración necesaria para React Router (para que no de error 404 al recargar)
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