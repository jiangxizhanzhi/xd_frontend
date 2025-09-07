import { getI18N } from '@cyber/helper';
export default {
  methods: {
    t(...args) {
      // return t.apply(this, args);
      return getI18N().t(...args);
    },
  },
};
