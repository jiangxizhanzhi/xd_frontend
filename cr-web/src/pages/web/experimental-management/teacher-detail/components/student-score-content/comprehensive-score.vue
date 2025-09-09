<template>
  <div class="assess-detail">
    <block :title="$t('rbt.comprehensiveScore')"></block>
    <div class="display-wrap cyber-scroll-bar-small">
      <vue2-org-tree
        :data="orgTreeData"
        :horizontal="true"
        :props="{ label: 'name', expand: 'expand', children: 'children' }"
        @OrgTreeDataChage="handleOrgTreeDataChage"
      />
    </div>
  </div>
</template>

<script>
import block from '@/components/block';
import Vue2OrgTree from './customTree/index';
// import { bb } from './mock';
export default {
  name: 'Home',
  components: {
    block,
    Vue2OrgTree,
  },
  data() {
    return {
      orgTreeData: {},
      // sonAllData:this.allData
    };
  },
  props: {
    allData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    allData(newValue, oldValue) {
      let orgData = newValue;
      const resData1 = {
        name: '最终得分',
        score: orgData?.final_score ? orgData?.final_score : 0, //最终得分
        score: orgData?.final_score
          ? orgData?.final_score
          : orgData?.training_score?.total
          ? Math.round(
              (orgData?.training_score.score / orgData?.training_score.total) *
                100 *
                0.3,
            )
          : 0, //最终得分
        children: [
          {
            // name: '权重占比:',
            name: this.$t('rbt.weightProportion'),
            score: orgData?.ability_percentage
              ? orgData?.ability_percentage
              : 70,
            type: 'ability',
            children: [
              {
                // name: '能力得分',
                name: this.$t('rbt.abilityScore'),
                type: 'allAbilityType',
                score: orgData?.ability_score_result
                  ? orgData?.ability_score_result
                  : 0,
                children: [
                  {
                    // name: '总和',
                    name: this.$t('rbt.totals'),
                    type: 'ability',
                    children:
                      orgData.ability_score.length > 0
                        ? this.exchangeAbilityType(orgData.ability_score)
                        : [],
                  },
                ],
              },
            ],
          },
          {
            // name: '权重占比:',
            name: this.$t('rbt.weightProportion'),
            score: orgData?.training_percentage
              ? orgData?.training_percentage
              : 30,
            type: 'training',
            children: [
              {
                // name: '训练得分', trainingScore
                name: this.$t('rbt.trainingScore'),
                score: orgData?.training_score.score
                  ? orgData?.training_score.score
                  : 0,
                total: orgData?.training_score.total
                  ? orgData?.training_score.total
                  : 0,
                children:
                  // 判断阶段有无显示总得分/总分数字段以及后续数据
                  orgData?.training_score?.stages?.length > 0
                    ? [
                        {
                          // name: '总得分/总分数',
                          name: this.$t('rbt.scoresAll'),
                          children: orgData?.training_score.stages.map(
                            (item) => ({
                              ...item,
                              type: 'training',
                              children: [
                                {
                                  // name: '总和',
                                  name: this.$t('rbt.totals'),
                                  children: item.missions.map((j) => ({
                                    name: j.name,
                                    score: j?.score ? j?.score : 0,
                                  })),
                                },
                              ],
                            }),
                          ),
                        },
                      ]
                    : [],
              },
            ],
          },
        ],
      };
      this.orgTreeData = resData1;
      this.arrayTreeAddLevel([resData1]);
    },
  },
  created() {},
  methods: {
    handleOrgTreeDataChage(data) {
      this.$emit('treeDataChange', data);
    },
    exchangeAbilityName(data) {
      switch (Number(data)) {
        case 0: {
          return this.$t('rbt.competence');
        }
        case 1: {
          return this.$t('rbt.teamCooperation');
        }
        case 2: {
          return this.$t('rbt.executivePower');
        }
        case 3: {
          return this.$t('rbt.leaderShip');
        }
        case 4: {
          return this.$t('rbt.overView');
        }
        default: {
          return '';
        }
      }
    },
    //处理能力
    exchangeAbilityType(data) {
      return data.map((item, index) => {
        return {
          name: this.exchangeAbilityName(index),
          score: item * 4,
          abilityType: index + 1,
          type: 'ability',
        };
      });
    },

    //计算能力分总和
    addAllabilityScore(data) {
      let num = 0;
      data.forEach((element) => {
        num += element.score;
      });
      return num;
    },
    //给树增加level
    arrayTreeAddLevel(array, levelName = 'level', childrenName = 'children') {
      if (!Array.isArray(array)) return [];
      const recursive = (array, level = 0) => {
        level++;
        return array.map((v) => {
          v[levelName] = level;
          const child = v[childrenName];
          if (child && child.length) recursive(child, level);
          return v;
        });
      };
      return recursive(array);
    },
  },
};
</script>
<style scoped lang="scss">
.assess-detail {
  width: 100%;
  height: 100%;
  padding: 16px;
  .display-wrap {
    height: calc(100% - 36px);
    overflow: scroll;
  }
}
</style>
