<template>
  <!-- 我的学习任务 -->
  <div class="card-thumb-wrapper">
    <div class="content-box">
      <div class="left-box">
        <div class="image-box">
          <img
            :src="tableData.logo || defaultLogo"
            alt=""
            class="image-style"
          />
          <div
            class="level-style"
            :class="[
              tableData.difficulty === 0 ? 'color-greens' : '',
              tableData.difficulty === 1 ? 'color-oranges' : '',
              tableData.difficulty === 2 ? 'color-reds' : '',
            ]"
          >
            <span v-if="tableData.difficulty === 2">{{
              $t('m.highLevel')
            }}</span>
            <span v-else-if="tableData.difficulty === 1">{{
              $t('m.middleLevel')
            }}</span>
            <span v-else-if="tableData.difficulty === 0">{{
              $t('m.lowLevel')
            }}</span>
          </div>
        </div>
      </div>
      <!-- 中间 -->
      <div class="middle-box">
        <div class="middle-top">
          <div class="title-style one-overflow" :title="tableData.name">
            {{ tableData.name }}
          </div>
          <div
            style="margin-left: 8px"
            class="name-style one-overflows"
            :title="tableData.direction_name"
          >
            {{ tableData.direction_name }}
          </div>
        </div>
        <div class="middle-bottom">
          <span class="title"
            >{{ $t('personal.totalClass') }}：{{ tableData.lesson_count }}</span
          >
          <span class="title"
            >{{ $t('personal.learnedTheory') }}：{{
              tableData.learned_theory
            }}</span
          >
          <span class="title"
            >{{ $t('personal.learnedExperiment') }}：{{
              tableData.learned_exp
            }}</span
          >
          <span class="title"
            >{{ $t('personal.recentStudy') }}：{{ tableData.create_time }}</span
          >
        </div>
      </div>
      <div class="right-box">
        <cb-button hollow @click="goLesson(tableData)" class="btn-style">{{
          $t('personal.goLesson')
        }}</cb-button>
      </div>
    </div>
  </div>
</template>
<script>
import cardThumb from '../tabs-model/card-thumb.vue';
import Default from '@/assets/img/course/logo.jpg';
import { getRouter } from '@cyber/helper';
export default {
  components: { cardThumb },
  props: {
    tableData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      defaultLogo: Default,
    };
  },
  methods: {
    goLesson(tableData) {
      if (tableData.room_id) {
        getRouter().push({
          path: `/oj/all-course/lesson/${tableData.resource_id}/${tableData.lesson_id}/`,
          query: {
            room_id: tableData.room_id,
          },
        });
      } else {
        getRouter().push({
          path: `/oj/all-course/lesson/${tableData.resource_id}/${tableData.lesson_id}/`,
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.card-thumb-wrapper {
  width: 100%;
  padding: 0 16px;
  background: var(--bg-color-3);
  .content-box {
    padding: 12px 0;
    border-bottom: 1px solid var(--neutral0);
    display: flex;
    height: 88px;
    font-size: 14px;

    .left-box {
      margin-right: 16px;
      .image-box {
        width: 112px;
        height: 64px;
        position: relative;
        .image-style {
          height: 100%;
          width: 112px;
        }
        .level-style {
          position: absolute;
          top: 0;
          min-width: 36px;
          padding: 0 8px;
          height: 18px;
          text-align: center;
          color: var(--white-color);
          span {
            font-size: 12px;
          }
        }
      }
    }
    .middle-box {
      margin-right: 16px;
      width: 70%;
      height: 52px;
      margin-top: 4px;
      .middle-top {
        display: flex;
        margin-bottom: 8px;

        height: 22px;
        line-height: 22px;
        .name-style {
          font-size: 12px;
          background: var(--neutral0);
          border-radius: 2px 2px 2px 2px;
          padding-right: 8px;
          padding-left: 8px;
          min-width: 16px;
          max-width: 200px;
        }
        .title-style {
          max-width: 200px;
          font-size: 14px;
        }
        .one-overflows {
          overflow: hidden;
        }
      }
      .middle-bottom {
        .title {
          margin-right: 12px;
          font-size: 12px;
        }
      }
    }
    .right-box {
      width: 30%;
      .btn-style {
        margin-top: 16px;
        float: right;
      }
    }
    .color-greens {
      background: var(--green-color);
    }
    .color-reds {
      background: var(--red-color);
    }
    .color-oranges {
      background: var(--orange-color);
    }
  }
}
</style>
