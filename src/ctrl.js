'use strict';

function movePiece(root, state, piece, destSquare, isDragging) {
  var destPiece = destSquare.querySelector('.piece');
  var origSquare = piece.parentNode;

  if (destPiece && destPiece !== piece) {
    destSquare.removeChild(destPiece);
  }

  if (isDragging) destSquare.classList.remove('drag-over');

  origSquare.removeChild(piece);
  var newPiece = document.createElement('div');
  newPiece.className = isDragging ? piece.className.replace('dragging', '') : piece.className;
  destSquare.appendChild(newPiece);

  var anyMoved = root.querySelectorAll('.moved');
  for (var i=0; i < anyMoved.length; i++) {
    anyMoved[i].classList.remove('moved');
  }
  origSquare.classList.add('moved');
  destSquare.classList.add('moved');

  if (origSquare !== destSquare) {
    origSquare.classList.remove('selected');
    state.selected = null;
  } else {
    state.selected = newPiece;
  }
}

function selectSquare(root, state, square) {
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
      movePiece(root, state, selectedPiece, square);
    }
  }
}

module.exports = {
  selectSquare: selectSquare,
  movePiece: movePiece
};
