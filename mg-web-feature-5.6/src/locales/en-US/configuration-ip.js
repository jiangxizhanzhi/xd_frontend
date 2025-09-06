export default {
  configuration: {
    configurationIp: 'Configuration IP',
    beforeClearResource: 'Clear Started Resources：',
    clearStartedResource: 'Clear Started Resources',
    clearTip:
      'Tip: Perform this operation with caution. This operation will delete all started scenarios, scenario data, and started mirrors! It takes about 5-10 minutes to clear. Please wait patiently',
    webIpAddress: 'Web Address：',
    currentWebIpAddress: 'IP Address Of Current Web Port：',
    currentWebIpAddressPlz:
      'Enter the new IP address of Web port. No input content is not modified by default',
    webIpAddressTip: 'Tip: Access the address of the platform via the Web',
    maskCode: 'Mask：',
    currentMaskCode: 'Current Mask：',
    currentMaskCodePlz:
      'Enter the new mask. No input content is not modified by default',
    gateway: 'Gateway：',
    currentGateway: 'Current Gateway：',
    currentGatewayPlz:
      'Enter the new gateway. No input content is not modified by default',
    networkRange: 'Address Pool Range：',
    currentNetworkRange: 'Current Network Segment Address Pool Range：',
    currentNetworkRangePlz:
      'Enter the new network segment address pool range. No input content is not modified by default',
    networkRangeTip:
      'Tip: The address pool is the range of IP addresses used to start VMS. The input style is as follows: 10.4.1.100-10.4.1.200 Do not include the IP address of the server',
    nodeWebIp: 'Compute Node Address：',
    currentNodeWebIp: 'IP Address Of Current Compute Node Web Port：',
    currentNodeWebIpPlz:
      'Enter the new IP address of compute node Web port. No input content is not modified by default',
    nodeWebIpTip:
      'Tip: The system automatically obtains the IP addresses of all the current compute nodes. Ensure that the communication between the compute node and the Web port is normal',
    modelIp: 'Component IP：',
    currentModelIp: 'Current Component IP：',
    currentModelIpPlz:
      'Enter the new component IP. No input content is not modified by default',
    modelIpTip:
      'Tip: Set the IP address of the Web port to the same network segment',

    webPortIpError: 'The IP address of the Web port is incorrect',
    maskError: 'The entered mask is incorrect',
    gatewayError: 'The entered gateway is incorrect',
    nodeWebIpError: 'The IP address of the compute node Web port is incorrect',
    modelIpError: 'The component IP address is incorrect',
    rangeAddressError: 'The network segment address pool is incorrect',
    noGetMaskError: 'No mask obtained',
    noSameNetwork: 'Not in the same network segment',
    clearConfirm:
      'The system will clear the started scene instances, scene data, and all started images. Are you sure to confirm the operation?',
    nodeErrorConfirm:
      'The current computing node service is abnormal. It is recommended to restore the running status of the computing node and try again, or contact the operation and maintenance engineer to recover. If you continue to modify the system configuration, it may cause computing nodes with abnormal service status to be unable to modify their IP addresses.',
    stillContinue: 'Still Continue',
    saveConfirm:
      'The system will save the configured IP address. Are you sure?',
    deployAwait:
      'The system is in the process of configuration. Wait for the configuration to complete. After restarting, access the following address to log in',
    noChange: 'No changes have been made, please make changes and save',
  },
};
