<template>
  <div class="bulletin-wrapper cyber-scroll-bar-small">
    <template v-if="bulletinListsCom.length > 0">
      <div
        v-for="item in bulletinListsCom"
        :key="item.resource_id"
        class="list-boxs"
      >
        <div class="time-box ft14">{{ item.time }}</div>
        <div class="value-box" :title="item.title">
          【{{ item.codeName }}】{{ item.title }}
        </div>
      </div>
    </template>
    <div
      v-else
      class="empty-comp"
      style="width: 100%; height: 155px; color: var(--neutral8)"
    >
      <empty-page ref="emptyComp" />
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import { getBulletin } from '@/api/personal';
import { typeData } from '@/api/notice';
import emptyPage from '@/pages/web/Empty';
export default {
  components: {
    emptyPage,
  },
  data() {
    return {
      bulletinLists: [],
      pagination: {
        total: 0,
        currentPage: 1,
        currentSize: 10, // 列表每页条数
      },
      typeList: [], // 公告类型
    };
  },
  computed: {
    bulletinListsCom() {
      if (this.typeList && this.bulletinLists) {
        _.forEach(this.bulletinLists, (item) => {
          const findData = _.find(this.typeList, (type) => {
            return item.type === type.code;
          });
          this.$set(item, 'codeName', findData.name);
        });
        return this.bulletinLists;
      }
      return [];
    },
  },
  mounted() {
    this.getTypeList();
    this.getInitData();
  },
  methods: {
    getTypeList() {
      typeData().then((res) => {
        let tempList = _.get(res, 'data.data', []);
        this.typeList = tempList;
      });
    },
    getInitData() {
      const that = this;
      const query = {
        page: that.pagination.currentPage,
        per_page: that.pagination.currentSize,
      };
      getBulletin(query).then((resp) => {
        _.forEach(_.get(resp, 'data.data.list'), (item) => {
          that.$set(item, 'time', item.create_time.substr(0, 16));
        });
        that.bulletinLists = _.get(resp, 'data.data.list');
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.bulletin-wrapper {
  width: 100%;
  min-height: 155px;
  max-height: 522px;
  overflow-y: auto;
  .list-boxs {
    padding: 8px 0;
    line-height: 24px;
    &:hover {
      background: var(--neutral1);
    }
    &:first-child {
      border-top: 0;
    }
    .time-box {
      color: var(--neutral5);
      font-size: 12px;
      padding-left: 8px;
    }
    .value-box {
      color: var(--neutral8);
      font-size: 14px;
    }
  }
}
</style>
