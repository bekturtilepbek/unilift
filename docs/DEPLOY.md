# Деплой на домашний сервер (OMV + Cloudflare Tunnel)

Сайт `https://unilift.site` крутится на сервере `anton` (доступ — только Tailscale: `ssh miro@anton`).
Белого IP нет, весь трафик идёт через общий Cloudflare Tunnel `anton`:

```
Браузер ─► Cloudflare (TLS) ─► туннель "anton" ─► edge_tunnel (cloudflared)
                                                   │  docker-сеть "edge"
                                                   └─► unilift-web:80 (caddy) ─► web:8000 (gunicorn)
```

- `web` — образ `ghcr.io/bekturtilepbek/unilift:latest`, при старте `migrate` + `collectstatic`.
- `caddy` — раздаёт `/media/` (Django при `DEBUG=False` этого не делает), остальное — в gunicorn.
- Портов на хосте нет. БД — SQLite в volume `db_data`, фото — в `media_data`.
- Образ собирает GitHub Actions при пуше в `main` (`.github/workflows/deploy.yml`).

## Первичная настройка

### 1. Домен
1. Cloudflare (тот же аккаунт, где туннель `anton`) → **Add a domain** → `unilift.site`, план Free.
2. GoDaddy → домен → **Nameservers → Change → I'll use my own** → два NS от Cloudflare.
3. В Cloudflare удалить импортированные записи `A @ Parked`, `CNAME www`, `CNAME _domainconnect`.
4. Дождаться статуса **Active**.

### 2. Сервер
```bash
# если образ в GHCR приватный — один раз, токен с правом read:packages
docker login ghcr.io -u bekturtilepbek

docker network ls | grep edge   # сеть уже есть; если нет — docker network create edge
```

### 3. OMV
OMV → Services → Compose → **Files → Add**:
- Name: `Unilift`
- File: содержимое `docker-compose.prod.yml`
- Environment: по образцу `.env.example` (`DJANGO_SECRET_KEY` сгенерировать заново)

Сгенерировать ключ:
```bash
docker run --rm python:3.13-slim python -c "import secrets; print(secrets.token_urlsafe(50))"
```

Затем **Up**. Создать администратора:
```bash
docker exec -it unilift-web-1 python manage.py createsuperuser
```
(точное имя контейнера — `docker ps | grep unilift`)

### 4. Маршруты в туннеле `anton`
Cloudflare → Networking → Tunnels → `anton` → Routes → **Published application**:

| Subdomain | Domain | Service URL |
|---|---|---|
| (пусто) | `unilift.site` | `http://unilift-web:80` |
| `www` | `unilift.site` | `http://unilift-web:80` |

Только `http://` — TLS делает Cloudflare.

## Обновление
1. Пуш в `main` → дождаться зелёного **Build image** в Actions.
2. OMV → Compose → Files → `Unilift` → **Pull** → **Up**.

Миграции применятся сами при старте контейнера.

## Бэкап
SQLite и фото лежат в volumes `unilift_db_data` и `unilift_media_data` на единственном диске сервера.
```bash
docker run --rm -v unilift_db_data:/db -v unilift_media_data:/media -v /appdata/backups:/out \
  alpine tar czf /out/unilift-$(date +%F).tar.gz /db /media
```
Копию нужно уносить с сервера (rclone → облако) — TODO.

## Проверка
```bash
curl -sI https://unilift.site/healthz/          # 200
curl -sI http://unilift.site/ | grep -i location # редирект на https, без цикла
```
