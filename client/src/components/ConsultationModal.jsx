import { useState } from 'react';
import { api } from '../api';

export const ConsultationModal = ({ open, onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '', policyAccepted: false });
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  if (!open) return null;

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form.policyAccepted) {
      setStatus({ loading: false, message: '', error: 'Нужно согласие с политикой обработки данных.' });
      return;
    }

    try {
      setStatus({ loading: true, message: '', error: '' });
      await api.requestConsultation({
        name: form.name,
        phone: form.phone,
        policy_accepted: form.policyAccepted,
      });
      setStatus({ loading: false, message: 'Заявка отправлена, мы скоро свяжемся с вами.', error: '' });
      setForm({ name: '', phone: '', policyAccepted: false });
    } catch (error) {
      setStatus({ loading: false, message: '', error: `Не удалось отправить заявку: ${error.message}` });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-[#002a86]">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-xl font-semibold">Консультация</h3>
          <button onClick={onClose} type="button" className="text-2xl leading-none">×</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full rounded-xl border border-gray-300 px-3 py-2"
            placeholder="Ваше имя"
            name="name"
            value={form.name}
            onChange={onChange}
            required
          />
          <input
            className="w-full rounded-xl border border-gray-300 px-3 py-2"
            placeholder="Телефон"
            name="phone"
            value={form.phone}
            onChange={onChange}
            required
          />

          <label className="flex gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="policyAccepted"
              checked={form.policyAccepted}
              onChange={onChange}
            />
            <span>Согласен(а) с политикой обработки персональных данных</span>
          </label>

          {status.error ? <p className="text-sm text-red-600">{status.error}</p> : null}
          {status.message ? <p className="text-sm text-green-600">{status.message}</p> : null}

          <button
            type="submit"
            disabled={status.loading}
            className="w-full rounded-xl bg-[#0048b5] px-4 py-2 font-semibold text-white disabled:opacity-60"
          >
            {status.loading ? 'Отправка...' : 'Заказать консультацию'}
          </button>
        </form>
      </div>
    </div>
  );
};
