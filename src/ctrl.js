'use strict';

function movePiece(state, piece, destSquare, isDragging) {
  var destPiece = destSquare.querySelector('.piece');
  var origSquare = piece.parentNode;

  if (destPiece && destPiece !== piece) {
    destSquare.removeChild(destPiece);
  }

  origSquare.removeChild(piece);
  var newPiece = document.createElement('div');
  newPiece.className = isDragging ? piece.className.replace('dragging', '') : piece.className;
  destSquare.appendChild(newPiece);

  if (isDragging) destSquare.classList.remove('drag-over');

  if (origSquare !== destSquare) {
    origSquare.classList.remove('selected');
    state.selected = null;
  } else {
    state.selected = newPiece;
  }
}

function selectSquare(state, square) {
  var pieceInSquare = square.querySelector('.piece');
  var selectedPiece = state.selected;
  // there is a piece and no other selected
  if (pieceInSquare && !selectedPiece) {
    square.classList.add('selected');
    state.selected = pieceInSquare;
  }
  // there is a piece selected
  else if (selectedPiece) {
    if (square !== selectedPiece.parentNode) {
      movePiece(state, selectedPiece, square);
    }
  }
}

module.exports = {
  selectSquare: selectSquare,
  movePiece: movePiece
};
