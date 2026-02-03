import { icons } from './icons';
import selectFiles from 'select-files';
import ZH from './locales/zh_Hans.json';
export default function UploadZip({ locale: _locale = {}, uploadZip } = {}) {
  const locale = { ...ZH, ..._locale };
  return {
    actions: [
      {
        title: locale.uploadZip,
        icon: icons.uploadZip,
        handler: uploadZip
          ? {
              type: 'action',
              click(ctx) {
                selectFiles({
                  accept: 'application/zip',
                  multiple: false,
                }).then((files) => {
                  if (files == null ? void 0 : files.length) {
                    const { editor, appendBlock, codemirror } = ctx;
                    uploadZip(files[0]).then((res) => {
                      const pos = appendBlock(
                        `[${files[0].name}](${res[0].url})`,
                      );
                      editor.setSelection(pos, codemirror.Pos(pos.line + 1, 0));
                      editor.focus();
                    });
                  }
                });
              },
            }
          : void 0,
      },
    ],
  };
}
