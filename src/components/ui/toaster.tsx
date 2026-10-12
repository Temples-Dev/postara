import * as React from "react";

type ToastKind = "success" | "error";

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

const DISMISS_AFTER_MS = 4000;

let nextId = 1;
let items: ToastItem[] = [];
const listeners = new Set<(items: ToastItem[]) => void>();

function emit() {
  const snapshot = [...items];
  listeners.forEach((listener) => listener(snapshot));
}

function push(kind: ToastKind, message: string) {
  const id = nextId++;
  items = [...items, { id, kind, message }];
  emit();
  window.setTimeout(() => {
    items = items.filter((item) => item.id !== id);
    emit();
  }, DISMISS_AFTER_MS);
}

export const toast = {
  success: (message: string) => push("success", message),
  error: (message: string) => push("error", message),
};

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastItem[]>(items);

  React.useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toaster group fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((item) => (
        <div
          key={item.id}
          role={item.kind === "error" ? "alert" : "status"}
          className={
            item.kind === "error"
              ? "rounded-md border border-red-200 bg-white px-4 py-3 text-sm text-red-800 shadow-lg"
              : "rounded-md border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-800 shadow-lg"
          }
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}
