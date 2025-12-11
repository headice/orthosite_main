import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  consent: false,
};

export const TicketModal = ({ open, onClose }) => {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [priceRub, setPriceRub] = useState(null);
  const [isPriceLoading, setPriceLoading] = useState(false);

  const apiBaseUrl = useMemo(
    () => process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, "") || "",
    []
  );

  const requireApiBase = () => {
    if (!apiBaseUrl) {
      throw new Error(
        "Бэкенд не настроен. Добавьте REACT_APP_API_BASE_URL в .env и перезапустите сборку."
      );
    }
  };

  const readJsonSafe = async (response) => {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    const text = await response.text();
    throw new Error(text?.slice(0, 300) || "Сервер вернул неверный ответ");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetAndClose = () => {
    setForm(emptyForm);
    setError("");
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.consent) {
      setError("Нужно подтвердить согласие на обработку данных");
      return;
    }

    setIsSubmitting(true);

    try {
      requireApiBase();
    } catch (missingBackendError) {
      setError(missingBackendError.message);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: `Билет: ${form.name} (${form.email})`,
          return_url: window.location.origin,
        }),
      });

      if (!response.ok) {
        const body = await readJsonSafe(response).catch((err) => err);
        const detail = body?.detail || body?.message || body;
        const message =
          typeof detail === "string"
            ? detail
            : detail
            ? JSON.stringify(detail)
            : "Не удалось создать платеж";
        throw new Error(message);
      }

      const payment = await readJsonSafe(response);
      if (payment.confirmation_url) {
        window.location.href = payment.confirmation_url;
        return;
      }

      setError("Ссылка на оплату не получена. Попробуйте позже.");
    } catch (submitError) {
      setError(submitError.message || "Ошибка при создании платежа");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    const fetchPrice = async () => {
      setPriceLoading(true);
      setError("");
      try {
        requireApiBase();

        const response = await fetch(`${apiBaseUrl}/price`);
        if (!response.ok) {
          const message = await readJsonSafe(response).catch(
            () => "Не удалось получить цену"
          );
          throw new Error(
            typeof message === "string" ? message : "Не удалось получить цену"
          );
        }
        const data = await readJsonSafe(response);
        setPriceRub(data.amount_rub);
      } catch (priceError) {
        setError(priceError.message || "Ошибка загрузки цены");
      } finally {
        setPriceLoading(false);
      }
    };

    fetchPrice();
  }, [apiBaseUrl, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          initial={{ opacity: 0 }}          // как появляется фон
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}             // как исчезает фон
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="relative w-full max-w-xl rounded-[32px] border border-white/10 bg-gradient-to-b from-[#123870] to-[#06183c] p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}   // стартовое состояние окна
            animate={{ opacity: 1, scale: 1, y: 0 }}      // финальное состояние
            exit={{ opacity: 0, scale: 0.9, y: 20 }}      // анимация закрытия
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              aria-label="Закрыть окно"
              onClick={resetAndClose}
              className="absolute right-4 top-4 text-white/70 transition hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-center text-3xl font-semibold">Оплата на участие</h2>
            <p className="mt-4 text-center text-sm text-blue-100">
              Оплата участия дает право на посещение 2-х дневного интенсива 29-30.01.2026.
            </p>
            <p className="mt-3 text-center text-xs text-blue-200">
              Регистрация и выдача бейджа участника — при входе на площадку Зал «Ярославль». Билет невозвратный.
              При невозможности присутствия его можно передать другому участнику (по согласованию с
              организаторами).
            </p>

            <div className="mt-6 rounded-2xl bg-white/5 px-4 py-3 text-center text-lg font-semibold text-blue-100">
              {isPriceLoading && "Загрузка цены..."}
              {!isPriceLoading && priceRub && `Стоимость: ${priceRub} ₽`}
              {!isPriceLoading && priceRub === null && "Цена недоступна"}
            </div>

            <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
              <label className="text-sm uppercase tracking-wide text-blue-200">
                Ваше ФИО
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder:text-blue-200/70 focus:border-blue-300 focus:outline-none"
                  placeholder="Иванов Иван Иванович"
                />
              </label>

              <label className="text-sm uppercase tracking-wide text-blue-200">
                Ваш email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder:text-blue-200/70 focus:border-blue-300 focus:outline-none"
                  placeholder="ivanovivan@mail.ru"
                />
              </label>

              <label className="text-sm uppercase tracking-wide text-blue-200">
                Ваш телефон
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder:text-blue-200/70 focus:border-blue-300 focus:outline-none"
                  placeholder="+7 (999) 123-45-67"
                />
              </label>

              <label className="flex items-start gap-3 text-xs text-blue-100">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={handleChange}
                  required
                  className="mt-1 h-5 w-5 rounded border border-white/30 bg-transparent text-blue-500 focus:ring-blue-300"
                />
                <span>
                  Соглашаюсь с обработкой моих персональных данных в электронном виде. <br />
                  <Link to="/privacy-policy" className="text-blue-300 underline">
                    Политика в отношении обработки персональных данных
                  </Link>
                </span>
              </label>
              {error && (
                <div className="rounded-xl bg-red-500/20 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full rounded-2xl bg-gradient-to-r from-blue-400 to-blue-600 py-4 text-lg font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Создаем платеж..." : "Купить билет"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
