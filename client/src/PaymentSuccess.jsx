import React from "react";
import { Link } from "react-router-dom";

export const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-[#030b1f] text-white">
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
          Оплата завершена
        </p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Спасибо за покупку!
        </h1>
        <p className="mt-4 text-base text-blue-100 sm:text-lg">
          Мы получили оплату и скоро отправим письмо с подтверждением и деталями
          участия на ваш email.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#030b1f] transition hover:bg-blue-100"
          >
            Вернуться на главную
          </Link>
          <a
            href="mailto:info@orthosite.ru"
            className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:text-white"
          >
            Связаться с организаторами
          </a>
        </div>
      </main>
    </div>
  );
};
