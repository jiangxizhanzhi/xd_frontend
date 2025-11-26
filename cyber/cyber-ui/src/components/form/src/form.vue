<template>
  <div
    class="cb-form"
    :class="[
      formBlockExist ? 'no-form-bg' : '',
      isBgColor ? 'form-card-bg' : '',
    ]"
    :style="{ width: width }"
  >
    <Form
      ref="elFormRef"
      :label-position="labelPosition"
      :model="model"
      @submit.native.prevent
      :rules="computedRules"
      v-bind="$attrs"
    >
      <slot></slot>
    </Form>
    <div
      v-if="isFixedBottomSlot"
      class="cb-form__bottom-holder"
      :style="{
        margin: `0 ${confirmSlotMargin.right} ${confirmSlotMargin.bottom} 0`,
      }"
    ></div>
    <div
      v-if="isFixedBottomSlot"
      class="cb-form__bottom"
      :style="{
        margin: `0 ${confirmSlotMargin.right} ${confirmSlotMargin.bottom} 0`,
      }"
    >
      <slot name="fixedBottom"></slot>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import { request, getResponse, isSubFrame, getMainWin } from '@cyber/helper';
import { Form } from 'element-ui';
import { getScrollbarWidth } from '../../../utils/utils';
import scrollIntoView from 'scroll-into-view-if-needed';

/**
 * @displayName cb-form 表单
 * @classify Form/表单
 */
export default {
  name: 'CbForm',
  components: {
    Form,
  },
  props: {
    /**
     * 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width
     *@values right,left
     */
    labelPosition: {
      type: String,
      default: 'right',
    },
    /**
     * 表单宽度
     *@values px,百分比
     */
    width: {
      type: String,
      default: '100%',
    },
    /**
     * 修改时的资源id
     *
     */
    id: {
      type: [String, Number, Object],
      default: '',
    },
    /**
     * 创建时下发post请求
     * 编辑时根据id 请求拉取内容，下发path请求
     *
     */
    url: {
      type: String,
      default: '',
    },
    /**
     * 请求体Content-type是否为application/json
     * 覆盖contentType属性
     *
     */
    json: {
      type: Boolean,
      default: false,
    },
    /**
     * 与请求绑定的数据，需要.sync 修饰符
     *
     */
    model: {
      type: Object,
      default: () => {
        return {};
      },
    },
    /**
     * 内容校验
     * 必填字段会自动trim后再校验
     *
     */
    rules: {
      type: Object,
      default: () => {
        return {};
      },
    },
    /**
     * 自定义异步请求
     * promise (请求类型, url, 请求体, 自定义请求头)
     *
     */
    fetchPromise: {
      type: null,
      default: null,
    },
    /**
     * 请求体Content-type类型
     *
     */
    contentType: {
      type: String,
      default: 'multipart/form-data',
    },
    /**
     * 请求体的baseURL
     *
     */
    baseURL: {
      type: String,
      default: '',
    },
    /**
     * 默认请求method
     */
    method: {
      type: String,
    },
    /**
     * 是否显示卡片背景
     */
    isBgColor: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      original: {},
      __resizeHandler: null,
      confirmSlotMargin: {
        bottom: 0,
        right: 0,
      },
    };
  },
  created() {},
  mounted() {
    if (this.isFixedBottomSlot) {
      this.setConfirmSlotPosition();
      this.__resizeHandler = _.debounce(() => {
        this.setConfirmSlotPosition();
      }, 100);
      window.addEventListener('resize', this.__resizeHandler);
    }
  },
  beforeDestroy() {
    // 页面销毁后清除事件
    window.removeEventListener('resize', this.__resizeHandler);
  },
  computed: {
    formBlockExist() {
      return this.$slots.default.some((item) => {
        return item.tag && item.tag.indexOf('CbFormBlock') > -1;
      });
    },
    isFixedBottomSlot() {
      return this.$slots.fixedBottom;
    },
    computedContentType() {
      const { json, contentType } = this;
      return json ? 'application/json' : contentType;
    },
    formDataSubmit() {
      const { id, model, original } = this;
      if (id) {
        const data = {};
        const entries = Object.entries(model);
        for (const [key, value] of entries) {
          const originalValue = original[key];
          if (JSON.stringify(originalValue) !== JSON.stringify(value)) {
            data[key] = value;
          }
        }
        // 路径参数作为请求体的参数
        if (_.isPlainObject(id)) {
          Object.assign(data, id);
        }
        return data;
      }
      return model;
    },
    fetchUrl() {
      // 路径参数
      if (_.isPlainObject(this.id)) {
        const queryPath = Object.entries(this.id)
          .map(([key, val]) => `${key}=${val}`)
          .join('&');
        return this.url + '?' + queryPath;
      } else if (this.id) {
        return this.url + this.id + '/';
      } else {
        return this.url;
      }
    },
    action() {
      return this.method ? this.method : this.id ? 'patch' : 'post';
    },
    computedRules() {
      const rules = this.rules;
      Object.keys(rules).map((_key) => {
        const required = _.find(rules[_key], { required: true });
        if (required) {
          rules[_key].push({
            validator: (rule, value, callback) => {
              if (_.isString(value) && value.trim() === '') {
                callback(new Error(required.message));
              }
              callback();
            },
            trigger: ['blur', 'change'],
          });
        }
      });
      return rules;
    },
  },
  methods: {
    /**
     * 编辑时获取新的model
     *
     * @public
     */
    getModelData(requestConfig = {}) {
      const { fetchUrl, baseURL } = this;
      let pom = null;
      const option = requestConfig;
      if (baseURL) {
        option.baseURL = baseURL;
      }
      if (this.fetchPromise) {
        pom = this.fetchPromise('get', fetchUrl, null, option);
      } else {
        pom = request['get'](fetchUrl, null, option);
      }
      return new Promise((resolve, reject) => {
        pom
          .then((resp) => {
            const model = getResponse(resp).data;
            this.original = _.cloneDeep(model);
            this.changeModel(model);
            resolve(model);
          })
          .catch(reject);
      });
    },
    changeModel(model) {
      this.$emit('update:model', model);
    },
    /**
     * 下发方法
     *
     * @public
     */
    submit(customFormData, requestConfig = {}, beforeSubmit) {
      const {
        action,
        fetchUrl,
        computedContentType,
        formDataSubmit,
        baseURL,
        id,
        url,
      } = this;
      return new Promise((resolve, reject) => {
        this.submitValidate((valid) => {
          if (!valid) {
            reject('form validate failed');
            return;
          }
          let formData;
          if (computedContentType === 'application/json') {
            formData = formDataSubmit;
          } else {
            const _data = new FormData();
            _.forEach(formDataSubmit, (value, key) => {
              if (Array.isArray(value)) {
                _.forEach(value, (val) => {
                  _data.append(key, val);
                });
              } else {
                _data.append(key, value);
              }
            });
            formData = _data;
          }
          let config = {
            headers: {
              'Content-Type': computedContentType,
            },
          };
          if (baseURL) {
            config.baseURL = baseURL;
          }
          config = _.merge(config, requestConfig);
          if (this.fetchPromise) {
            this.fetchPromise(
              action,
              fetchUrl,
              customFormData ? customFormData : formData,
              config,
            )
              .then((resp) => {
                resolve(resp);
              })
              .catch(reject);
          } else {
            const actionUrl = _.isPlainObject(id) ? url : fetchUrl;
            if (beforeSubmit) {
              beforeSubmit()
                .then((res) => {
                  request[action](actionUrl, res, config)
                    .then((resp) => {
                      resolve(resp);
                    })
                    .catch(reject);
                })
                .catch(reject);
            } else {
              request[action](
                actionUrl,
                customFormData ? customFormData : formData,
                config,
              )
                .then((resp) => {
                  resolve(resp);
                })
                .catch(reject);
            }
          }
        });
      });
    },
    /**
     * validate 校验
     *
     * @public
     */
    submitValidate(callback) {
      this.$refs.elFormRef.validate((valid, obj) => {
        let customValid = true;
        if (!valid) {
          //按照rules的顺序focus跳转
          for (let r in this.rules) {
            if (obj[r]) {
              const label = document.querySelector(`label[for="${r}"]`);
              const formItem = label.closest('.el-form-item');
              const inputEle =
                formItem &&
                formItem.querySelector(
                  '.el-form-item__content .el-input>input',
                );
              if (
                inputEle &&
                _.get(inputEle.getClientRects(), 'length') !== 0
              ) {
                //input display ！== none
                inputEle.focus();
              } else {
                this.focus(r);
              }
              break;
            }
          }
        } else {
          //customValidator

          for (let r in this.rules) {
            const arr = this.rules[r];
            for (let i in arr) {
              const customValidator = arr[i].customValidator;
              if (customValidator && typeof customValidator === 'function') {
                const callback = (error) => {
                  if (error && error.message) {
                    customValid = false;
                    this.$message.error(error.message);
                  }
                };
                customValidator(this.rules, this.model[r], callback);
                if (!customValid) {
                  break;
                }
              }
            }
            if (!customValid) {
              this.focus(r);
              break;
            }
          }
        }
        const objKey = _.get(Object.keys(obj || {}), '0');
        if (obj && objKey && !Object.keys(this.rules).includes(objKey)) {
          //rules之外的校验
          const ele = document.querySelector(
            `.form-validate-${objKey.replace(/\./g, '-')}`,
          );
          ele && this.focusNode(ele);
        }
        callback && callback(valid && customValid, obj);
      });
    },

    /**
     * validate 校验
     *
     * @public
     */
    validate(...args) {
      this.$refs.elFormRef.validate(...args);
    },

    focus(ele) {
      if (!ele) {
        return;
      }
      const label = document.querySelector(`label[for="${ele}"]`);
      scrollIntoView(label, {
        scrollMode: 'if-needed',
      });
    },

    focusNode(node) {
      if (!node) {
        return;
      }
      scrollIntoView(node, {
        scrollMode: 'if-needed',
      });
    },
    /**
     * validateField 部分校验
     *
     * @public
     */
    validateField(...args) {
      this.$refs.elFormRef.validateField(...args);
    },
    /**
     * resetFields
     *
     * @public
     */
    resetFields() {
      this.$refs.elFormRef.resetFields();
    },
    /**
     * clearValidate
     *
     * @public
     */
    clearValidate(...args) {
      this.$refs.elFormRef.clearValidate(...args);
    },
    setConfirmSlotPosition() {
      //fix fixed底部slot遮住滚动条问题
      let element;
      if (isSubFrame()) {
        const removeDomScope = _.get(window.microApp, 'removeDomScope');
        removeDomScope && removeDomScope();
      }
      element = getMainWin().document.querySelector(
        'body .cb-layout-content-page',
      );
      if (!element) {
        return;
      }

      const scrollbarWidth = (getScrollbarWidth() + 2 || 0) + 'px';

      this.confirmSlotMargin.right =
        element.scrollHeight > element.clientHeight ? scrollbarWidth : '0px';
      this.confirmSlotMargin.bottom =
        element.scrollWidth > element.clientWidth ? scrollbarWidth : '0px';
    },
  },
};
</script>
