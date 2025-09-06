<template>
  <div>
    <div class="base-content">
      <div class="item" v-for="item in baseInfo" :key="item.key">
        <label for="">
          <cb-iconfont :size="16" :type="`icon-${item.icon}`"></cb-iconfont>
          {{ item.label }}：</label
        >
        <span>{{ item.value }}</span>
        <span v-if="item.key === 'duration_time'">h</span>
      </div>
    </div>

    <div class="skill-content">
      <div class="skill-title">{{ $t('m.frontSkills') }}:</div>
      <skill-component :skill-list="trainDescription.pre_skill" />
    </div>
    <div class="train-skill">
      <div class="skill-title">{{ $t('m.trainingSkills') }}:</div>
      <skill-component :skill-list="trainDescription.train_skill" />
    </div>
  </div>
</template>

<script>
import SkillComponent from './skill-component.vue';
export default {
  components: {
    SkillComponent,
  },
  props: {
    trainDescription: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      animationFold: false,
      baseInfo: [
        {
          label: this.$t('list.duration'),
          icon: 'lishizuijinshijian',
          key: 'duration_time',
          value: null,
        },
        {
          label: this.$t('list.node'),
          icon: 'tuopubianpai',
          key: 'node_count',
          value: null,
        },
        {
          label: this.$t('list.difficulty'),
          icon: 'dengji',
          key: 'trainDifficult',
          value: null,
        },
        {
          label: this.$t('list.category'),
          icon: 'yingyongxitong',
          key: 'trainType',
          value: null,
        },
      ],
    };
  },
  watch: {
    trainDescription: {
      handler: function (val, oldval) {
        if (val) {
          this.getBaseInfo(val);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getBaseInfo(val) {
      let obj = {};
      obj.trainType = val.trainType;
      obj.trainDifficult = val.trainDifficult;
      obj.duration_time = val.duration_time;
      obj.node_count = val.nodes_count;
      for (let key in obj) {
        this.baseInfo.map((info) => {
          if (info.key == key) {
            info.value = obj[key];
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.base-content {
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 50%;
    line-height: 24px;
    font-size: 14px;
    span {
      margin-left: 8px;
    }
    label {
      color: var(--neutral5);
      font-weight: normal;
    }
  }
}
.skill-content {
  margin-top: 14px;
  position: relative;
  margin-bottom: 12px;
}
.skill-title {
  color: var(--neutral7);
}
.train-skill {
  position: relative;
}
</style>
