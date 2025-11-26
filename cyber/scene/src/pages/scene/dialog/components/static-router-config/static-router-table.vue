<template>
  <div class="static-router-table-wrapper">
    <cb-row v-for="(item, index) in staticRoutesForm" class="static-router-table-item" :key="JSON.stringify(item + index)">
      <cb-col :span="7">
        <cb-form-item :label="label['target']" :prop="'routerConfig.' + index + '.destination'" :rules="FORM_RULES.staticRoutes.destination">
          <cb-input size="small" v-model="item.destination" type="text" :placeholder="$tt('global.placeInput')"></cb-input>
        </cb-form-item>
      </cb-col>
      <cb-col :span="7">
        <cb-form-item :label="label['next']" :prop="'routerConfig.' + index + '.nexthop'" :rules="FORM_RULES.staticRoutes.nextHop">
          <cb-input size="small" v-model="item.nexthop" type="text" :placeholder="$tt('global.placeInput')"></cb-input>
        </cb-form-item>
      </cb-col>
      <cb-col :span="2">
        <div class="btn-box">
          <cb-button type="text" icon="icon-jianshao"
                     @click="deleteTable(index, item)"></cb-button>
          <cb-button v-if="index == staticRoutesForm.length - 1" type="text" icon="icon-xinzeng" @click="addTable()" class="add-btn"></cb-button>
        </div>
      </cb-col>
    </cb-row>
    <!-- 静态路由表为空 -->
    <template v-if="!staticRoutesForm || !staticRoutesForm.length">
      <cb-row>
        <empty-box
          tab="static_routes"
          :nodeInfo="nodeInfo"
          @click="addTable()"
        ></empty-box>
      </cb-row>
    </template>
  </div>
</template>

<script>
import t from '../../../../../utils/i18n';
import {computed} from "@vue/composition-api";
import {FORM_RULES} from "../constant/form-rules";
import EmptyBox from "../empty-box/empty-box";

export default {
  name: "static-router-table",
  components: {
    EmptyBox,
  },
  props: {
    static_routes: {
      type: Array,
      default: () => [],
    },
    nodeInfo: {
      type: Object,
      default: () => {
      }
    },
  },
  setup(props, {emit}) {
    const $tt = t;
    const label = {
      target: `${$tt('target.targetSegment')} ：`,
      next: `${$tt('target.nextHop')} ：`,
    }
    let staticRoutesForm = computed({
      get: () => {
        return props.static_routes
      },
      set: (val) => {
        emit('update:static_routes', val);
        return val;
      }
    })
    const addTable = () => {
      let addData = {
        destination: null,
        nexthop: null,
      }
      staticRoutesForm.value.push(addData);
    }
    const deleteTable = (index) => {
      staticRoutesForm.value.splice(index, 1);
    }
    return {
      $tt,
      label,
      FORM_RULES,
      staticRoutesForm,
      addTable,
      deleteTable,
    }
  }
}
</script>
