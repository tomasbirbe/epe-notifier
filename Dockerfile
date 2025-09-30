# Dockerfile
FROM node:alpine

# Instalar dependencias del sistema para Playwright
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Configurar Playwright para usar Chromium del sistema
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json pnpm-lock.yaml* ./

# Instalar pnpm y dependencias
RUN npm install -g pnpm tsx
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Crear directorio para logs
RUN mkdir -p /app/logs

# Configurar cron job (8 AM y 8 PM)
RUN echo '0 8,20 * * * cd /app && tsx main.mts >> /app/logs/epe-notifier.log 2>&1' > /etc/crontabs/root

# Script de inicio para cron
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Iniciando EPE Notifier con cron..."' >> /app/start.sh && \
    echo 'echo "Verificaciones programadas: 8 AM y 8 PM"' >> /app/start.sh && \
    echo 'crond -f -l 2' >> /app/start.sh && \
    chmod +x /app/start.sh

# Comando por defecto - iniciar cron en foreground
CMD ["/app/start.sh"]
