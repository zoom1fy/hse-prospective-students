# Frontend — Поступить.Про

Скелет фронтенда агрегатора вузов и приёмных кампаний.

## Стек

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS 4
- Bun (менеджер пакетов и рантайм разработки)
- ESLint + Prettier (`prettier-plugin-tailwindcss`)
- Docker (standalone-сборка)

## Структура маршрутов

| Маршрут                                       | Назначение                                                                 |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| `/`                                           | Главная: ведущие вузы, популярные направления, открытые наборы, поиск      |
| `/universities`                               | Каталог программ с фильтрами (`q`, `city`, `degree`, `form`, `budgetOnly`) |
| `/universities/[slug]`                        | Сайт вуза: о вузе, факультеты и программы                                  |
| `/universities/[slug]/programs/[programSlug]` | Сайт программы                                                             |
| `/dashboard`                                  | Личный кабинет: обзор, полнота профиля, рекомендации                       |
| `/dashboard/profile`                          | Личные данные: ФИО, контакты, дипломы, достижения                          |
| `/dashboard/recommendations`                  | Подбор программ по данным профиля                                          |
| `/dashboard/applications`                     | Древо поданных заявок (вуз → факультет → программа)                        |
| `/api/health`                                 | Health-check                                                               |

## Слои

```
src/
  app/            маршруты App Router ((site) — публичная часть, dashboard — кабинет)
  components/     ui/ — примитивы, layout/, доменные компоненты
  data/           моковые данные и хелперы (заменяются вызовами backend)
  lib/            конфиг сайта, утилиты, клиент API
  types/          доменные типы
```

Моковые данные находятся в `src/data`. Для интеграции с backend используйте
`src/lib/api/client.ts` и переменную окружения `NEXT_PUBLIC_API_URL`.

## Команды

```bash
bun install
bun run dev         # dev-сервер
bun run build       # production-сборка
bun run start       # запуск production-сервера
bun run lint        # ESLint
bun run typecheck   # next typegen + tsc
bun run format      # Prettier
```

## Скрипты и Docker

Из корня репозитория:

```bat
scripts\frontend\dev.bat                   # dev
scripts\frontend\prod.bat                  # prod (build + start), [port] [host] [skip] — опционально
scripts\frontend\docker.bat                # docker build + run, [port] [image] — опционально
```

```bash
./scripts/frontend/dev.sh
./scripts/frontend/prod.sh
./scripts/frontend/docker.sh
```

Переменные окружения — см. `.env.example`.
