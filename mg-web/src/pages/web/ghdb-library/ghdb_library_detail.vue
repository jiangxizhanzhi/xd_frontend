<template>
  <cb-inner-page :background="false">
    <div id="GHDBLibraryDetail" class="page">
      <div class="content vuln-second-background">
        <div class="content-top">
          <div class="box-cards fl">
            <span class="fontArial title-head">{{ detailData.title }}</span>
            <div class="box-card vuln-color-white">
              <div class="left-content">
                <div class="card-top">
                  <div class="card-top-left">
                    <div class="card-top-left-data">
                      {{ detailData.id }}
                    </div>
                    <div class="card-top-left-des">EDB-ID</div>
                  </div>
                  <div class="card-top-right">
                    <div class="card-top-left-data">
                      {{ detailData.author }} &nbsp;
                    </div>
                    <div class="card-top-left-des">Author</div>
                  </div>
                </div>
                <div
                  class="fontArial fontBold"
                  style="
                    height: 30%;
                    text-align: left;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <div>
                    Published :
                    <span>{{ detailData.published }}</span>
                  </div>
                </div>
              </div>
              <div class="middle-content">
                <div class="card-top">
                  <div class="card-top-left">
                    <div class="card-top-left-data">
                      {{ detailData.google_dork_description }}
                    </div>
                    <div class="card-top-left-des">Google Dork Description</div>
                  </div>
                  <div>&nbsp;</div>
                </div>
                <div
                  class="fontArial fontBold"
                  style="
                    height: 30%;
                    text-align: left;
                    display: flex;
                    align-items: center;
                    padding-left: 50px;
                  "
                >
                  <div>
                    Google Search :
                    <span>{{ detailData.google_search }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="middle-line"></div>
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
import { getToolGHdb } from '@/api/vuln';

export default {
  components: {},
  props: {
    breadcrumbName: {
      type: String,
      default: '',
    },
    crEventData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      ghdbLibrary: this.$t('m.ghdbLibrary'),
      ghdb_id: null,
      toolDetailsDivBg: require('@/assets//img/vuln/detailBg.png').default,
      toolEXPDetails: this.$t('m.toolEXPDetails'),
      previous: this.$t('m.previous'),
      next: this.$t('m.next'),
      detailData: {},
    };
  },
  created() {
    this.ghdb_id = this.$route.params && this.$route.params.id;
  },
  mounted() {
    this.getToolGHdb();
  },
  methods: {
    getToolGHdb() {
      getToolGHdb({ resource_id: this.ghdb_id }).then((res) => {
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
#GHDBLibraryDetail {
  height: inherit;
  .header {
    width: 100%;
  }
  .title-head {
    font-size: 24px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 30px;
  }
  .fontArial {
    font-family: Microsoft YaHei;
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
          justify-content: space-between;
          align-items: center;
          padding: 0 50px;
          .card-top-left-data {
            font-size: 24px;
            font-weight: 300;
          }
          .card-top-left-des {
            font-size: 14px;
            font-weight: 300;
          }
        }

        .card-top-main-left {
          text-align: left;
          height: 69%;
          border-bottom-style: solid;
          border-bottom-width: 1px;
          display: flex;
          align-items: center;
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
        width: 47%;
        height: 80%;
      }

      .middle-content {
        width: 47%;
        height: 80%;
      }
    }

    .content-bottom {
      width: 100%;
      height: calc(100% - 271px);
      border-radius: 0px 0px 16px 16px;
      .text-margin {
        padding: 31px 50px 0 50px;
      }
      .card-color-grey {
        color: var(--neutral8);
      }
    }
  }
}
</style>
