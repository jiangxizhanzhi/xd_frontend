<template>
  <div>
    <SimpleFishBone v-model="data" :layout="fishLayout" :theme="fishTheme">
      <div class="fishbone-header">
        <div>
          <layout-selector v-model="model.template" :layout.sync="fishLayout" />
          <cb-select v-model="model.color" :options="themes" />
        </div>
        <div class="tips">
          操作提示：双击修改节点，单击Insert键插入子节点，单击Enter键插入同级节点，单击Delete键删除节点
        </div>
      </div>
    </SimpleFishBone>
    <SimpleFishBone
      :value="data"
      readonly
      :key="dataKey"
      :layout="fishLayout"
      :theme="fishTheme"
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
      themes: [
        {
          key: 'black',
          label: '黑色',
          value: 1,
        },
        {
          key: 'green',
          label: '绿色',
          value: 2,
        },
        {
          key: 'blue',
          label: '蓝色',
          value: 3,
        },
        {
          key: 'brown',
          label: '棕色',
          value: 4,
        },
      ],
      fishLayout: '',
      model: {
        template: _.random(2),
        color: _.random(1, 4),
      },
    };
  },
  computed: {
    dataKey() {
      return JSON.stringify(this.data);
    },
    fishTheme() {
      return (
        _.chain(this.themes)
          .find({ value: this.model.color })
          .get('key')
          .value() || ''
      );
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
    answer(e) {},
  },
};
</script>
