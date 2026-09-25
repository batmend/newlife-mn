"use client";

import { useState, useTransition } from "react";
import { deleteReflection } from "./actions";

export function RemoveReflectionButton({ reflectionId, date, author }: { reflectionId: string; date: string; author: string }) {
  const [pending, start] = useTransition();
  const [failed, setFailed] = useState(false);

  function onClick() {
    if (!window.confirm(`Энэ бодлын тэмдэглэлийг устгах уу? Буцаах боломжгүй.\n\nБичсэн: ${author}`)) return;
    const formData = new FormData();
    formData.set("reflection_id", reflectionId);
    formData.set("date", date);
    start(async () => {
      const result = await deleteReflection(formData).catch(() => ({ ok: false }));
      setFailed(!result.ok);
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-xs text-white/55 underline-offset-4 hover:text-red-300 hover:underline disabled:opacity-50"
    >
      {pending ? "Устгаж байна…" : failed ? "Устгаж чадсангүй, дахин оролдох" : "Устгах"}
    </button>
  );
}
