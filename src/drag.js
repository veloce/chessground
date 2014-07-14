'use strict';

var interact = require('./vendor/interact');
var ctrl = require('./ctrl');

var draggingDiv;
var draggingDivPos = {};

document.addEventListener("DOMContentLoaded", function() {
  draggingDiv = document.createElement('div');
  draggingDiv.className = "moving-square";
  document.body.appendChild(draggingDiv);
}, false);

function isHidden(el) {
  return (el.offsetParent === null);
}

function getScrollXY () {
  return {
    x: window.scrollX || document.documentElement.scrollLeft,
    y: window.scrollY || document.documentElement.scrollTop
  };
}

function getElementRect (element) {
  var scroll = /ipad|iphone|ipod/i.test(window.navigator.userAgent)
  ? { x: 0, y: 0 }
  : getScrollXY(),
  clientRect = (element instanceof window.SVGElement)?
  element.getBoundingClientRect():
  element.getClientRects()[0];

  return clientRect && {
    left  : clientRect.left   + scroll.x,
    right : clientRect.right  + scroll.x,
    top   : clientRect.top    + scroll.y,
    bottom: clientRect.bottom + scroll.y,
    width : clientRect.width || clientRect.right - clientRect.left,
    height: clientRect.heigh || clientRect.bottom - clientRect.top
  };
}

function makeDraggable(root, state) {
  var transformProp = 'transform' in document.body.style?
  'transform': 'webkitTransform' in document.body.style?
  'webkitTransform': 'mozTransform' in document.body.style?
  'mozTransform': 'oTransform' in document.body.style?
  'oTransform': 'msTransform';

  interact('.square').dropzone(true)
  .on('dragenter', function (event) {
    var el = event.target;
    var rect = getElementRect(el);
    var h = rect.height - 1;
    var w = rect.width - 1;
    var h2 = h * 2;
    var w2 = w * 2;

    // first enter
    if (isHidden(draggingDiv)) {
      console.log('first enter');
      draggingDiv.style.height = h2 + 'px';
      draggingDiv.style.width = w2 + 'px';
      draggingDiv.style.left = rect.left - (w / 2);
      draggingDiv.style.top = rect.top - (h / 2);

      draggingDivPos = rect;

      draggingDiv.style.display = 'block';

    }

    var dx = rect.left - draggingDivPos.left;
    var dy = rect.top - draggingDivPos.top;

    draggingDiv.style[transformProp] = draggingDiv.style.transform =
    'translate3d(' + dx + 'px, ' + dy + 'px, 0)';

  })
  .on('drop', function (event) {
    draggingDiv.style.display = 'none';
    var piece = event.relatedTarget;
    var square = event.target;
    ctrl.movePiece(root, state, piece, square, true);

  });

  interact('.piece').draggable({
    onmove: function (event) {
      var target = event.target;
      target.classList.add('dragging');

      target.x = (target.x|0) + event.dx;
      target.y = (target.y|0) + event.dy;

      target.style[transformProp] = target.style.transform =
      'translate3d(' + target.x + 'px, ' + target.y + 'px, 0)';
    }
  });
}

module.exports = {
  makeDraggable: makeDraggable
};
