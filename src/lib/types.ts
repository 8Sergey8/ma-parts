export const BRANDS = [
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Škoda",
  "Volkswagen",
  "Porsche",
  "Bentley",
] as const;

export type Brand = (typeof BRANDS)[number];

export const CATEGORIES = [
  "Двигатель",
  "Фильтры",
  "Тормозная система",
  "Подвеска",
  "Электрика",
  "Кузов",
  "Масла и жидкости",
  "Трансмиссия",
  "Охлаждение",
  "Выхлоп",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Part = {
  article: string;
  name: string;
  brand: Brand;
  category: Category | string;
  price: number;
  stock: number;
  warehouse: string;
  oem: boolean;
  applicability: string[];
  description: string;
  deliveryDays?: number;
};

export type Inquiry = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  message: string;
  type: "contact" | "order";
  items?: { article: string; name: string; qty: number; price: number }[];
  payment?: "cash" | "bank";
};
