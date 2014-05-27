'use strict';

var Chess = require('chess.js').Chess;

function Chessground(element, cfg) {

  cfg = cfg || {};

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
    }
  };

  // all mutable data goes in there
  var state = {
    chess: new Chess(cfg.fen),
    orientation: cfg.orientation || 'white',
    draggable: cfg.draggable || true
  };

  function drawSquares() {
    var html = '';
    for (var rank = 8; rank > 0; rank--) {
      for (var file = 1; file < 9; file++) {
        var key = state.orientation === 'white' ?
          (constants.files[file - 1] + rank) :
          (constants.files[8 - file] + (9 - rank));
        html += '<div data-key="' + key + '"></div>';
      }
    }
    element.innerHTML = html;
  }

  function drawPieces() {
    var html;
    Array.prototype.forEach.call(element.children, function(square) {
      var piece = state.chess.get(square.getAttribute('data-key'));
      if (piece) {
        var classes = ['piece', constants.types[piece.type], constants.colors[piece.color]].join(' ');
        html = '<div draggable="' + state.draggable + '" class="' + classes + '"></div>';
      } else {
        html = '';
      }
      square.innerHTML = html;
    });
  }

  function makeDraggable() {

    var handleDragStart = function(e) {
      this.style.opacity = '0.7';
      e.dataTransfer.setData('Text', this.getAttribute('data-key'));
    };

    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
      }

      e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.

      return false;
    }

    function handleDragEnter(e) {
      // this / e.target is the current hover target.
      this.classList.add('over');
    }

    function handleDragLeave(e) {
      this.classList.remove('over'); // this / e.target is previous target element.
    }

    function handleDrop(e) {
      // this / e.target is current target element.

      if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
      }

      // See the section on the DataTransfer object.

      return false;
    }

    function handleDragEnd(e) {
      // this/e.target is the source node.

      [].forEach.call(cols, function(col) {
        col.classList.remove('over');
      });
    }

    Array.prototype.forEach.call(element.querySelectorAll('.piece[draggable]'), function(piece) {
      piece.addEventListener('dragstart', handleDragStart, false);
      piece.addEventListener('dragenter', handleDragEnter, false);
      piece.addEventListener('dragover', handleDragOver, false);
      piece.addEventListener('dragleave', handleDragLeave, false);
      piece.addEventListener('drop', handleDrop, false);
      piece.addEventListener('dragend', handleDragEnd, false);
    });
  }

  function setFen(fen) {
    if (state.chess.load(fen)) {
      drawPieces();
      return true;
    }
    return false;
  }

  function setOrientation(color) {
    if (isValidColor(color)) state.orientation = color;
    drawSquares();
    drawPieces();
  }

  function toggleOrientation() {
    setOrientation(state.orientation === 'white' ? 'black' : 'white');
  }

  function clear() {
    state.chess.clear();
    drawPieces();
  }

  function isValidColor(color) {
    return color === 'white' || color === 'black';
  }

  drawSquares();
  drawPieces();
  makeDraggable();

  return {
    setFen: setFen,
    setOrientation: setOrientation,
    toggleOrientation: toggleOrientation,
    clear: clear
  };
}

module.exports = Chessground;
