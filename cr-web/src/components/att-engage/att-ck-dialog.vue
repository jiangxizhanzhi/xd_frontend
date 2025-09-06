<template>
  <div class="att-ck">
    <div
      class="att-ck-item"
      v-for="item in attCkList"
      :key="item.category_name"
    >
      <div class="att-ck-item-title">
        <span>{{ item.category_name }}</span>
      </div>
      <div
        :class="['att-ck-detail-item', item2.related ? 'hover2' : '']"
        v-for="item2 in item.attacks"
        :key="item2.resource_id"
      >
        <cb-iconfont
          v-if="item2.related"
          style="color: #ff3045; margin: 2px 3px 0 0; flex: 0 0 auto"
          type="icon-danxuan-xuanzhong"
        ></cb-iconfont>
        <span>{{ item2.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getAttCkRelatedData } from '@/api/web/career-att-engage';
export default {
  name: 'att-ck-dialog',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      attCkList: [],
    };
  },
  mounted() {
    this.getRelated(this.id);
  },
  methods: {
    getRelated(id) {
      getAttCkRelatedData({ resource_id: id }).then((res) => {
        const data = _.get(res, 'data.data', null);
        if (data) {
          this.attCkList = data;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.att-ck {
  display: flex;
  .att-ck-item {
    margin-right: 8px;
    .att-ck-item-title {
      padding: 0 8px;
      width: 136px;
      height: 48px;
      background-color: var(--primary-color);
      color: var(--neutral9);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      text-align: center;
      span {
        word-break: break-word;
      }
    }
    .att-ck-detail-item {
      position: relative;
      width: 136px;
      height: auto;
      padding: 5px 8px;
      background-color: var(--bg-color-3);
      border: solid 1px var(--bg-color-2);
      border-top: none;
      display: flex;
      justify-content: center;
      font-size: 14px;
      color: var(--neutral9);
      text-align: center;
      span {
        word-break: break-word;
      }
    }
    .hover2 {
      border: solid 1px var(--red-color);
      background: rgba($color: var(--red-color), $alpha: 0.2);
      color: var(--red-color);
    }
  }
}
</style>
