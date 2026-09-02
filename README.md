# MBA-parts — оригинальные автозапчасти

Интернет-магазин оригинальных запчастей для BMW, Mercedes-Benz, Audi, Škoda, Volkswagen, Porsche и Bentley. Компания MBA-parts (Москва, с 2020 года) продаёт только дилерский оригинал.

Сайт: каталог с поиском по артикулу, корзина-заявка, услуги, о компании, блог, FAQ, контакты, загрузка остатков и REST API.

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:43123](http://localhost:43123).

Сборка:

```bash
npm run build
npm start
```

## Что есть на сайте

- Главная: марки, BMW G81, Mercedes-Benz G63, Porsche 911 992 Targa, поиск по артикулу
- Каталог и карточки OEM-деталей
- Услуги: оригинал, нал/безнал, гарантия, отсрочка для юрлиц, доставка, заказ из Европы
- Контакты: +7 915 308-88-84, Москва, ул. Кедрова, 13к2, mbaparts888@gmail.com, MAX
- Форма обратной связи и оформление заказа из корзины
- [Управление остатками](/admin/ostatki): загрузка CSV/Excel каждый день
- API обновления наличия

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

Колонки файла: `article` (артикул), `name` (название), `brand` (марка), `category`, `price` (цена), `stock` (остаток), `warehouse`, `applicability`, `description`.

Марки в поле brand: `BMW`, `Mercedes-Benz`, `Audi`, `Škoda`, `Volkswagen`, `Porsche`, `Bentley`.

## Стек

Next.js, TypeScript, Tailwind CSS, shadcn/ui. Шрифт Verdana. Цвета: белый и светло-голубой.

Заявки и остатки пишутся в JSON в папке `data/`. На serverless (Vercel) файловая запись не сохраняется между запросами — для продакшена подключите базу или S3.

## SEO

- description: Интернет-магазин оригинальных автозапчастей для BMW, Mercedes-Benz, Audi, Škoda, Volkswagen, Porsche, Bentley.
- keywords: автозапчасти, запчасти для BMW, запчасти для Mercedes-Benz, оригинальные запчасти.
