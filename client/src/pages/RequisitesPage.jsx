import { useEffect, useState } from 'react';
import { api } from '../api';

const fallback = [
  {
    id: 1,
    title: 'ООО «Вектор здоровья»',
    legal_name: 'ООО «Вектор здоровья»',
    short_name: 'ООО «Вектор здоровья»',
    legal_address: 'г. Новосибирск, ул. Примерная, 1',
    ogrn: '0000000000000',
    license_number: 'ЛО-54-01-000000',
    inn: '0000000000',
    postal_address: '630000, г. Новосибирск, а/я 1',
  },
  {
    id: 2,
    title: 'ООО «Первый Педикюрный»',
    legal_name: 'ООО «Первый Педикюрный»',
    short_name: 'ООО «Первый Педикюрный»',
    legal_address: 'г. Новосибирск, ул. Примерная, 2',
    ogrn: '1111111111111',
    license_number: 'ЛО-54-01-111111',
    inn: '1111111111',
    postal_address: '630001, г. Новосибирск, а/я 2',
  },
];

export const RequisitesPage = () => {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getRequisites();
        const list = Array.isArray(data) && data.length ? data : fallback;
        setItems(list);
        setActiveId(list[0].id);
      } catch {
        setItems(fallback);
        setActiveId(fallback[0].id);
      }
    };

    load();
  }, []);

  const active = items.find((item) => item.id === activeId) || items[0];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 text-[#003399]">
      <h1 className="mb-8 text-5xl font-semibold">Реквизиты</h1>

      <div className="overflow-hidden rounded-3xl bg-[#d9d9d9]">
        <div className="grid grid-cols-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`py-4 text-lg ${item.id === activeId ? 'bg-white' : 'bg-[#d1d1d1]'}`}
              onClick={() => setActiveId(item.id)}
            >
              {item.title}
            </button>
          ))}
        </div>

        {active ? (
          <div className="grid gap-8 p-8 md:grid-cols-2">
            <div className="space-y-3 text-2xl">
              <p>Наименование организации: {active.legal_name}</p>
              <p>Краткое наименование организации: {active.short_name}</p>
              <p>Юридический адрес: {active.legal_address}</p>
              <p>ОГРН: {active.ogrn}</p>
            </div>
            <div className="space-y-3 text-2xl">
              <p>Регистрационный номер лицензии: {active.license_number}</p>
              <p>ИНН: {active.inn}</p>
              <p>Почтовый адрес: {active.postal_address}</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};
