/**
 * 设置节点连接桩的坐标
 * @param portList 连接桩列表
 * @param size 单个连接桩直径
 * @returns
 */
const setPortArgs = (portList: Array<any>, size: number) => {
  const portNumber: number = portList.length, // 端口数量
    half: number = Math.ceil(portNumber / 2); // 端口数量一半, 用于双排展示连接桩
  let items: Array<any> = [];
  // 连接桩总数长度不大于节点宽度
  if (size * (portNumber - 1) <= 60) {
    if (portNumber === 1) {
      items.push({
        id: portList[0].id,
        group: 'bottom',
        args: {
          x: 30,
          y: 60,
        },
        connected: portList[0].connected ? portList[0].connected : false,
        name: portList[0].name,
      });
    } else {
      items = portList.map((port, i) => ({
        id: port.id,
        group: 'bottom',
        args: {
          x: i * (60 / (portNumber - 1)),
          y: 60,
        },
        connected: portList[i].connected ? portList[i].connected : false,
        name: portList[i].name,
      }));
    }
  } else {
    for (let i = 0; i < portNumber; i++) {
      if (i < half) {
        items.push({
          id: portList[i].id,
          group: 'bottom',
          args: {
            x: i * size - ((half - 1) * size - 60) / 2, // (half - 1) * size 半数连接桩总长度
            y: 60,
          },
          connected: portList[i].connected ? portList[i].connected : false,
          name: portList[i].name,
        });
      } else {
        items.push({
          id: portList[i].id,
          group: 'bottom',
          args: {
            x: (i - half) * size - ((half - 1) * size - 60) / 2,
            y: 60 + size,
          },
          connected: portList[i].connected ? portList[i].connected : false,
          name: portList[i].name,
        });
      }
    }
  }
  return items;
};

export { setPortArgs };
