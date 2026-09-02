"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/lib/site";

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
        <div className="space-y-1.5">
          <Label htmlFor="name">Имя *</Label>
          <Input id="name" name="name" required className="h-10 bg-white" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Телефон *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+7"
            className="h-10 bg-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Эл. почта</Label>
          <Input
            id="email"
            name="email"
            type="email"
            className="h-10 bg-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company">Компания (для юрлиц)</Label>
          <Input id="company" name="company" className="h-10 bg-white" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Сообщение *</Label>
        <Textarea
          id="message"
          name="message"
          required
          defaultValue={defaultMessage}
          className="min-h-28 bg-white"
          placeholder="Артикул, VIN или описание детали"
        />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={status === "loading"} className="h-10 px-6">
        {status === "loading" ? "Отправка…" : "Отправить заявку"}
      </Button>
    </form>
  );
}
