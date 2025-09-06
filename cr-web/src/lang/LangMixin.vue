<script>
import { getI18n, trans } from './index';

export default {
  props: {
    lang: {
      type: String,
      default: '',
    },
  },
  computed: {
    langClass() {
      return [getI18n().locale];
    },
  },
  watch: {},
  methods: {
    $it(...args) {
      return getI18n().t(...args);
    },
    $itc(...args) {
      return i18n.tc(...args);
    },
    $trans(...args) {
      return trans(...args);
    },
  },
};
</script>
