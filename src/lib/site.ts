export const site = {
  name: "MBA-parts",
  legalName: "MBA-parts",
  foundedYear: 2020,
  tagline: "Оригинальные автозапчасти для BMW, Mercedes-Benz и VAG",
  description:
    "Интернет-магазин оригинальных автозапчастей для BMW, Mercedes-Benz, Audi, Škoda, Volkswagen, Porsche, Bentley.",
  keywords:
    "автозапчасти, запчасти для BMW, запчасти для Mercedes-Benz, оригинальные запчасти.",
  phone: "+79153088884",
  phonePretty: "+7 915 308-88-84",
  email: "mbaparts888@gmail.com",
  address: "Москва, улица Кедрова, 13к2",
  messenger: "MAX",
  hours: "Пн–Пт: 10:00–20:00, сб–вс: выходной",
  url: "https://mba-parts.ru",
} as const;

export const nav = [
  { href: "/", label: "Главная" },
  { href: "/katalog", label: "Каталог" },
  { href: "/podbor-vin", label: "Подбор по VIN" },
  { href: "/uslugi", label: "Услуги" },
  { href: "/o-kompanii", label: "О компании" },
  { href: "/blog", label: "Блог" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontakty", label: "Контакты" },
] as const;
