<template>
  <div>
    <ul class="step-wrap">
      <li v-for="(item, index) in stepData" :key="index">
        <div class="step-div">
          <div :class="getStwCicleClass(item.status)">
            <div></div>
          </div>
          <div :class="getStepName(item.status)" class="step-name">
            {{ item.name }}
          </div>
        </div>
        <div v-if="stepData.length - 1 > index" class="stwline"></div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: ['loadData'],
  data() {
    return {
      stepData: [],
    };
  },
  created() {
    //获取场景id(scene_id||topo_id,)
    this.scene_id = this.$route.query.scene_id
      ? this.$route.query.scene_id
      : this.$route.query.topo_id;
    // 大屏动效步骤接口
    this.$request
      .get(
        '/situation/control/schedule',
        { scene_id: this.scene_id },
        { baseURL: '/api/ojj' },
      )
      .then((res) => {
        this.stepData = res.data.data;
      });
  },
  watch: {
    loadData: {
      handler(newValue, oldValue) {
        this.stepData = newValue;
      },
      deep: true,
    },
  },
  methods: {
    getStwCicleClass(status) {
      switch (status) {
        case 0:
          return 'stw-cicle-zero';

        case 2:
          return 'stw-cicle-one';

        case 1:
          return 'stw-cicle-two';

        case 3:
          return 'stw-cicle-three';

        default:
          return 'stw-cicle';
      }
    },
    getStepName(status) {
      switch (status) {
        case 0:
        case 1:
        case 2:
          return 'step-name-zero';
        case 3:
          return 'step-name-one';
        default:
          return 'stw-cicle-one';
      }
    },
  },
};
</script>
<style scoped>
ul li {
  list-style: none;
}
.step-wrap {
  right: 70px;
  width: 900px;
  height: auto;
  margin: auto;
  top: 50%;
}
.step-div {
  display: flex;
  flex-direction: row-reverse;
}
.step-wrap li {
  position: relative;
  height: 42px;
}
.stw-cicle {
  width: 10px;
  height: 10px;
  border: 1px solid;
  border-radius: 10px;
}
.stw-cicle-zero {
  width: 16px;
  height: 16px;
  border: 1px solid var(--primary-color);
  border-radius: 10px;
  position: relative;
}
.stw-cicle-zero div {
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background: var(--primary-color);
  box-shadow: 0 0 blur 10px var(--primary-color);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
.stw-cicle-one {
  width: 10px;
  height: 10px;
  background: var(--primary-color);
  border-radius: 10px;
  position: relative;
  right: 3px;
  top: 4px;
}
.stw-cicle-two {
  width: 16px;
  height: 16px;
  border: 1px dashed var(--primary-color);
  border-radius: 10px;
  position: relative;
  box-shadow: 0 0 blur 10px var(--primary-color);
  animation: load 2s linear infinite;
}
@keyframes load {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.stw-cicle-two div {
  width: 8px;
  height: 8px;
  border-radius: 8px;
  box-shadow: 0 0 20px var(--primary-color);
  border: 1px solid var(--primary-color);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

.stw-cicle-three {
  width: 16px;
  height: 16px;
  border: 1px solid var(--primary-color);
  border-radius: 10px;
  position: relative;
}
.stw-cicle-three div {
  width: 12px;
  height: 12px;
  border-radius: 8px;
  background: var(--primary-color);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
.stwline {
  width: 2px;
  height: 17px;
  border-left: 2px solid var(--primary-color);
  position: absolute;
  right: 7px;
  top: 22px;
}
.stw-cicle-bottom {
  width: 10px;
  height: 10px;
  border: 1px solid;
  border-radius: 10px;
  position: absolute;
  bottom: -10px;
}
.step-name-zero {
  position: relative;
  top: -2px;
  right: 5px;
  font-size: 14px;
  color: var(--primary-color);
}
.step-name-one {
  position: relative;
  top: -2px;
  right: 5px;
  font-size: 14px;
  color: var(--primary-color-8);
}
.step-name-zero,
.step-name-one {
  width: 340px;
  display: -webkit-box;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
  text-align: right;
}
</style>
