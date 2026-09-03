# MBA-parts — оригинальные автозапчасти

Интернет-магазин оригинальных запчастей для BMW, Mercedes-Benz, Audi, Škoda, Volkswagen, Porsche и Bentley. Компания MBA-parts (Москва, с 2020 года) продаёт только дилерский оригинал.

Сайт: каталог с поиском по артикулу, корзина-заявка, услуги, о компании, блог, FAQ, контакты, загрузка остатков и REST API.

## Запуск на своём компьютере

## Запуск на Mac из ZIP (6-я версия)

```bash
cd ~/Downloads/ma-parts-main-6
chmod +x start.sh
./start.sh
```

Сайт: [http://127.0.0.1:43123](http://127.0.0.1:43123). Окно Terminal не закрывайте.

Нужен [Node.js 20+](https://nodejs.org). Подробности: `КАК-ЗАПУСТИТЬ.txt`.

**Windows:** `start.bat`.

Сборка production:

```bash
npm run build
npm start
```

## Что есть на сайте

- Каталог и поиск только из загруженного прайса (CSV/Excel): артикул, срок поставки. Цена на витрине = цена из файла + 30%
- Сроки на карточке: магазин (самовывоз), ЦС 1–3 дня, удалённый склад 5–7 дней, Европа 14–25 дней
- Главная: марки, витрина из трёх авто, поиск по артикулу и VIN
- [Загрузка прайса](/admin/ostatki): вручную или автоматически от поставщика

## Автообновление прайса

Поставщик каждый день присылает CSV/Excel. Каталог обновляется сам, наценка +30% считается на сайте.

**Вариант 1 — HTTP (удобно 1С / учётка поставщика).** Пока сайт запущен, они делают POST:

```bash
curl -X POST http://127.0.0.1:43123/api/supplier/ostatki \
  -H "Authorization: Bearer mba-parts-local" \
  -F "mode=replace" \
  -F "file=@ostatki.xlsx"
```

Ключ также можно передать как `?key=` или заголовок `X-Api-Key`. По умолчанию весь каталог заменяется файлом. После публикации на домен адрес будет `https://ваш-домен/api/supplier/ostatki`.

**Вариант 2 — папка.** Файл кладут в `data/inbox` (правило почты, FTP, общая папка). При `./start.sh` сайт сам подхватывает CSV/Excel, обновляет витрину и переносит файл в `data/inbox/done`.

Сайт в момент прихода файла должен быть запущен. На Vercel запись на диск не сохраняется — для круглосуточного приёма нужен Mac/сервер, который не выключается.

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
- `цена` / `price` — цена закупки в прайсе. На сайте показывается эта сумма + 30%
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
