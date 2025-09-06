<template>
  <cb-inner-page :background="false">
    <div class="content-table">
      <cb-search-table
        ref="TypeTableRef"
        :baseURL="baseURL"
        :url="url"
        :cols="columns"
        :data.sync="query"
        :selection.sync="multipleSelection"
        row-key="resource_id"
      >
        <template v-slot:search>
          <cb-button button-type="add" @click="push"></cb-button>
          <cb-button
            button-type="delete"
            hollow
            :disabled="multipleSelection.length === 0"
            @click="deleteSelectedType(multipleSelection, $event)"
          ></cb-button>
        </template>
        <template v-slot:filter>
          <cb-search-input
            v-model="query.pattern"
            :placeholder="$t('traffic.inputName')"
          ></cb-search-input>
        </template>
        <template v-slot:operate="scope">
          <cb-button
            button-type="edit"
            type="text"
            @click="edit(scope.data.id)"
          ></cb-button>
        </template>
      </cb-search-table>
    </div>
  </cb-inner-page>
</template>
<script>
import { deleteFlowCatagory } from '@/api/traffic/traffic';
export default {
  components: {},
  data() {
    return {
      baseURL: '/api/mp',
      url: 'flow/info/page_categories',
      query: {
        pattern: '',
      },
      multipleSelection: [],
    };
  },
  created() {
    this.columns = [
      {
        label: this.$t('traffic.name'),
        prop: 'name',
      },
      {
        label: this.$t('common.operation'),
        slot: 'operate',
        width: 120,
      },
    ];
  },
  methods: {
    // 类型添加
    push() {
      this.$router.push({ name: 'scheme-traffic-type-add' });
    },
    // 类型编辑
    edit(id) {
      this.$router.push({
        name: 'scheme-traffic-type-edit',
        params: {
          typeId: id,
        },
      });
    },
    // 删除
    deleteSelectedType(data, done) {
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.id));
      } else {
        ids.push(data.id);
      }
      deleteFlowCatagory({ ids })
        .then(() => {
          done();
          this.multipleSelection = [];
          this.$refs.TypeTableRef.reload();
        })
        .catch((error) => {
          done(false);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.type-content {
  .header-box {
    height: 40px;
    margin-bottom: 20px;
  }
  .exam-botton {
    margin-top: 25px;
  }
}
</style>
