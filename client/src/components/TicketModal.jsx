import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePrice } from "../providers/PriceProvider";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  consent: false,
};

const emptyErrors = {
  name: "",
  email: "",
  phone: "",
  consent: "",
};

export const TicketModal = ({ open, onClose }) => {
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState(emptyErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { priceRub, isLoading: isPriceLoading, error: priceError, refreshPrice } =
    usePrice();

  const apiBaseUrl = useMemo(
    () => process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, "") || "",
    []
  );

  const requireApiBase = () => {
    if (!apiBaseUrl) {
      throw new Error(
        "Бэкенд не настроен. Добавьте строку REACT_APP_API_BASE_URL=http://localhost:8000 в client/.env и перезапустите `npm start` или пересоберите фронтенд."
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

  // ---- ВАЛИДАЦИЯ ----
  const validateForm = (values) => {
    const errors = { ...emptyErrors };

    // ФИО: минимум 3 символа, только буквы, пробелы и дефис
    if (!values.name.trim()) {
      errors.name = "Введите ФИО";
    } else if (!/^[a-zA-Zа-яА-ЯёЁ\s-]{3,}$/u.test(values.name.trim())) {
      errors.name =
        "ФИО должно содержать только буквы, пробелы и дефисы и быть не короче 3 символов";
    }

    // Email: простая проверка формата
    if (!values.email.trim()) {
      errors.email = "Введите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errors.email = "Некорректный формат email";
    }

    // Телефон: минимум 10 цифр
    const digits = values.phone.replace(/\D/g, "");
    if (!values.phone.trim()) {
      errors.phone = "Введите телефон";
    } else if (digits.length < 10) {
      errors.phone = "Укажите полный номер телефона (не менее 10 цифр)";
    }

    // Согласие
    if (!values.consent) {
      errors.consent = "Необходимо согласие на обработку данных";
    }

    const isValid = !errors.name && !errors.email && !errors.phone && !errors.consent;
    return { isValid, errors };
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // очищаем ошибку конкретного поля при вводе
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const resetAndClose = () => {
    setForm(emptyForm);
    setFieldErrors(emptyErrors);
    setError("");
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Клиентская валидация
    const { isValid, errors } = validateForm(form);
    if (!isValid) {
      setFieldErrors(errors);
      setError("Проверьте правильность заполнения формы");
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
          email: form.email,
          return_url: `${window.location.origin}/payment/success`,
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
        if (payment.payment_id) {
          localStorage.setItem("last_payment_id", payment.payment_id);
        }
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

    refreshPrice().catch((priceFetchError) => {
      setError(priceFetchError.message || "Ошибка загрузки цены");
    });
  }, [open, refreshPrice]);

  useEffect(() => {
    if (priceError) {
      setError(priceError);
    }
  }, [priceError]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6"
          initial={{ opacity: 0 }}          // как появляется фон
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}             // как исчезает фон
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="relative w-full max-w-xl md:max-w-lg lg:max-w-xl rounded-[32px] border border-white/10 bg-gradient-to-b from-[#123870] to-[#06183c] p-6 sm:p-7 md:p-6 shadow-2xl max-h-[90vh] overflow-y-auto md:max-h-none md:overflow-visible md:scale-[0.95] lg:scale-[0.9]"
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

            <h2 className="text-center text-2xl font-semibold sm:text-3xl">Оплата на участие</h2>
            <p className="mt-4 text-center text-sm text-blue-100 sm:text-base">
              Оплата участия дает право на посещение 2-х дневного интенсива 
            </p>
            <p className="text-center text-sm text-blue-100 sm:text-base">28.03-29.03.2026.</p>
            <p className="mt-3 text-center text-xs text-blue-200 sm:text-sm">
          Регистрация и выдача бейджей участникам.
Место: вход в . 
Билет невозвратный. При невозможности присутствия его можно передать другому участнику (по согласованию с организаторами).
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
                  className={`mt-2 w-full rounded-2xl border bg-white/5 px-4 py-3 text-base text-white placeholder:text-blue-200/70 focus:outline-none ${
                    fieldErrors.name
                      ? "border-red-400 focus:border-red-400"
                      : "border-white/20 focus:border-blue-300"
                  }`}
                  placeholder="Иванов Иван Иванович"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.name}</p>
                )}
              </label>

              <label className="text-sm uppercase tracking-wide text-blue-200">
                Ваш email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`mt-2 w-full rounded-2xl border bg-white/5 px-4 py-3 text-base text-white placeholder:text-blue-200/70 focus:outline-none ${
                    fieldErrors.email
                      ? "border-red-400 focus:border-red-400"
                      : "border-white/20 focus:border-blue-300"
                  }`}
                  placeholder="ivanovivan@mail.ru"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.email}</p>
                )}
              </label>

              <label className="text-sm uppercase tracking-wide text-blue-200">
                Ваш телефон
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`mt-2 w-full rounded-2xl border bg-white/5 px-4 py-3 text-base text-white placeholder:text-blue-200/70 focus:outline-none ${
                    fieldErrors.phone
                      ? "border-red-400 focus:border-red-400"
                      : "border-white/20 focus:border-blue-300"
                  }`}
                  placeholder="+7 (999) 123-45-67"
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.phone}</p>
                )}
              </label>

              <label className="flex items-start gap-3 text-xs text-blue-100">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={handleChange}
                  className={`mt-1 h-5 w-5 rounded border bg-transparent text-blue-500 focus:ring-blue-300 ${
                    fieldErrors.consent ? "border-red-400" : "border-white/30"
                  }`}
                />
                <span>
                  Соглашаюсь с обработкой моих персональных данных в электронном виде. <br />
                  <Link to="/privacy-policy" className="text-blue-300 underline">
                    Политика в отношении обработки персональных данных
                  </Link>
                  {fieldErrors.consent && (
                    <p className="mt-1 text-xs text-red-300">{fieldErrors.consent}</p>
                  )}
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
