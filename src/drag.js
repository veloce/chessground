'use strict';

var interact = require('./vendor/interact');
var ctrl = require('./ctrl');

function makeDraggable(state) {
  var transformProp = 'transform' in document.body.style?
  'transform': 'webkitTransform' in document.body.style?
  'webkitTransform': 'mozTransform' in document.body.style?
  'mozTransform': 'oTransform' in document.body.style?
  'oTransform': 'msTransform';

  interact('.square').dropzone(true)
  .on('dragenter', function (event) {
    var dropzoneElement = event.target;
    dropzoneElement.classList.add('drag-over');
  })
  .on('dragleave', function (event) {
    event.target.classList.remove('drag-over');
    event.target.classList.remove('selected');
  })
  .on('drop', function (event) {
    var piece = event.relatedTarget;
    var square = event.target;
    ctrl.movePiece(state, piece, square, true);
    state.selected = null;
  });

  interact('.piece').draggable({
    onmove: function (event) {
      var target = event.target;
      target.classList.add('dragging');

      target.x = (target.x|0) + event.dx;
      target.y = (target.y|0) + event.dy;

      target.style[transformProp] = target.style.transform =
      'translate(' + target.x + 'px, ' + target.y + 'px)';
    }
  });
}

module.exports = {
  makeDraggable: makeDraggable
};
