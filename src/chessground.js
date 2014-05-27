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
    orientation: cfg.orientation || 'white'
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
    Array.prototype.forEach.call(element.children, function(square) {
      var piece = state.chess.get(square.getAttribute('data-key'));
      var html = piece ? '<div class="piece ' + constants.types[piece.type] + ' ' + constants.colors[piece.color] + '"></div>' : '';
      square.innerHTML = html;
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

  return {
    setFen: setFen,
    setOrientation: setOrientation,
    toggleOrientation: toggleOrientation,
    clear: clear
  };
}

module.exports = Chessground;
