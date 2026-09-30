import avatar1 from '../assets/img/avatar-1.jpg';
import avatar2 from '../assets/img/avatar-2.jpg';

export interface Review {
  name: string;
  caption: string;
  avatar: string;
  text: string;
}

const long =
  'Привезли ноутбук из Дубая за 6 дней, всё чётко, с фото, трекингом и оповещениями. Очень доволен! ' +
  'Привезли ноутбук из Дубая за 6 дней, всё чётко, с фото, трекингом и оповещениями. Очень доволен!';
const b2b =
  'Работаем по ВЭД с компанией больше года. Надежные партнёры по логистике, всё по договору. ' +
  'Очень ценим стабильность и прозрачность в этом партнёрстве.';

const arman: Review = { name: 'Арман С.', caption: 'Алматы', avatar: avatar1, text: long };
const asel: Review = { name: 'Асель Б.,', caption: 'директор ТОО', avatar: avatar2, text: b2b };

export const reviews: Review[] = [arman, asel, arman, asel, arman, asel, arman, asel];

const escape = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function renderReview(r: Review): string {
  return `
    <li class="review">
      <div class="review__head">
        <img class="review__avatar" src="${r.avatar}" width="58" height="58" alt="" />
        <p class="review__name">${escape(r.name)}<br />${escape(r.caption)}</p>
      </div>
      <p class="review__text">${escape(r.text)}</p>
    </li>`;
}
