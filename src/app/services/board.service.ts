import { Injectable } from '@angular/core';
import { ChessField } from '../common/chess-field';
import { PieceMovement } from '../common/piece-movement';
import { Color, Piece } from '../models/app-enums.model';
@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor() {}

  createBoard(rows: number, columns: number) {
    return Array(rows)
      .fill(0)
      .map((_, row) => {
        return Array(columns)
          .fill(0)
          .map((_, column) => {
            return {
              row,
              column,
              hasBeenMoved: false,
              piece: null,
            };
          });
      });
  }

  fillPieces(row: ChessField[], color: 'white' | 'black') {
    const pieces = [
      Piece.Rook,
      Piece.Knight,
      Piece.Bishop,
      Piece.Queen,
      Piece.King,
      Piece.Bishop,
      Piece.Knight,
      Piece.Rook,
    ];
    return row.map((field, index) => {
      return {
        ...field,
        piece: Color[color] + '-' + pieces[index],
      };
    });
  }

  fillPawns(row: ChessField[], color: 'black' | 'white') {
    const piece = Color[color] + '-' + Piece.Pawn;
    return row.map((field) => {
      return {
        ...field,
        piece,
      };
    });
  }

  fillBoard(board: ChessField[][]) {
    const filledBoard: ChessField[][] = board.map((row, index) => {
      if (index == 0) return this.fillPieces(row, 'black');
      if (index == 0 + 1) return this.fillPawns(row, 'black');
      else if (index == board.length - 1) return this.fillPieces(row, 'white');
      else if (index == board.length - 1 - 1)
        return this.fillPawns(row, 'white');
      else return row;
    });
    return filledBoard;
  }

  getMoves(
    board: ChessField[][],
    currentField: ChessField,
    currentPlayer: 'black' | 'white'
  ) {
    const pieceMovement = new PieceMovement(board, currentField, currentPlayer);
    const moves = pieceMovement.pawn();

    return moves;
  }

  movePiece(
    board: ChessField[][],
    currentField: ChessField,
    targetField: ChessField
  ) {
    const updatedBoard = board;

    updatedBoard[currentField.row][currentField.column] = {
      ...currentField,
      piece: null,
      hasBeenMoved: false,
    };
    updatedBoard[targetField.row][targetField.column] = {
      ...targetField,
      piece: currentField.piece,
      hasBeenMoved: true,
    };
    return updatedBoard;
  }
}
