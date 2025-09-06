import { nodeShutDown, nodeShutUp } from '@/api/web/single-train';
export const mixins = {
  data() {
    return {
      msg: '',

      /* 进度条信息 */
      progress: {
        progressRate: 0,
        progressInfo: '',
        status: undefined,
      },

      /* 阶段进度 */
      stageProgress: {
        stageList: [],
        stageName: '',
        stagePercentage: 0,
      },
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 重置进度
     */
    refreshProgress() {
      this.progress.status = undefined;
      this.progress.progressInfo = '';
      this.progress.progressRate = 0;
      this.stageProgress.stageList = [];
      this.stageProgress.stageName = '';
      this.stageProgress.stagePercentage = 0;
    },

    /**
     * 关机
     * @param {节点数据} data
     * @param {场景id} sceneId
     */
    onNodeShutDown(data, sceneId) {
      const { id } = data;
      nodeShutDown({
        node_id: id,
        mp_scene_id: sceneId,
      }).then((res) => {});
    },

    /**
     * 开机
     * @param {节点数据} data
     * @param {场景id} sceneId
     */
    onNodeShutUp(data, sceneId) {
      const { id } = data;
      nodeShutUp({
        node_id: id,
        mp_scene_id: sceneId,
      }).then((res) => {});
    },
  },
};
