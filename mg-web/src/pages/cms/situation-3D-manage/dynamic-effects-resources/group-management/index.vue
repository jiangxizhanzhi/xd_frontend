<template>
  <cb-inner-page :background="false">
    <div class="content-table">
      <cb-search-table
        ref="groupRef"
        :cols="columns"
        :data.sync="query"
        :selection.sync="multipleSelection"
        :baseURL="'/api/ojj'"
        :url="'/situation/effect/category/page'"
        row-key="resource_id"
      >
        <template v-slot:search>
          <cb-button button-type="add" @click="addCategory"></cb-button>
          <cb-button
            button-type="delete"
            hollow
            :disabled="multipleSelection.length === 0"
            @click="deleteSelectedType(multipleSelection, $event)"
          ></cb-button>
        </template>
        <template v-slot:filter>
          <cb-search-input v-model="query.pattern"></cb-search-input>
        </template>
        <template v-slot:operate="scope">
          <cb-button
            button-type="edit"
            type="text"
            @click="edit(scope.data.resource_id)"
          ></cb-button>
        </template>
      </cb-search-table>
    </div>
  </cb-inner-page>
</template>
<script>
import { deleteEffectCategory } from '@/api/situation-3D-manage';

export default {
  components: {},
  data() {
    return {
      query: {
        pattern: '',
      },
      typeData: [],
      multipleSelection: [],
    };
  },
  created() {
    this.columns = [
      {
        label: '名称',
        prop: 'name',
      },
      {
        label: '操作',
        slot: 'operate',
        width: '200px',
      },
    ];
  },
  methods: {
    // 分类添加
    addCategory() {
      this.$router.push({ name: 'dynamic-effects-resources-group-create' });
    },
    // 分类编辑
    edit(resource_id) {
      this.$router.push({
        name: 'dynamic-effects-resources-group-edit',
        params: {
          groupId: resource_id,
        },
      });
    },
    // 删除
    deleteSelectedType(data, done) {
      const that = this;
      const ids = [];
      if (data && data.length) {
        data.map((item) => ids.push(item.resource_id));
      } else {
        ids.push(data.resource_id);
      }
      deleteEffectCategory({ ids })
        .then(() => {
          done();
          that.multipleSelection = [];
          that.$refs.groupRef.reload();
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
