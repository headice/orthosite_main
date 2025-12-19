import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const STATUS_LABELS = {
  succeeded: {
    title: "Спасибо за покупку!",
    eyebrow: "Оплата завершена",
    description:
      "Мы получили оплату и скоро отправим письмо с подтверждением и деталями участия на ваш email.",
  },
  canceled: {
    title: "Оплата отменена",
    eyebrow: "Платеж не завершен",
    description:
      "Мы не получили оплату. Можно попробовать оплатить снова или связаться с организаторами.",
  },
  pending: {
    title: "Платеж не завершен",
    eyebrow: "Оплата не подтверждена",
    description:
      "Оплата пока не подтверждена. Если вы закрыли окно оплаты, попробуйте начать оплату заново.",
  },
  unknown: {
    title: "Не удалось проверить оплату",
    eyebrow: "Платеж не подтвержден",
    description:
      "Не удалось получить статус платежа. Проверьте соединение и попробуйте снова.",
  },
};

export const PaymentSuccess = () => {
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsSent, setAnalyticsSent] = useState(false);

  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );

  const apiBaseUrl = useMemo(
    () => process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, "")  "",
    []
  );

  const paymentId = useMemo(() => {
    return (
      searchParams.get("payment_id") 
      searchParams.get("paymentId") 
      localStorage.getItem("last_payment_id") 
      ""
    );
  }, [searchParams]);

  // Подставляем payment_id в URL, если его нет
  useEffect(() => {
    if (!paymentId) return;

    const params = new URLSearchParams(window.location.search);
    if (!params.get("payment_id")) {
      params.set("payment_id", paymentId);
      window.history.replaceState(
        {},
        "",
        ${window.location.pathname}?${params.toString()}
      );
    }
  }, [paymentId]);

  const fetchStatus = useCallback(async () => {
    if (!apiBaseUrl) {
      setError("Бэкенд не настроен. Проверьте адрес API.");
      setStatus("unknown");
      setIsLoading(false);
      return;
    }

    if (!paymentId) {
      setError("Не найден идентификатор платежа.");
      setStatus("unknown");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        ${apiBaseUrl}/payments/${paymentId}
      );

      if (!response.ok) {
        throw new Error("Не удалось получить статус платежа.");
      }

      const data = await response.json();
      const rawStatus = data.status  "unknown";
      const normalizedStatus =
        rawStatus === "waiting_for_capture" ? "pending" : rawStatus;

      setStatus(normalizedStatus);

      if (normalizedStatus === "succeeded") {
        localStorage.removeItem("last_payment_id");
      }
    } catch (err) {
      setError(err.message  "Ошибка загрузки статуса платежа");
      setStatus("unknown");
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, paymentId]);

  // Первичная загрузка статуса
  useEffect(() => {
    const statusFromQuery = searchParams.get("status");
    if (statusFromQuery === "canceled"  statusFromQuery === "cancelled") {
      setStatus("canceled");
      setIsLoading(false);
      return;
    }

    fetchStatus();
  }, [fetchStatus, searchParams]);

  // 🔥 АНАЛИТИКА (ТОЛЬКО 1 РАЗ И ТОЛЬКО ПРИ SUCCEEDED)
  useEffect(() => {
    if (status !== "succeeded") return;
    if (analyticsSent) return;

    // 🟡 Яндекс Метрика
    if (typeof window.ym === "function") {
      window.ym(105921891, "reachGoal", "purchase", {
        payment_id: paymentId,
      });
    }

    // 🔵 VK Pixel
    if (window.VK?.Retargeting) {
      window.VK.Retargeting.Event("purchase");
    }

    setAnalyticsSent(true);
  }, [status, paymentId, analyticsSent]);

  const displayStatus = STATUS_LABELS[status]  STATUS_LABELS.unknown;

return (
    <div className="min-h-screen bg-[#030b1f] text-white">
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
          {displayStatus.eyebrow}
        </p>

        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
          {displayStatus.title}
        </h1>

        <p className="mt-4 text-base text-blue-100 sm:text-lg">
          {displayStatus.description}
        </p>

        {isLoading && (
          <p className="mt-4 text-sm text-blue-200">
            Проверяем статус оплаты...
          </p>
        )}

        {!isLoading && error && (
          <p className="mt-4 text-sm text-rose-200">{error}</p>
        )}

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#030b1f] transition hover:bg-blue-100"
          >
            Вернуться на главную
          </Link>

          <a
            href="mailto:info@orthosite.ru"
            className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
          >
            Связаться с организаторами
          </a>
        </div>

        {status === "canceled" && (
          <Link
            to="/"
            className="mt-4 text-sm text-blue-200 underline underline-offset-4"
          >
            Попробовать оплатить снова
          </Link>
        )}
      </main>
    </div>
  );
};
