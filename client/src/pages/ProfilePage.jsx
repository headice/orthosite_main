import { useEffect, useState } from 'react';
import { api } from '../api';

export const ProfilePage = () => {
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', email: '' });
  const [state, setState] = useState({ loading: true, saving: false, message: '', error: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getProfile();
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          email: data.email || '',
        });
        setState({ loading: false, saving: false, message: '', error: '' });
      } catch (error) {
        setState({ loading: false, saving: false, message: '', error: `Не удалось загрузить профиль: ${error.message}` });
      }
    };

    load();
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setState((prev) => ({ ...prev, saving: true, message: '', error: '' }));
      await api.updateProfile(form);
      setState((prev) => ({ ...prev, saving: false, message: 'Профиль обновлен.' }));
    } catch (error) {
      setState((prev) => ({ ...prev, saving: false, error: `Не удалось сохранить: ${error.message}` }));
    }
  };

  if (state.loading) {
    return <section className="mx-auto w-full max-w-3xl px-4 py-12 text-white">Загрузка профиля...</section>;
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12 text-white">
      <h1 className="mb-6 text-4xl font-semibold">Профиль пользователя</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-[#102448] p-6">
        <input className="w-full rounded-xl px-3 py-2 text-black" name="first_name" value={form.first_name} onChange={onChange} placeholder="Имя" />
        <input className="w-full rounded-xl px-3 py-2 text-black" name="last_name" value={form.last_name} onChange={onChange} placeholder="Фамилия" />
        <input className="w-full rounded-xl px-3 py-2 text-black" name="phone" value={form.phone} onChange={onChange} placeholder="Телефон" />
        <input className="w-full rounded-xl px-3 py-2 text-black" name="email" value={form.email} onChange={onChange} placeholder="Email" />

        {state.error ? <p className="text-red-300">{state.error}</p> : null}
        {state.message ? <p className="text-green-300">{state.message}</p> : null}

        <button className="rounded-xl bg-white px-4 py-2 text-[#003399]" type="submit" disabled={state.saving}>
          {state.saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </section>
  );
};
