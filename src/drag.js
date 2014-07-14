'use strict';

var interact = require('./vendor/interact');
var ctrl = require('./ctrl');

function makeDraggable(root, state) {
  var transformProp = 'transform' in document.body.style?
  'transform': 'webkitTransform' in document.body.style?
  'webkitTransform': 'mozTransform' in document.body.style?
  'mozTransform': 'oTransform' in document.body.style?
  'oTransform': 'msTransform';

  interact('.square').dropzone(true)
  .on('drop', function (event) {
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
