<template>
  <div>
    <cb-search-table
      ref="combatTableRef"
      :url="url"
      :baseURL="baseURL"
      rowKey="resource_id"
      :cols="columns"
      :data="query"
      :selector="selector"
      :selection.sync="selection"
      @rowSelection="checkboxChange"
      :searchBarBg="false"
    >
      <template v-slot:search>
        <cb-search-input
          v-model="query.pattern"
          :placeholder="$t('common.pleaseInputName')"
        />
      </template>
      <template v-slot:phaseCount="scope">
        <span>{{ scope.data.combat_config.length }}</span>
      </template>
    </cb-search-table>
    <div class="combatSelect">
      <span slot="footer" class="dialog-footer">
        <!-- 选择任务方案点击确定提交todo,暂无接口 -->
        <cb-button button-type="confirm" mr @click="submit">{{
          $t('common.confirm')
        }}</cb-button>
        <slot name="closeWindow" />
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SelectCombatTech',
  data() {
    const that = this;
    return {
      // url: '/admin/mission/combat_techs/',
      url: '/cr/admin/mission/combat_techs/list',
      baseURL: '/api/ojj',
      query: {},
      combatTechList: [],
      formatter: {
        // 作战技法总目标数
        targetCount: (row, column, value) => {
          let sum = 0;
          for (var i = 0; i < value.length; i++) {
            sum += value[i].templates.length;
          }
          return sum;
        },
      },
      selector: 'radio',
      selection: [],
      columns: [
        {
          label: this.$t('combatTech.name'),
          prop: 'title',
        },
        {
          label: this.$t('combatTech.desc'),
          prop: 'description',
        },
        {
          label: this.$t('combatTech.phaseCount'),
          slot: 'phaseCount',
          width: '100px',
        },
        {
          label: this.$t('combatTech.targetCount'),
          getData(row) {
            return that.formatter.targetCount(row, '', row.combat_config);
          },
          width: '100px',
        },
        {
          label: this.$t('combatTech.founder'),
          prop: 'rep_name',
        },
      ],
    };
  },
  watch: {
    selection: {
      handler(nv, ov) {
        if (nv.length > 0) {
          const val = nv[0].resource_id;
          // if (this.combatTechList.indexOf(val) > -1) {
          this.combatTechList = [];
          this.combatTechList.push(val);
          this.combatSelect = val;
          // }
        }
      },
    },
  },
  methods: {
    // 选中技法
    submit() {
      this.$emit('selectCombatTech', this.combatSelect);
    },
    // 用于table组件单选
    checkboxChange(val) {
      if (this.combatTechList.indexOf(val) > -1) {
        this.combatTechList = [];
        this.combatTechList.push(val);
        this.combatSelect = val;
      }
    },
  },
};
</script>

<style scoped>
::v-deep.el-checkbox__label {
  display: none;
}
.combatSelect {
  text-align: center;
}
</style>
