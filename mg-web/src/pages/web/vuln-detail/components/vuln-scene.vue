<template>
  <div class="scene-info">
    <scene-loader
      ref="sceneRef"
      @start="sceneStart"
      @close="sceneClose"
      @restart="sceneRestart"
      @rebuild="sceneRebuild"
    ></scene-loader>
  </div>
</template>

<script>
import SceneLoader from '@/components/scene-loader';
import _ from 'lodash';
import {
  postVulnScene,
  deleteVulnScene,
  getVulnSceneRestart,
  getVulnSceneRebuild,
} from '@/api/vuln';

export default {
  name: 'VulnScene',
  components: {
    SceneLoader,
  },
  props: {
    sceneData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      resourceId: '',
      sceneId: '',
    };
  },
  watch: {
    sceneData: {
      handler(val) {
        if (!_.isEmpty(val.scene_config)) {
          this.$nextTick(() => {
            this.closeWs();
            const sceneData = {
              data: val,
            };
            this.initScene(sceneData);
          });
        } else {
          this.$nextTick(() => {
            this.$refs.sceneRef && this.$refs.sceneRef.setEmpty({});
          });
        }
      },
      immediate: true,
    },
  },
  created() {
    this.resourceId = this.$route.params.resource_id;
  },
  mounted() {},
  methods: {
    initScene(scene_config) {
      this.$refs.sceneRef.initSceneData(scene_config, {
        url: `/ws/${this.resourceId}`,
        config: {
          baseURL: '/api/vuln',
        },
      });
    },
    closeWs() {
      this.$refs.sceneRef.closeWs();
    },
    sceneStart(done) {
      postVulnScene(this.resourceId).then((res) => {
        this.sceneId = _.get(res, 'data.data.scene_instance_id', '');
        done();
      });
    },
    sceneClose(done) {
      deleteVulnScene(this.resourceId).then(() => {
        done();
      });
    },
    sceneRestart(data) {
      const dataObj = {
        node: data.id,
        scene: this.sceneId || this.sceneData.scene_config.id,
      };
      getVulnSceneRestart(this.resourceId, dataObj).then(() => {});
    },
    sceneRebuild(data) {
      const dataObj = {
        node: data.id,
        scene: this.sceneId || this.sceneData.scene_config.id,
      };
      getVulnSceneRebuild(this.resourceId, dataObj).then(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.scene-info {
  width: 100%;
  height: 100%;
}
</style>
