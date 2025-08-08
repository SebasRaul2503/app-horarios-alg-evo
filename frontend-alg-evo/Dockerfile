# Etapa 1: build con Node
FROM node:20.19.3 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

# Etapa 2: producción con NGINX
FROM nginx:stable-alpine

# Elimina el contenido por defecto del nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia el build generado
COPY --from=builder /app/dist/frontend-alg-evo/browser /usr/share/nginx/html

# Copia una configuración personalizada de nginx (opcional pero recomendado)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]