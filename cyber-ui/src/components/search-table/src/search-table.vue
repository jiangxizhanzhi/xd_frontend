<template>
  <div
    class="cb-search-table"
    v-show="showSdl"
  >
    <div
      class="search-bar"
      :class="{ 'search-bar-bg': searchBarBg }"
    >
      <cb-search-bar class="top-filter">
        <template v-slot:filter>
          <slot name="filter"></slot>
          <template v-if="showSearchBtn">
            <cb-button @click="handleSearch" style="margin-right: 16px">
              搜索
            </cb-button>
            <cb-button @click="resetSearch" hollow>重置</cb-button>
          </template>
        </template>
        <template v-slot:searchRightArea>
          <slot name="searchRightArea"></slot>
        </template>
      </cb-search-bar>
      <cb-search-bar class="bottom-search">
        <template v-slot:search>
          <slot name="search"></slot>
        </template>
      </cb-search-bar>
    </div>
    <div
      class="thumb-view"
      v-show="showThumbView"
    >
      <div
        class="thumb-view-has-data"
        v-if="dataSourceComputed && dataSourceComputed.length > 0"
        :style="fixedThumbStyle"
      >
        <template v-for="(row, index) of dataSourceComputed">
          <div
            class="thumb-view-card"
            :key="'cb-thumb-view-card' + index"
            :style="{ width: thumbCard.width, margin: thumbCardMargin }"
          >
            <slot
              name="thumb"
              :data="row"
            ></slot>
          </div>
        </template>
      </div>
      <div
        class="thumb-no-data"
        v-else
      >
        <slot
          name="thumbNoData"
          :loading="loading"
        ></slot>
        <div
          v-if="!$slots.thumbNoData"
          class="thumb-no-data-icon"
        >
          <cb-iconfont
            class="no-data-icon"
            size="90"
            type="icon-zanwuziyuan"
          ></cb-iconfont>
          <div class="no-data-text">{{ $t('g.noData') }}</div>
        </div>
      </div>
    </div>
    <cb-a-config-provider :locale="$cbAntLocale[$i18n.locale]">
      <div
        class="cb-a-table-container cyber-scroll-bar"
        :class="[
          { 'cb-a-table-container-bg': searchBarBg },
          { 'have-search': $slots.search && searchBarBg },
        ]"
        v-loading="loading && !showThumbView"
        ref="cbTableRef"
        :style="{
          height: tableHeight ? tableHeight + 'px' : '',
          overflow: tableHeight ? 'auto' : '',
          position: 'relative',
        }"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
        @mousemove="handleMouseMove"
      >
        <a-table
          v-bind="$attrs"
          :scroll="scrollComputed"
          :table-layout="tableLayout"
          :row-key="rowKey"
          :row-class-name="setRowClassName"
          :expanded-row-keys.sync="expandRowArr"
          :row-selection="rowSelectionFunc"
          :data-source="dataSourceComputed"
          :pagination="pagination"
          :children-column-name="childrenColumnName"
          :expand-icon-column-index="expandIconColumnIndex"
          @change="handleTableChange"
          @expandedRowsChange="expandedRowsChange"
        >
          <div
            class="cb-table-expanded-row"
            :slot="expandRow ? 'expandedRowRender' : null"
            slot-scope="record, index, indent, expanded"
          >
            <slot
              name="expandRow"
              :data="{ record, index, indent, expanded }"
            ></slot>
          </div>

          <cb-table-columns
            v-if="showIndex"
            key="cb-props-index"
            :title="$t('g.indexTitle')"
            data-index="_propsIndex"
            :width="60"
          >
          </cb-table-columns>
          <template v-for="(col, index) of cols">
            <cb-table-columns
              v-if="col.titleSlot"
              :key="
                'title-slot' + col.key ||
                `${col.prop || col.title || col.label}-${index}`
              "
              :data-index="col.prop || col.dataIndex"
              :width="col.width"
            >
              <template v-slot:title>
                <slot :name="col.titleSlot"></slot>
              </template>
              <template slot-scope="text, record, index">
                <slot
                  v-if="col.slot"
                  :name="col.slot"
                  :col="col"
                  :data="record"
                  :index="index"
                ></slot>
<!--                <template v-else>-->
<!--                  <span :title="getColumnContent(col, record)">{{-->
<!--                    getColumnContent(col, record)-->
<!--                  }}</span>-->
<!--                </template>-->
                <template v-else>
                  <cb-tooltip
                    :disabled="!isShowTooltip"
                    effect="dark"
                    transition=""
                    placement="bottom-start"
                    :open-delay="500"
                    :visible-arrow="false"
                  >
                    <div class="cb-search-table-custom-tip cyber-scroll-bar-small" slot="content">
                      {{getColumnContent(col, record)}}
                    </div>
                    <span
                      @mouseover="visibleTooltip($event)"
                      @mouseout="hiddenTooltip($event)"
                    >{{getColumnContent(col, record)}}
                    </span>
                  </cb-tooltip>
                </template>
              </template>
            </cb-table-columns>
            <cb-table-columns
              v-else
              :key="col.key || `${col.prop || col.title || col.label}-${index}`"
              :class="
                index === expandIconColumnIndex && isExpandIconColumn
                  ? 'expand-icon-column'
                  : ''
              "
              :title="col.title || col.label"
              :data-index="col.prop"
              :width="col.width"
              :colSpan="col.colSpan"
              :custom-render="col.customRender"
              :ellipsis="col.ellipsis"
              :sorter="col.sorter"
              :custom-header-cell="(arg) => customHeaderCell(arg, col)"
            >
              <template slot-scope="text, record, index">
                <slot
                  v-if="col.slot"
                  :name="col.slot"
                  :col="col"
                  :data="record"
                  :index="index"
                ></slot>
<!--                <template v-else>-->
<!--                  <span :title="getColumnContent(col, record)">{{-->
<!--                    getColumnContent(col, record)-->
<!--                  }}</span>-->
<!--                </template>-->
                <template v-else>
                  <cb-tooltip
                    :disabled="!isShowTooltip"
                    effect="dark"
                    transition=""
                    placement="bottom-start"
                    :open-delay="500"
                    :visible-arrow="false"
                  >
                    <div class="cb-search-table-custom-tip cyber-scroll-bar-small" slot="content">
                      {{getColumnContent(col, record)}}
                    </div>
                    <span
                      @mouseover="visibleTooltip($event)"
                      @mouseout="hiddenTooltip($event)"
                    >{{getColumnContent(col, record)}}
                    </span>
                  </cb-tooltip>
                </template>
              </template>
            </cb-table-columns>
          </template>
        </a-table>
        <div
          v-show="isResizable && resizeAction.flag"
          class="cb-table-resize-anchor"
          :style="{ left: resizeAction.anchorX + 'px' }"
        ></div>
        <!--无数据-->
        <div
          class="cb-table-no-data"
          v-if="dataSourceComputed.length === 0 && !showThumbView"
        >
          <div
            class="cb-table-no-data-icon"
            v-if="!loading"
          >
            <cb-iconfont
              class="cb-table-no-data-icon"
              size="56"
              type="icon-zanwuziyuan"
            ></cb-iconfont>
            <div class="cb-table-no-data-text">{{ $t('g.noData') }}</div>
          </div>
        </div>
      </div>
    </cb-a-config-provider>
  </div>
</template>
<script>
import _ from 'lodash';
import { request, getResponse, getStore } from '@cyber/helper';
import CbSearchBar from '../../search-bar';
import CbIconfont from '../../iconfont';

import { setMemory, getMemory, guid } from '../../../utils';

/**
 * @displayName cb-search-table 数据列表
 * @classify Data/数据
 */
export default {
  name: 'CbSearchTable',
  components: {
    CbSearchBar,
    CbIconfont,
  },
  props: {
    /**
     * baseUrl
     */
    baseURL: {
      type: String,
      default: '',
    },
    /**
     * table请求数据地址
     */
    url: {
      type: String,
      default: '',
    },
    /**
     * 缓存key值（若不指定memoryKey,则缓存的默认值为route.path + url）
     */
    memoryKey: {
      type: String,
      default: '',
    },
    /**
     * 搜素参数
     */
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    /**
     * 表格数据
     */
    dataSource: {
      type: Array,
      default() {
        return null;
      },
    },
    /**
     * 是否展开行
     */
    expandRow: {
      type: Boolean,
      default: false,
    },
    /**
     * 表格元素的 table-layout 属性，设为 fixed 表示内容不会影响列的布局
     */
    tableLayout: {
      type: String,
      default: 'fixed',
    },
    /**
     * 是否显示分页
     */
    hidePaginOnDemand: {
      type: Boolean,
      default: false,
    },
    /**
     * 数据为空时是否展示表格
     */
    hideOnEmpty: {
      type: Boolean,
      default: false,
    },
    /**
     * 表格行 key 的取值
     */
    rowKey: {
      type: String,
      default: 'id',
    },

    selection: {
      type: Array,
    },
    /**
     * 勾选的数据
     */
    selector: {
      type: [Object, String],
      default() {
        return null;
      },
    },
    /**
     * 表格列的配置描述
     */
    cols: {
      type: Array,
      default() {
        return [];
      },
    },
    /**
     * 序号是否显示
     */
    showIndex: {
      type: Boolean,
      default: false,
    },
    /**
     * 请求的异步promise
     */
    fetchPromise: {
      type: null,
      default: null,
    },
    thumbCard: {
      type: Object,
      default() {
        return {
          number: 5,
          width: '18%',
        };
      },
    },
    /**
     * 指定树形结构的列名
     */
    childrenColumnName: {
      type: String,
      default: 'children',
    },
    /**
     * 展开的图标显示在哪一列，如果没有 rowSelectionFunc，默认显示在第一列，否则显示在选择框后面
     */
    expandIconColumnIndex: {
      type: Number,
      default: 0,
    },
    /**
     * 展开行的参数
     */
    expandRowKey: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 行类名
     */
    rowClassName: {
      type: Function,
      default() {
        return () => '';
      },
    },
    /**
     *table 最大高度
     */
    tableHeight: {
      type: Number,
      default: 0,
    },
    /**
     * 显示少量分页按钮数量
     */
    showLessItems: {
      type: Boolean,
      default: false,
    },
    /**
     * rowSelection
     */
    rowSelection: {
      type: null,
      default: null,
    },
    /**
     * 是否显示分页快速跳转
     */
    showQuickJumper: {
      type: Boolean,
      default: true,
    },
    /**
     * 默认显示分页数量
     */
    pageSize: {
      type: Number,
      default: 10,
    },
    /**
     * 分页展示数量选项
     */
    pageSizeOptions: {
      type: Array,
      default: () => {
        return ['10', '20', '30', '50', '100'];
      },
    },
    /**
     * 是否简单分页
     */
    simplePagination: {
      type: Boolean,
      default: false,
    },
    /**
     * antdv table scroll属性
     */
    scroll: {
      type: null,
      default: undefined,
    },
    searchBarBg: {
      type: Boolean,
      default: true,
    },
    showSearchBtn: {
      type: Boolean,
      default: false,
    },
    // 固定的搜索入参
    queryStrKeep: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      expandRowArr: [],
      tableData: [],
      paginator: {
        simple: this.simplePagination,
        size: 'small',
        showSizeChanger: true,
        showQuickJumper: this.showQuickJumper,
        current: 1,
        pageSize: this.pageSize,
        pageSizeOptions: this.pageSizeOptions,
        showLessItems: this.showLessItems,
        showTotal: (total) => this.$t('g.pageTotal', [total]),
        total: 0,
      },
      loading: false,
      sorter: false,
      guidSource: '',
      flag: false,
      defaultMemoryKey: this.memoryKey || this.$route.path + this.url,
      actualWidth: undefined,
      originCols: this.cols,
      resizeAction: {
        flag: false,
        col: null,
        start: null,
        end: null,
        anchorX: null,
      },
      isShowTooltip: false,
    };
  },
  computed: {
    /**
     * 是否是展开图标列
     *  目的=>找到需要展开的表头，将其与数据对齐而不是与展开图标对齐
     */
    isExpandIconColumn() {
      return this.dataSourceComputed.some((item) => {
        return (
          !_.isEmpty(item[this.childrenColumnName]) &&
          Array.isArray(item[this.childrenColumnName])
        );
      });
    },
    isResizable() {
      return this.cols.some((col) => {
        return col.resizable;
      });
    },
    dataEmpty() {
      return this.dataSourceComputed.length === 0;
    },
    scrollComputed() {
      if (!this.isResizable) {
        return this.scroll;
      } else if (this.actualWidth) {
        return Object.assign(this.scroll || {}, { x: this.actualWidth });
      }
    },
    dataSourceComputed() {
      const { rowKey, showIndex, tableData, dataSource } = this;
      if (Array.isArray(dataSource)) {
        return dataSource.map((i, index) => {
          if (showIndex) {
            i._propsIndex = index + 1;
          }
          if (!i[rowKey]) {
            i[rowKey] = `data-source-row-key--${index}`;
          }
          return i;
        });
      } else {
        return tableData.map((i, index) => {
          if (showIndex) {
            i._propsIndex = index + 1;
          }
          if (!i[rowKey]) {
            i[rowKey] = `data-source-row-key--${index}`;
          }
          return i;
        });
      }
    },
    pagination() {
      if (this.hidePaginOnDemand || this.dataSourceComputed.length === 0) {
        return false;
      } else {
        return this.paginator;
      }
    },
    fixedThumbStyle() {
      const width = parseFloat(this.thumbCard.width) / 100.0;
      const number = parseInt(this.thumbCard.number);
      const mr = (((width * number - 1) * 100) / (2 * number)).toFixed(2) + '%';
      return {
        'box-sizing': 'content-box',
        margin: mr,
        width: `calc(100% - 2*${mr})`,
      };
    },
    thumbCardMargin() {
      const { width, number } = this.thumbCard;
      return `calc((100% - ${width}*${number})/${2 * number})`;
    },
    showSdl() {
      const { hideOnEmpty } = this;
      if (hideOnEmpty) {
        return this.dataSourceComputed.length > 0;
      }
      return true;
    },
    showThumbView() {
      const { cols } = this;
      if (cols && Array.isArray(cols) && cols.length > 0) {
        return false;
      }
      return true;
    },
    selectedRowKeys() {
      const { rowKey } = this;
      if (!this.selection) {
        return [];
      }
      const m = this.selection.map((i) => {
        return i[rowKey];
      });
      return m;
    },
    rowSelectionFunc() {
      if (!this.selection) {
        return null;
      }
      const maxSelect = _.get(this.selector, 'maxSelect');
      const type =
        maxSelect === 1 || this.selector === 'radio' ? 'radio' : 'checkbox';
      let options = {
        type,
        selectedRowKeys: this.selectedRowKeys,
        onSelect: this.onSelect,
        onSelectAll: this.onSelectAll,
        getCheckboxProps: (record) => {
          return { props: record.checkbox || {} };
        },
      };
      if (this.rowSelection) {
        Object.assign(options, this.rowSelection);
      }

      return options;
    },
    userStore() {
      return _.get(getStore(), 'state.user', '');
    },
    dataQuery: {
      get() {
        return this.data;
      },
      set(val) {
        this.$emit('update:data', val);
        return val;
      },
    },
  },
  watch: {
    expandRowKey(val) {
      if (this.expandRowArr.indexOf(val.key) == -1 && val.status) {
        this.expandRowArr.push(val.key);
        this.expandedRowsChange(this.expandRowArr);
      }
      if (!val.status) {
        this.expandRowArr.forEach((element, index) => {
          if (element == val.key) {
            this.expandRowArr.splice(index, 1);
          }
        });
      }
    },
    data: {
      handler(val) {
        this.dataQuery = val;
        // this.flag ? (this.flag = false) : (this.paginator.current = 1); // flag仅在查缓存的时候执行一次
        // this.setWinMemory();
        // this.handleTableChange(this.paginator);
      },
      deep: true,
    },
    paginator: {
      handler(val) {
        this.setWinMemory();
      },
      deep: true,
    },
  },
  mounted() {
    if (!this.dataSource) {
      // 加上用户id => 用户隔离
      this.fetchData(
        _.get(getMemory(this.defaultMemoryKey), this.userStore.id, ''),
      );
    }
    if (this.isResizable) {
      window.addEventListener('resize', this.initResizeWidth, true);
      this.initResizeWidth();
    }
  },
  destroyed() {
    if (this.isResizable) {
      window.removeEventListener('resize', this.initResizeWidth, true);
    }
  },
  methods: {
    handleSearch() {
      // if (!this.dataSource) {
      //   // 加上用户id => 用户隔离
      //   this.fetchData(
      //     _.get(getMemory(this.defaultMemoryKey), this.userStore.id, ''),
      //   );
      // }
      this.flag ? (this.flag = false) : (this.paginator.current = 1); // flag仅在查缓存的时候执行一次
      this.setWinMemory();
      this.handleTableChange(this.paginator);
    },
    resetSearch() {
      let {page, per_page, ...other} = this.dataQuery;
      for (const otherKey in other) {
        if (this.queryStrKeep.includes(otherKey)) {
          if (typeof other[otherKey] === 'string') {
            other[otherKey] = '';
          }
          if (typeof other[otherKey] === 'number') {
            other[otherKey] = undefined;
          }
          if (typeof other[otherKey] === 'boolean') {
            other[otherKey] = false;
          }
        }
      }
      if (this.queryStrKeep.length) {
        this.dataQuery = {
          ...other,
        };
      } else {
        this.dataQuery = {}
      }
      this.$nextTick(() => {
        this.handleSearch();
      });
      this.$emit('reset');
    },
    setRowClassName(record, index) {
      const cls = index % 2 === 1 ? 'cb-table-zebra' : '';
      return (
        (this.rowClassName ? this.rowClassName(record, index) : '') + ' ' + cls
      );
    },
    // 在搜索条件、页码改变时存储缓存
    setWinMemory() {
      // data加sync才开启缓存
      if (_.get(this, '_events.update:data', '')) {
        setMemory(`${this.defaultMemoryKey}.${this.userStore.id}`, {
          searchData: this.dataQuery, // 不缓存data的数据，只缓存分页的
          paginator: this.paginator,
        });
        this.flag = false;
      }
    },
    expandedRowsChange(list) {
      /**
       * 展开行触发的回调
       *
       * @event expandedRowsChange
       * @property {Array}  list
       */
      this.$emit('expandedRowsChange', list);
    },
    getSelectedRowKeys() {
      return this.getSelectedRowKeys;
    },
    onSelectAll(selected, selectedRows, changeRows) {
      /**
       * 用户手动选择/取消选择所有列的回调
       *
       * @event onSelectAll
       * @property {Boolean} selected 是否全选
       * @property {Array} selectedRows 选中所有列的数据
       * @property {Array} changeRows 与原选择数据相比变化的列数据
       *
       */
      this.$emit('onSelectAll', selected, selectedRows, changeRows);
      let arr = this.selection;
      const { rowKey } = this;
      if (selected) {
        const temp = arr.concat(changeRows);
        arr = _.uniqBy(temp, rowKey);
      } else {
        _.pullAllBy(arr, changeRows, rowKey);
      }
      this.updateSelection(arr);
    },
    onSelect(record, selected) {
      /**
       * 用户手动选择/取消选择某列的回调
       *
       * @event onSelect
       * @property {Object} record 选中列的数据
       * @property {Boolean} selected 是否选中
       *
       */
      this.$emit('onSelect', record, selected);
      if (this.rowSelectionFunc.type === 'radio') {
        this.radioOnSelect(record);
      } else {
        this.checkboxOnSelect(record, selected);
      }
    },
    radioOnSelect(record) {
      this.updateSelection([record]);
    },
    checkboxOnSelect(record, selected) {
      let arr = this.selection;
      const { rowKey } = this;
      if (selected) {
        arr.push(record);
        arr = _.uniqBy(arr, rowKey);
      } else {
        _.pullAllBy(arr, [record], rowKey);
      }
      this.updateSelection(arr);
    },
    updateSelection(arr) {
      this.$emit('update:selection', _.cloneDeep(arr));
    },
    getColumnContent(col, row) {
      let val = '';
      if (col.getData) {
        val = col.getData(row, row[col.prop]);
      } else if (col.render) {
        val = col.render(row, row[col.prop]);
      } else {
        val = row[col.prop];
      }
      if (val === undefined || val === null || val === '') {
        return '-';
      } else {
        return `${val}`;
      }
    },
    handleTableChange(pagination, filters, sorter) {
      const { current, pageSize } = pagination;
      this.paginator = Object.assign(this.paginator, {
        current,
        pageSize,
      });
      if (sorter) {
        this.sorter = sorter;
      }
      this.fetchData();
    },
    getQueryData(data, current, pageSize) {
      const rv = {};
      const entries = _.entries(data);
      for (const [key, val] of entries) {
        if (val || val === 0 || val === false) {
          rv[key] = val;
        }
      }
      return Object.assign(
        {
          per_page: pageSize,
          page: current,
        },
        rv,
      );
    },
    fetchData(memoryData, opt = { loading: true }) {
      const { sorter, baseURL } = this;
      // // 缓存内是否存在页码及搜索项数据
      if (!_.isEmpty(memoryData)) {
        Object.assign(this.paginator, _.get(memoryData, 'paginator', {}));
        this.flag = true;
        Object.assign(this.dataQuery, _.get(memoryData, 'searchData', {}));
        // 保证触发data 的watch
        // this.$emit('update:data', _.clone(_.get(memoryData, 'searchData')));
        // return;
      }
      const { current, pageSize } = this.paginator;
      const _guid = guid();

      // 保存 guid 的值，防止 guid 被闭包保存
      this.guidSource = _guid;
      this.loading = opt.loading !== false;
      // console.log('----------this.dataQuery',this.dataQuery)
      const queryData = this.getQueryData(this.dataQuery, current, pageSize);
      if (sorter && sorter.order) {
        queryData.sort = `${sorter.order === 'descend' ? '-' : ''}${sorter.column.sorter || ''
          }`;
      }
      const option = {
        headers: {
          'Ui-Request-Id': _guid,
        },
      };
      if (baseURL) {
        option.baseURL = baseURL;
      }

      if (this.fetchPromise) {
        return this.fetchPromise(queryData, option)
          .then((resp) => {
            this.setTableData(resp, _guid);
          })
          .catch(() => {
            this.loading = false;
          });
      } else if (this.url) {
        return request
          .get(this.url, queryData, option)
          .then((resp) => {
            this.setTableData(resp, _guid);
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.loading = false;
      }
    },
    reload(opt) {
      return this.fetchData(undefined, opt);
    },
    empty() {
      this.tableData = [];
    },
    setTableData(resp, _guid) {
      const respId = _.get(resp, 'headers.config.Ui-Request-Id', _guid);
      if (respId !== this.guidSource) {
        return;
      }
      const { list, total } = getResponse(resp);
      const current = this.paginator.current;
      //删除最后一页，当前页自动减一；
      if (list.length === 0 && total > 0 && current > 1) {
        this.paginator.current = Math.max(current - 1, 1);
        this.fetchData();
      } else {
        this.tableData = list;
        this.paginator.total = total;
        /**
         * 数据请求完返回完整数据
         * @event data-loaded
         * @property {tableData}
         * @property {tableDatatotal}
         * @property {grandTotal}
         */
        this.$emit('data-loaded', {
          tableData: list,
          total,
          grandTotal: total,
        });
        this.$nextTick(() => {
          this.loading = false;
        });
      }
    },
    initResizeWidth() {
      this.$nextTick(() => {
        const tableNode = this.$refs.cbTableRef;
        if (!tableNode) {
          return;
        }
        if (this.searchBarBg) {
          this.actualWidth = tableNode.clientWidth - 32;
        } else {
          this.actualWidth = tableNode.clientWidth;
        }
      })
    },
    updateColsWidth(name, plus) {
      const tableNode = this.$refs.cbTableRef;
      if (!tableNode) {
        return;
      }

      const tableTh = tableNode.querySelectorAll(
        '.ant-table-body>table .ant-table-thead th',
      );
      let colsWidth = [];
      let tableWidth = 0;
      tableTh.forEach((col, index) => {
        tableWidth = tableWidth + col.offsetWidth;
        colsWidth[index] = col.offsetWidth;
      });
      if (tableWidth <= tableNode.offsetWidth && plus < 0) {
        return;
      }
      let cols = _.cloneDeep(this.cols);
      const offset = tableTh.length - cols.length;
      cols.forEach((col, index) => {
        col.width = colsWidth[index + offset];
      });
      const col = _.find(cols, { prop: name });
      const originCol = _.find(this.originCols, { prop: name });
      if (_.isNumber(originCol.width) || originCol.width.indexOf('px') > -1) {
        col.width = Math.max(col.width + plus, parseInt(originCol.width));
      } else {
        col.width = col.width + plus;
      }

      this.$emit('update:cols', cols);
    },
    customHeaderCell(column, col) {
      let obj = {};
      if (col.customHeaderCell) {
        obj = col.customHeaderCell(column, col);
      }
      const { isResizable, dataEmpty } = this;
      return _.merge(
        {
          class: {
            'cb-resizable-column': col.resizable && isResizable && !dataEmpty,
          },
          attrs: {
            'data-col': col.prop || '',
          },
        },
        obj,
      );
    },
    handleMouseDown(e) {
      if (!this.isResizable || this.dataEmpty) {
        return;
      }
      const srcEle = e.target;
      if (srcEle.classList.contains('cb-resizable-column')) {
        const colProp = srcEle.getAttribute('data-col');
        this.resizeAction.col = colProp;
        this.resizeAction.flag = true;
        this.resizeAction.start = e.pageX;
        const tableNode = this.$refs.cbTableRef;
        const rectangle = tableNode.getBoundingClientRect();
        this.resizeAction.anchorX = this.resizeAction.start - rectangle.left;
      }
    },
    handleMouseUp(e) {
      if (!this.isResizable || this.dataEmpty) {
        return;
      }
      if (this.resizeAction.flag && this.resizeAction.start) {
        this.resizeAction.end = e.pageX;
        const width = (this.resizeAction.end - this.resizeAction.start).toFixed(
          0,
        );
        this.updateColsWidth(this.resizeAction.col, parseInt(width));
      }
      this.resizeAction.flag = false;
      this.resizeAction.anchorX = null;
    },
    handleMouseLeave() {
      if (!this.isResizable || this.dataEmpty) {
        return;
      }
      this.resizeAction.flag = false;
      this.resizeAction.start = null;
      this.resizeAction.anchorX = null;
    },
    handleMouseMove(e) {
      if (
        !this.isResizable ||
        this.dataEmpty ||
        !this.resizeAction.flag ||
        !this.resizeAction.start
      ) {
        return;
      }
      const tableNode = this.$refs.cbTableRef;
      const rectangle = tableNode.getBoundingClientRect();
      const offset = e.pageX - rectangle.left;
      this.resizeAction.anchorX = offset;
    },
    // 手动刷新表格数据方法，可用于限制多选个数
    refreshTableData() {
      this.tableData = [...this.tableData];
    },
    hiddenTooltip(e) {
      let el = e.target;
      if (el) {
        _.debounce(() => {
          this.isShowTooltip =false;
        }, 200);
      }
    },
    visibleTooltip(e) {
      let el = e.target;
      if (el) {
        this.isShowTooltip = (el.offsetWidth + 20) > el.parentNode.offsetWidth;
      }
    },
  },
};
</script>
