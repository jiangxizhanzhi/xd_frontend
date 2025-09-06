<template>
  <cb-inner-page :background="false">
    <div class="engage" id="engage">
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
            :style="{ width: childItemWidth + 'px' }"
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
                  ? 'color0049662'
                  : i === 3
                  ? 'color00468C'
                  : 'color735C00',
              ]"
            >
              {{ pItem.sub_category_name }}
            </div>
            <!-- 子技术 -->
            <div
              :class="['engage-c-item', cItem.count ? 'hover2' : 'hover1']"
              v-for="cItem in pItem.engages"
              :key="cItem.resource_id"
              @click="toTaskLink(cItem)"
            >
              <span class="last-name">{{ cItem.name }}</span>
              <span class="hover-edit">
                <cb-iconfont type="icon-bianji"></cb-iconfont>
              </span>
              <span class="task-num" v-if="cItem.count">{{ cItem.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import { getEngageList } from '@/api/career-att-engage';
export default {
  name: 'engage',
  data() {
    return {
      engageList: [],
      childItemWidth: '',
    };
  },
  mounted() {
    this.getEngageData();
    window.addEventListener('resize', this.getCategoryLength, false);
  },
  beforeDestory() {
    window.removeEventListener('resize', this.getCategoryLength, false);
  },
  methods: {
    getCategoryLength() {
      // 外层div的宽度
      const boxWidth = document.getElementById('engage').clientWidth;
      // 父元素右间距的长度
      const parentsMargin = (this.engageList.length - 1) * 8;
      // 子元素右边距的长度
      let childrenMargin = 0;
      // 子元素的个数
      let childrenLength = 0;
      this.engageList.forEach((item) => {
        childrenMargin += (item.sub_categories.length - 1) * 8;
        childrenLength += item.sub_categories.length;
      });
      const perChildLength =
        (boxWidth - (parentsMargin + childrenMargin)) / childrenLength;
      this.childItemWidth = perChildLength;
    },
    getEngageData() {
      getEngageList().then((res) => {
        const data = _.get(res, 'data.data', []) || [];
        this.engageList = data;
        this.getCategoryLength();
      });
    },
    toTaskLink(item) {
      this.$router.push({
        name: 'engage-frame-task',
        query: {
          type: '2',
          resource_id: item.resource_id,
        },
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
  background: var(--bg-color-2);
  border-radius: 6px;
}
.engage::-webkit-scrollbar-corner {
  background: transparent !important;
}
.engage {
  overflow: auto;
  display: flex;
  & > div {
    margin-right: 8px;
  }
  & > div:last-child {
    margin-right: 0px;
  }
  .engage-item {
    .engage-item-title {
      padding: 0 8px;
      width: auto;
      height: 48px;
      color: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      text-align: center;
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
        color: var(--neutral8);
        font-size: 14px;
        min-width: 136px;
      }
      .marginR8 {
        margin-right: 8px;
      }
      .engage-p-item-title {
        cursor: pointer;
        padding: 5px 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
      }
      .color735C00 {
        background-color: var(--yellow-color-2);
      }
      .color004966 {
        background-color: var(--green-color-2);
      }
      .color0049662 {
        background-color: var(--cyan-color-2);
      }
      .color00468C {
        background-color: var(--blue-color-2);
      }
      .engage-c-item {
        cursor: pointer;
        padding: 5px 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--bg-color-2);
        border: solid 1px var(--bg-color-3);
        border-top: none;
        position: relative;
        text-align: center;
        position: relative;
        .task-num {
          min-width: 16px;
          height: 16px;
          background-color: var(--red-color);
          position: absolute;
          right: 0;
          top: 0;
          font-size: 12px;
          line-height: 16px;
          text-align: center;
          color: var(--white-color);
        }
        .hover-edit {
          display: none;
        }
      }
      .engage-c-item:hover {
        .hover-edit {
          display: inline-block;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          line-height: 16px;
          text-align: center;
        }
      }
      .hover2 {
        background-color: var(--bg-color-3);
        border: solid 1px var(--neutral1);
      }
      .hover2:hover {
        background-color: var(--neutral1);
        span.task-num {
          display: none;
        }
      }
      .hover1:hover {
        background-color: var(--bg-color-3);
      }
    }
  }
}
</style>
