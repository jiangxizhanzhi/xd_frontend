<template>
  <div style="height: 100%">
    <div class="content">
      <div class="button">
        <div class="start-top">
          <div class="start-attack" @click="startAttack"></div>
        </div>
        <div class="end-top">
          <div class="end-attack" @click="endAttack"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: '',
    };
  },
  mounted() {},
  methods: {
    attackEvent() {
      this.$request
        .get(
          '/situation/simulation/attack_event',
          { scene_id: 'demo' },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.$message.success(res.data.message);
          // console.log("开始攻击");
        })
        .catch((err) => {
          /* this.$serverError(err); */
        });
    },
    startAttack() {
      this.attackEvent();
      this.timer = setInterval(() => {
        this.attackEvent();
      }, 3000);
    },
    endAttack() {
      clearInterval(this.timer);
      // console.log("结束攻击");
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 980px;
  height: 538px;
  background-image: url('~@/assets/img/screen/bg.png');
  background-size: 100% 100%;
  .button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .start-top {
      background-image: url('~@/assets/img/screen/bg1.png');
    }
    .start-top,
    .end-top {
      width: 638px;
      height: 56px;
      background-size: 100% 100%;
      position: relative;
      .start-attack {
        background-image: url('~@/assets/img/screen/start.png');
      }
      .start-attack,
      .end-attack {
        width: 342px;
        height: 78px;
        background-size: 100% 100%;
        position: absolute;
        left: 146px;
        top: -8px;
        cursor: pointer;
      }
    }
    .end-top {
      background-image: url('~@/assets/img/screen/bg1.png');
      margin-top: 104px;
      .end-attack {
        background-image: url('~@/assets/img/screen/end.png');
      }
    }
  }
}
</style>
