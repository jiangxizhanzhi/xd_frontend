<template>
  <div class="flag-card-wrapper" @click="flagClick">
    <div
      class="top-wrapper"
      :class="{
        'bg-img-green': this.tableData.difficulty === 0,
        'bg-img-orange': this.tableData.difficulty === 1,
        'bg-img-red': this.tableData.difficulty === 2,
      }"
    >
      <div class="name two-overflow" :title="tableData && tableData.title">
        {{ tableData && tableData.title }}
      </div>
    </div>
    <div class="bottom-wrapper">
      <div
        class="category-box one-overflow"
        :title="categoryCom || tableData.category_name"
      >
        <cb-iconfont type="icon-kecheng" themedColor="neutral7" :size="16" />
        {{ categoryCom || tableData.category_name }}
      </div>
      <div class="knowledge-list">
        <knowledge-list
          :dataList="tableData && tableData.knowledge"
        ></knowledge-list>
      </div>
      <!-- <div
        class="flag-workbook-box one-overflow"
        :class="{ 'show-set-name': showBtn }"
        :title="tableData.practice_set_name || tableData.set_name"
      >
        <cb-iconfont type="icon-jianda1" themedColor="neutral7" :size="16" />
        {{ tableData.practice_set_name || tableData.set_name }}
      </div> -->
      <div
        class="status-wrapper"
        v-if="tableData && tableData.solved % 2 === 1"
      >
        {{ statusCom }}
      </div>
    </div>
    <div
      class="level-wrapper"
      :class="{
        'bg-green': this.tableData.difficulty === 0,
        'bg-orange': this.tableData.difficulty === 1,
        'bg-red': this.tableData.difficulty === 2,
      }"
    >
      {{ levelCom }}
    </div>
    <div v-if="showBtn" class="btn-again">
      <cb-button hollow size="small" @click.native.stop="practiceAgain">
        {{ $t('practice.practiceAgain') }}
      </cb-button>
    </div>
  </div>
</template>
<script>
import KnowledgeList from './knowledge-list.vue';
export default {
  components: {
    KnowledgeList,
  },
  props: {
    // 状态
    statusLists: {
      type: Array,
      default: () => [],
    },
    //难度
    difficultLists: {
      type: Array,
      default: () => [],
    },
    //方向
    categoryLists: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Object,
      default: () => {},
    },
    showBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    categoryCom() {
      return this.getById(this.categoryLists, this.tableData.category_id);
    },
    levelCom() {
      return this.getById(this.difficultLists, this.tableData.difficulty);
    },
    statusCom() {
      return this.getById(this.statusLists, Number(this.tableData.solved));
    },
  },
  watch: {},
  methods: {
    getById(arr, id) {
      const list = _.filter(arr, (item) => {
        return item.resource_id === id;
      });
      return list[0]?.name;
    },

    practiceAgain() {
      this.$emit('practice-again', this.tableData);
    },
    flagClick() {
      this.$emit('flag-click', this.tableData);
    },
  },
};
</script>
<style lang="scss" scoped>
.flag-card-wrapper {
  width: 100%;
  height: 146px;
  background: var(--bg-color-3);
  border-radius: 4px;
  position: relative;
  cursor: pointer;

  .top-wrapper {
    height: 74px;
    padding: 10px 40px 10px 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px 4px 0 0;
    .name {
      font-size: 14px;
      font-weight: 600;
      color: var(--white-color);
      line-height: 24px;
    }
  }
  .bottom-wrapper {
    padding: 12px;
    position: relative;
    .category-box,
    .flag-workbook-box {
      font-size: 12px;
      font-weight: 400;
      color: var(--neutral7);
      line-height: 20px;
    }
    .knowledge-list {
      height: 20px;
    }
    .category-box {
      margin-bottom: 10px;
    }
    .flag-workbook-box {
    }
    .status-wrapper {
      position: absolute;
      min-width: 52px;
      padding: 0 5px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      background: var(--green-color-2);
      border-radius: 89px 0px 0px 89px;
      top: 10px;
      right: 0;
      font-size: 12px;
      color: var(--green-color);
    }
  }
  .level-wrapper {
    min-width: 40px;
    height: 22px;
    border-radius: 4px 0px 8px 0px;
    font-size: 12px;
    position: absolute;
    top: 0;
    left: 0;
    line-height: 22px;
    text-align: center;
    color: var(--white-color);
  }
  .bg-img-green {
    background: url('@/assets/img/practice/topic_bg_easy.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .bg-img-orange {
    background: url('@/assets/img/practice/topic_bg_middle.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .bg-img-red {
    background: url('@/assets/img/practice/topic_bg_difficulty.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .bg-green {
    background: var(--green-color-8);
  }
  .bg-red {
    background: var(--red-color-8);
  }
  .bg-orange {
    background: var(--orange-color-8);
  }
  .btn-again {
    display: none;
    position: absolute;
    bottom: 2px;
    left: 0;
    width: 100%;
    height: 32px;
    text-align: center;
    border-radius: 0px 0px 4px 4px;
  }
  &:hover {
    transform: translate(0, -4px);
    background: var(--neutral0);
    box-shadow: 6px 0px 20px 0px var(--box-shadow-color);
    .show-set-name {
      display: none;
    }
    .btn-again {
      display: block;
    }
  }
}
</style>
