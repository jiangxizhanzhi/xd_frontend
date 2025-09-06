<template>
  <div class="menu-config-page">
    <div class="menu-config-btn">
      <div class="menu-config-btn-top">
        <cb-checkbox-group v-model="checkList" @change="checkboxChange">
          <cb-checkbox
            v-for="item in functionList"
            :key="item.key"
            :disabled="item.value === '0'"
            :label="item.key"
            >{{ item.name }}</cb-checkbox
          >
        </cb-checkbox-group>
      </div>
      <div class="menu-config-btn-bottom">
        <cb-upload-file
          type="file"
          :limit="1"
          :fetch-promise="upLoad"
          tipText=""
          v-model="list"
          accept=".json"
          @delete="deleteFile"
        >
          <!-- <template v-slot:tip>
            <div class="tips">导入模板文件</div>
          </template> -->
        </cb-upload-file>
      </div>
    </div>
    <div class="menu-config-content">
      <div class="menu-config-web cyber-scroll-bar-small">
        <front-tree :treeData="frontTreeData" />
      </div>
      <div class="menu-config-cms cyber-scroll-bar-small">
        <back-tree :treeData="backTreeData" />
      </div>
    </div>
    <div class="menu-config-role">
      <label for="">应用于角色：</label>
      <cb-select
        v-model="role"
        :placeholder="$t('请选择角色')"
        titleField="name"
        valueField="id"
        :first="{ name: '全部角色', id: '' }"
        :options="roleOptios"
        clearable
      />
    </div>
    <div class="bottom-btn">
      <cb-button-group space="middle">
        <cb-button button-type="confirm" @click="saveTemplate" mr>
          应用模板
        </cb-button>
        <!-- <cb-button button-type="confirm" @click="applyTemplate" mr>
          应用于系统
        </cb-button> -->
        <cb-button button-type="confirm" @click="exportTemplate">
          导出模板
        </cb-button>
      </cb-button-group>
    </div>
  </div>
</template>

<script>
import {
  defaultTemplate,
  addTemplate,
  importTemplate,
  menuList,
  roleList,
} from '@/api/role';
import _ from 'lodash';
import { activeModule } from '@/constants/active-module';
import FrontTree from './components/front-tree.vue';
import BackTree from './components/back-tree.vue';
export default {
  components: {
    FrontTree,
    BackTree,
  },
  data() {
    return {
      checkList: [],
      list: [],
      resourceKeys: ['LCS-RES-CR-ACTIVENODES', 'LCS-RES-CR-EDITNODES'],
      functionList: [],
      frontTreeData: [],
      backTreeData: [],
      role: '',
      roleOptios: [],
      tagList: [],
    };
  },
  mounted() {
    this.getActivationInfo();
    this.getRoleList();
  },
  methods: {
    checkboxChange(value) {
      this.checkList = value;
      this.getTreeData();
    },
    // 查询激活项
    getActivationInfo() {
      this.$request
        .get('/sys/activation/status', null, { baseURL: '/api/mp' })
        .then((res) => {
          const data = _.get(res, 'data.data', {});
          this.functionList = [];
          (data.items || []).map((i) => {
            if (!this.resourceKeys.includes(i.key)) {
              for (let j = 0; j < activeModule.length; j++) {
                if (i.key === activeModule[j].key) {
                  i.name = activeModule[j].name;
                  break;
                }
              }
              this.checkList.push(i.key);
              this.functionList.push(i);
            }
          });
          this.getTreeData();
        });
    },
    // 获取树结构
    getTreeData() {
      const data = {
        actives: this.checkList,
      };
      menuList(data).then((res) => {
        let data = _.get(res, 'data.data', []);
        this.frontTreeData = data[0]
          ? [data[0]].map((org) => this.mapTree(org))
          : [];
        this.backTreeData = data[1]
          ? [data[1]].map((org) => this.mapTree(org))
          : [];
      });
    },
    mapTree(org) {
      const haveChildren =
        Array.isArray(org.children) && org.children.length > 0;
      return {
        ...org,
        disabled: org.id === 'personal-folder',
        name: org.name,
        en_name: org.en_name,
        children: haveChildren ? org.children.map((i) => this.mapTree(i)) : [],
      };
    },
    // 获取角色列表
    getRoleList() {
      const data = {
        page: 1,
        per_page: 10000,
      };
      roleList(data).then((res) => {
        const data = _.get(res, 'data.data.list');
        this.roleOptios = data;
      });
    },
    // 导入文件
    upLoad(file) {
      const formData = new FormData();
      formData.append('file', file);
      importTemplate(formData).then((res) => {
        const data = _.get(res, 'data.data.menu_tree');
        this.frontTreeData = data[0]
          ? [data[0]].map((org) => this.mapTree(org))
          : [];
        this.backTreeData = data[1]
          ? [data[1]].map((org) => this.mapTree(org))
          : [];
      });
    },
    deleteFile() {
      this.list = [];
    },

    filterTreeData(orgs) {
      const tagList = [];
      const matchData = (orgs) => {
        orgs.map((org) => {
          if (
            org.id.includes('folder') &&
            org.children.length === 0 &&
            (org.parent === 'front_all' || org.parent === 'back_all')
          ) {
            // this.$message.warning(org.name + '是空框架,不能有空框架菜单');
            tagList.push(org.id);
          }
          if (org.children) {
            matchData(org.children);
          }
        });
        return tagList;
      };
      const data = matchData(orgs);
      return data;
    },
    // 保存模板
    saveTemplate() {
      this.tagList = [];
      const frontData = this.filterTreeData(this.frontTreeData[0].children);
      const backData = this.filterTreeData(this.backTreeData[0].children);
      if (frontData.length === 0 && backData.length === 0) {
        this.$confirm('是否应用于当前角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const data = {
              menu_tree: [...this.frontTreeData, ...this.backTreeData],
              role_id: this.role,
            };
            addTemplate(data).then((res) => {
              this.$message.success('保存成功');
            });
          })
          .catch(() => {
            this.$message.info('已取消');
          });
      } else {
        this.$message.warning('请先处理空框架菜单后再应用模板');
      }
    },
    // 应用于模板
    applyTemplate() {
      const data = {
        menu_tree: [...this.frontTreeData, ...this.backTreeData],
        role_id: this.role,
      };
      defaultTemplate(data).then((res) => {
        this.$message.success('保存成功');
      });
    },
    // 导出模板
    exportTemplate() {
      const data = {
        menu_tree: [...this.frontTreeData, ...this.backTreeData],
      };
      this.$request.download(JSON.stringify(data), 'config.json', 'text/plain');
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-config-page {
  width: 100%;
  height: 100%;
  padding: 16px;
  background: var(--bg-color-2);
  color: var(--neutral8);
  font-size: 14px;
  .menu-config-btn {
    margin-left: 16px;
    &-top,
    &-bottom {
      .checkbox-group {
        margin-right: 8px;
      }
      display: flex;
      width: 100%;
      margin: 10px 0;
    }
  }
  .menu-config-content {
    width: 100%;
    display: flex;
    justify-content: space-around;
    .menu-config-web,
    .menu-config-cms {
      width: 49%;
      height: 600px;
      overflow: auto;
      background: var(--neutral0);
      padding: 16px;
    }
  }
  .menu-config-role {
    margin: 16px;
  }
  .bottom-btn {
    width: 400px;
    margin: 20px auto;
  }
}
</style>
<style lang="scss">
.menu-config-btn-bottom {
  .cb-upload-file {
    display: flex;
    align-items: baseline;
    .file-list {
      margin-left: 20px;
    }
  }
}
</style>
