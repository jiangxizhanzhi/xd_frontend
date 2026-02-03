
<script>
export default {
  name: 'JsonUndefined',
  functional: true,
  props: {
    jsonValue: {
      type: Object,
      default: null,
    },
  },
  render(h, { props }) {
    return h('span', {
      class: {
        'cb-item': true,
        'cb-undefined': true,
      },
      domProps: {
        innerText: props.jsonValue === null ? 'null' : 'undefined',
      },
    });
  },
};
</script>
