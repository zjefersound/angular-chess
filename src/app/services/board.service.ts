import { Injectable } from '@angular/core';
import { ChessField } from '../common/chess-field';
import { PieceMovement } from '../common/piece-movement';

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

  fillRow(row: ChessField[], piece: string) {
    return row.map((field) => {
      return {
        ...field,
        piece,
      };
    });
  }

  fillBoard(board: ChessField[][]) {
    const filledBoard: ChessField[][] = board.map((row, index) => {
      if (index == 0 + 1) return this.fillRow(row, 'B-P');
      else if (index == board.length - 1 - 1) return this.fillRow(row, 'W-P');
      else return row;
    });
    return filledBoard;
  }

  getMoves(
    board: ChessField[][],
    currentField: ChessField,
    currentPlayer: 'black' | 'white'
  ) {
    const pieceMovement = new PieceMovement(board, currentField, currentPlayer)
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
