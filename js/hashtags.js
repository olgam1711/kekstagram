'use strict';

(function () {
  window.validateHashtags = function (userInput) {
    if (userInput === '') {
      return '';
    }

    var arrayHashtags = userInput.toLowerCase().split(' ');

    if (arrayHashtags.length > 5) {
      return 'Вы не можете использовать больше 5 хэштегов';
    }

    for (var i = 0; i < arrayHashtags.length; i++) {
      var hashtag = arrayHashtags[i];

      if (hashtag[0] !== '#') {
        return 'Вы забыли поставить знак #';
      }

      if (hashtag === '#') {
        return ' Вы не ввели текст хэштэга';
      }

      var cutHashtag = hashtag.slice(1);

      if (cutHashtag.indexOf('#') !== -1) {
        return 'Вы забыли поставить пробел между хэштегами';
      }

      if (arrayHashtags.indexOf(hashtag) !== i) {
        return 'Вы уже использовали данный хэштег';
      }

      if (hashtag.length > 20) {
        return 'Длина хэштега должна быть не больше 20 символов, включая решётку';
      }
    }

    return '';
  };
})();
