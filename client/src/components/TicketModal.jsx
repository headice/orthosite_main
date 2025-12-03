import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link} from 'react-router-dom';

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  consent: false,
};

export const TicketModal = ({ open, onClose }) => {
  const [form, setForm] = useState(emptyForm);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetAndClose = () => {
    setForm(emptyForm);
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // логика отправки
    resetAndClose();
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
                className="mt-4 w-full rounded-2xl bg-gradient-to-r from-blue-400 to-blue-600 py-4 text-lg font-semibold text-white transition hover:brightness-110"
              >
                Купить билет
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
