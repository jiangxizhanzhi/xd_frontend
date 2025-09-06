<template>
  <cb-inner-page :background="false">
    <cb-search-table
      :cols.sync="cols"
      :selector="selector"
      :selection.sync="selection"
      :data="query"
      url="/cscene/cscenes"
      baseURL="/api/mp"
      ref="topoListRef"
      row-key="id"
      :searchBarBg="true"
    >
      <template slot="filter">
        <cb-search-input
          v-model="query.search"
          :placeholder="$t('topo.plzEnterName')"
        ></cb-search-input>
      </template>
      <template v-slot:search>
        <cb-button button-type="add" @click="createTopo" />
        <cb-button
          buttonType="delete"
          hollow
          @click="deleteSelectScene($event)"
          :disabled="selection.length === 0"
        />
      </template>
      <template v-slot:operate="scope">
        <cb-button
          @click="editRow(scope.data)"
          type="text"
          buttonType="edit"
          mr
        ></cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import { deleteSceneModel } from '@/api/topology-management.ts';
import IndexDB from '@/utils/indexDB.js';

export default {
  data() {
    return {
      baseURL: '/api/mp',
      model: {
        name: '',
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [],
      resource_id: '',
      orgs: [],
      selectIds: [], // 选择数据id 用于授权页面
      query: {
        type: 1,
        search: null,
      },
      cacheAllList: [], // 单兵所有缓存值
      myCacheList: [], // 本人的缓存
    };
  },
  computed: {},
  created() {
    const that = this;
    that.cols = [
      {
        label: this.$t('topo.name'),
        prop: 'name',
      },
      {
        label: this.$t('topo.desc'),
        getData: (row) => {
          return row.scene_config?.topology?.scene?.description;
        },
      },
      {
        label: this.$t('topo.nodeSize'),
        getData: (row) => {
          return row.scene_config?.topology?.elements?.length;
        },
      },
      {
        label: that.$t('systemOperation.scene.cpuRamDisk'),
        getData(row) {
          const cpu = row.total_cpu || 0,
            ram = row.total_ram || 0,
            disk = row.total_disk || 0;
          return (
            cpu +
            that.$t('systemOperation.scene.C') +
            '/' +
            ram +
            'MB/' +
            disk +
            'G'
          );
        },
      },
      {
        label: this.$t('topo.creator'),
        prop: 'create_name',
      },
      {
        label: this.$t('topo.updateTime'),
        prop: 'update_time',
      },
      {
        label: this.$t('topo.operation'),
        slot: 'operate',
        width: '120px',
      },
    ];
    IndexDB.dbInit('single');
  },
  async mounted() {
    this.cacheAllList = await IndexDB.dbOperation('topo', 'getAll');
    if (this.cacheAllList && this.cacheAllList[0]) {
      // 如果有值，则去判断是否有本人的缓存
      this.myCacheList = _.filter(this.cacheAllList, (item) => {
        const idSplit = item.id.slice(0, 32); // 截取uesrId
        return idSplit === this.$store.state.user.id;
      });
    }
  },
  methods: {
    // 编辑
    editRow(data) {
      if (this.myCacheList && this.myCacheList[0]) {
        this.comGo('edit', data.id);
      } else {
        this.$router.push({
          name: 'topology-management-edit',
          params: { id: data.id },
        });
      }
    },
    // 批量删除场景模板数据
    deleteSelectScene(done) {
      const ids = this.selection.map((item) => {
        return item.id;
      });
      deleteSceneModel(ids).then(() => {
        this.$refs.topoListRef.reload();
        this.selection = [];
        done();
      });
    },
    createTopo() {
      if (this.myCacheList && this.myCacheList[0]) {
        this.comGo('add');
      } else {
        this.$router.push({
          name: 'topology-management-add',
        });
      }
    },
    comGo(type, id) {
      this.$confirm(this.$t('topo.isRecoverTopoScene'), this.$t('topo.info'), {
        type: 'warning',
      })
        .then(() => {
          const cacheSplit = this.myCacheList[0].id.split('-');
          // 切割id，判断是新增还是编辑
          if (cacheSplit[1] === 'add') {
            this.$router.push({
              name: 'topology-management-add',
            });
          } else {
            this.$router.push({
              name: 'topology-management-edit',
              params: { id: cacheSplit[1] },
            });
          }
        })
        .catch(() => {
          IndexDB.dbOperation('topo', 'delete', this.myCacheList[0].id).then(
            (res) => {
              this.myCacheList = [];
              if (type === 'add') {
                this.$router.push({
                  name: 'topology-management-add',
                });
              } else {
                this.$router.push({
                  name: 'topology-management-edit',
                  params: { id: id },
                });
              }
            },
          );
        });
    },
  },
};
</script>
