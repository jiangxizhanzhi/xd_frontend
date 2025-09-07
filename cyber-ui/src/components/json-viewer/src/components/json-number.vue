
<script>
export default {
  name: 'JsonNumber',
  functional: true,
  props: {
    jsonValue: {
      type: Number,
      required: true,
    },
  },
  render(h, { props }) {
    const isInteger = Number.isInteger(props.jsonValue);

    return h('span', {
      class: {
        'cb-item': true,
        'cb-number': true,
        'cb-number-integer': isInteger,
        'cb-number-float': !isInteger,
      },
      domProps: {
        innerText: props.jsonValue.toString(),
      },
    });
  },
};
</script>
