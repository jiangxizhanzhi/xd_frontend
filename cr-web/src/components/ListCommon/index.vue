<template>
  <div class="common-list-comp">
    <div class="train_img_box">
      <img :src="itemData.running_bg_src" alt="" />
      <span class="imgContent">{{ itemData.img_content }}</span>
    </div>
    <div
      class="train_content"
      :class="$store.getters.language === 'en' ? 'train_content-en' : ''"
    >
      <div class="train_name one-overflow" :title="itemData.name">
        <div>{{ itemData.name }}</div>
        <!-- TODO: 条件判断 -->
        <div
          v-show="itemData.is_attack_related"
          class="att-engage"
          @click.stop="attClick(itemData)"
        >
          <cb-iconfont size="14" type="icon-babiaoguanli"></cb-iconfont>
          <span>ATT&CK</span>
        </div>
        <div
          v-show="itemData.is_engage_related"
          class="att-engage"
          @click.stop="engageClick(itemData)"
        >
          <cb-iconfont size="14" type="icon-anfangshebei"></cb-iconfont>
          <span>Engage</span>
        </div>
      </div>
      <!-- 训练时长,拓扑规模,难度 -->
      <div class="description">
        <span class="level"
          >{{ $t('m.trainDuration') }}&nbsp;<span>:</span></span
        >
        <span class="value">
          <span style="font-size: 16px">
            {{ itemData.duration_time_formate }}</span
          >
          {{ hours }}
        </span>
        <span class="level" style="margin-left: 40px">
          {{ $t('m.topologySize') }}&nbsp;<span>:</span>
        </span>
        <span class="value"
          ><span style="font-size: 16px">{{ itemData.nodes_count }}</span>
          {{ nodesCount }}</span
        >
        <!-- 难度 -->
        <span class="level" style="margin-left: 40px">
          {{ $t('m.difficulty') }}&nbsp;<span>:</span>
        </span>
        <span
          style="color: var(--green-color)"
          v-if="this.itemData.difficult % 4 === 1"
          >{{ computedDiffculty(itemData.difficult) }}
        </span>
        <span
          style="color: var(--orange-color)"
          v-else-if="this.itemData.difficult % 4 === 2"
          >{{ computedDiffculty(itemData.difficult) }}
        </span>
        <span
          style="color: var(--red-color)"
          v-else-if="this.itemData.difficult % 4 === 3"
          >{{ computedDiffculty(itemData.difficult) }}
        </span>
      </div>

      <!-- 前置技能 -->
      <div class="description tags_list">
        <span class="level">{{ $t('m.frontSkills') }}&nbsp;<span>:</span></span>
        <div class="tags_list-label">
          <span
            v-for="(trainItem, index) in itemData.pre_skill"
            :key="trainItem"
            class="value skill_value"
            :title="trainItem"
            ><span v-if="!!index" style="margin: 0 10px">/</span
            >{{ trainItem }}</span
          >
        </div>
      </div>
      <!-- 训练技能 -->
      <div class="description tags_list">
        <span class="level"
          >{{ $t('m.trainingSkills') }}&nbsp;<span>:</span></span
        >
        <div class="tags_list-label">
          <span
            v-for="(trainItem, index) in itemData.train_skill"
            :key="trainItem"
            class="value skill_value"
            :title="trainItem"
            ><span v-if="!!index" style="margin: 0 10px">/</span
            >{{ trainItem }}</span
          >
        </div>
      </div>
      <!-- 场景描述 -->
      <div class="description tags_list" style="display: flex">
        <div class="level">
          {{ $t('m.taskDescription') }}&nbsp;<span>:</span>
        </div>
        <div class="description_cntent">
          <div :title="this.itemData.description">
            {{ itemData.description }}
          </div>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Index',
  components: {},
  props: {
    itemData: {
      type: Object,
      default: () => {},
    },
    diffcultInfo: {
      type: Object,
      default: () => {},
    },
    difficultLists: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      attDialogVisible: false,
    };
  },
  computed: {
    hours() {
      let hoursName = '';
      if (this.itemData.duration_time_formate === 1) {
        hoursName = this.$t('m.hours');
      } else {
        hoursName = this.$t('m.hour');
      }
      return hoursName;
    },
    nodesCount() {
      let nodeName = '';
      if (this.itemData.nodes_count === 1) {
        nodeName = this.$t('m.node');
      } else {
        nodeName = this.$t('m.nodes');
      }
      return nodeName;
    },
  },
  methods: {
    // ATT&CK点击
    attClick(data) {
      this.$emit('attEngageEvent', data, 1);
    },
    // Engage点击
    engageClick(data) {
      this.$emit('attEngageEvent', data, 0);
    },
    computedDiffculty(difficult) {
      const data = this.difficultLists.filter((item) => {
        return item.value === difficult;
      });
      if (data.length) {
        return data[0].label;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.description_cntent {
  width: calc(100% - 75px);
  height: 50px;
}
.description_cntent > div {
  width: 100%;
  height: 100%;
  margin-left: 4px;
  text-overflow: ellipsis;
  display: -webkit-box;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-wrap: break-word;
}
.description.tags_list {
  width: 100%;
  .tags_list-label {
    display: inline-flex;
    justify-content: left;
    align-items: center;
    width: calc(100% - 75px);
  }
}
.common-list-comp {
  width: 100%;
  height: 100%;
  padding: 30px 0;
  box-sizing: border-box;
  .train_img_box {
    width: 66px;
    height: 100%;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 30px;
    img {
      width: 66px;
      height: auto;
      background-size: 100% 100%;
    }
    .imgContent {
      position: absolute;
      color: var(--neutral8);
      font-size: 14px;
    }
  }
  .train_content {
    font-size: 14px;
    float: left;
    // height: 250px;
    width: calc(70% - 196px);
    box-sizing: border-box;
    position: relative;
    z-index: 3;
    padding-right: 2%;
    .train_name {
      width: calc(100% - 270px);
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: normal;
      margin: 5px 0 24px 0;
      display: flex;
      align-items: center;
      .att-engage {
        border: solid 1px var(--primary-color);
        padding: 5px 8px;
        font-size: 12px;
        color: var(--primary-color);
        margin-left: 15px;
      }
    }
  }
  .train_content-en {
    .description.tags_list {
      .tags_list-label {
        width: calc(100% - 100px);
      }
    }
    .description {
      line-height: 24px;
      .level {
        width: 85px !important;
      }
    }
    .special-span {
      width: calc(100% - 103px) !important;
    }
  }
  .train_status {
    position: absolute;
    padding: 9px 30px 0 25px;
    height: 34px;
    top: -23px;
    left: 37px;
    img {
      vertical-align: middle;
      padding-right: 7px;
    }
    span {
      vertical-align: middle;
      font-size: 12px;
      color: rgba(237, 242, 255, 1);
    }
  }
  .tags_list {
    white-space: nowrap;
  }
  .description {
    margin-bottom: 2px;
    clear: both;
    line-height: 24px;
    &:last-child {
      margin-bottom: 0;
    }
    .level {
      padding: 1px 0;
      // width: 60px;
      color: rgba(209, 219, 241, 1);
      margin-right: 15px;
      font-family: Microsoft YaHei;
    }
    .value {
      display: inline-block;
      vertical-align: bottom;
      height: 24px;
      line-height: 24px;
      white-space: nowrap;
      text-align: center;
      overflow: hidden;
      box-sizing: border-box;
      text-overflow: ellipsis;
    }
  }
  .special {
    width: 100%;
    .special-span {
      width: calc(100% - 78px);
      box-sizing: border-box;
      font-family: Microsoft YaHei;
      font-weight: lighter;
    }
  }
  .single-diffult {
    position: absolute;
    top: 74px;
    right: calc(28% + 60px);
  }
}

.common-list-comp {
  .description {
    .level,
    .value,
    .description_cntent {
      color: var(--neutral7);
    }
  }
}
</style>
