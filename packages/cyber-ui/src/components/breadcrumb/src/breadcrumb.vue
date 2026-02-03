<template>
  <div
    class="cb-breadcrumb"
    :class="breadcrumbClass"
  >
    <template v-if="!hideBreadcrumb">
      <div
        v-for="(_item, index) in matchedPath"
        :key="_item.name + _item.path + index"
        class="cb-breadcrumb-container"
        :class="{ 'left-radius': index === 0 }"
      >
        <a
          v-if="_item.isLink"
          class="cb-breadcrumb-title cb-breadcrumb-link"
          @click="linkClick(_item)"
          :title="$t(_item.title)"
        >{{ $t(_item.title) }}</a>
        <span
          class="cb-breadcrumb-arrow"
          v-if="_item.isLink && type === 'simple'"
        >
          <cb-iconfont
            type="icon-xiangzuo"
            themed-color="neutral5"
          ></cb-iconfont>
        </span>
        <span
          v-if="!_item.isLink"
          class="cb-breadcrumb-title"
          :title="
            isLast(index) ? $t(_item.title) + customTitle : $t(_item.title)
          "
          :class="{ 'cb-breadcrumb-current': isLast(index) }"
        >{{
            isLast(index) ? $t(_item.title) + customTitle : $t(_item.title)
          }}</span>
        <div
          v-if="!isLast(index)"
          class="cb-breadcrumb-triangle-right"
        >
          <cb-iconfont
            type="icon-xiangzuo"
            themed-color="neutral5"
            style="vertical-align: initial"
          ></cb-iconfont>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import _ from 'lodash';
import { bus } from '../../../utils/bus';
import { getAllPath, hasValidChildren } from '../../../utils/navi';
import pathToRegexp from 'path-to-regexp';

/**
 * @displayName cb-breadcrumb 面包屑
 * @classify Navigation/导航
 */
export default {
  name: 'CbBreadcrumb',
  props: {
    /**
     * 面包屑类型
     * @values primary,simple
     */
    type: {
      type: String,
      default: 'primary',
    },
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    /**
     * 选择的菜单项
     *
     */
    active: {
      type: Object,
      default: () => {
        return {};
      },
    },
    /**
     * 前插入项
     *
     */
    preItems: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      customTitle: '',
      params: {},
    };
  },
  computed: {
    allPath() {
      return getAllPath(this.data);
    },
    breadcrumbClass() {
      return 'cb-breadcrumb-' + this.type;
    },
    hideBreadcrumb() {
      return _.get(this.active, 'meta.breadcrumb') === false;
    },
    matchedPath() {
      const breadcrumb = _.get(this.active, 'meta.breadcrumb');
      const preItems = _.get(this.active, 'meta.preItems', this.preItems);
      return Array.isArray(breadcrumb)
        ? this.customizedPath(breadcrumb)
        : this.getMatchedPath(this.data, this.active, preItems, this.allPath);
    },
    customSelect() {
      return this.$listeners && this.$listeners.select;
    },
  },
  watch: {
    active: {
      handler(val, oldVal) {
        this.params = {};
        if (val !== oldVal) {
          this.customTitle = '';
          const base = this.$router.options.base;
          const path =
            base + (_.find(this.allPath, { name: val.name }) || {}).path;
          let keys = [];
          let re = pathToRegexp(path, keys);
          const match = re.exec(location.pathname);
          if (match) {
            keys.map((i, index) => {
              this.params[i.name] = match[index + 1];
            });
          }
        }
      },
      immediate: true,
    },
  },
  created() {
    bus.$on('breadcrumb_title', (val) => {
      this.customTitle = ` - ${val}`;
    });
  },
  beforeDestroy() {
    bus.$off('breadcrumb_title');
  },
  methods: {
    isLast(index) {
      return index === this.matchedPath.length - 1;
    },
    linkClick(route) {
      if (this.customSelect) {
        this.$emit('select', route.name, route, this.params);
      } else {
        this.$router.push({ name: route.name, params: this.params });
      }
    },
    customizedPath(arr) {
      return arr.map((i) => {
        return _.isPlainObject(i)
          ? {
            title: i.title,
            name: i.name,
            path: i.path,
            isLink: true,
          }
          : {
            title: i,
            path: i,
          };
      });
    },
    getMatchedPath(data, active, preItems, allPath) {
      let matchedArr = [];
      const parentName = _.get(active, 'meta.breadcrumb.parentName');
      const curPathName = parentName || active.name;
      const setItem = (curPathName) => {
        allPath.some((i) => {
          if (i.name === curPathName) {
            i.isLink = Boolean(i.path && i.name !== active.name);
            matchedArr.unshift(i);
            const par = _.get(i, 'meta.breadcrumb.parentName');
            if (par) {
              setItem(par);
            } else if (i._folderName) {
              // 存在有效子集
              if (this.isVaildChild(i._folderName, data)) {
                setItem(i._folderName);
              }
            }
            return true;
          }
        });
      };
      setItem(curPathName);

      if (parentName) {
        matchedArr.push({
          title: _.get(active, 'meta.title'),
          name: active.name,
          path: active.path,
        });
      }
      preItems.map((i) => {
        matchedArr.unshift(_.isPlainObject(i) ? i : { title: i, path: i });
      });
      return matchedArr;
    },
    // 是否存在有效子集
    isVaildChild(_folderName, Data) {
      let isVaild = false;
      if (!_.isEmpty(Data)) {
        Data.forEach((item) => {
          if (item.name === _folderName) {
            isVaild = hasValidChildren(item);
          }
        });
      }
      return isVaild;
    },
  },
};
</script>
