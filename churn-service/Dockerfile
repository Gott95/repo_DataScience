FROM python:3.9-slim
WORKDIR /app
# Instalamos dependencias del sistema para compilar librerías de ciencia de datos si hace falta
RUN apt-get update && apt-get install -y --no-install-recommends gcc python3-dev
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Exponer puerto
EXPOSE 8000
CMD ["python", "app.py"]