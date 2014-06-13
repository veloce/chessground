'use strict';

function movePiece(state, piece, destSquare, isDragging) {
  var destPiece = destSquare.querySelector('.piece');
  piece.parentNode.classList.remove('selected');
  piece.parentNode.removeChild(piece);

  if (destPiece && destPiece !== piece) {
    destSquare.removeChild(destPiece);
  }

  var newPiece = document.createElement('div');
  newPiece.className = isDragging ? piece.className.replace('dragging', '') : piece.className;
  destSquare.appendChild(newPiece);

  if (isDragging) destSquare.classList.remove('drag-over');
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
      state.selected = null;
    }
  }
}

module.exports = {
  selectSquare: selectSquare,
  movePiece: movePiece
};
