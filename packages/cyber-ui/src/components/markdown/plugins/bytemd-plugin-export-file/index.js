import { icons } from './icons';
// @ts-ignore
import ZH from './locales/zh_Hans.json';
export default function ExportFile({ locale: _locale, exportFile } = {}) {
  const locale = { ...ZH, ..._locale };
  return {
    actions: [
      {
        title: locale.exportFile,
        icon: icons.exportFile,
        handler: {
          type: 'action',
          click(ctx) {
            return exportFile();
          },
        },
      },
    ],
  };
}
