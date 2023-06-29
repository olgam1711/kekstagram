'use strict';

(function () {
  var uploadFile = document.querySelector('#upload-file');
  var editFile = document.querySelector('.img-upload__overlay');
  var closeEdition = document.querySelector('#upload-cancel');

  var closeWindow = function () {
    editFile.classList.add('hidden');
    document.removeEventListener('keydown', EscPressHandler);
  };

  var EscPressHandler = function (evt) {
    if (evt.keyCode === window.ESC_KEYCODE && !commentInput.matches(':focus') && !userHashtag.matches(':focus')) {
      closeWindow();
    }
  };

  var openWindow = function () {
    editFile.classList.remove('hidden');
    document.addEventListener('keydown', EscPressHandler);
  };

  uploadFile.addEventListener('change', function () {
    openWindow();
  });

  closeEdition.addEventListener('click', function () {
    closeWindow();
  });

  closeEdition.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.ENTER_KEYCODE) {
      closeWindow();
    }
  });

  var sliderPin = document.querySelector('.effect-level__pin');
  var sliderLine = document.querySelector('.effect-level__line');
  var sliderValue = document.querySelector('.effect-level__value');

  var uploadPreview = document.querySelector('.img-upload__preview');
  var effectsFieldset = document.querySelector('.effects');
  var effectLevel = document.querySelector('.effect-level');
  var colorDepth = document.querySelector('.effect-level__depth');

  effectsFieldset.addEventListener('change', function () {
    resetSlider();

    getEffect();
  });

  var getEffect = function () {
    var currentFilter = effectsFieldset.querySelector('input:checked');

    if (currentFilter.value === 'chrome') {
      uploadPreview.style.filter = 'grayscale(' + sliderValue.value / 100 + ')';
    }

    if (currentFilter.value === 'sepia') {
      uploadPreview.style.filter = 'sepia(' + sliderValue.value / 100 + ')';
    }

    if (currentFilter.value === 'marvin') {
      uploadPreview.style.filter = 'invert(' + sliderValue.value + ')';
    }

    if (currentFilter.value === 'phobos') {
      if (sliderValue.value === 0) {
        uploadPreview.style.filter = 'blur(0)';
      }

      if (sliderValue.value > 0 && sliderValue.value <= 33.33) {
        uploadPreview.style.filter = 'blur(1px)';
      }

      if (sliderValue.value > 33.33 && sliderValue.value <= 66.66) {
        uploadPreview.style.filter = 'blur(2px)';
      }

      if (sliderValue.value > 66.66 && sliderValue.value <= 100) {
        uploadPreview.style.filter = 'blur(3px)';
      }
    }

    if (currentFilter.value === 'heat') {
      if (sliderValue.value === 0) {
        uploadPreview.style.filter = 'brightness(1)';
      }

      if (sliderValue.value > 0 && sliderValue.value <= 50) {
        uploadPreview.style.filter = 'brightness(2)';
      }

      if (sliderValue.value > 50 && sliderValue.value <= 100) {
        uploadPreview.style.filter = 'brightness(3)';
      }
    }

    if (currentFilter.value === 'none') {
      uploadPreview.style.filter = '';
      effectLevel.classList.add('hidden');
    } else {
      effectLevel.classList.remove('hidden');
    }

  };

  var resetSlider = function () {
    sliderPin.style.left = '100%';
    colorDepth.style.width = '100%';
    sliderValue.value = '100';
  };

  var commentInput = document.querySelector('.text__description');

  commentInput.addEventListener('invalid', function () {
    if (commentInput.validity.tooLong) {
      commentInput.setCustomValidity('Длина комментария не должна превышать 140 символов');
    }
  });

  sliderPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX
      };

      startCoords = {
        x: moveEvt.clientX
      };

      var sliderParam = sliderPin.getBoundingClientRect();
      var sliderParent = sliderLine.getBoundingClientRect();
      var sliderLeft = sliderParam.left - sliderParent.left;
      var value = Math.round(sliderLeft * 100 / sliderParent.width);

      if (value >= 0 && value <= 100) {
        sliderValue.value = value;
        colorDepth.style.width = value + '%';
        sliderPin.style.left = (sliderPin.offsetLeft - shift.x) + 'px';
      }

      getEffect();
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      var sliderParam = sliderPin.getBoundingClientRect();
      var sliderParent = sliderLine.getBoundingClientRect();
      var sliderLeft = sliderParam.left - sliderParent.left;
      var value = Math.round(sliderLeft * 100 / sliderParent.width);

      if (value >= 0 && value <= 100) {
        sliderValue.value = value;
        colorDepth.style.width = sliderValue.value + '%';
      }

      getEffect();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  var form = document.querySelector('.img-upload__form');
  var userHashtag = form.querySelector('.text__hashtags');

  userHashtag.addEventListener('input', function () {
    var hashtagError = window.validateHashtags(userHashtag.value);
    userHashtag.setCustomValidity(hashtagError);
  });

  form.addEventListener('submit', function (formEvt) {
    formEvt.preventDefault();

    window.sendForm(new FormData(form), function () {
      resetForm();
      closeWindow();
      openSuccess();

    }, errorHandler);
  });

  var errorHandler = function () {
    resetForm();
    closeWindow();
    openError();
  };

  var resetForm = function () {
    resetSlider();
    document.querySelector('#effect-heat').checked = true;
    userHashtag.value = '';
    commentInput.value = '';
  };

  var openSuccess = function () {
    var successTemplate = document.querySelector('#success')
      .content;

    var successPopup = successTemplate.cloneNode(true).firstElementChild;
    var main = document.querySelector('main');

    main.appendChild(successPopup);

    var successButton = document.querySelector('.success__button');

    var closeSuccess = function () {
      main.removeChild(successPopup);
      successButton.removeEventListener('click', closeSuccess);
      document.removeEventListener('keydown', EscSuccessHandler);
    };

    successButton.addEventListener('click', closeSuccess);

    var EscSuccessHandler = function (evt) {
      if (evt.keyCode === window.ESC_KEYCODE) {
        closeSuccess();
      }
    };

    document.addEventListener('keydown', EscSuccessHandler);

    successPopup.addEventListener('click', function (evt) {
      if (evt.target === successPopup) {
        closeSuccess();
      }
    });
  };

  var openError = function () {
    var errorTemplate = document.querySelector('#error')
      .content;

    var errorPopup = errorTemplate.cloneNode(true).firstElementChild;
    var main = document.querySelector('main');

    main.appendChild(errorPopup);

    var closeError = function () {
      main.removeChild(errorPopup);
      document.removeEventListener('keydown', EscErrorHandler);
    };

    var EscErrorHandler = function (evt) {
      if (evt.keyCode === window.ESC_KEYCODE) {
        closeError();
      }
    };

    document.addEventListener('keydown', EscErrorHandler);

    errorPopup.addEventListener('click', function (evt) {
      if (evt.target === errorPopup || evt.target.matches('.error__button')) {
        closeError();
      }
    });
  };
})();
