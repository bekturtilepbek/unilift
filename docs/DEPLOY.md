# Деплой на домашний сервер (OMV + Cloudflare Tunnel)

Сайт `https://unilift.site` крутится на сервере `anton` (доступ — только Tailscale: `ssh miro@anton`).
Белого IP нет, весь трафик идёт через общий Cloudflare Tunnel `anton`:

```
Браузер ─► Cloudflare (TLS) ─► туннель "anton" ─► edge_tunnel (cloudflared)
                                                   │  docker-сеть "edge"
                                                   └─► unilift-web:80 (caddy) ─► web:8000 (gunicorn)
```

- Код — клон репо в `/appdata/Unilift/app` (deploy key, только чтение), образ собирается на сервере.
- `web` — gunicorn, при старте `migrate` + `collectstatic`.
- `caddy` — раздаёт `/media/` (Django при `DEBUG=False` этого не делает), остальное — в gunicorn.
- Портов на хосте нет. БД — SQLite в volume `db_data`, фото — в `media_data`.
- Compose-проект `Unilift` управляется из OMV UI, файл — `docker-compose.prod.yml`.

## Первичная настройка

### 1. Домен
1. Cloudflare (тот же аккаунт, где туннель `anton`) → **Add a domain** → `unilift.site`, план Free.
2. В Cloudflare удалить импортированные записи `A @` (парковка GoDaddy, обычно две: `15.197.148.33`,
   `3.33.130.190`), `CNAME www`, `CNAME _domainconnect` — иначе маршрут туннеля не сохранится.
3. GoDaddy → домен → **Nameservers → Change → I'll use my own** → два NS от Cloudflare.
4. Дождаться статуса **Active**.

### 2. Deploy key и клон
Ключ создаётся на сервере:
```bash
ssh-keygen -t ed25519 -N "" -f ~/.ssh/deploy_unilift -C "anton-unilift"
cat ~/.ssh/deploy_unilift.pub   # → GitHub: repo → Settings → Deploy keys → Add (без write)

cat >> ~/.ssh/config << 'EOF'

Host gh-unilift
  HostName github.com
  User git
  IdentityFile ~/.ssh/deploy_unilift
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
ssh -T gh-unilift   # "Hi BekturTilepbek/unilift! ..."

sudo mkdir -p /appdata/Unilift/app
sudo chown miro:users /appdata/Unilift/app   # основная группа пользователей OMV — users
git clone gh-unilift:BekturTilepbek/unilift.git /appdata/Unilift/app
```

### 3. OMV
Сгенерировать ключ Django:
```bash
docker run --rm python:3.13-slim python -c "import secrets; print(secrets.token_urlsafe(50))"
```

OMV → Services → Compose → **Files → Create**:
- Name: `Unilift`
- File: содержимое `docker-compose.prod.yml`
- Environment: по образцу `.env.example` (OMV сохраняет его в `Unilift.env` и делает симлинк `.env`)

Save → **Up** (первый раз собирает образ, пара минут). Если OMV оборвёт по таймауту:
`cd /appdata/Unilift && sudo docker compose up -d --build`. Создать администратора:
```bash
docker exec -it unilift-web-1 python manage.py createsuperuser
```

### 4. Маршруты в туннеле `anton`
Cloudflare → Networking → Tunnels → `anton` → Routes → **Published application**:

| Subdomain | Domain | Service URL |
|---|---|---|
| (пусто) | `unilift.site` | `http://unilift-web:80` |
| `www` | `unilift.site` | `http://unilift-web:80` |

Только `http://` — TLS делает Cloudflare. Маршрутов два: один маршрут = одно имя, `*.unilift.site`
корень домена не покрывает. DNS-записи (CNAME на `<id>.cfargotunnel.com`) Cloudflare создаёт сам.

## Обновление
```bash
cd /appdata/Unilift/app && git pull
```
Затем OMV → Compose → Files → `Unilift` → **Up** (образ пересоберётся, миграции применятся при старте).

Если `docker-compose.prod.yml` в репо поменялся — обновить его и в OMV (Edit → вставить → Save).

## Бэкап
SQLite и фото лежат в volumes `unilift_db_data` и `unilift_media_data` на единственном диске сервера.
```bash
docker run --rm -v unilift_db_data:/db -v unilift_media_data:/media -v /appdata/backups:/out \
  alpine tar czf /out/unilift-$(date +%F).tar.gz /db /media
```
Копию нужно уносить с сервера (rclone → облако) — TODO.

## Проверка
```bash
# изнутри сети edge, как видит туннель
docker run --rm --network edge curlimages/curl:8.10.1 -sI \
  -H "Host: unilift.site" -H "X-Forwarded-Proto: https" http://unilift-web/healthz/

curl -sI https://unilift.site/healthz/          # 200
curl -sI http://unilift.site/ | grep -i location # редирект на https, без цикла
```
