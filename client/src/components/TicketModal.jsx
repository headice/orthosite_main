import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPayment, fetchCurrentPrice, formatWindow } from "../api";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  consent: false,
};

export const TicketModal = ({ open, onClose }) => {
  const [form, setForm] = useState(emptyForm);
  const [price, setPrice] = useState(null);
  const [priceWindow, setPriceWindow] = useState(null);
  const [priceError, setPriceError] = useState("");
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetAndClose = () => {
    setForm(emptyForm);
    setSubmitError("");
    onClose();
  };

  const refreshPrice = async () => {
    setIsLoadingPrice(true);
    setPriceError("");
    try {
      const { amount_rub, window } = await fetchCurrentPrice();
      setPrice(amount_rub);
      setPriceWindow(window);
    } catch (error) {
      setPrice(null);
      setPriceError(error.message || "Не удалось загрузить цену");
    } finally {
      setIsLoadingPrice(false);
    }
  };

  useEffect(() => {
    if (open) {
      refreshPrice();
    }
  }, [open]);

  const returnUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/payment-complete`;
    }
    return "https://example.com/payment-complete";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    const description = `Билет для ${form.name || "участника"}`;

    try {
      const payment = await createPayment({
        description,
        returnUrl,
      });

      if (payment?.confirmation_url) {
        window.open(payment.confirmation_url, "_blank", "noopener,noreferrer");
        resetAndClose();
      } else {
        setSubmitError("Не удалось получить ссылку для оплаты");
      }
    } catch (error) {
      setSubmitError(error.message || "Не удалось создать платеж");
    } finally {
      setIsSubmitting(false);
    }
  };

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

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-sm text-blue-200">Текущая стоимость</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {isLoadingPrice ? "..." : price ? `${price}₽` : "—"}
              </p>
              <p className="mt-1 text-xs text-blue-300">
                {priceWindow ? `Период: ${formatWindow(priceWindow)}` : "Базовая цена"}
              </p>
              {priceError && (
                <p className="mt-2 text-xs text-red-300">{priceError}</p>
              )}
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

              <button
                type="submit"
                disabled={isSubmitting || !price || isLoadingPrice}
                className="mt-4 w-full rounded-2xl bg-gradient-to-r from-blue-400 to-blue-600 py-4 text-lg font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Создаем платеж..." : "Купить билет"}
              </button>
              {submitError && (
                <p className="text-center text-sm text-red-300">{submitError}</p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
