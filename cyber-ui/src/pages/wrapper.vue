<template>
  <div class="cu-wrapper">
    <div class="cu-wrapper-code">
      <h1>{{ displayName }}</h1>
      {{ description }}
      <!-- <h2>代码演示</h2> -->
      <div class="cu-code-box">
        <component v-bind:is="docComponent" />
      </div>
    </div>
    <div class="cu-wrapper-code">
      <h2 v-if="props">属性</h2>
      <table class="cu-properties" v-if="props">
        <thead>
          <tr>
            <th>属性名</th>
            <th>描述</th>
            <th>类型</th>
            <th>默认值</th>
            <th>可选值</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prop in props" :key="prop.name">
            <td class="cu-name">{{ prop.name }}</td>
            <td class="cu-description">{{ prop.description }}</td>
            <td class="cu-type">{{ prop.type ? prop.type.name : '-' }}</td>
            <td class="cu-defaultValue">
              {{ prop.defaultValue ? prop.defaultValue.value : '' }}
            </td>
            <td class="cu-type">
              <span
                v-for="(item, index) in prop.values"
                :key="index"
                class="parameter-span"
              >
                {{ item }}</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--    事件-->
    <div class="cu-wrapper-code">
      <h2 v-if="events">事件</h2>
      <table class="cu-properties" v-if="events">
        <thead>
          <tr>
            <th>事件名称</th>
            <th>描述</th>
            <th>回调参数</th>
            <th>回调参数描述</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in events" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
            <td>
              <span v-show="item.properties">
                (<span
                  v-for="(proper, index) in item.properties"
                  v-show="item.properties.length > 0"
                  :key="index"
                >
                  {{ proper.name }}
                  <span v-if="index != item.properties.length - 1">,</span>
                </span>
                )
              </span>
              <span v-show="!item.properties">-</span>
            </td>
            <td class="parameter">
              <div
                v-for="(proper, index) in item.properties"
                v-show="item.properties.length > 0"
                :key="index"
              >
                <span class="parameter-span">{{ proper.name }}</span>
                ({{ proper.description }})
              </div>
              <span v-show="!item.properties">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 插槽-->
    <div class="cu-wrapper-code">
      <h2 v-if="slots">插槽</h2>
      <table class="cu-properties" v-if="slots">
        <thead>
          <tr>
            <th>name</th>
            <th>说明</th>
            <th>参数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in slots" :key="item.name">
            <td>{{ item.name }}</td>
            <td v-if="item.description">{{ item.description }}</td>
            <td v-if="!item.description">-</td>
            <td class="parameter" v-if="item.bindings">
              <div v-for="(a, index) in item.bindings" :key="index">
                <span class="parameter-span">{{ a.name }}</span>
                ({{ a.description }})
              </div>
            </td>
            <td v-if="!item.bindings">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import 'highlight.js/styles/github.css';

export default {
  name: 'wrapper',
  props: {
    docComponent: {
      type: String,
    },
    displayName: {
      type: String,
    },
    description: {
      type: String,
    },
    props: {
      type: Array,
    },
    events: {
      type: Array,
    },
    slots: {
      type: Array,
    },
    sort: {
      type: String,
    },
    classify: {
      type: String,
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
blockquote {
  color: var(--neutral8);
  background-color: var(--bg-color-3);
  border-left: 0.25em solid var(--primary-color);
  padding: 1em;
  border-radius: 4px;
  font-size: 14px;
}

.cu-wrapper {
  margin: 10px;
  &-code {
    padding: 10px;
    margin: 20px 0;
    background: var(--neutral0);
  }
  .cu-code-box {
    min-height: 64px;
    padding: 24px;
    box-sizing: border-box;
  }

  .cu-properties {
    width: 100%;
    border-collapse: collapse;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier,
      monospace;

    .parameter {
      display: flex;

      &-span {
        background-color: #969090;
        color: var(--neutral8);
        padding: 4px;
        border-radius: 4px;
      }
    }

    th {
      text-align: left;
      color: #5c6b77;
      background: rgba(0, 0, 0, 0.02);
    }

    td {
      font-size: 13px;
      font-weight: 500;
    }

    th,
    td {
      border-top: 1px solid var(--neutral0);
      border-left: 1px solid var(--neutral0);
      padding: 12px;
    }

    th:last-child,
    td:last-child {
      border-right: 1px solid var(--neutral0);
    }

    tr:last-child > td {
      border-bottom: 1px solid var(--neutral0);
    }

    td.cu-type {
      color: var(-red-color);
    }

    .cu-name {
      color: var(--neutral8);

      font-weight: 600;
    }
  }
}
</style>
<style lang="scss">
h1,
h2,
h3,
h4,
table,
p {
  color: var(--neutral8);
}
pre code {
  background: none;
  color: var(--neutral8);
}
</style>
