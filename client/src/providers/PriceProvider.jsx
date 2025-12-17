import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const PriceContext = createContext({
  priceRub: null,
  isLoading: false,
  error: "",
  refreshPrice: async () => {},
});

const PRICE_STALE_MS = 5 * 60 * 1000;
const KEEP_ALIVE_INTERVAL_MS = 4 * 60 * 1000;

const readJsonSafe = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  throw new Error(text?.slice(0, 300) || "Сервер вернул неверный ответ");
};

export const PriceProvider = ({ children }) => {
  const [priceRub, setPriceRub] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastLoadedAt, setLastLoadedAt] = useState(null);

  const apiBaseUrl = useMemo(
    () => process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, "") || "",
    []
  );

  const requireApiBase = useCallback(() => {
    if (!apiBaseUrl) {
      throw new Error(
        "Бэкенд не настроен. Добавьте строку REACT_APP_API_BASE_URL=http://localhost:8000 в client/.env и перезапустите `npm start` или пересоберите фронтенд."
      );
    }
  }, [apiBaseUrl]);

  const fetchPrice = useCallback(async () => {
    if (isLoading) {
      return priceRub;
    }

    const isFresh =
      lastLoadedAt && Date.now() - lastLoadedAt < PRICE_STALE_MS && priceRub;
    if (isFresh) {
      return priceRub;
    }

    setLoading(true);
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
      setLastLoadedAt(Date.now());
      return data.amount_rub;
    } catch (fetchError) {
      setError(fetchError.message || "Ошибка загрузки цены");
      throw fetchError;
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl, isLoading, lastLoadedAt, priceRub, requireApiBase]);

  const pingBackend = useCallback(() => {
    if (!apiBaseUrl) {
      return;
    }

    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch(`${apiBaseUrl}/wake`, {
      method: "GET",
      cache: "no-store",
      keepalive: true,
      signal: controller.signal,
    })
      .catch(() => null)
      .finally(() => clearTimeout(timeoutId));
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchPrice().catch(() => null);
  }, [fetchPrice]);

  useEffect(() => {
    if (!apiBaseUrl) {
      return undefined;
    }

    pingBackend();
    const id = setInterval(pingBackend, KEEP_ALIVE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [apiBaseUrl, pingBackend]);

  const value = useMemo(
    () => ({ priceRub, isLoading, error, refreshPrice: fetchPrice }),
    [error, fetchPrice, isLoading, priceRub]
  );

  return <PriceContext.Provider value={value}>{children}</PriceContext.Provider>;
};

export const usePrice = () => useContext(PriceContext);
