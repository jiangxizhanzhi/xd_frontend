<template>
  <div class="vuln-impact">
    <div class="vuln-impact-input">
      <span class="impact-input__cpe">{{ model.cpe }}</span>
      <cb-input-number
        class="impact-input__ver"
        v-model="model.num"
        controls-position="right"
        :precision="1"
        :step="0.1"
        :min="0"
        :max="10"
      ></cb-input-number>
      <cb-input
        v-model="model.str"
        v-input-trim
        class="impact-input__str"
        maxlength="30"
      />
      <cb-input
        v-model="model.comp"
        :placeholder="$t('vulnList.firm')"
        v-input-trim
        maxlength="30"
      />
      <cb-input
        v-model="model.prod"
        :placeholder="$t('vulnList.produce')"
        v-input-trim
        maxlength="30"
      />
      <cb-input
        v-model="model.verNum"
        :placeholder="$t('vulnList.edition')"
        v-input-trim
        maxlength="30"
      />
      <cb-input
        v-model="model.upg"
        :placeholder="$t('vulnList.upgradeNumber')"
        v-input-trim
        maxlength="30"
      />
      <cb-input
        v-model="model.ver"
        :placeholder="$t('vulnList.version')"
        v-input-trim
        maxlength="30"
      />
      <cb-input v-model="model.last1" v-input-trim maxlength="30" />
      <cb-input v-model="model.last2" v-input-trim maxlength="30" />
      <cb-input v-model="model.last3" v-input-trim maxlength="30" />
      <cb-input v-model="model.last4" v-input-trim maxlength="30" />
      <cb-input v-model="model.last5" v-input-trim maxlength="30" />
      <div class="vuln-impact-btn">
        <cb-iconfont
          type="icon-xinzeng"
          class="iconfont"
          @click="addTargetNum()"
        />
      </div>
      <form-error :error="errorMsg" style="margin: 0"></form-error>
    </div>

    <div
      v-for="(listItem, listIndex) in list"
      :key="'impact-list' + listIndex"
      class="vuln-impact-list"
    >
      <template v-for="(item, index) in listItem">
        <span
          v-if="index === 0"
          :key="'impact-list-item-' + index"
          class="impact-input__cpe"
          >{{ item }}</span
        >
        <cb-input
          v-else
          :key="'impact-list-item-' + index"
          :style="(itemAttr[index] || {}).style"
          v-model="listItem[index]"
          disabled
        ></cb-input>
      </template>
      <div class="vuln-impact-btn" :key="'impact-list-btn-' + listIndex">
        <cb-iconfont
          type="icon-jianshao"
          class="iconfont"
          @click="removeTargetNum(listIndex)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FormError from '@/components/form-error';
import _ from 'lodash';
export default {
  name: 'VulnWebVulnImpact',
  props: {
    data: Array,
  },
  components: {
    FormError,
  },
  data() {
    return {
      itemAttr: [
        { default: 'CPE' },
        { default: '2.3', style: { width: '100px', flex: 'none' } },
        { default: 'a', style: { width: '60px', flex: 'none' } },
      ],
      model: {
        cpe: 'CPE',
        num: '2.3',
        str: 'a',
        comp: '',
        prod: '',
        verNum: '',
        upg: '',
        ver: '',
        last1: '*',
        last2: '*',
        last3: '*',
        last4: '*',
        last5: '*',
      },
      list: [],
      errorMsg: '',
      repeatTimeOut: '',
    };
  },
  watch: {
    data(val) {
      this.list = val;
    },
  },

  methods: {
    addTargetNum() {
      const listItem = Object.keys(this.model).map((key, index) => {
        return this.model[key] || _.get(this.itemAttr[index], 'default') || '*';
      });
      if (listItem.join('').indexOf(':') > -1) {
        this.validate(this.$t('vulnList.impactValidateMsg'));
        return;
      }
      const repeat = this.list.some((i) => {
        return _.isEqualWith(i, listItem, (objValue, othValue) => {
          return '' + objValue === '' + othValue;
        });
      });
      if (repeat) {
        this.validate(this.$t('vulnList.cannotRepeat'));
        clearTimeout(this.repeatTimeOut);
        this.repeatTimeOut = setTimeout(() => {
          if (this.errorMsg === this.$t('vulnList.cannotRepeat')) {
            this.validate();
          }
        }, 3000);
        return;
      }
      this.list.unshift(listItem);
      this.$emit('update:data', this.list);
      (this.model = {
        cpe: 'CPE',
        num: '2.3',
        str: 'a',
        comp: '',
        prod: '',
        verNum: '',
        upg: '',
        ver: '',
        last1: '*',
        last2: '*',
        last3: '*',
        last4: '*',
        last5: '*',
      }),
        this.validate();
      this.$emit('updateValidate');
    },
    removeTargetNum(index) {
      this.list.splice(index, 1);
      this.$emit('update:data', this.list);
      this.$emit('updateRemoveValidate', this.list);
      this.validate();
    },
    validate(msg) {
      if (this.list.length === 0 && msg === '') {
        this.errorMsg = this.$t('vulnList.inputVulnerabilityImpact');
        return false;
      }
      this.errorMsg = msg || '';
      return !this.errorMsg;
    },
  },
};
</script>

<style lang="scss" scoped>
.vuln-impact {
  width: 100%;
  .vuln-impact-input {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > * {
      margin: 0 4px;
    }

    .impact-input__ver {
      width: 100px;
      flex: none;
    }
    .impact-input__str {
      width: 60px;
      flex: none;
    }
  }

  .vuln-impact-list {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 24px 0;
    &:last-child {
      margin-bottom: 0px;
    }
    & > * {
      margin: 0 4px;
    }
  }
  .vuln-impact-btn {
    cursor: pointer;
  }
  .impact-input__cpe {
    color: var(--neutral5);
    width: 48px;
    height: var(--input-default-height);
    flex: none;
    padding: 0 8px;
    margin-left: 0px;
    border: 1px solid var(--neutral1);
    box-sizing: border-box;
  }
}
</style>
