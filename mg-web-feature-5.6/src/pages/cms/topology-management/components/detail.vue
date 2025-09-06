<template>
  <div>
    <cb-form
      :model.sync="model"
      :rules="rules"
      label-position="right"
      :label-width="language === 'zh-CN' ? '80px' : '120px'"
      :isBgColor="true"
      ref="formRef"
    >
      <cb-form-item :label="$t('topo.topologyName')" prop="name">
        <cb-input
          v-model="model.name"
          :placeholder="$t('topo.plzEnterName')"
        ></cb-input>
      </cb-form-item>
      <cb-form-item :label="$t('topo.desc')" prop="description">
        <cb-input
          type="textarea"
          v-model="model.description"
          :placeholder="$t('topo.plzEnterDesc')"
        ></cb-input>
      </cb-form-item>
      <div slot="fixedBottom">
        <cb-button-group space="middle">
          <cb-button
            button-type="confirm"
            @click="submitThrottling"
          ></cb-button>
          <cb-button button-type="cancel" @click="cancelSubmit"></cb-button>
        </cb-button-group>
      </div>
    </cb-form>
    <div v-if="showTopo" class="scene-editor">
      <scene-editor
        ref="sceneEditor"
        :title="model.name"
        :topology-data="model.scene_config_data"
        :sceneConfig="sceneConfig"
        :showTitle="false"
      ></scene-editor>
    </div>
  </div>
</template>

<script>
import { SceneEditor } from '@cyber/scene';
import { getLanguage } from '@cyber/helper';
import {
  createTopology,
  uploadLogo,
  getTopologyDetail,
} from '@/api/topology-management.ts';
import IndexDB from '@/utils/indexDB.js';

export default {
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  components: {
    SceneEditor,
  },
  data() {
    return {
      language: getLanguage(),
      model: {
        name: '',
        description: '',
        scene_config_data: {
          scene_config: {
            topology: {
              scene: {},
              areas: [],
              connections: [],
              elements: [],
            },
            plugins: {},
          },
        },
        scene_config_data_indexdb: {
          scene_config: {
            topology: {
              scene: {},
              areas: [],
              connections: [],
              elements: [],
            },
            plugins: {},
          },
        },
      },
      timer: null, // 节流定时器
      sceneConfig: {
        showMenu: true,
        menubar: ['topology'],
        toolbar: [],
        showToolbar: true,
        toolMenuBar: ['basicSetting'],
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('topo.plzEnterName'),
            trigger: 'blur',
          },
        ],
      },
      timerGetTopo: null,
      cacheAllList: [], // 所有缓存值
      myCacheList: [], // 本人的缓存
      idKey: '',
      debounceCacheAdd: undefined,
      changeCount: 0,
      showTopo: false,
      haveCache: false,
    };
  },
  computed: {
    cacheAdd() {
      return this.$store.state.user.id + '-add';
    },
    cacheEdit() {
      return this.$store.state.user.id + '-' + this.id;
    },
    modelNew() {
      return JSON.parse(JSON.stringify(this.model));
    },
  },
  watch: {
    modelNew: {
      handler(val, oldval) {
        // 用于判断新增时 数据改变(&& 编辑已经回显后的model数据变化)
        if (JSON.stringify(val) !== JSON.stringify(oldval)) {
          this.changeCount++;
          if (
            (this.id && !this.haveCache && this.changeCount > 2) ||
            (this.id && this.haveCache && this.changeCount > 1) ||
            (!this.id && this.changeCount > 1)
          ) {
            this.debounceCacheAdd();
          }
        }
      },
      deep: true,
    },
  },
  created() {
    IndexDB.dbInit('topo');
    this.timerGetTopo = setInterval(() => {
      if (this.$refs.sceneEditor) {
        const sceneData = this.$refs.sceneEditor.getData();
        _.set(
          this.model,
          'scene_config_data_indexdb.scene_config',
          _.cloneDeep(sceneData.scene_config),
        );
      }
    }, 2000);
    this.debounceCacheAdd = _.debounce(
      () => {
        this.addIndexDB();
      },
      1000,
      {
        leading: true,
      },
    );
  },
  async mounted() {
    this.cacheAllList = await IndexDB.dbOperation('topo', 'getAll');
    // 如果有值，则去判断是否有本人的缓存
    this.myCacheList = _.filter(this.cacheAllList, (item) => {
      const idSplit = item.id.slice(0, 32); // 截取uesrId
      return idSplit === this.$store.state.user.id;
    });
    if (this.myCacheList && this.myCacheList[0]) {
      this.haveCache = true;
      this.idKey = this.myCacheList[0].id;
      this.$nextTick(() => {
        this.model = this.myCacheList[0];
        this.model.scene_config_data = _.cloneDeep(
          this.model.scene_config_data_indexdb,
        );
        this.showTopo = true;
      });
    } else {
      if (this.id) {
        getTopologyDetail({ id: this.id }).then((res) => {
          const tempdata = _.get(res, 'data.data', []);
          this.model.name = tempdata.scene_config.topology.scene.name;
          this.model.description =
            tempdata.scene_config.topology.scene.description;
          this.model.scene_config_data.scene_config = tempdata.scene_config;
          this.$set(
            this.model,
            'scene_config_data_indexdb',
            _.cloneDeep(this.model.scene_config_data),
          );
          this.showTopo = true;
        });
      } else {
        this.showTopo = true;
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = null;
    this.debounceCacheAdd = undefined;

    if (this.timerGetTopo) {
      clearTimeout(this.timerGetTopo);
    }
  },
  methods: {
    async addIndexDB() {
      let data = {};
      if (!this.idKey) {
        this.idKey = this.id ? this.cacheEdit : this.cacheAdd;
        data = {
          id: this.idKey,
          ...this.model,
        };
        await IndexDB.dbOperation('topo', 'add', data);
      } else {
        data = {
          id: this.idKey,
          ...this.model,
        };
        await IndexDB.dbOperation('topo', 'put', data);
      }
    },
    submitForm() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          // 获取场景数据
          const topologyData = this.$refs.sceneEditor.getData();
          topologyData.scene_config.topology.scene.name = this.model.name;
          topologyData.scene_config.topology.scene.description =
            this.model.description;
          // 获取场景截图 logo
          this.$refs.sceneEditor.getScreenShot().then((res) => {
            const file = new File([res], 'file.png', { type: 'png' });
            const formData = new FormData();
            formData.append('file', file);
            uploadLogo(formData).then((res) => {
              const logo = res.data.data.http_url;
              // 拓扑模板需要的参数
              const submitModel = {
                scene_config: topologyData.scene_config,
                type: 1,
                logo: logo,
              };
              if (this.id) {
                submitModel.id = this.id;
              }
              createTopology(submitModel).then((res) => {
                this.goList();
              });
            });
          });
        } else {
          return false;
        }
      });
    },
    // 提交时做节流处理
    submitThrottling() {
      if (!this.timer) {
        this.submitForm();
        this.timer = setTimeout(() => {
          clearTimeout(this.timer);
          this.timer = null;
        }, 1000);
      }
    },
    goList() {
      if (this.idKey) {
        IndexDB.dbOperation('topo', 'delete', this.idKey).then(() => {
          this.$router.push({
            name: 'topology-management',
          });
        });
      } else {
        this.$router.push({
          name: 'topology-management',
        });
      }
    },
    cancelSubmit() {
      this.$confirm(this.$t('topo.confirmCancel'), this.$t('topo.info'), {
        type: 'warning',
      })
        .then(() => {
          this.goList();
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.scene-editor {
  margin-top: -85px;
  margin-bottom: 0;
  min-height: 400px;
  height: calc(100vh - 380px);
}
</style>
