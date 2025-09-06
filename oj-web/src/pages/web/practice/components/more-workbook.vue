<template>
  <div class="more-workbook-wrapper cyber-scroll-bar-small">
    <div class="more-workbook-wrapper-blew" v-if="list.length > 0">
      <div
        class="workbook-item"
        v-for="(item, index) in list"
        :key="index"
        @click="goOtherWorkBook(item)"
      >
        <div class="left-img-wrapper">
          <div class="left-img">
            <WorkBookCard
              :logo="item.logo || defaultLogo"
              :logo-is-built-in="item.logo_is_built_in"
              :name="item.name"
            />
          </div>
        </div>
        <div class="right-name two-overflow" :title="item.name">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div v-else style="height: 190px">
      <empty />
    </div>
  </div>
</template>
<script>
import empty from '@/components/empty/index.vue';
import Default from '@/assets/img/course/logo.jpg';
import WorkBookCard from './workbook-card.vue';
import { TYPE } from '../constant';
import { getMoreWorkBook } from '@/api/practice.ts';
export default {
  components: {
    WorkBookCard,
    empty,
  },
  props: {
    // 理论 or 实操
    type: {
      type: [String, Number],
      default: '',
    },
    // 习题集id
    practiceSetId: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      TYPE,
      defaultLogo: Default,
      list: [],
    };
  },
  watch: {
    practiceSetId: {
      handler(nv, ov) {
        if (nv) {
          this.getMoreWorkBookTh();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    getMoreWorkBookTh() {
      getMoreWorkBook({
        set_type: this.type,
        resource_id: this.practiceSetId,
      }).then((res) => {
        const data = _.get(res, 'data.data', []);
        this.list = data;
      });
    },
    goOtherWorkBook(row) {
      if (this.type === TYPE.Rationale) {
        this.$router.push({
          path: `/practice/rationale/list/${row.resource_id}`,
        });
      } else {
        this.$router.push({
          path: `/practice/capture-flag/list/${row.resource_id}`,
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.more-workbook-wrapper {
  max-height: 528px;
  overflow: auto;
  .more-workbook-wrapper-blew {
    padding-right: 16px;
  }
  .workbook-item {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    cursor: pointer;
    .left-img-wrapper {
      width: 98px;
      height: 56px;
      flex: 1;
      transform: scale(0.5);
      transform-origin: top left;
    }
    .left-img {
      width: 183px;
      height: 104px;
    }
    .right-name {
      width: 120px;
      padding: 6px 0;
      font-weight: 600;
      color: var(--neutral8);
      line-height: 22px;
      height: 52px;
      font-size: 14px;
    }
  }
}
</style>
