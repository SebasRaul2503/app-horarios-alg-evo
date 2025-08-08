# Imagen base liviana
FROM python:3.10.13-alpine

# Evitar que Python guarde .pyc y que use buffering
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instalar dependencias de compilación para PyMySQL y otros paquetes
RUN apk add --no-cache gcc musl-dev libffi-dev

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar requirements.txt primero (para aprovechar la cache de capas)
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el código de la app
COPY . .

# Exponer el puerto de Flask
EXPOSE 5000

# Comando de ejecución (usando flask run)
# Asume que tu archivo principal se llama app.py y crea la app como `app`
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

CMD ["flask", "run"]
