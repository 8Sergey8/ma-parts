# MBA-parts — оригинальные автозапчасти

Интернет-магазин оригинальных запчастей для BMW, Mercedes-Benz, Audi, Škoda, Volkswagen, Porsche и Bentley. Компания MBA-parts (Москва, с 2020 года) продаёт только дилерский оригинал.

Сайт: каталог с поиском по артикулу, корзина-заявка, услуги, о компании, блог, FAQ, контакты, загрузка остатков и REST API.

## Запуск на своём компьютере

Нужен [Node.js 20+](https://nodejs.org). Откройте папку `ma-parts` в Terminal.

**macOS:** файл `КАК-ЗАПУСТИТЬ.txt` или:

```bash
cd ~/Downloads/ma-parts
node -v
npm install
npx --yes next dev --hostname 127.0.0.1 --port 43123
```

Оставьте Terminal открытым и откройте [http://127.0.0.1:43123](http://127.0.0.1:43123).

Либо: `chmod +x start.sh && ./start.sh`

**Windows:** `start.bat` или те же `npm install` / `npx` в `cmd`.

Сборка production:

```bash
npm run build
npm start
```

## Что есть на сайте

- Каталог и поиск только из загруженного прайса (CSV/Excel): артикул, цена, срок поставки
- Сроки на карточке: магазин (самовывоз), ЦС 1–3 дня, удалённый склад 5–7 дней, Европа 14–25 дней
- Главная: марки, витрина из трёх авто, поиск по артикулу и VIN
- [Загрузка прайса](/admin/ostatki): CSV/Excel каждый день

## API остатков

Ключ: заголовок `Authorization: Bearer <ключ>` или query `?key=`.

Локально по умолчанию: `mba-parts-local`. На продакшене задайте `ADMIN_API_KEY`.

```bash
# Список / поиск
curl http://localhost:43123/api/parts?q=11427586926

# Обновить или добавить позиции
curl -X POST http://localhost:43123/api/parts \
  -H "Authorization: Bearer mba-parts-local" \
  -H "Content-Type: application/json" \
  -d '{"parts":[{"article":"11427586926","name":"Фильтр масляный","brand":"BMW","category":"Фильтры","price":1890,"stock":24}]}'

# Загрузка файла
curl -X POST http://localhost:43123/api/parts/upload \
  -H "Authorization: Bearer mba-parts-local" \
  -F "mode=replace" \
  -F "file=@public/sample-ostatki.csv"
```

Колонки файла (CSV с `;` или Excel):

- `артикул` / `article` — обязателен
- `название` / `name`
- `марка` / `brand` — BMW, Mercedes-Benz, Audi, Škoda, Volkswagen, Porsche, Bentley
- `цена` / `price` — обязательна, с неё берётся цена на карточке
- `магазин`, `цс`, `удаленный_склад`, `европа` — остатки по складам

Сроки на сайте фиксированные:

| Наличие | Срок |
| --- | --- |
| в магазине | самовывоз сегодня |
| на ЦС | 1–3 дня |
| на удалённом складе | 5–7 дней |
| в Европе | 14–25 дней |

Пока прайс не загружен, каталог и поиск пустые. Пример файла: `public/sample-ostatki.csv`.

```bash
# Подбор по VIN
curl "http://localhost:43123/api/vin?vin=WBA31CM0705A12345"
```

## Стек

Next.js, TypeScript, Tailwind CSS, shadcn/ui. Шрифт Verdana. Цвета: белый и светло-голубой.

Заявки и остатки пишутся в JSON в папке `data/`. На serverless (Vercel) файловая запись не сохраняется между запросами — для продакшена подключите базу или S3.

## SEO

- description: Интернет-магазин оригинальных автозапчастей для BMW, Mercedes-Benz, Audi, Škoda, Volkswagen, Porsche, Bentley.
- keywords: автозапчасти, запчасти для BMW, запчасти для Mercedes-Benz, оригинальные запчасти.
