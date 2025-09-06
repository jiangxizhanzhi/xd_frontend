<template>
  <div class="position-menu">
    <div class="position-menu-title">
      <Block :title="title" />
      <cb-radio-group v-model="radioValue" @change="handleChange">
        <cb-radio-button :label="1">{{
          $t('personal.potition')
        }}</cb-radio-button>
        <cb-radio-button :label="2">{{
          $t('personal.knowledgePoint')
        }}</cb-radio-button>
        <cb-radio-button :label="3">{{
          $t('personal.skillPoint')
        }}</cb-radio-button>
      </cb-radio-group>
    </div>
    <div class="position-menu-content">
      <cb-search-table
        :scroll="{ y: 240 }"
        :cols="columns"
        rowKey="resource_id"
        :dataSource="dataSource"
        :hidePaginOnDemand="true"
        :searchBarBg="false"
      >
      </cb-search-table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import Block from '@/components/block';

export default {
  props: {
    positionMenu: {
      type: Object,
      default: null,
    },
  },
  components: { Block },
  data() {
    return {
      radioValue: 1,
      title: this.$t('personal.potitionList'),
      columns: [
        {
          label: this.$t('personal.num'),
          prop: 'resource_id',
          width: '25%',
        },
        {
          label: this.$t('personal.content'),
          prop: 'content',
        },
      ],
      groupDataList: [],
      dataSource: [],
    };
  },
  watch: {
    radioValue(val) {
      this.getDataList();
    },
    positionMenu(val) {
      this.getDataList();
    },
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    handleChange(value) {
      this.radioValue = value;
      if (value === 1) {
        this.title = this.$t('personal.potitionList');
      } else if (value === 2) {
        this.title = this.$t('personal.knowledgePointList');
      } else if (value === 3) {
        this.title = this.$t('personal.skillPointList');
      }
    },
    getDataList() {
      const that = this;
      if (this.radioValue === 1) {
        that.dataSource = that.positionMenu && that.positionMenu.task_data_list;
      } else if (this.radioValue === 2) {
        that.dataSource =
          that.positionMenu && that.positionMenu.knowledge_data_list;
      } else if (this.radioValue === 3) {
        that.dataSource =
          that.positionMenu && that.positionMenu.skill_data_list;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.position-menu {
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-content {
    margin-top: 15px;
  }
}
</style>
