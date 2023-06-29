'use strict';

(function () {
  window.ENTER_KEYCODE = 13;
  window.ESC_KEYCODE = 27;

  window.getRandomElement = function (array) {
    var i = Math.floor(Math.random() * array.length);
    return array[i];
  };
})();
