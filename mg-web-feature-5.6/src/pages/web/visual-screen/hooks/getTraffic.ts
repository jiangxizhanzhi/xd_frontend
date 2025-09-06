import dayjs from 'dayjs';
import { redBlueTraffic } from '@/api/screen-center';
import _ from 'lodash';
export function getTrafficBaseNew(lineDataInfo, preNow, sourceId, url) {
  let now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const query = {
    per_page: 100,
    page: 1,
    sceneId: sourceId,
    start_time: preNow,
    end_time: now,
  };
  let format = 'HH:mm';
  redBlueTraffic(url, query)
    .then((res) => {
      const list = _.cloneDeep(res.data.data.list);
      const eventlineDataBackup = list.map((item) => {
        return item.total_bytes;
      });
      lineDataInfo.lineData = [eventlineDataBackup];
      lineDataInfo.lineXData = list.map((item) => {
        return dayjs(item.timestamp).format(format);
      });
    })
    .catch((res) => {
      // console.log('error==============');
    });
}

export function getTrafficEvent(lineDataInfo, preNow, sourceId, url) {
  let now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  let nowXline = dayjs().format('HH');
  const query = {
    per_page: 100,
    page: 1,
    sceneId: sourceId,
    start_time: preNow,
    end_time: now,
  };

  redBlueTraffic(url, query)
    .then((res) => {
      const list = _.cloneDeep(res.data.data.list);
      lineDataInfo.attackxData.push(nowXline + ':00');
      lineDataInfo.attacklineData[0].push(list.length);
    })
    .catch((res) => {
      // console.log('error=attack=============');
    });
}
