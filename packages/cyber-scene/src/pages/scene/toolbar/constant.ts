import t from '../../../utils/i18n';

const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

let ctrl = isMac ? { icon: 'icon-command' } : 'Ctrl';
let alt = isMac ? { icon: 'icon-option' } : 'Alt';

export const help = [
  // { key: ['esc'], value: t('toolbar.returnToMove') },
  {
    key: isMac ? [ctrl, { icon: 'icon-tuigejian' }] : ['Del'],
    value: t('toolbar.delete'),
  },
  { key: [ctrl, 'C'], value: t('toolbar.copy') },
  { key: [ctrl, 'V'], value: t('toolbar.paste') },
  { key: [ctrl, 'F'], value: t('toolbar.search') },
  // { key: [ctrl, 'z'], value: t('toolbar.undo') },
  // { key: [ctrl, 'shift', 'z'], value: t('toolbar.redo') },
  {
    key: [ctrl, { icon: 'icon-shubiaogunlun' }],
    value: t('toolbar.scale'),
  },
  {
    key: [ctrl, { icon: 'icon-danji' }],
    value: t('toolbar.drawRect'),
  },
  { key: [alt, { icon: 'icon-danji' }], value: t('toolbar.drawSelection') },
];
