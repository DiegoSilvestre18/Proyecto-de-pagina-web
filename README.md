# Proyecto-de-pagina-web

Pagina web que realiza salas de apuesta por equipos de videojuegos.

## Despliegue con Docker

Este repositorio ahora incluye:

- `docker-compose.yml` en la raiz del proyecto.
- `Backend/sistema-de-apuestas/src/SistemaApuestas.Api/Dockerfile`.
- `Frontend/front-sistema-apuestas/Dockerfile`.
- `Frontend/front-sistema-apuestas/nginx.conf`.
- `.env.example` para variables de entorno.

### Pasos en servidor

1. Entrar a la carpeta del proyecto:

```bash
cd ~/sistema-apuestas
```

2. Actualizar el codigo:

```bash
git pull origin main
```

3. Crear archivo de variables:

```bash
cp .env.example .env
nano .env
```

4. Levantar el stack:

```bash
docker compose up -d --build
```

5. Ver estado y logs:

```bash
docker compose ps
docker compose logs -f --tail=100
```

### Puertos

- Frontend (Nginx): `80`
- Backend (.NET): interno en `8080` (expuesto por proxy Nginx)
- PostgreSQL: interno en `5432`
