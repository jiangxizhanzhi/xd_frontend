<template>
  <div class="topology-painter-wrapper" :style="style" ref="box"></div>
</template>
<script>
import { TopologyPainter } from '@cyber/painter';
import down from '@/assets/port/icon-down.png';
import up from '@/assets/port/icon-up.png';
import shutdown from '@/assets/port/icon-shutdown.png';
import reserved from '@/assets/port/icon-reserved.png';
import { ListenDomChange } from '@cyber/ui';
export default {
  props: {
    model: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    onNodeClick: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      topologyPainter: null,
      defaultImg: require('@/assets/port/icon-down.png').default,
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.initPaintainter,
      }),
    };
  },
  computed: {
    style() {
      let style = Object.assign(
        { width: '100%', height: '600px' },
        this.options,
      );
      return {
        width: style.width,
        height: style.height,
      };
    },
    nodeList() {
      return this.model.nodeList || [];
    },
    portData() {
      return this.model.portData || [];
    },
  },
  created() {},
  mounted() {
    this.initPaintainter();
    this.listen.createListen();
  },
  watch: {
    model: {
      handler() {
        this.destroy();
        this.initPaintainter();
      },
      deep: true,
    },
    options() {
      this.destroy();
      this.initPaintainter();
    },
  },
  methods: {
    initPaintainter() {
      this.destroy();
      let color = this.$themed('neutral8');
      let backgroundColor = this.$themed('bg-color-3');
      if (!color || !backgroundColor) return;
      this.topologyPainter = new TopologyPainter({
        interactive: true,
        edgeStyle: {
          type: 'solid',
          dynamic: true,
        },
        nodeStyle: {
          width: 40,
          height: 40,
          color: color,
        },
        backgroundColor: backgroundColor,
      });
      this.topologyPainter.init('.topology-painter-wrapper');
      let data = this.createData();
      this.topologyPainter.paint(data);
      this.topologyPainter.setMode('display');
      this.topologyPainter._on('mouseover', (node) => {
        let { top, left } = this.$refs.box.getBoundingClientRect();
        let { x, y } = node;
        left += x;
        top += y;
        this.onNodeClick(node, { top, left });
      });
    },
    createData() {
      const nodes = [];
      const edges = [];
      const blocks = [];
      const labels = [];
      const { padding, line, portId, device, logo, status, deviceId } =
        Object.assign(
          {
            width: '100%',
            height: '600px',
            padding: 50,
            line: 240,
            portId: 'name', //  端口区别id
            device: 'device_name', //  设备显示名称
            deviceId: 'device_uuid', //  设备区别Id
            logo: 'logo', // 设备图标
            status: 'status', //端口状态
          },
          this.options,
        );

      const len = this.nodeList.length;
      const half = Math.round(len / 2);
      const { offsetWidth: width, offsetHeight: height } = this.$refs.box;
      const image = { down, up, shutdown, reserved };
      let nodeX = 0;
      let nodeY = 0;
      let blockX = 0;
      let blockY = 0;
      let realWidth = width - padding / 2;
      for (let i = 0; i < len; i++) {
        if (i < half) {
          nodeX = padding + (i * realWidth) / half;
          nodeY = height / 2 - 50;
          blockX = padding + (i * realWidth) / half;
          blockY = height / 2 - line;
        } else {
          nodeX = ((i - half) * realWidth) / half + padding;
          nodeY = height / 2 + 50;
          blockX = ((i - half) * realWidth) / half + padding;
          blockY = height / 2 + line;
        }
        nodes.push({
          id: this.nodeList[i]?.[portId],
          x: nodeX,
          y: nodeY,
          label: [i + 1],
          image: image[this.nodeList[i][status].toLowerCase()],
        });
        let index = this.portData.findIndex((el) => {
          if (el.switch_port) {
            return el.switch_port === this.nodeList[i]?.[portId];
          }
          if (el.ccm_port) {
            return el.ccm_port === this.nodeList[i]?.[portId];
          }
        });
        if (index > -1) {
          if (
            !nodes.some(
              (el) => el.id === 'target_' + this.portData[index][deviceId],
            )
          ) {
            nodes.push({
              id: 'target_' + this.portData[index][deviceId],
              x: blockX,
              y: blockY,
              image: this.portData[index][logo],
            });
          }
          edges.push({
            id: 'edges_' + this.nodeList[i][portId],
            source: this.nodeList[i]?.[portId],
            target: 'target_' + this.portData[index][deviceId],
            tag: {
              target: this.portData[index][device], // 终点文字
              tagStyle: {},
            },
          });
        }
      }
      return {
        nodes,
        edges,
        blocks,
        labels,
      };
    },
    destroy() {
      this.topologyPainter && this.topologyPainter.destroy();
      this.topologyPainter = null;
    },
  },
  beforeDestroy() {
    this.listen.destroyListen();
    this.destroy();
  },
};
</script>
<style lang="scss" scoped>
.topology-painter-wrapper {
  width: 100%;
  height: 100%;
}
</style>
