<template>
  <cb-inner-page :background="false">
    <div id="toolEXPDetails" class="page">
      <div class="content vuln-second-background">
        <div class="content-top">
          <div class="box-cards fl">
            <span class="fontArial title-head">{{ detailData.title }}</span>
            <div class="box-card">
              <div class="left-content">
                <div class="card-top">
                  <div class="card-top-left">
                    <div class="card-top-left-data">
                      {{ detailData.edb_id }}
                    </div>
                    <div class="card-top-left-des">EDB-ID</div>
                  </div>
                  <div class="card-top-right">
                    <div class="card-top-left-data">
                      {{ detailData.cve }} &nbsp;
                    </div>
                    <div class="card-top-left-des">CVE</div>
                  </div>
                </div>
                <div
                  class="fontArial fontBold number-size vuln-color-white"
                  style="
                    height: 30%;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <div>
                    EDB Verifield :
                    <template v-if="detailData.verified">
                      <cb-iconfont
                        size="14"
                        type="icon-chenggong"
                        themedColor="cy8"
                        class="green"
                      />
                    </template>
                    <template v-else>
                      <cb-iconfont
                        size="14"
                        type="icon-cuowu"
                        themedColor="cy10"
                        class="red"
                      ></cb-iconfont>
                    </template>
                  </div>
                </div>
              </div>
              <div class="middle-content">
                <div class="card-top">
                  <div class="card-top-left">
                    <div class="card-top-left-data">
                      {{ detailData.author }}
                    </div>
                    <div class="card-top-left-des">Author</div>
                  </div>
                  <div class="card-top-right">
                    <div class="card-top-left-data">{{ detailData.type }}</div>
                    <div class="card-top-left-des">Type</div>
                  </div>
                </div>
                <div
                  class="fontArial fontBold number-size vuln-color-white"
                  style="
                    height: 30%;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <div>
                    Exploit :
                    <a :href="detailData.download_url">
                      <cb-iconfont
                        size="18"
                        type="icon-xiazai"
                        class="color-sky-blue"
                      ></cb-iconfont>
                    </a>
                  </div>
                </div>
              </div>
              <div class="right-content">
                <div class="card-top">
                  <div class="card-top-left">
                    <div class="card-top-left-data">
                      {{ detailData.platform }}
                    </div>
                    <div class="card-top-left-des">Platform</div>
                  </div>
                  <div class="card-top-right">
                    <div class="card-top-left-data">{{ detailData.date }}</div>
                    <div class="card-top-left-des">Date</div>
                  </div>
                </div>
                <div
                  class="fontArial fontBold vuln-color-white"
                  style="
                    height: 30%;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <div>
                    <span> Vulnerable App :</span>
                    <template v-if="detailData.vulnerable_app">
                      <a :href="detailData.application_url">
                        <cb-iconfont
                          type="icon-fenlei"
                          themedColor="primary-color+"
                        ></cb-iconfont>
                      </a>
                    </template>
                    <template v-else>
                      <span>-</span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="line-cent"></div>
        <div class="content-bottom">
          <cb-scrollbar>
            <div class="text-margin">
              <div class="text-wrapper card-color-grey">
                {{ detailData.content }}
              </div>
            </div>
          </cb-scrollbar>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
// import _ from 'lodash'
import { setBreadcrumbTitle } from '@cyber/ui';
import { getToolEXP } from '@/api/vuln';

export default {
  components: {},
  props: {
    breadcrumbName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      rightIcon: require('@/assets//img/vuln/icon_right.png').default,
      errorIcon: require('@/assets//img/vuln/icon_error.png').default,
      tool_EXP: this.$t('exp.toolEXP'),
      exp_id: null,
      toolDetailsDivBg: require('@/assets//img/vuln/detailBg.png').default,
      toolEXPDetails: this.$t('exp.toolEXPDetails'),
      previous: this.$t('exp.previous'),
      next: this.$t('exo.next'),
      detailData: {},
    };
  },
  created() {
    this.exp_id = this.$route.params && this.$route.params.id;
  },
  mounted() {
    this.getToolEXP();
  },
  methods: {
    getToolEXP() {
      getToolEXP({ resource_id: this.exp_id }).then((res) => {
        this.detailData = res.data.data || {};
        this.detailData.title && setBreadcrumbTitle(this.detailData.title);
      });
    },
  },
};
</script>

<style lang="scss">
.card-top {
  border-bottom-color: var(--neutral3);
}
.left-content {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    background: var(--primary-color);
    opacity: 0.7;
    inset: 0;
    z-index: -1;
  }
}
.middle-content {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    background: var(--green-color);
    opacity: 0.7;
    inset: 0;
    z-index: -1;
  }
}
.right-content {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    background: var(--orange-color);
    opacity: 0.7;
    inset: 0;
    z-index: -1;
  }
}
#toolEXPDetails {
  height: inherit;
  .header {
    width: 100%;
  }
  .title-head {
    font-size: 24px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: var(--neutral8);
    line-height: 30px;
  }
  .fontArial {
    font-family: Microsoft YaHei;
  }
  .number-i {
    font-size: 18px;
  }
  .number-size {
    font-size: 18px;
  }
  .fontBold {
    font-weight: 300;
  }

  .font15 {
    font-size: 15px;
  }
  .text-wrapper {
    white-space: pre-wrap;
  }
  .content {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 2px;

    .content-top {
      height: 270px;
      position: relative;

      .go-to-left {
        width: 44px;
        height: 44px;
        top: 56%;
        left: 1%;
        transform: translateY(-56%);
        cursor: pointer;
        position: absolute;
        background: url('~@/assets//img/vuln/arrow_left.png') no-repeat center;
        background-size: 100% 100%;
      }

      .go-to-right {
        width: 44px;
        height: 44px;
        top: 56%;
        right: 1%;
        transform: translateY(-56%);
        cursor: pointer;
        position: absolute;
        background: url('~@/assets//img/vuln/arrow_right.png') no-repeat center;
        background-size: 100% 100%;
      }

      .box-cards {
        text-align: center;
        width: 100%;
        position: absolute;
        top: 10%;
        left: 50%;
        height: 90%;
        padding: 0 50px;
        transform: translateX(-50%);

        .box-card {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-top: 24px;
          height: 84%;
        }

        .card-top {
          text-align: left;
          height: 69%;
          border-bottom-style: solid;
          border-bottom-width: 1px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          // border-bottom: 1px solid #6274e2;
          .card-top-left-data {
            font-size: 24px;
            font-weight: 300;
          }
          .card-top-left-des {
            font-size: 14px;
            font-weight: 300;
          }
        }
      }

      .spanStyle {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .left-content {
        width: 30%;
        height: 80%;
        // padding: 20px 0;
      }

      .middle-content {
        width: 30%;
        height: 80%;
        // padding: 20px 0;
      }

      .right-content {
        width: 30%;
        height: 80%;
        // padding: 20px 0;
      }
    }

    .content-bottom {
      width: 100%;
      height: calc(100% - 271px);
      border-radius: 0px 0px 16px 16px;
      .text-margin {
        padding: 31px 50px 0;
      }
    }
  }
}
</style>
