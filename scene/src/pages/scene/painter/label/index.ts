/**
 * 新增标签
 * @param id
 * @param x
 * @param y
 * @param text
 * @param width
 */
export const addLabelConfig = (
  id: string,
  x: number,
  y: number,
  text: string,
) => ({
  id,
  x,
  y,
  shape: 'text-block',
  text: text,
  width: 200,
  height: 20,
  attrs: {
    label: {
      contenteditable: true,
      style: {
        color: '#fff',
        fontSize: 14,
      },
    },
    body: {
      fill: '#32405c',
      stroke: '#32405c',
      rx: 4,
      ry: 4,
    },
  },
});
