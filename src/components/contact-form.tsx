"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const fieldClass =
  "h-10 w-full rounded-lg border border-[#c5d9eb] bg-white px-2.5 text-sm text-[#152033] outline-none focus:border-[#1a6fb5]";

export function ContactForm({
  defaultMessage = "",
  type = "contact",
  items,
  payment,
  onSuccess,
}: {
  defaultMessage?: string;
  type?: "contact" | "order";
  items?: { article: string; name: string; qty: number; price: number }[];
  payment?: "cash" | "bank";
  onSuccess?: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      message: String(data.get("message") ?? ""),
      type,
      items,
      payment,
    };
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Не удалось отправить заявку");
      setStatus("ok");
      form.reset();
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
        Заявка отправлена. Менеджер MBA-parts свяжется с вами по телефону или в
        MAX ({site.phonePretty}) в рабочее время.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium">
          Имя *
          <input id="name" name="name" required className={fieldClass} />
        </label>
        <label className="space-y-1.5 text-sm font-medium">
          Телефон *
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+7"
            className={fieldClass}
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium">
          Эл. почта
          <input id="email" name="email" type="email" className={fieldClass} />
        </label>
        <label className="space-y-1.5 text-sm font-medium">
          Компания (для юрлиц)
          <input id="company" name="company" className={fieldClass} />
        </label>
      </div>
      <label className="block space-y-1.5 text-sm font-medium">
        Сообщение *
        <textarea
          id="message"
          name="message"
          required
          defaultValue={defaultMessage}
          className="min-h-28 w-full rounded-lg border border-[#c5d9eb] bg-white px-2.5 py-2 text-sm outline-none focus:border-[#1a6fb5]"
          placeholder="Артикул, VIN или описание детали"
        />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex h-10 items-center rounded-lg bg-[#1a6fb5] px-6 text-sm font-medium text-white hover:bg-[#155d98] disabled:opacity-50"
      >
        {status === "loading" ? "Отправка…" : "Отправить заявку"}
      </button>
    </form>
  );
}
