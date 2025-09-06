import { nodeShutDown, nodeShutUp } from '@/api/common';
export const mixins = {
  data() {
    return {
      // 进度条信息
      progress: {
        status: undefined,
        progressRate: 0,
        progressInfo: '',
      },
      // 阶段进度条的位置
      progressLocalize: {
        width: '100%',
        left: '0px',
        bottom: '0px',
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
    // 刷新进度条状态
    refreshProgress() {
      this.progress = {
        status: undefined,
        progressRate: 0,
        progressInfo: '',
      };
      this.stageProgress.stageList = [];
      this.stageProgress.stageName = '';
      this.stageProgress.stagePercentage = 0;
    },
    // 关机
    onNodeShutDown(data, sceneId) {
      const { id } = data;
      nodeShutDown({
        node_id: id,
        mp_scene_id: sceneId,
      }).then((res) => {});
    },
    // 开机
    onNodeShutUp(data, sceneId) {
      const { id } = data;
      nodeShutUp({
        node_id: id,
        mp_scene_id: sceneId,
      }).then((res) => {});
    },
  },
};
