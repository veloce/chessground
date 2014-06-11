'use strict';

var Chess = require('chess.js').Chess;
var _ = require('lodash');
var interact = window.interact;

function Chessground(element, cfg) {

  var defaults = {
    orientation: 'white',
    draggable: {
      enabled: 'both', // 'white' | 'black' | 'both' | false
      events: {
        start: function( /* e, piece, pos */ ) {
          return true; // return false to prevent the drag from happening
        }
      }
    }
  };

  var constants = {
    files: 'abcdefgh',
    types: {
      p: 'pawn',
      r: 'rook',
      b: 'bishop',
      n: 'knight',
      q: 'queen',
      k: 'king'
    },
    colors: {
      w: 'white',
      b: 'black'
    },
    squares: _.flatten(_.map(_.range(1, 8), function(rank) {
      return _.map('abcdefgh', function(file) {
        return '' + rank + file;
      });
    }))
  };

  // all mutable data goes in there
  // use the fen config to create a chess object,
  // then drop the fen. The chess object will provide it.
  var state = _.omit(_.merge(defaults, cfg), 'fen');
  state.chess = new Chess();
  if (cfg && cfg.fen) state.chess.load(cfg.fen); else state.chess.reset();

  function drawSquares() {
    element.innerHTML = _.flatten(_.map(_.range(8, 0, -1), function(rank) {
      return _.map(_.range(1, 9), function(file) {
        var key = state.orientation === 'white' ?
          (constants.files[file - 1] + rank) :
          (constants.files[8 - file] + (9 - rank));
        var xpos = (file - 1) * 12.5;
        var ypos = (rank - 1) * 12.5;
        var style = (getOrientation() === 'white') ?
          'left:' + xpos + '%; bottom:' + ypos + '%;' :
          'right:' + xpos + '%; top:' + ypos + '%;' ;

        return '<div class="square" style="' + style + '" data-key="' + key + '"></div>';
      });
    })).join('');
  }

  function drawPieces() {
    var html;
    _.forEach(element.children, function($square) {
      var piece = state.chess.get($square.getAttribute('data-key'));
      if (piece) {
        var classes = ['piece', constants.types[piece.type], constants.colors[piece.color]].join(' ');
        html = '<div class="' + classes + '"></div>';
      } else {
        html = '';
      }
      $square.innerHTML = html;
    });
  }

  function makeDraggable() {
    var // x and y to keep the position that's been dragged to
    x = 0,
    y = 0,
    // vendor prefixes (prefices?)
    transformProp = 'transform' in document.body.style?
    'transform': 'webkitTransform' in document.body.style?
    'webkitTransform': 'mozTransform' in document.body.style?
    'mozTransform': 'oTransform' in document.body.style?
    'oTransform': 'msTransform';

    interact('.square').dropzone(true)
    .on('dragenter', function (event) {
      var draggableElement = event.relatedTarget,
      dropzoneElement = event.target;

      dropzoneElement.classList.add('drag-over');
    })
    .on('dragleave', function (event) {
      event.target.classList.remove('drag-over');
    })
    .on('drop', function (event) {
      var piece = event.relatedTarget;
      piece.removeAttribute('style');
      piece.classList.remove('can-drop');
      event.target.appendChild(piece);
    });

    interact('.piece').draggable({
      onmove: function (event) {
        var target = event.target;

        target.x = (target.x|0) + event.dx;
        target.y = (target.y|0) + event.dy;

        target.style[transformProp] = target.style.transform =
        'translate(' + target.x + 'px, ' + target.y + 'px)';
      }
    });

  }

  function setFen(fen) {
    if (state.chess.load(fen)) {
      drawPieces();
      return true;
    }
    return false;
  }

  function getFen() {
    return state.chess.fen();
  }

  function setOrientation(color) {
    if (isValidColor(color)) state.orientation = color;
    drawSquares();
    drawPieces();
  }

  function getOrientation() {
    return state.orientation;
  }

  function setDraggable(value) {
    if (['both', 'white', 'black', null].contains(value)) {
      state.draggable.enabled = value;
      makeDraggable();
    }
  }

  function toggleOrientation() {
    setOrientation(state.orientation === 'white' ? 'black' : 'white');
  }

  function clear() {
    state.chess.clear();
    drawPieces();
  }

  // [{type: 'p', color: 'w', square: 'a2'}, ...]
  function getPieces() {
    return _.compact(_.map(constants.squares, function(s) {
      var piece = state.chess.get(s);
      if (piece) {
        piece.square = s;
        return piece;
      }
    }));
  }

  function isValidColor(color) {
    return color === 'white' || color === 'black';
  }

  drawSquares();
  drawPieces();
  makeDraggable();

  return {
    setFen: setFen,
    getFen: getFen,
    getPieces: getPieces,
    setOrientation: setOrientation,
    getOrientation: getOrientation,
    toggleOrientation: toggleOrientation,
    setDraggable: setDraggable,
    clear: clear
  };
}

module.exports = Chessground;
