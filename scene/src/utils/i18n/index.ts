import locales from '../../locales';

interface RecursiveObject {
  [key: string]: string | RecursiveObject;
}

interface Index {
  [key: string]: any;
}

class Cookie {
  static cookie = document.cookie
    .split(';')
    .map((kv) => kv.split('='))
    .reduce((p, c) => {
      p[c[0].trim()] = c[1];
      return p;
    }, {} as Index);

  static get(key: string) {
    return this.cookie[key];
  }

  static set(key: string, value: any) {
    this.cookie[key] = value;
    let str = '';
    for (let key in this.cookie) {
      str += key + '=' + this.cookie[key] + ';';
    }
    document.cookie = str;
  }
}

class Index {
  private _lang: string;
  private readonly _message: RecursiveObject = {};

  constructor(message: RecursiveObject) {
    this._lang = Cookie.get('language') || 'zh-CN';
    this._message = message;
  }

  set lang(lang: string) {
    this._lang = lang;
  }

  get lang(): string {
    return this._lang;
  }

  get message(): RecursiveObject {
    return this._message;
  }

  public t(key: string, template?: Index): string {
    let arr = key.split('.');
    let locale: RecursiveObject | string = this._message[
      this._lang
    ] as RecursiveObject;
    let i = 0;
    while (i < arr.length && locale) {
      if (typeof locale === 'string') break;
      locale = locale[arr[i]];
      i++;
    }
    let result = locale;
    if (typeof result !== 'string') return (result as unknown as string) || key;
    if (result && /{*}/.test(result as unknown as string)) {
      if (template) {
        let keys = Object.keys(template);
        keys.forEach((el) => {
          result = (result as unknown as string).replace(
            new RegExp(`{${el}}`, 'g'),
            template[el],
          );
        });
      }
    }
    return result || key;
  }
}

// @ts-ignore
export const i18n = new Index(locales);

export default i18n.t.bind(i18n);
