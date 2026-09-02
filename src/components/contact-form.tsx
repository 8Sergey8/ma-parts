import { site } from "@/lib/site";

const fieldClass =
  "h-10 w-full rounded-lg border border-[#c5d9eb] bg-white px-2.5 text-sm text-[#152033] outline-none focus:border-[#1a6fb5]";

export function ContactForm({
  defaultMessage = "",
  sent = false,
  error = false,
}: {
  defaultMessage?: string;
  sent?: boolean;
  error?: boolean;
}) {
  if (sent) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
        Заявка отправлена. Менеджер MBA-parts свяжется с вами по телефону или в
        MAX ({site.phonePretty}) в рабочее время.
      </div>
    );
  }

  return (
    <form action="/api/inquiries" method="post" className="space-y-4">
      <input type="hidden" name="type" value="contact" />
      {error && (
        <p className="text-sm text-red-700">
          Укажите имя, телефон и сообщение.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium">
          Имя *
          <input name="name" required className={fieldClass} />
        </label>
        <label className="space-y-1.5 text-sm font-medium">
          Телефон *
          <input
            name="phone"
            type="tel"
            required
            placeholder="+7"
            className={fieldClass}
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium">
          Эл. почта
          <input name="email" type="email" className={fieldClass} />
        </label>
        <label className="space-y-1.5 text-sm font-medium">
          Компания (для юрлиц)
          <input name="company" className={fieldClass} />
        </label>
      </div>
      <label className="block space-y-1.5 text-sm font-medium">
        Сообщение *
        <textarea
          name="message"
          required
          defaultValue={defaultMessage}
          className="min-h-28 w-full rounded-lg border border-[#c5d9eb] bg-white px-2.5 py-2 text-sm outline-none focus:border-[#1a6fb5]"
          placeholder="Артикул, VIN или описание детали"
        />
      </label>
      <button
        type="submit"
        className="inline-flex h-10 items-center rounded-lg bg-[#1a6fb5] px-6 text-sm font-medium text-white hover:bg-[#155d98]"
      >
        Отправить заявку
      </button>
    </form>
  );
}
