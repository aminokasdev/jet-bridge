/** Маска телефона +7 (XXX) XXX-XX-XX */
function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (!digits.startsWith('7')) digits = '7' + digits;
  digits = digits.slice(0, 11);

  const p = digits.slice(1);
  let out = '+7';
  if (p.length) out += ` (${p.slice(0, 3)}`;
  if (p.length >= 3) out += ')';
  if (p.length > 3) out += ` ${p.slice(3, 6)}`;
  if (p.length > 6) out += `-${p.slice(6, 8)}`;
  if (p.length > 8) out += `-${p.slice(8, 10)}`;
  return out;
}

type Validator = (value: string) => string | null;

const validators: Record<string, Validator> = {
  name: (v) => (v.trim().length >= 2 ? null : 'Введите имя'),
  phone: (v) => (v.replace(/\D/g, '').length === 11 ? null : 'Введите номер полностью'),
  weight: (v) => {
    if (!v.trim()) return null;
    const n = Number(v.replace(',', '.'));
    return Number.isFinite(n) && n > 0 ? null : 'Только число';
  },
};

function validateField(input: HTMLInputElement): boolean {
  const error = validators[input.name]?.(input.value) ?? null;
  const slot = input.parentElement?.querySelector<HTMLElement>('.form__error');
  input.classList.toggle('is-invalid', !!error);
  input.setAttribute('aria-invalid', String(!!error));
  if (slot) slot.textContent = error ?? '';
  return !error;
}

export function initForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-form]');
  if (!form) return;

  const phone = form.elements.namedItem('phone') as HTMLInputElement;
  const weight = form.elements.namedItem('weight') as HTMLInputElement;
  const tariff = form.elements.namedItem('tariff') as HTMLInputElement;
  const status = form.querySelector<HTMLElement>('.form__status')!;
  const inputs = Array.from(form.querySelectorAll<HTMLInputElement>('.form__input'));

  phone.addEventListener('focus', () => { if (!phone.value) phone.value = '+7'; });
  phone.addEventListener('blur', () => { if (phone.value === '+7') phone.value = ''; });
  phone.addEventListener('input', () => { phone.value = formatPhone(phone.value); });

  weight.addEventListener('input', () => {
    weight.value = weight.value.replace(/[^\d.,]/g, '');
  });

  inputs.forEach((input) =>
    input.addEventListener('blur', () => { if (input.value) validateField(input); }),
  );

  // кнопки «Оставить заявку» в тарифах: подставляем тариф и ведём к форме
  document.querySelectorAll<HTMLButtonElement>('[data-tariff]').forEach((btn) => {
    btn.addEventListener('click', () => {
      tariff.value = btn.dataset.tariff ?? '';
      document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' });
      (form.elements.namedItem('name') as HTMLInputElement).focus({ preventScroll: true });
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const valid = inputs.map(validateField).every(Boolean);
    status.classList.remove('is-error');
    if (!valid) {
      status.textContent = 'Проверьте поля формы';
      status.classList.add('is-error');
      inputs.find((i) => i.classList.contains('is-invalid'))?.focus();
      return;
    }

    const submit = form.querySelector<HTMLButtonElement>('.form__submit')!;
    submit.disabled = true;
    status.textContent = 'Отправляем…';

    // Здесь будет запрос на бэкенд; для тестового задания имитируем отправку
    const data = Object.fromEntries(new FormData(form));
    await new Promise((r) => setTimeout(r, 700));
    console.info('Заявка:', data);

    status.textContent = 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
    form.reset();
    inputs.forEach((i) => i.classList.remove('is-invalid'));
    submit.disabled = false;
  });
}
