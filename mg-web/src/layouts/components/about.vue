<template>
  <cb-dialog
    :title="$t('mgRoutes.versionInfo')"
    :visible.sync="dialogAbout"
    width="600px"
  >
    <div class="about-content">
      <div class="avatar">
        <div class="avatar-img">
          <img :src="systemAvatar" />
        </div>
      </div>
      <div class="system-title">{{ systemTitle }}</div>
      <div class="platform">
        <cb-row>
          <template v-for="item in items">
            <cb-col :span="12" :key="item.id" v-if="item.visible">
              <div class="platform-item">
                <div class="plat" :title="item.model_name">
                  {{ item.model_name }} :
                </div>
                <div class="version">
                  {{ item.model_version.toUpperCase() }}
                </div>
              </div>
            </cb-col>
          </template>
        </cb-row>
      </div>
    </div>
  </cb-dialog>
</template>

<script>
import _ from 'lodash';
import Block from '@/components/block';
import defaultSystemAvator from '@/assets/system-avatar.png';
import { getSysVersion } from '@/api/system.ts';
let version = 'V5.4';
export default {
  components: {
    Block,
  },
  data() {
    return {
      dialogAbout: false,
      version: version,
      items: [],
    };
  },
  created() {
    this.getSysVersionList();
  },
  computed: {
    systemTitle() {
      return (
        _.get(this.$store.state.user, 'system_setting.system_name') +
        ` ${this.version}`
      );
    },
    copyright() {
      return _.get(this.$store.state.user, 'system_setting.copyright');
    },
    systemAvatar() {
      return defaultSystemAvator;
    },
  },
  methods: {
    getSysVersionList() {
      getSysVersion().then((res) => {
        this.items = _.get(res, 'data.data.model_versions', []) || [];
        this.version = _.toUpper(
          _.get(res, 'data.data.sys_version.model_version', '') || '',
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.min-height {
  min-height: 24px;
}
.about-content {
  .avatar {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    &-img {
      height: 140px;
      width: 140px;
      background: var(--neutral0);
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .system-title {
    text-align: center;
    font-size: 16px;
    margin-bottom: 20px;
  }
  .platform {
    background: var(--neutral0);
    padding: 20px 20px;
    border-radius: 2px;
    & .el-col {
      margin-bottom: 20px;
    }
    &-item {
      display: flex;
      line-height: 30px;
      width: 90%;
      .plat,
      .version {
        padding: 0 5px;
        text-align: left;
      }
      .plat {
        // width: calc(70% - 60px);
        width: 60%;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .version {
        width: 40%;
      }
    }
  }
}
.copyright {
  text-align: center;
  min-height: 20px;
}
</style>
