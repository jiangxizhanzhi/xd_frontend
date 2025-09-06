<template>
  <cb-inner-page :background="false" v-loading="loading">
    <div class="task-skill">
      <div class="top">
        <div class="skill-point">
          <p class="tip">
            <i></i>
            <span>{{ $t('combatTech.taskSkillPoint') }}</span>
          </p>
          <br />
          <cb-form
            ref="fromRef"
            :model.sync="model"
            label-width="100px"
            :rules="rules"
            :contentType="contentType"
          >
            <cb-form-item :label="$t('combatTech.skill1')" prop="skill1">
              <cb-input v-model="model.skill1" />
            </cb-form-item>
            <cb-form-item :label="$t('combatTech.skill2')" prop="skill2">
              <cb-input v-model="model.skill2" />
            </cb-form-item>
            <cb-form-item :label="$t('combatTech.skill3')" prop="skill3">
              <cb-input v-model="model.skill3" />
            </cb-form-item>
            <cb-form-item :label="$t('combatTech.skill4')" prop="skill4">
              <cb-input v-model="model.skill4" />
            </cb-form-item>
            <cb-form-item :label="$t('combatTech.skill5')" prop="skill5">
              <cb-input v-model="model.skill5" />
            </cb-form-item>
            <cb-form-item :label="$t('combatTech.skill6')" prop="skill6">
              <cb-input v-model="model.skill6" />
            </cb-form-item>
            <cb-form-item :label="$t('combatTech.skill7')" prop="skill7">
              <cb-input v-model="model.skill7" />
            </cb-form-item>
          </cb-form>
        </div>

        <div class="radar-chart">
          <p class="tip">
            <i></i>
            <span>{{ $t('combatTech.example') }}</span>
          </p>
          <cb-echart-radar
            v-if="ready"
            ref="rader"
            radarShape="sharp"
            :indicator="indicator"
            :radarData="radarData"
            :radarRadius="radarRadius"
          ></cb-echart-radar>
        </div>
      </div>

      <div class="button-group">
        <cb-button buttonType="confirm" @click="submit()" mr> </cb-button>
        <cb-button buttonType="cancel" @click="goBack()"> </cb-button>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import { validateLengthSkill } from '@/utils/validate-cms';
import { ListenDomChange } from '@cyber/ui';

export default {
  data() {
    const name = (rule, value, callback) => {
      if (value) {
        const len = validateLengthSkill(value);
        if (!len) {
          callback(new Error(this.$t('combatTech.skillNameError')));
        } else if (len < 0 || len > 50) {
          callback(new Error(this.$t('combatTech.validataSkill')));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    return {
      ready: true,
      listen: new ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      action: '',
      loading: false,
      contentType: 'application/json',
      radarRadius: ['0%', '77%'],
      radarData: [50, 50, 50, 50, 50, 50, 50],
      model: {
        skill1: '',
        skill2: '',
        skill3: '',
        skill4: '',
        skill5: '',
        skill6: '',
        skill7: '',
      },
      rules: {
        skill1: [
          {
            required: true,
            message: this.$t('combatTech.pleaseInputSkill'),
            trigger: 'blur',
          },
          { validator: name, trigger: 'blur' },
        ],
        skill2: [
          {
            required: true,
            message: this.$t('combatTech.pleaseInputSkill'),
            trigger: 'blur',
          },
          { validator: name, trigger: 'blur' },
        ],
        skill3: [
          {
            required: true,
            message: this.$t('combatTech.pleaseInputSkill'),
            trigger: 'blur',
          },
          { validator: name, trigger: 'blur' },
        ],
        skill4: [
          {
            required: true,
            message: this.$t('combatTech.pleaseInputSkill'),
            trigger: 'blur',
          },
          { validator: name, trigger: 'blur' },
        ],
        skill5: [
          {
            required: true,
            message: this.$t('combatTech.pleaseInputSkill'),
            trigger: 'blur',
          },
          { validator: name, trigger: 'blur' },
        ],
        skill6: [
          {
            required: true,
            message: this.$t('combatTech.pleaseInputSkill'),
            trigger: 'blur',
          },
          { validator: name, trigger: 'blur' },
        ],
        skill7: [
          {
            required: true,
            message: this.$t('combatTech.pleaseInputSkill'),
            trigger: 'blur',
          },
          { validator: name, trigger: 'blur' },
        ],
      },
    };
  },

  created() {
    this.getData();
  },

  computed: {
    indicator() {
      const temp1 = this.model.skill1
        ? this.model.skill1
        : this.$t('combatTech.skill1');
      const temp2 = this.model.skill2
        ? this.model.skill2
        : this.$t('combatTech.skill2');
      const temp3 = this.model.skill3
        ? this.model.skill3
        : this.$t('combatTech.skill3');
      const temp4 = this.model.skill4
        ? this.model.skill4
        : this.$t('combatTech.skill4');
      const temp5 = this.model.skill5
        ? this.model.skill5
        : this.$t('combatTech.skill5');
      const temp6 = this.model.skill6
        ? this.model.skill6
        : this.$t('combatTech.skill6');
      const temp7 = this.model.skill7
        ? this.model.skill7
        : this.$t('combatTech.skill7');
      let data = [
        {
          name: temp1,
          max: 100,
          axisLabel: {
            align: 'center',
            verticalAlign: 'top',
            show: true,
            fontSize: 14,
            color: this.$themed('neutral5'),
            showMaxLabel: true, //不显示最大值，即外圈不显示数字30
            showMinLabel: true, //显示最小数字，即中心点显示0
          },
        },
        { name: temp2, max: 100 },
        { name: temp3, max: 100 },
        { name: temp4, max: 100 },
        { name: temp5, max: 100 },
        { name: temp6, max: 100 },
        { name: temp7, max: 100 },
      ];
      return data;
    },
  },

  watch: {
    model: {
      handler() {
        this.$nextTick(() => {
          this.$refs.rader.loadEchart();
        });
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    // 监听换肤，动态reload echarts
    listenFunc() {
      this.ready = false;
      if (this.$refs.rader) {
        this.$refs.rader.indicator[0].axisLabel.color =
          this.$themed('neutral5');
      }
      this.$nextTick(() => {
        this.ready = true;
      });
    },
    getData() {
      this.loading = true;
      this.$request
        .get('/cr/admin/mission/missions/radar_labels/', null, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          this.loading = false;
          const data = _.get(res, 'data.data.labels') || [];
          this.model.skill1 = data[0];
          this.model.skill2 = data[1];
          this.model.skill3 = data[2];
          this.model.skill4 = data[3];
          this.model.skill5 = data[4];
          this.model.skill6 = data[5];
          this.model.skill7 = data[6];
        })
        .catch(() => {
          this.loading = false;
        });
    },
    goBack() {
      this.$router.push('/admin/combat-tech/combat-tech');
    },
    submit() {
      this.$refs['fromRef'].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          //任务技能点名称重复校验
          for (let item in this.model) {
            for (let key in this.model) {
              if (key == item) {
                continue;
              }
              if (this.model[item] == this.model[key]) {
                this.$message.error(this.$t('combatTech.repetitionName'));
                return false;
              }
            }
          }
          let data = { labels: [] };
          data.labels.push(
            this.model.skill1,
            this.model.skill2,
            this.model.skill3,
            this.model.skill4,
            this.model.skill5,
            this.model.skill6,
            this.model.skill7,
          );
          this.$request
            .post('/cr/admin/mission/missions/radar_labels/', data, {
              baseURL: '/api/ojj',
            })
            .then(() => {
              this.goBack();
            })
            .catch(() => {});
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.top {
  display: flex;
  .tip {
    color: var(--neutral8);
    margin: 30px 0 0 30px;
    line-height: 14px;
    i {
      display: inline-block;
      width: 6px;
      height: 8px;
      margin-right: 5px;
      margin-bottom: 2px;
      background: linear-gradient(
        0deg,
        var(--primary-color),
        var(--blue-color)
      );
    }
  }

  .skill-point {
    width: 40%;
    color: var(--neutral8);
  }
  .radar-chart {
    width: 60%;
  }
}
.button-group {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
</style>
