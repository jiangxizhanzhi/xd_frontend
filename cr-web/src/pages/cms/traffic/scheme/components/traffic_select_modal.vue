<template>
  <cb-dialog
    :title="$t('traffic.selectSchemeTraffic')"
    center
    :visible.sync="dialog.visible"
  >
    <cb-search-table
      :cols="cols"
      :selector="selector"
      :selection.sync="selection"
      :url="url"
      :data="model"
      row-key="resource_id"
      ref="tableListRef"
      baseURL="/api/mp"
    >
      <template v-slot:search>
        <cb-select
          v-model="type"
          :placeholder="$t('traffic.selectCategory')"
          :options="trafficTypeList"
        />
        <cb-select
          v-model="model.category"
          :placeholder="$t('event.selectTrafficCategory')"
          :options="categoryOptions"
          clearable
        />
        <cb-search-input
          v-model="model.search"
          :placeholder="$t('traffic.pleaseInputTrafficTitle')"
        ></cb-search-input>
      </template>

      <template v-slot:category="scope">
        <span>{{ categoryTagNames[scope.data.category] }}</span>
      </template>
    </cb-search-table>

    <div class="dialog-btns">
      <cb-button button-type="confirm" @click="submit" mr>{{
        $t('common.confirm')
      }}</cb-button>
      <cb-button button-type="cancel" @click="dialogCancel">{{
        $t('common.cancel')
      }}</cb-button>
    </div>
  </cb-dialog>
</template>

<script>
import _ from 'lodash';
import { importSchemeFlow, getOptionList } from '@/api/traffic/traffic';
import '@/lang/all-lang/index';
import { trans } from '@/lang';
export default {
  name: 'TrafficSelectModal',
  data() {
    return {
      url: '/flow/info/page',
      dialog: {
        visible: false,
      },
      model: {
        category: '',
        interactive_type: 0,
        search: '',
        search_fields: ['title'],
      },
      type: this.$CONSTANT.Traffic.TrafficType.BACKGROUND.value,
      selector: {
        maxSelect: 0,
      },
      selection: [],
      categoryOptions: [],
      categoryTagNames: {},
      cols: [
        {
          label: this.$t('table.title'),
          prop: 'title',
        },
        {
          label: this.$t('event.desc'),
          prop: 'introduction',
        },
        {
          label: this.$t('table.type'),
          slot: 'category',
        },
        {
          label: this.$t('common.createTime'),
          prop: 'create_time',
        },
      ],
    };
  },
  computed: {
    trafficTypeList: function () {
      const list = this.$CONSTANT.LIST.Traffic.TrafficType;
      const listNew = list.map((item) => {
        return {
          label: item.name.toString(),
          value: item.value,
        };
      });
      return listNew;
    },
  },
  watch: {
    model: {
      handler(newV, oldV) {
        this.selection = [];
      },
      deep: true,
    },
    type: function (value) {
      if (value === this.$CONSTANT.Traffic.TrafficType.INTELLIGENT.value) {
        this.model.interactive_type = 1;
      } else if (
        value === this.$CONSTANT.Traffic.TrafficType.BACKGROUND.value
      ) {
        this.model.interactive_type = 0;
      }
    },
  },
  created() {
    this.traffic_scheme = this.$route.params.resource_id;
  },
  mounted() {
    this.getOptionsList();
  },
  methods: {
    show() {
      this.selection = [];
      this.dialog.visible = true;
    },
    submit() {
      if (this.selection.length > 0) {
        const list = [];
        this.selection.forEach((item) => {
          list.push(item.resource_id);
        });
        importSchemeFlow(this.traffic_scheme, list).then((res) => {
          this.$emit('refreshTraffic');
          this.dialogCancel();
        });
      }
    },
    dialogCancel() {
      this.dialog.visible = false;
    },
    //获取下拉选框options列表数据
    getOptionsList() {
      getOptionList().then((res) => {
        const tempList = (this.options = _.get(res, 'data.data', []));
        this.categoryOptions = tempList.map((item) => {
          this.categoryTagNames[item.code] = item.name;
          return {
            label: item.name,
            value: item.code,
          };
        });
      });
    },
    trans,
  },
};
</script>
<style scoped>
.dialog-btns {
  display: flex;
  justify-content: center;
}
</style>
