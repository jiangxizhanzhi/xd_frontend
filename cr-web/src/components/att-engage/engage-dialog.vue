<template>
  <div class="engage">
    <div
      class="engage-item"
      v-for="(item, i) in engageList"
      :key="item.category_name"
    >
      <div
        :class="[
          'engage-item-title',
          i === 0
            ? 'colorE6CF09'
            : i === 1
            ? 'color0BDAFF'
            : i === 2
            ? 'color00B0E0'
            : i === 3
            ? 'color24A7FF'
            : 'colorE6CF09',
        ]"
      >
        <!-- 阶段 -->
        <span>{{ item.category_name }}</span>
      </div>
      <div class="engage-item-content">
        <div
          v-for="(pItem, pi) in item.sub_categories"
          :key="pItem.sub_category_name"
          :class="[
            'engage-p-item',
            pi !== item.sub_categories.length - 1 ? 'marginR8' : '',
          ]"
        >
          <!-- 技术 -->
          <div
            :class="[
              'engage-p-item-title',
              i === 0
                ? 'color735C00'
                : i === 1
                ? 'color004966'
                : i === 2
                ? 'color004966'
                : i === 3
                ? 'color00468C'
                : 'color735C00',
            ]"
          >
            {{ pItem.sub_category_name }}
          </div>
          <!-- 子技术 -->
          <div
            :class="['engage-c-item', { active: cItem.related }]"
            v-for="cItem in pItem.engages"
            :key="cItem.resource_id"
          >
            <cb-iconfont
              v-if="cItem.related"
              style="color: #24a7ff; margin: 2px 3px 0 0; flex: 0 0 auto"
              type="icon-danxuan-xuanzhong"
            ></cb-iconfont>
            <span>{{ cItem.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getEngageRelatedData } from '@/api/web/career-att-engage';
export default {
  name: 'engage-dialog',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      engageList: [],
    };
  },
  mounted() {
    this.getRelated(this.id);
  },
  methods: {
    getRelated(id) {
      getEngageRelatedData({ resource_id: id }).then((res) => {
        const data = _.get(res, 'data.data', null);
        if (data) {
          this.engageList = data;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.engage::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.engage::-webkit-scrollbar-thumb {
  background: var(--scrollbar-color);
  border-radius: 6px;
}
.engage {
  overflow: auto;
  display: flex;
  .engage-item {
    margin-right: 8px;
    .engage-item-title {
      padding: 0 8px;
      width: auto;
      height: 48px;
      color: var(--neutral9);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
    }
    .colorE6CF09 {
      background-color: var(--yellow-color);
    }
    .color0BDAFF {
      background-color: var(--green-color);
    }
    .color00B0E0 {
      background-color: var(--cyan-color);
    }
    .color24A7FF {
      background-color: var(--blue-color);
    }
    .engage-item-content {
      display: flex;
      flex-direction: row;
      .engage-p-item {
        color: var(----neutral9);
        font-size: 14px;
        width: 144px;
      }
      .marginR8 {
        margin-right: 8px;
      }
      .engage-p-item-title {
        padding: 5px 8px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .color735C00 {
        background-color: var(--yellow-color-2);
      }
      .color004966 {
        background-color: var(--green-color-2);
      }
      .color00468C {
        background-color: var(--blue-color-2);
      }
      .engage-c-item {
        padding: 5px 8px;
        display: flex;
        justify-content: center;
        background-color: var(--bg-color-3);
        border: solid 1px var(--bg-color-2);
        border-top: none;
        position: relative;
        text-align: center;
        span {
          word-break: break-word;
        }
      }
      .active {
        border: solid 1px var(----primary-color-4);
        color: var(----primary-color-4);
        background: rgba($color: var(----primary-color-4), $alpha: 0.2);
      }
    }
  }
}
</style>
