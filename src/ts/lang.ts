type Lang = 'ru' | 'kz';
type Dict = Record<string, string>;

const dictionary: Record<Lang, Dict> = {
  ru: {
    menu: 'Меню',
    'nav.about': 'О компании',
    'nav.advantages': 'Преимущества',
    'nav.tariffs': 'Тарифы',
    'nav.how': 'Как мы работаем',
    'nav.reviews': 'Отзывы',
    'nav.contacts': 'Контакты',
    'hero.l1': '- доставка из ОАЭ',
    'hero.l2': 'в Казахстан за 5-7 дней',
    'hero.text': 'Посылки, техника, запчасти и грузы для бизнеса.<br />Всё под ключ: склад, трекинг, таможня.',
    'cta.calc': 'Рассчитать стоимость',
    'cta.tariff': 'Ознакомиться с тарифом',
  },
  kz: {
    menu: 'Мәзір',
    'nav.about': 'Компания туралы',
    'nav.advantages': 'Артықшылықтар',
    'nav.tariffs': 'Тарифтер',
    'nav.how': 'Біз қалай жұмыс істейміз',
    'nav.reviews': 'Пікірлер',
    'nav.contacts': 'Байланыс',
    'hero.l1': '- БАӘ-дан жеткізу',
    'hero.l2': 'Қазақстанға 5-7 күнде',
    'hero.text': 'Сәлемдемелер, техника, қосалқы бөлшектер және бизнеске арналған жүктер.<br />Бәрі дайын күйде: қойма, трекинг, кеден.',
    'cta.calc': 'Құнын есептеу',
    'cta.tariff': 'Тарифпен танысу',
  },
};

const STORAGE_KEY = 'jb-lang';

function apply(lang: Lang): void {
  const dict = dictionary[lang];
  document.documentElement.lang = lang === 'kz' ? 'kk' : 'ru';
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const value = dict[el.dataset.i18n ?? ''];
    if (value !== undefined) el.innerHTML = value;
  });
  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

/** Переключатель RU / KZ (переводятся шапка и первый экран) */
export function initLang(): void {
  let saved: Lang = 'ru';
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'ru' || v === 'kz') saved = v;
  } catch {
    /* storage недоступен — остаёмся на RU */
  }
  if (saved !== 'ru') apply(saved);

  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang as Lang;
      apply(lang);
      try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
    });
  });
}
