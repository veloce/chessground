'use strict';

var Chess = require('chess.js').Chess;
var _ = require('lodash');
var constants = require('./constants');
var render = require('./render');
var ctrl = require('./ctrl');
var drag = require('./drag');

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

  // all mutable data goes in there
  // use the fen config to create a chess object,
  // then drop the fen. The chess object will provide it.
  var state = _.omit(_.merge(defaults, cfg), 'fen');
  state.chess = new Chess();
  state.selected = null;
  if (cfg && cfg.fen) state.chess.load(cfg.fen); else state.chess.reset();

  function bindEvents() {
    // touchstart, mousedown
    var squares = element.querySelectorAll('div.square');

    function selectHandler(e) {
      e.preventDefault();
      ctrl.selectSquare(state, getSquare(e.target));
    }

    for (var i=0 ; i < squares.length ; i++) {
      squares[i].addEventListener('touchstart', selectHandler);
      squares[i].addEventListener('mousedown', selectHandler);
    }
  }

  function getSquare(el) {
    if (el.classList.contains('piece')) {
      return el.parentNode;
    }
    return el;
  }

  function setFen(fen) {
    if (state.chess.load(fen)) {
      render.drawPieces();
      return true;
    }
    return false;
  }

  function getFen() {
    return state.chess.fen();
  }

  function setOrientation(color) {
    if (isValidColor(color)) state.orientation = color;
    render.drawSquares();
    render.drawPieces();
  }

  function getOrientation() {
    return state.orientation;
  }

  function setDraggable(value) {
    if (['both', 'white', 'black', null].contains(value)) {
      state.draggable.enabled = value;
      drag.makeDraggable();
    }
  }

  function toggleOrientation() {
    setOrientation(state.orientation === 'white' ? 'black' : 'white');
  }

  function clear() {
    state.chess.clear();
    render.drawPieces();
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

  render.drawSquares(element, state);
  render.drawPieces(element, state);
  drag.makeDraggable(state);
  bindEvents();

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
