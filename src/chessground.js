(function() {
  'use strict';

  function Chessground(element, cfg) {
    // constructor
    console.log(element);

    var drawSquares = function() {
      var html = '';
      var files = 'abcdefgh';
      for (var rank = 8; rank > 0; rank--) {
        for (var file = 1; file < 9; file++) {
          var key = files[file - 1] + rank;
          html += '<div data-key="' + key + '"></div>';
        }
      }
      element.innerHTML = html;
    };
    drawSquares();
  }

  window.Chessground = Chessground;

})();
