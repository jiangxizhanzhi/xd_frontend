<template>
  <cb-inner-page :background="false" class="attack-inner-page">
    <cb-tabs v-model="activeName" type="border-card">
      <cb-tab-pane :label="$t('attEngage.enterprise')" name="enterprise">
        <div class="att-ck" id="att-ck">
          <div
            class="att-ck-item"
            v-for="item in attCkList"
            :key="item.category_name"
          >
            <div class="att-ck-item-title">
              <span>{{ item.category_name }}</span>
            </div>
            <div
              :class="['att-ck-detail-item', item2.count ? 'hover2' : 'hover1']"
              v-for="item2 in item.attacks"
              :key="item2.resource_id"
              @click="toTaskLink(item2, 'enterprise')"
            >
              {{ item2.name }}
              <span class="hover-edit">
                <cb-iconfont type="icon-bianji"></cb-iconfont>
              </span>
              <span class="hover2-count" v-if="item2.count">{{
                item2.count
              }}</span>
            </div>
          </div>
        </div>
      </cb-tab-pane>

      <cb-tab-pane
        :label="$t('attEngage.ics')"
        name="ics"
        v-if="system_type === '2' && show"
      >
        <div class="att-ck" id="att-ck">
          <div
            class="att-ck-item"
            v-for="item in attCkIcsList"
            :key="item.category_name"
          >
            <div class="att-ck-item-title">
              <span>{{ item.category_name }}</span>
            </div>
            <div
              :class="['att-ck-detail-item', item2.count ? 'hover2' : 'hover1']"
              v-for="item2 in item.attacks"
              :key="item2.resource_id"
              @click="toTaskLink(item2, 'ics')"
            >
              {{ item2.name }}
              <span class="hover-edit">
                <cb-iconfont type="icon-bianji"></cb-iconfont>
              </span>
              <span class="hover2-count" v-if="item2.count">{{
                item2.count
              }}</span>
            </div>
          </div>
        </div>
      </cb-tab-pane>
    </cb-tabs>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import { getAttCkList, getAttCkIcs } from '@/api/career-att-engage';
import { getSysSettings } from '@cyber/helper';
export default {
  name: 'career-att-ck',
  data() {
    return {
      activeName: 'enterprise',
      attCkList: [],
      attCkIcsList: [],
      startX: 0,
      endX: 0,
      show: false,
      system_type: '1', //1-标准，2-工控，3-攻击，4-防御，5-教育，
    };
  },
  mounted() {
    this.getSystemType();
    this.getAttCkData();
    this.getAttCkIcsData();
  },
  methods: {
    getSystemType() {
      getSysSettings().then((res) => {
        const data = _.get(res, 'data.data');
        const filterData = _.filter(data, (item) => {
          return item.key_name === 'system_type';
        });
        this.system_type = filterData[0].value;
        if (this.system_type === '2') {
          this.show = true;
        }
      });
    },
    // 获取att&ck数据
    getAttCkData() {
      getAttCkList().then((res) => {
        const data = _.get(res, 'data.data', []) || [];
        this.attCkList = data;
      });
    },
    // 获取ics数据
    getAttCkIcsData() {
      getAttCkIcs().then((res) => {
        const data = _.get(res, 'data.data', []) || [];
        this.attCkIcsList = data;
      });
    },
    toTaskLink(item, attckType) {
      this.$router.push({
        name: 'att-ck-frame-task',
        query: {
          type: '1',
          attckType,
          resource_id: item.resource_id,
        },
      });
    },

    // TODO:兼容性还未考虑
    /* mouseDown(event) {
      document.onselectstart = function () {
        return false;
      };
      document.ondragstart = function () {
        return false;
      };
      this.startX = event.clientX;
    },

    mouseMove(event) {
      this.endX = event.clientX;
    },

    mouseUp(event) {
      const dom = document.getElementById('att-ck');
      if (this.endX > this.startX) {
        dom.scrollLeft = parseInt(this.endX - this.startX);
      } else {
        dom.scrollLeft =
          dom.scrollWidth - dom.offsetWidth - (this.startX - this.endX);
      }
    }, */
  },
};
</script>

<style scoped lang="scss">
.att-ck::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.att-ck::-webkit-scrollbar-thumb {
  background: var(--scrollbar-color);
  border-radius: 6px;
}
.att-ck::-webkit-scrollbar-corner {
  background: transparent !important;
}
.att-ck {
  /* overflow: auto; */
  display: flex;
  margin: 0 0 20px 0;
  overflow-x: auto;
  height: 100%;
  cursor: pointer;
  .att-ck-item {
    margin-right: 8px;
    .att-ck-item-title {
      padding: 0 8px;
      width: 136px;
      height: 48px;
      background-color: var(--primary-color);
      color: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      text-align: center;
    }
    .att-ck-detail-item {
      position: relative;
      width: 136px;
      height: auto;
      padding: 5px 12px;
      background-color: var(--bg-color-2);
      border: solid 1px var(--bg-color-3);
      border-top: none;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      cursor: pointer;
      color: var(--neutral8);
      text-align: center;
      span.hover2-count {
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
    .att-ck-detail-item:hover {
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
      span.hover2-count {
        display: none;
      }
    }
    .hover1:hover {
      background-color: var(--bg-color-3);
    }
  }
}
</style>
<style lang="scss">
.attack-inner-page {
  .cb-tabs .el-tabs--border-card {
    height: calc(var(--content-height) - 39px);
    .el-tabs__content {
      height: 100%;
      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>
