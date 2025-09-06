<template>
  <div class="simple-fish-bone--layout-selector">
    <cb-button icon="icon-gou" @click="visible = true">{{
      $t('crEvent.templateSwitch')
    }}</cb-button>
    <cb-dialog
      class="simple-fish-bone--dialog"
      :title="$t('crEvent.templateSelect')"
      :visible.sync="visible"
      append-to-body
    >
      <div class="simple-fish-bone--layouts">
        <div
          v-for="o in options"
          :key="o.label"
          :class="[o.label, { checked: checked.value === o.value }]"
          @click="checked = o"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <cb-button button-type="confirm" @click="submit" mr />
        <cb-button button-type="cancel" @click="cancel" />
      </div>
    </cb-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  props: {
    value: {
      type: Number | String,
      default: 1,
    },
  },
  data() {
    return {
      visible: false,
      checked: {},
      options: [
        { label: 'fish', value: 1 },
        { label: 'up', value: 2 },
        { label: 'down', value: 3 },
      ],
    };
  },
  watch: {
    value() {
      this.cancel();
    },
  },
  mounted() {
    this.cancel();
  },
  methods: {
    submit() {
      this.$emit('input', this.checked.value);
      this.visible = false;
    },
    cancel() {
      this.checked = _.find(this.options, { value: Number(this.value) }) || {
        label: 'fish',
        value: 1,
      };
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.simple-fish-bone--layout-selector {
  display: inline-block;
  top: 3px;
  position: relative;
}

.simple-fish-bone--dialog {
  background: var(--bg-color-third);
}

.simple-fish-bone--layouts {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;

  .fish,
  .up,
  .down {
    width: 290px;
    height: 133px;
    background-size: cover;
    border-radius: 10px;
    opacity: 0.8;
    &.checked {
      border: 3px solid var(--primary-color);
      opacity: 1;
    }
  }

  .fish {
    background-image: url(./assets/fish.png);
  }

  .up {
    background-image: url(./assets/up.png);
  }

  .down {
    background-image: url(./assets/down.png);
  }
}
</style>

<style lang="scss">
.el-dialog {
  background: var(--bg-color-2);
  color: var(--neutral8);
}
.el-dialog__title {
  color: var(--neutral8);
}
.el-dialog__header {
  border-bottom: 1px solid var(--neutral0);
}
.el-dialog__footer {
  border-top: 1px solid var(--neutral0);
}
</style>
