# Etapa 1: Build
FROM node:20.19.3-alpine3.22 as builder

WORKDIR /app

# Copiamos config primero para aprovechar la cache
COPY package*.json ./
COPY prisma ./prisma/

# Instalamos dependencias (incluyendo dev para build y prisma)
RUN npm install

# Copiamos todo el código
COPY . .

# Generamos el cliente de Prisma
RUN npx prisma generate

# Compilamos la app NestJS
RUN npm run build


# Etapa 2: Producción
FROM node:20.19.3-alpine3.22 AS production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Instalamos solo dependencias necesarias para producción
RUN npm install --omit=dev

# Copiamos el build desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Generar cliente Prisma en producción
RUN npx prisma generate

# Si quieres aplicar migraciones automáticamente al levantar el contenedor:
# RUN npx prisma migrate deploy

# Copiar archivo de entorno (opcional, mejor pasar por --env-file)
COPY .env .env

EXPOSE 3000

CMD ["node", "dist/main.js"]
