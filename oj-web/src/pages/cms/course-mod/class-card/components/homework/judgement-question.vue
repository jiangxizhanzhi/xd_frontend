<template>
  <div class="judgement">
    <div v-for="item in data" :key="item.label">
      <CbMarkdown v-model="item.label" type="viewer"></CbMarkdown>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';
import { getI18N } from '@cyber/helper';

export default {
  setup() {
    const i18n = getI18N();
    const state = reactive({
      count: 0,
      judgmentAnswer: '',
      data: [
        {
          label: i18n.t('m.correct'),
          value: 'A',
        },
        {
          label: i18n.t('m.error'),
          value: 'B',
        },
      ],
    });
    const refData = toRefs(state);

    return {
      ...refData,
    };
  },
};
</script>

<style lang="scss" scoped>
.judgement {
  padding-left: 15px;
}
</style>
