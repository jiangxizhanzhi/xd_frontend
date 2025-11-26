<template>
  <div
    class="cb-button"
    :class="[colorTypeCls, btnMargin, sizeClass]"
  >
    <Button
      v-bind="$attrs"
      :type="type"
      :loading="loadingStatus"
      :disabled="disabled"
      v-loading.fullscreen="fullscreenLoadingStatus"
      @click="click"
      :circle="circle"
      size="medium"
      :style="buttonStyle"
    >
      <cb-iconfont
        v-if="iconComputed"
        :class="{ 'cb-button-span': $t(defaultText) || $slots.default }"
        :type="iconComputed"
        size="14"
      />
      <span v-if="$t(defaultText)">{{ $t(defaultText) }}</span>
      <span v-if="$slots.default">
        <slot></slot>
      </span>
    </Button>
  </div>
</template>

<script>
import _ from 'lodash';
import CbIconfont from '../../iconfont';
import { Button } from 'element-ui';
import Utils from '../../../utils/utils.js';
import { webTrack } from '../../../utils/track';

/**
 * @displayName cb-button 按钮
 * @classify Basic/基础
 */
export default {
  name: 'CbButton',
  components: {
    CbIconfont,
    Button,
  },
  mounted() { },
  props: {
    /**
     * 圆按钮
     *
     */
    circle: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否开启节流loading
     *
     */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否开启全屏loading
     *
     */
    fullscreenLoading: {
      type: Boolean,
      default: false,
    },
    /**
     * 点击跳转路由
     * string：路由名称
     * object：路由对象
     *
     */
    linkName: {
      type: [String, Object],
      default: () => {
        return '';
      },
    },
    /**
     * 图标类名
     *
     */
    icon: {
      type: String,
      default: '',
    },
    /**
     * 类型
     * @values info,text
     *
     */
    type: {
      type: String,
      default: '',
    },
    /**
     * 预设按钮类型
     * @values 新增 add,删除 delete, 编辑 edit, 导出 export,导入 import,查看 view,恢复 recover, 禁止 disable,确定 confirm, 取消 cancel搜索 search
     *
     */
    buttonType: {
      type: String,
      default: '',
    },
    /**
     * 按钮预设颜色
     * @values hollow,default,green,yellow,red
     *
     */
    colorType: {
      type: String,
      default: 'cb-button-default',
    },
    /**
     * 是否弹出确定框
     *
     */
    isConfirm: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否镂空
     *
     */
    hollow: {
      type: Boolean,
      default: null,
    },
    /**
     * 右边距
     *
     */
    mr: {
      type: Boolean,
      default: false,
    },
    /**
     * 左边距
     *
     */
    ml: {
      type: Boolean,
      default: false,
    },
    /**
     * 按钮自定义样式
     *
     */
    buttonStyle: {
      type: String,
      default: '',
    },
    /**
     * 警告消息
     *
     */
    warnMsg: {
      type: String,
      default: '',
    },
    /**
     * 完成消息
     *
     */
    completeMsg: {
      type: String,
      default: '',
    },
    /**
     * 按钮大小
     */
    size: {
      type: String,
      default: 'middle',
    },
    /**
     * 按钮禁用状态
     */
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadingStatus: false,
      fullscreenLoadingStatus: false,
      defaultType: {
        add: { icon: 'icon-xinzeng', text: 'g.add' },
        delete: {
          icon: 'icon-shanchu',
          text: 'g.delete',
          colorType: 'red',
        },
        edit: { icon: 'icon-bianji', text: 'g.edit' },
        export: { icon: 'icon-daochu', text: 'g.export' },
        import: { icon: 'icon-daoru', text: 'g.import' },
        view: { icon: 'icon-shiyanbaogaochakan', text: 'g.view' },
        recover: { icon: 'icon-shuaxin', text: 'g.recover' },
        disable: {
          icon: 'icon-jinyong',
          text: 'g.disable',
          colorType: 'yellow',
        },
        confirm: { icon: '', text: 'g.confirm' },
        cancel: { icon: '', text: 'g.cancel', colorType: 'hollow' },
        replace: { icon: 'icon-genghuan', text: 'g.replace' },
        search: { icon: 'icon-sousuo', text: 'g.search' },
      },
    };
  },
  computed: {
    sizeClass() {
      return 'cb-button-' + this.size;
    },
    deafultAttr() {
      return _.get(this.defaultType, this.buttonType)
        ? this.defaultType[this.buttonType]
        : false;
    },
    defaultText() {
      return this.deafultAttr && !this.$slots.default
        ? this.deafultAttr.text
        : '';
    },
    iconComputed() {
      return this.deafultAttr && this.type !== 'text'
        ? this.deafultAttr.icon
        : this.icon;
    },
    colorTypeCls() {
      let type = this.deafultAttr
        ? this.deafultAttr.colorType || 'cb-button-default'
        : this.colorType;
      if (this.hollow === true) {
        type = type + ' hollow';
      } else if (this.hollow === false) {
        type.replace('hollow', '');
      }
      return type;
    },
    btnMargin() {
      return `${this.mr ? 'mr' : ''} ${this.ml ? 'ml' : ''}`;
    },
  },
  watch: {
    loading(newVal, oldVal) {
      this.loadingStatus = newVal;
    },
  },
  methods: {
    /**
     * Success event.
     *
     * @event success
     * @property {string} content content of the first prop passed to the event
     * @property {object} example the demo example
     */
    messageOpt(event, msg) {
      const that = this;
      return {
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            that.clickAction(event, msg, () => {
              done();
              instance.confirmButtonLoading = false;
            });
          } else {
            done();
          }
        },
      };
    },
    click(event) {
      if (this.disabled) return;
      if (this.loading) {
        this.loadingStatus = true;
      }
      if (this.fullscreenLoading) {
        this.fullscreenLoadingStatus = true;
      }
      if (this.buttonType === 'delete' && this.isConfirm) {
        this.$confirm(
          this.$t('g.deleteWarn'),
          '',
          this.messageOpt(event, this.$t('g.deleteSuccessfully')),
        );
      } else if (this.warnMsg) {
        this.$confirm(
          this.warnMsg,
          '',
          this.messageOpt(event, this.completeMsg),
        );
      } else {
        /**
         * click event
         *
         * @property {Function} done 关闭自动loading的回调函数
         * @property {event} event 原生MouseEvent
         */
        this.clickAction(event, this.completeMsg);
      }
      // Utils.debounce(webTrack('button', event, 'click', this.$route), 50);
    },

    clickAction(event, completeMsg, callback) {
      if (this.linkName && this.$router) {
        const obj = _.isPlainObject(this.linkName)
          ? this.linkName
          : { name: this.linkName };
        this.$router.push(obj);
        callback && callback();
      }
      this.$emit(
        'click',
        (flag) => {
          if (flag !== false && completeMsg) {
            this.$message.success(completeMsg);
          }
          callback && callback();
          this.loadingStatus = false;
          this.fullscreenLoadingStatus = false;
        },
        event,
      );
    },
  },
};
</script>
