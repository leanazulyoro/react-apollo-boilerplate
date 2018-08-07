const DeviceDetectHelper = require('../client/helpers/DeviceDetectHelper');

module.exports = function (css) {

  if(!DeviceDetectHelper.currentDevice) {
    DeviceDetectHelper.setDeviceFromUserAgent(window.navigator.userAgent);
  }
  return DeviceDetectHelper.currentDevice === 'desktop' ? css : false;
};
