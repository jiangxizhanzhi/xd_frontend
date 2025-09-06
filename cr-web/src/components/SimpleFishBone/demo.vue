<template>
  <div>
    <SimpleFishBone
      v-model="data"
      :layout.sync="model.template"
      :theme.sync="model.color"
    />
    <SimpleFishBone
      :value="data"
      readonly
      :key="dataKey"
      :layout="model.template"
      :theme="model.color"
      @answer="answer"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import SimpleFishBone from '@/components/SimpleFishBone';
import LayoutSelector from '@/components/SimpleFishBone/LayoutSelector';

export default {
  components: {
    SimpleFishBone,
    LayoutSelector,
  },
  data() {
    return {
      data: [],
      model: {
        template: _.random(1, 3),
        color: _.random(1, 4),
      },
    };
  },
  computed: {
    dataKey() {
      return JSON.stringify(this.data);
    },
  },
  created() {
    const r = [];
    for (let i = 0; i < _.random(3, 9); i++) {
      const templates = [];
      for (let j = 0; j < _.random(1, 9); j++) {
        templates.push({
          title: _.uniqueId(`leaf_${j}_`),
          isDone: _.random(),
        });
      }
      r.push({
        stage: _.uniqueId(`node_${i}_`),
        templates,
      });
    }
    this.data = r;
  },
  methods: {
    answer(e) {
      console.log(e);
    },
  },
};
</script>
1
