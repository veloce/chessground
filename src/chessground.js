'use strict';

var Chess = require('chess.js').Chess;

function Chessground(element, cfg) {
  var chessground = {};

  cfg = cfg || {};
  var files = 'abcdefgh';
  var types = {p: 'pawn', r: 'rook', b: 'bishop', n: 'knight', q: 'queen', k: 'king'};
  var colors = {w: 'white', b: 'black'};
  var startFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  var chess = new Chess(cfg.fen || startFEN);

  function drawSquares() {
    var html = '';
    for (var rank = 8; rank > 0; rank--) {
      for (var file = 1; file < 9; file++) {
        var key = files[file - 1] + rank;
        html += '<div data-key="' + key + '"></div>';
      }
    }
    element.innerHTML = html;
  }

  function drawPieces(chess) {
    Array.prototype.forEach.call(element.children, function(square) {
      var piece = chess.get(square.getAttribute('data-key'));
      var html = piece ? '<div class="piece ' + types[piece.type] + ' ' + colors[piece.color] + '"></div>' : '';
      square.innerHTML = html;
    });
  }

  function position(fen) {
    if (chess.load(fen)) {
      drawPieces(chess);
      return true;
    }
    return false;
  }

  drawSquares();
  drawPieces(chess);

  // public members
  chessground.position = position;

  return chessground;
}

module.exports = Chessground;
