import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const type = searchParams.get('type') || 'all';

  useEffect(() => {
    const load = async () => {
      try {
        const [servicesData, productsData] = await Promise.all([api.getServices(), api.getProducts()]);
        setServices(Array.isArray(servicesData) ? servicesData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        setError(`Не удалось загрузить каталог: ${err.message}`);
      }
    };

    load();
  }, []);

  const visibleItems = useMemo(() => {
    if (type === 'services') return services;
    if (type === 'products') return products;
    return [...services, ...products];
  }, [products, services, type]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 text-white">
      <h1 className="mb-6 text-4xl font-semibold">Каталог</h1>

      <div className="mb-6 flex gap-3">
        {[
          ['all', 'Все'],
          ['services', 'Услуги'],
          ['products', 'Товары'],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setSearchParams({ type: value })}
            className={`rounded-xl px-4 py-2 ${type === value ? 'bg-white text-[#003399]' : 'bg-[#1d315f]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? <p className="mb-4 text-red-300">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {visibleItems.map((item) => (
          <article key={`${item.type || 'item'}-${item.id}`} className="rounded-2xl bg-[#102448] p-4">
            <h2 className="text-xl font-semibold">{item.title || item.name}</h2>
            <p className="mt-2 text-sm text-blue-100">{item.description || 'Описание скоро появится'}</p>
            {item.price ? <p className="mt-3 text-lg font-medium">{item.price} ₽</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
};
