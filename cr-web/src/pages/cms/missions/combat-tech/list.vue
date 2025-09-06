<template>
  <cb-inner-page :background="false">
    <cb-search-table
      :cols.sync="cols"
      :selector="selector"
      :selection.sync="selection"
      :url="url"
      :baseURL="baseURL"
      :data.sync="model"
      rowKey="resource_id"
      ref="tableListRefTech"
      :searchBarBg="true"
    >
      <template v-slot:search>
        <cb-button button-type="add" link-name="combat-tech-create"></cb-button>
        <cb-button
          hollow
          button-type="delete"
          @click="deleteSelectedRow(selection, $event)"
          :disabled="selection.length === 0"
        ></cb-button>
        <cb-button button-type="import" hollow @click="importFile">
          {{ $t('common.import') }}
        </cb-button>
        <cb-button
          hollow
          button-type="export"
          @click="batchExportTech"
          :disabled="selection.length === 0"
          loading
        >
          {{ $t('common.export') }}
        </cb-button>
      </template>
      <template v-slot:searchRightArea>
        <cb-iconfont type="icon-shezhi"></cb-iconfont>
        <cb-button
          :link-name="{
            name: 'task-skill-management',
          }"
          type="text"
          >{{ $t('combatTech.taskSkillManagement') }}</cb-button
        >
      </template>
      <template v-slot:filter>
        <cb-search-input
          v-model="model.pattern"
          :placeholder="$t('combatTech.pleaseInput')"
        ></cb-search-input>
      </template>
      <template v-slot:operate="scope">
        <cb-button
          type="text"
          @click="editRow(scope.data)"
          button-type="edit"
        ></cb-button>
      </template>
    </cb-search-table>

    <import-file
      :visible.sync="importVisible"
      :action="upload_url"
      @reloadGetList="reloadGetList"
    />
    <!-- <loading-dialog :visible.sync="infoVisible" /> -->
    <cb-dialog
      title=""
      :visible.sync="dialogVisible"
      width="900px"
      padding="20px 20px"
      class="dialogVisible"
    >
    </cb-dialog>
  </cb-inner-page>
</template>

<script>
import ImportFile from '../../cr-event/components/import-export/import-file';

export default {
  name: 'List',
  components: { ImportFile },
  data() {
    return {
      dialogVisible: false,
      importVisible: false,
      // url: '/admin/mission/combat_techs/',
      //任务方案列表
      url: '/cr/admin/mission/combat_techs/list',
      baseURL: '/api/ojj',
      // upload_url: `/admin/mission/combat_techs/batch_loads/`,
      // 任务方案导入
      upload_url: `/cr/admin/mission/combat_tech/load`,
      model: {
        category: '',
        // search: '',
        pattern: '',
      },
      selector: {
        maxSelect: 0,
      },
      selection: [],
      cols: [
        {
          label: this.$t('combatTech.name'),
          prop: 'title',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('combatTech.desc'),
          prop: 'description',
          width: 300,
          resizable: true,
        },
        {
          label: this.$t('combatTech.phaseCount'),
          getData: (data) => {
            return data.combat_config.length;
          },
        },
        {
          label: this.$t('combatTech.targetCount'),
          getData: (data) => {
            const { combat_config } = data;
            let sum = 0;
            for (let i = 0; i < combat_config.length; i++) {
              sum += combat_config[i].templates.length;
            }
            return sum;
          },
        },
        {
          label: this.$t('combatTech.founder'),
          prop: 'rep_name',
        },
        {
          label: this.$t('common.operation'),
          slot: 'operate',
        },
      ],
    };
  },
  methods: {
    importFile() {
      this.importVisible = true;
    },
    reloadGetList() {
      this.$refs.tableListRefTech.reload();
    },
    // 导出
    batchExportTech(done) {
      if (this.$_.isEmpty(this.selection)) {
        return;
      }
      const arr = _.map(this.selection, (item) => {
        return item.resource_id;
      });

      const postData = {
        ids: arr,
      };
      // 任务方案导出
      this.$request
        .post('/cr/admin/mission/combat_techs/dump', postData, {
          responseType: 'arraybuffer',
          baseURL: '/api/ojj',
        })
        .then((res) => {
          const contentDisposition = _.get(res, 'headers.content-disposition');
          const reg = /filename=(.*\.zip)/;
          let filename = _.get(reg.exec(contentDisposition), '1');
          filename = filename ? decodeURI(filename) : 'combatTechConfig.zip';
          this.$request.download(new Blob([res.data]), filename);
        })
        .finally(() => {
          done();
        });
    },
    /* 删除 */
    deleteSelectedRow(data, done) {
      const ids = [];
      if (data?.length) {
        data.forEach((item) => {
          ids.push(item.resource_id);
        });
      }
      this.$request
        .delete(
          '/cr/admin/mission/combat_techs/batch_destroy/',
          {
            ids,
          },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          done();
          this.selection = [];
          this.$refs.tableListRefTech.reload();
        })
        .catch((err) => {
          done(false);
        });
    },
    /* 编辑 */
    editRow(data) {
      const { resource_id } = data;
      this.$router.push({
        path: `/admin/combat-tech-update/${resource_id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.spanDesc {
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
