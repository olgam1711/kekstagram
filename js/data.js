'use strict';

(function () {
  var similarListElement = document.querySelector('.pictures');
  var similarPhotoTemplate = document.querySelector('#picture')
    .content;

  var renderPhotos = function (photo) {
    var photoElement = similarPhotoTemplate.cloneNode(true);

    photoElement.querySelector('.picture__img').src = photo.url;
    photoElement.querySelector('.picture__likes').textContent = photo.likes;
    photoElement.querySelector('.picture__comments').textContent = photo.comments;

    var picImg = photoElement.querySelector('.picture__img');

    picImg.addEventListener('load', function () {
      loadPhotos += 1;
      if (totalPhotos === loadPhotos) {
        activateFilter();
      }
    });

    photoElement.querySelector('.picture__img').addEventListener('click', function () {
      window.fullsize(photo);
    });

    return photoElement;
  };

  var totalPhotos = 0;
  var loadPhotos = 0;

  var picFilter = document.querySelector('.img-filters');

  var activateFilter = function () {
    picFilter.classList.remove('img-filters--inactive');
  };

  var renderSuccess = function (photos) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < photos.length; i++) {
      var photoElement = renderPhotos(photos[i]);

      fragment.appendChild(photoElement);

      totalPhotos += 1;
    }

    var photosRemoved = similarListElement.querySelectorAll('.picture');

    for (i = 0; i < photosRemoved.length; i++) {
      similarListElement.removeChild(photosRemoved[i]);
    }

    similarListElement.appendChild(fragment);
  };

  var renderError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 10; margin: 0 auto; text-align: center; color: black; background-color: yellow;';
    node.style.position = 'absolute';
    node.style.left = '0';
    node.style.right = '0';
    node.style.fontSize = '28px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.load(renderSuccess, renderError);

  var popular = picFilter.querySelector('#filter-popular');
  var news = picFilter.querySelector('#filter-new');
  var discussed = picFilter.querySelector('#filter-discussed');

  popular.addEventListener('click',
      window.debounce(function () {
        window.load(renderSuccess, renderError);
      }));

  news.addEventListener('click',
      window.debounce(function () {
        window.load(function (photos) {
          var compareRandom = function () {
            return Math.random() - 0.5;
          };

          photos.sort(compareRandom);

          var removed = photos.splice(0, 10);

          renderSuccess(removed);
        }, renderError);
      }));

  discussed.addEventListener('click',
      window.debounce(function () {
        window.load(function (photos) {

          photos.sort(function (first, second) {
            if (first.comments.length > second.comments.length) {
              return 1;
            } else if (first.comments.length < second.comments.length) {
              return -1;
            } else {
              return 0;
            }
          });

          renderSuccess(photos);

        }, renderError);
      }));
})();
