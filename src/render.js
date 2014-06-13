'use strict';

var _ = require('lodash');
var constants = require('./constants');

function drawSquares(element, state) {
  element.innerHTML = _.flatten(_.map(_.range(8, 0, -1), function(rank) {
    return _.map(_.range(1, 9), function(file) {
      var key = state.orientation === 'white' ?
        (constants.files[file - 1] + rank) :
        (constants.files[8 - file] + (9 - rank));
      var xpos = (file - 1) * 12.5;
      var ypos = (rank - 1) * 12.5;
      var style = (state.orientation === 'white') ?
        'left:' + xpos + '%; bottom:' + ypos + '%;' :
        'right:' + xpos + '%; top:' + ypos + '%;' ;

      return '<div class="square" style="' + style + '" data-key="' + key + '"></div>';
    });
  })).join('');
}

function drawPieces(element, state) {
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

module.exports = { drawSquares: drawSquares, drawPieces: drawPieces };
