import Image from "next/image";

const cars = [
  {
    src: "/images/cars/bmw-g81.jpg",
    title: "BMW M3 Touring G81",
    caption: "Витрина. Каталог — все марки MBA-parts, не только эта модель.",
  },
  {
    src: "/images/cars/mercedes-g63.jpg",
    title: "Mercedes-Benz G63",
    caption: "Витрина. Каталог — все марки MBA-parts, не только эта модель.",
  },
  {
    src: "/images/cars/porsche-911-targa.jpg",
    title: "Porsche 911 992 Targa",
    caption: "Витрина. Каталог — все марки MBA-parts, не только эта модель.",
  },
];

export function CarShowcase() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cars.map((car) => (
        <figure
          key={car.title}
          className="overflow-hidden rounded-2xl border border-[#d5e6f3] bg-white shadow-sm"
        >
          <div className="relative aspect-16/10">
            <Image
              src={car.src}
              alt={car.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>
          <figcaption className="px-4 py-3">
            <div className="font-semibold text-[#16324f]">{car.title}</div>
            <div className="text-sm text-[#5a7a96]">{car.caption}</div>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
