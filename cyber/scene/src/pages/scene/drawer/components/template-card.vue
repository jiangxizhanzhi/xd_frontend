<template>
  <div class='template-card' :body-style="{ padding: '0px',borderWidth: 0 }">
    <img @mousedown="dragstart($event, item)" :src='item.logo' class='image' alt="">
    <div class='content'>
      <div class="left">
        <span class='content-title'>{{ item.scene_config.topology.scene.name }}</span>
        <span class='content-user'>{{ item.create_username }}</span>
      </div>
      <div>
        <cb-button button-type="delete" buttonStyle="color: var(--primary-color)" type='text' @click='onDelete($event)'></cb-button>
      </div>
    </div>
  </div>
</template>

<script>
import {cyberBus} from "../../../../utils/event-bus";
import sceneStore from "../../../../store/scene-store";
import _ from "lodash";
import PageStatus from "../../../store/page-status";

export default {
  name: 'template-card',
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  methods: {
    /**
     * 抛出删除事件
     * @param done
     */
    onDelete(done) {
      this.$request
        .delete(`/cscene/cscenes?id=${this.item.id}`, null, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          if (res.status === 200) {
            this.$emit('onDelete');
            done()
          }
        }).catch((err) => {
        done(false);
      });
    },
    /**
     * 拖拽开始
     * 将拓扑状态置为场景模式 status = “scene”
     */
    dragstart(event, data) {
      window.getSelection().removeAllRanges();
      cyberBus.emit('drag', { type: 'scene', event, data, image: data.logo });
    },
    /**
     * 拖拽结束
     */
    dragend(e, data) {
      const nodesNum = sceneStore.state.targetNum.nodes;
      const addNodesNum = _.cloneDeep(
        data.scene_config.topology.elements.length,
      );
      if (!this.canAddNodes(nodesNum, addNodesNum)) {
        this.$message.error(
          this.$tt('stage.supportTemplateNodeLimit', {
            max: PageStatus.state.maxCount,
            current: nodesNum,
            add: addNodesNum,
          }),
        );
      }
    },
    // 是否可以添加节点
    canAddNodes(nodesNum, addNodesNum) {
      return nodesNum + addNodesNum <= PageStatus.state.maxCount;
    },
    getElementOffset(element) {
      let actualLeft = element.getBoundingClientRect().left;
      let actualTop = element.getBoundingClientRect().top;
      return [actualLeft, actualTop];
    },
  },
};
</script>

<style lang='scss' scoped>
.template-card {
  width: 220px;
  margin-bottom: 16px;
  border: 1px solid var(--bg-color-3);
  cursor: pointer;


  img {
    height: 130px;
    width: 220px;
  }

  .content {
    min-height: 50px;
    background: var(--bg-color-3);
    margin-top: -4px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    span {
      word-wrap: break-word;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    .content-title {
      font-size: 14px;
      font-weight: 400;
      color: var(--neutral8);
    }

    .content-user {
      font-size: 14px;
      font-weight: 400;
      color: var(--neutral7);
    }
  }
}
</style>
