(function() {
  'use strict';

  function Chessground(element, cfg) {
    // constructor
    var files = 'abcdefgh';

    var drawSquares = function() {
      var html = '';
      for (var rank = 8; rank > 0; rank--) {
        for (var file = 1; file < 9; file++) {
          var key = files[file - 1] + rank;
          html += '<div data-key="' + key + '"></div>';
        }
      }
      element.innerHTML = html;
    };

    var drawPieces = function(chess) {
      Array.prototype.forEach.call(element.children, function(square) {
        var piece = chess.get(square.getAttribute('data-key'));
        var html = piece ? '<div class="piece ' + piece.type + ' ' + piece.color + '"></div>' : '';
        square.innerHTML = html;
      });
    };

    drawSquares();
    var fen = 'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3';
    var chess = new Chess(fen);
    drawPieces(chess);
  }

  window.Chessground = Chessground;

})();
