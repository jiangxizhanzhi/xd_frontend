<template>
  <div class="scene-desc">
    <div v-if="topologyData.scene_share_mode">
      <img
        v-if="topologyData.scene_share_mode === SHARE_MODEL.PRIVATE"
        :src="private2"
      />
      <img
        v-else-if="topologyData.scene_share_mode === SHARE_MODEL.SHARED"
        :src="shared"
      />
      <img
        v-else-if="topologyData.scene_share_mode === SHARE_MODEL.GROUP"
        :src="group"
      />
      <span v-if="topologyData.scene_share_mode === SHARE_MODEL.PRIVATE">{{
        $t('scene.privateScene')
      }}</span>
      <span v-else-if="topologyData.scene_share_mode === SHARE_MODEL.SHARED">{{
        $t('scene.sharedScene')
      }}</span>
      <span v-else-if="topologyData.scene_share_mode === SHARE_MODEL.GROUP">{{
        $t('scene.groupScene')
      }}</span>
    </div>
  </div>
</template>
<script>
import private2 from '@/assets/scene/img/private.png';
import shared from '@/assets/scene/img/shared.png';
import group from '@/assets/scene/img/group.png';
import { SHARE_MODEL } from '@/pages/web/course/constant.js';
export default {
  props: {
    topologyData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      SHARE_MODEL,
      private2,
      shared,
      group,
    };
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
.scene-desc {
  position: absolute;
  top: 12px;
  left: 17px;
  z-index: 22;
  min-width: 160px;
  height: 36px;
  line-height: 34px;
  text-align: center;
  padding: 0 15px;
  &::before {
    position: absolute;
    content: '';
    inset: 0;
    background: var(--primary-color);
    opacity: 0.1;
  }
  img {
    vertical-align: middle;
    margin-right: 10px;
  }
  span {
    vertical-align: middle;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: var(--primary-color);
  }
}
</style>
