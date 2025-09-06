<template>
  <div class="scroll-table">
    <div
      class="scroll-table-header"
      :class="rankType === 'user' ? 'scroll-table-user' : ''"
    >
      <div
        v-for="(item, index) in cols"
        :key="index"
        class="header-item item-wrapper"
        :title="item.label"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="scroll-table-content">
      <!-- <cb-scroll
        :data="tableData"
        v-if="tableData.length !== 0"
        class="scroll-box"
        :classOption="optionSingleHeight"
        @ScrollEnd="scrollEndEvent"
      > -->
      <div v-if="rankType === 'org'" class="scroll-box">
        <div
          v-for="(item, index) in tableData"
          :key="item.org_id"
          class="scroll-item"
        >
          <div class="img-title"><img :src="getImg(index)" /></div>
          <div class="org-name one-overflow" :title="item.org_name">
            {{ item.org_name }}
          </div>
          <div class="excellent">{{ item.excellent }}</div>
          <div class="qualified">{{ item.qualified }}</div>
          <div class="sum">{{ item.sum }}</div>
        </div>
      </div>
      <div v-if="rankType === 'multi'" class="scroll-box muti-box">
        <div
          v-for="(item, index) in tableData"
          :key="index"
          class="scroll-item"
        >
          <div class="img-title position">
            <img :src="getImg(index, item)" />
          </div>
          <div class="one-overflow" :title="item.name">{{ item.name }}</div>
          <div>{{ item.excellent }}</div>
          <div>{{ item.qualified }}</div>
        </div>
      </div>
      <div v-if="rankType === 'user'" class="scroll-box">
        <div v-for="(item, index) in tableData" :key="index" class="user-item">
          <div class="index">{{ index + 1 }}</div>
          <div class="name one-overflow" :title="item.name">
            {{ item.name }}
          </div>
          <div class="org-name one-overflow" :title="item.role_name">
            {{ item.role_name }}
          </div>
          <div class="match">{{ item.match }}%</div>
          <div
            class="star one-overflow"
            :title="item.star ? $t('personTrainingScreen.postStar') : ''"
          >
            <img :src="starImg" alt="star" v-show="item.star" />
            {{ item.star ? $t('personTrainingScreen.postStar') : '' }}
          </div>
        </div>
      </div>
      <!-- </cb-scroll> -->
    </div>
  </div>
</template>

<script>
import starImg from '@/assets/img/person-training/star.png';
import firstImg from '@/assets/img/person-training/first.png';
import secondImg from '@/assets/img/person-training/second.png';
import thirdImg from '@/assets/img/person-training/third.png';
export default {
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    cols: {
      type: Array,
      default: () => [],
    },
    rankType: {
      type: String,
      default: 'org',
    },
    limitNum: {
      type: Number,
      default: 3,
    },
  },

  data() {
    return {
      starImg,
      firstImg,
      secondImg,
      thirdImg,
    };
  },
  computed: {
    optionSingleHeight() {
      return {
        limitMoveNum: this.limitNum,
      };
    },
  },
  methods: {
    scrollEndEvent() {
      this.$emit('scrollEndEvent');
    },
    getImg(index, item) {
      if (item) {
        if (
          index === 0 &&
          parseInt(item.qualified) + parseInt(item.excellent) > 2
        ) {
          return this.firstImg;
        }
        if (
          index === 1 &&
          parseInt(item.qualified) + parseInt(item.excellent) > 2
        ) {
          return this.secondImg;
        }
        if (
          index === 2 &&
          parseInt(item.qualified) + parseInt(item.excellent) > 2
        ) {
          return this.thirdImg;
        }
      } else {
        if (index === 0) {
          return this.firstImg;
        }
        if (index === 1) {
          return this.secondImg;
        }
        if (index === 2) {
          return this.thirdImg;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-table {
  text-align: left;
  &-header {
    display: flex;
    height: 60px;
    color: rgba(255, 255, 255, 0.4);
    line-height: 60px;
    .header-item {
      flex: 1;
      position: relative;
      font-size: 12px;
    }
  }
  &-user {
    display: flex;
    justify-content: space-between;
    .header-item {
      flex: none;
      width: 22%;
      &:first-child {
        width: 20px;
      }
    }
  }
  &-content {
    .scroll-box {
      height: 500px;
      overflow: hidden;
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      line-height: 22px;
      .scroll-item {
        display: flex;
        height: 50px;
        line-height: 50px;
        justify-content: space-between;
        .img-title {
          img {
            position: relative;
            top: -5px;
          }
        }
        div {
          flex: 1;
        }
      }
      .user-item {
        display: flex;
        height: 50px;
        line-height: 50px;
        justify-content: space-between;
        .index {
          width: 8px;
        }
        .name {
          width: 20%;
        }
        .org-name {
          width: 22%;
        }
        .match {
          width: 13%;
        }

        .star {
          width: 24%;
          color: #ff7d2c;
          font-size: 14px;
          img {
            position: relative;
            top: 5px;
          }
        }
      }
    }
    .muti-box {
      height: 300px;
    }
  }
}
</style>
