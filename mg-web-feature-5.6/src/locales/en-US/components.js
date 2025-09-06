export default {
  empty: { noData: 'No Data' },
  sceneLoader: {
    event: {
      default: 'Default ',
      init: 'Initialization ',
      create: 'Create ',
      start: 'Start ',
      stop: 'Stop ',
      reboot: 'Restart ',
      pause: 'Suspended ',
      recover: 'Restore ',
      snapshot: 'Snapshot ',
      close: 'Shut Down ',
      modify: 'Modify ',
      recreate: 'Recreate ',
      suspend: 'Suspend ',
      resume: 'Resume ',
    },
    status: {
      init: 'Initialization',
      start: 'Start',
      ongoing: 'Ongoing',
      paused: 'Suspended',
      complete: 'Complete',
      failed: 'Failure',
    },
    notStart: 'Scene Not Started',
    closeSceneConfirm: 'Are you sure to shutdown the scene?',
  },
  searchInputBar: {
    default: 'Default',
    productBusinessName: 'Product/Vendor',
    placeHolder: 'Please enter the vulnerability name,ID,product,vendor,etc',

    search: 'Search',
    advancedSearch: 'Advanced Search',

    useType: 'Type',
    isRepair: 'Repair Status',
    allRepairStatus: 'All Repair Statuses',
    severityLevel: 'Severity Level',
    infoAttribute: 'Information Property',
    vulnSoftwareAccessory: 'Software Attachment',
    repaired: 'Repaired',
    unRepaired: 'Unrepaired',
    pleaseEnter: 'Please Enter\u0020',
    pleaseEnterRangeNum: 'Enter a number between 0 and 10',
    pleaseEnterAllNum:
      'Please enter the complete and correct CVSS3 score range in turn',
    vulnAnalysis: 'Vulnerability Analysis',
    pleaseEnterVulnDescKeywords:
      'Please enter the keyword of vulnerability description',
    all: 'All',
    have: 'Yes',
    none: 'No',
  },
  // 导入button
  fileLoad: {
    typeError: 'Type error, please reselect and upload again',
    sizeError: 'File size cannot exceed the limit ',
  },
};
