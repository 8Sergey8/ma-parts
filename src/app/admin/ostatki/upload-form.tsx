"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InventoryUpload() {
  const router = useRouter();
  const [key, setKey] = useState("mba-parts-local");
  const [mode, setMode] = useState<"replace" | "merge">("replace");
  const [log, setLog] = useState("");
  const [busy, setBusy] = useState(false);

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const fileInput = formEl.elements.namedItem("file") as HTMLInputElement;
    if (!fileInput.files?.[0]) {
      setLog("Выберите CSV или Excel-файл.");
      return;
    }
    setBusy(true);
    setLog("");
    const body = new FormData();
    body.set("file", fileInput.files[0]);
    body.set("mode", mode);
    const res = await fetch("/api/parts/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body,
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setLog(data.error || "Ошибка загрузки");
      return;
    }
    setLog(
      `Загружено ${data.imported} позиций. В каталоге сейчас ${data.count}. Режим: ${data.mode}.`,
    );
    router.refresh();
  }

  return (
    <form
      onSubmit={onUpload}
      className="mt-6 space-y-4 rounded-2xl border border-[#d5e6f3] bg-white p-6"
    >
      <h2 className="font-semibold text-[#16324f]">Загрузка файла</h2>
      <div className="space-y-1.5">
        <Label htmlFor="key">API-ключ</Label>
        <Input
          id="key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="h-10 bg-[#f4f9fd]"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="file">CSV или Excel (ежедневный прайс)</Label>
        <Input
          id="file"
          name="file"
          type="file"
          accept=".csv,.txt,.xlsx,.xls"
          className="h-10 bg-[#f4f9fd] pt-1.5"
        />
      </div>
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={mode === "replace"}
            onChange={() => setMode("replace")}
          />
          Заменить весь каталог
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={mode === "merge"}
            onChange={() => setMode("merge")}
          />
          Обновить и добавить
        </label>
      </div>
      <Button type="submit" disabled={busy} className="h-10 px-5">
        {busy ? "Загрузка…" : "Загрузить наличие"}
      </Button>
      {log && <p className="text-sm text-[#0b3a6e]">{log}</p>}
      <p className="text-xs text-[#5a7a96]">
        Колонки: article / артикул, name / название, brand / марка, category,
        price / цена, stock / остаток, warehouse, applicability, description.
      </p>
      <a
        href="/sample-ostatki.csv"
        className="inline-block text-sm text-[#1a6fb5] underline"
      >
        Скачать пример CSV
      </a>
    </form>
  );
}
