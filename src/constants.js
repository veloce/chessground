'use strict';

var _ = require('lodash');

module.exports = {
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
