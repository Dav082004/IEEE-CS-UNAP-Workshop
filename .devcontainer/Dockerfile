FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

# Actualizar y instalar solo las dependencias necesarias (mínimo y rápido)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Crear directorio de trabajo
WORKDIR /workspace
