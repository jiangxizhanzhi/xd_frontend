import { gettext } from '@/lang';
export const USB_FILE_LIST_COLUMNS = [
  {
    title: gettext('device.usbFileName'),
    prop: 'file_name',
    width: '300px',
  },
  {
    title: gettext('device.date'),
    prop: 'file_date',
    width: '200px',
  },
  {
    title: gettext('device.size'),
    prop: 'file_size',
  },
  {
    label: gettext('common.operation'),
    slot: 'operation',
  },
];
