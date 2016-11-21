'use strict'

var regex = /android/i
var navigator = require('global/window').navigator

module.exports = (function detectAndroid (userAgent) {
  return regex.test(userAgent)
})(navigator ? navigator.userAgent : '')
