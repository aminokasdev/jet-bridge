import '@fontsource/jost/300.css';
import '@fontsource/jost/400.css';
import '@fontsource/jost/500.css';
import '@fontsource/jost/600.css';
import '@fontsource/jost/700-italic.css';
import './styles/main.scss';

import { initMenu } from './ts/menu';
import { initLang } from './ts/lang';
import { initSlider } from './ts/slider';
import { initForm } from './ts/form';

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initLang();
  initSlider();
  initForm();
});
