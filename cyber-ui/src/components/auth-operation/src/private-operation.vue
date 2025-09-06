<template>
  <div class="cb-auth-operation">
    <div class="operating">
      <cb-radio-group v-model="shareModeVal" @change="raioGroupChange">
        <cb-radio label="2"> {{ $t('g.custom') }}</cb-radio>
        <cb-radio label="1">{{ $t('g.authorizeAll') }}</cb-radio>
      </cb-radio-group>
    </div>
    <div class="content">
      <transition name="el-zoom-in-center">
        <Custom
          :columns="columns"
          :url="url"
          :props="props"
          :queryName="queryName"
          :rowKey="rowKey"
          :selectData="selectData"
          :baseURL="baseURL"
          :treeKey="treeKey"
          v-if="shareModeVal == 2"
          :treeData="treeData"
          :showIndex="showIndex"
          :treeWidth="treeWidth"
          :scroll="scroll"
          @onChange="onChange"
        >
          <template
            v-for="(item, index) in columns"
            v-slot:[item.slot]="{ data }"
          >
            <span :key="index" v-if="item.slot">
              <slot :name="item.slot" :data="data"></slot>
            </span>
          </template>
          <!-- 左边列表搜索插槽 -->
          <template v-slot:leftSearch>
            <slot name="leftSearch"></slot>
          </template>
          <!-- 右边列表搜索插槽 -->
          <template v-slot:rightSearch>
            <slot name="rightSearch"></slot>
          </template>
        </Custom>
      </transition>
    </div>
  </div>
</template>

<script>
import Custom from './components/custom.vue';

/**
 * @displayName cb-auth-operation 授权操作
 * @classify Business/业务
 */
export default {
  name: 'CbAuthOperation',
  props: {
    /**
     * baserUrl 参考search-table
     */
    baseURL: {
      type: String,
      default: '',
    },
    /**
     * 已选择用户数据
     */
    selectData: {
      type: Array,
      default: () => [],
    },
    /**
     * 树默认字段名配置
     */
    props: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label',
        };
      },
    },
    /**
     * treeKey 树的唯一性id
     */
    treeKey: {
      type: String,
      default: 'id',
    },
    /**
     * 唯一性id
     */
    rowKey: {
      type: String,
      default: 'resource_id',
    },
    /**
     * 表头
     */
    columns: {
      type: Array,
      default: () => [
        {
          title: '用户名',
          prop: 'name',
        },
        {
          title: '姓名',
          prop: 'direction_name',
        },
        {
          title: '组织名称',
          prop: 'create_username',
          slot: 'create_username',
        },
        {
          title: '角色',
          none: true,
          prop: 'lesson_count',
        },
      ],
    },
    /**
     * table请求数据地址
     */
    url: {
      type: String,
      default: 'http://10.100.3.4:3000/mock/195/cyber/table/data',
    },
    /**
     * 树的数据
     */
    treeData: {
      type: Array,
      default: () => [],
    },
    queryName: {
      type: Object,
      default: () => {
        return {
          treeName: 'organization',
          tableSearchName: 'name',
        };
      },
    },
    shareMode: {
      type: Number,
      default: 1,
    },
    /**
     * 是否展示序号
     */
    showIndex: {
      type: Boolean,
      default: true,
    },
    /**
     * 左侧树宽度
     */
    treeWidth: {
      type: [String, Number],
    },
    /**
     * table scroll
     */
    scroll: {
      type: Object,
      default: () => ({ y: 500 }),
    },
  },
  data() {
    return {
      shareModeVal: '1',
      // componentId: '',
      // pageArr: ['Custom'],
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.shareModeVal = this.shareMode.toString();
    // this.componentId = this.pageArr[this.shareMode];
  },
  watch: {
    shareMode(val) {
      this.shareModeVal = val.toString();
    },
  },
  methods: {
    onChange(val) {
      /**
       * 列表选择了数据触发的方法
       *
       * @event onChange
       * @property {array} val 所有选择的数据
       */
      this.$emit('onChange', val);
    },
    raioGroupChange() {
      /**
       * 单选框选择变化
       *
       * @event radioChange
       * @property {string} shareMode 单选框数值
       */
      this.$emit('radioChange', this.shareModeVal);
      // this.componentId = this.pageArr[this.shareMode];
    },
  },
  components: { Custom },
};
</script>
