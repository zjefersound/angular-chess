import { Injectable } from '@angular/core';
import { ChessField } from '../common/chess-field';

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
      if (index == 0) return this.fillRow(row, 'B-P');
      else if (index == board.length - 1) return this.fillRow(row, 'W-P');
      else return row;
    });
    return filledBoard;
  }

  getMoves(
    board: ChessField[][],
    currentField: ChessField,
    currentPlayer: 'black' | 'white'
  ) {
    const column = currentField.column;
    const row = currentField.row;
    const moves = [
      [row - 1, column - 1],
      [row - 1, column],
      [row - 1, column + 1],
      [row, column - 1],
      [row, column + 1],
      [row + 1, column - 1],
      [row + 1, column],
      [row + 1, column + 1],
    ];

    const validMoves = moves
      .filter((move) => {
        const row = move[0];
        const column = move[1];
        const isRowValid = row >= 0 && row <= board.length - 1;
        const isColumnValid = column >= 0 && column <= board[0].length - 1;
        const hasPiece = !!currentField?.piece;
        return isRowValid && isColumnValid && hasPiece;
      })
      .filter((move) => {
        const row = move[0];
        const column = move[1];
        const piece = currentField?.piece;
        const hasPiecesAround = !(piece === board[row][column]?.piece);
        const isAllowedToMove =
          (currentPlayer == 'white' && piece?.split('-')[0] == 'W') ||
          (currentPlayer == 'black' && piece?.split('-')[0] == 'B');
        return hasPiecesAround && isAllowedToMove;
      });

    return validMoves;
  }

  movePiece(board: ChessField[][], currentField: ChessField, targetField: ChessField) {
    const updatedBoard = board;

    updatedBoard[currentField.row][currentField.column] = {
      ...currentField,
      piece: null,
    };
    updatedBoard[targetField.row][targetField.column] = {
      ...targetField,
      piece: currentField.piece,
    };
    return updatedBoard;
  }
}
