<template>
  <div class="tips">
    <div
      class="box"
      :class="
        fromPage === 'env'
          ? `type-env-${dangerLevelOptions.type[tipKey]}`
          : `type-${dangerLevelOptions.type[tipKey]}`
      "
    >
      {{ dangerLevelOptions[tipKey] }}
    </div>
  </div>
</template>

<script>
import { dangerLevelOptions } from '@/constants/index.js';
export default {
  name: 'VulnWebTips',
  props: {
    tipKey: {
      type: Number,
      default: 0,
    },
    fromPage: String,
  },
  data() {
    return {
      dangerLevelOptions,
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.tips {
  .box {
    min-width: 42px;
    height: 22px;
    line-height: 22px;
    font-size: 12px;
    font-weight: 400;
    display: flex;
    align-items: center;
    padding: 5px 8px;
    border-radius: 2px;
  }
  .type-critically {
    background: #000000;
    color: var(--white-color);
    border: 1px solid var(--neutral9);
  }
  .type-highRisk {
    color: var(--red-color);
    background: var(--red-color-2);
    border: 1px solid var(--red-color);
  }
  .type-crisis {
    color: var(--orange-color);
    background: var(--orange-color-2);
    border: 1px solid var(--orange-color);
  }
  .type-lowRisk {
    color: var(--yellow-color);
    background: var(--orange-color-2);
    border: 1px solid var(--yellow-color);
  }
  .type-unknown {
    color: var(--neutral6);
    background: var(--bg-color-2);
    border: 1px solid var(--neutral6);
  }

  .type-critically {
    background: #000000;
    color: var(--white-color);
    border: 1px solid var(--neutral9);
  }
  .type-highRisk {
    color: var(--red-color);
    background: var(--red-color-2);
    border: 1px solid var(--red-color);
  }
  .type-crisis {
    color: var(--orange-color);
    background: var(--orange-color-2);
    border: 1px solid var(--orange-color);
  }
  .type-lowRisk {
    color: var(--yellow-color);
    background: var(--orange-color-2);
    border: 1px solid var(--yellow-color);
  }
  .type-unknown {
    color: var(--neutral6);
    background: var(--bg-color-2);
    border: 1px solid var(--neutral6);
  }

  .type-env-critically {
    background: #000000;
    color: var(--white-color);
    border: 1px solid var(--neutral9);
  }
  .type-env-highRisk {
    color: var(--red-color);
    background: var(--red-color-2);
  }
  .type-env-crisis {
    color: var(--orange-color);
    background: var(--orange-color-2);
  }
  .type-env-lowRisk {
    color: var(--yellow-color);
    background: var(--orange-color-2);
  }
  .type-env-unknown {
    color: var(--neutral6);
    background: var(--bg-color-2);
    border: 1px solid var(--neutral6);
  }
}
</style>
