<template>
  <div class="study-record">
    <div v-if="list.length > 0" class="record">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="record-item"
        @click="goDetail(item)"
      >
        <div class="com-record-item" v-if="type === 'practice'">
          <div class="left-title two-overflow ft14" :title="item.content">
            {{ item.content }}
          </div>
          <div
            class="right-status one-overflow ft14"
            :class="{
              green: item.solved === 1,
              orange: item.solved === 0,
              gray: item.solved === 2,
            }"
            :title="statusComputed(statusLists, item.solved)"
          >
            {{ statusComputed(statusLists, item.solved) }}
          </div>
        </div>
        <div class="com-record-item" v-else-if="type === 'testPaper'">
          <div
            class="left-title two-overflow ft14"
            :title="item.paper_time + $t('practice.volume')"
          >
            {{ item.paper_time }}{{ $t('practice.volume') }}
          </div>
          <div
            class="right-status one-overflow ft14"
            :class="item.is_finish ? 'green' : 'orange'"
            :title="
              item.is_finish ? $t('m.completed') : $t('practice.unfinished')
            "
          >
            {{ item.is_finish ? $t('m.completed') : $t('practice.unfinished') }}
          </div>
        </div>

        <div class="com-record-item" v-else-if="type === 'flag'">
          <div class="left-title two-overflow ft14" :title="item.title">
            {{ item.title }}
          </div>
          <div
            class="right-status one-overflow ft14"
            :class="item.solved ? 'green' : 'orange'"
            :title="getStatusName(item.solved)"
          >
            {{ getStatusName(item.solved) }}
          </div>
        </div>
      </div>
    </div>
    <div v-else style="height: 180px; margin-top: 10px">
      <empty />
    </div>

    <div v-if="list.length > 0" class="see-more ft14">
      <span class="see-more-span" @click="seeMore">
        {{
          this.type === 'practice' ? $t('m.seeMore') : $t('practice.viewRecord')
        }}
      </span>
    </div>
  </div>
</template>
<script>
import empty from '@/components/empty/index.vue';
import { TYPE } from '../constant';
export default {
  components: {
    empty,
  },
  props: {
    type: {
      type: String,
      default: 'practice',
    },
    // 自由练习 状态
    statusLists: {
      type: Array,
      default: () => [],
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      TYPE,
      len: [1, 2, 3],
    };
  },
  methods: {
    // 列表状态计算
    statusComputed(list, id) {
      const data = list.filter((item) => item.code === Number(id));
      if (data.length) {
        return data[0].name;
      }
    },
    getStatusName(id) {
      const data = this.statusLists.filter(
        (item) => item.resource_id === Number(id),
      );
      if (data.length) {
        return data[0].name;
      }
    },
    // 跳转习题详情
    goDetail(val) {
      this.$emit('go-detail', val);
    },
    seeMore() {
      this.$emit('seeMore');
    },
  },
};
</script>
<style lang="scss" scoped>
.green {
  color: var(--green-color);
}
.orange {
  color: var(--orange-color);
}

.study-record {
  min-height: 40px;
  .record {
    .record-item {
      .com-record-item {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        cursor: pointer;
        &:hover {
          background: var(--neutral0);
        }
      }
    }
    .left-title {
      width: calc(100% - 58px);
      color: var(--neutral8);
      line-height: 22px;
    }
    .right-status {
      width: 42px;
      line-height: 22px;
    }
  }
  .see-more {
    height: 40px;
    border-top: 1px solid var(--neutral1);
    color: var(--primary-color);
    text-align: center;
    line-height: 40px;
    .see-more-span {
      cursor: pointer;
    }
  }
}
</style>
