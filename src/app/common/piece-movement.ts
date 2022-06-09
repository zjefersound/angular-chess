import { EColor } from '../models/app-enums.model';
import Utils from '../utils/Utils';
import { ChessField } from './chess-field';
export class PieceMovement {
  private board: ChessField[][];
  private currentField: ChessField;
  private currentPlayer: 'black' | 'white';

  constructor(
    board: ChessField[][],
    currentField: ChessField,
    currentPlayer: 'black' | 'white'
  ) {
    this.board = board;
    this.currentField = currentField;
    this.currentPlayer = currentPlayer;
  }

  setBoard(board: ChessField[][]) {
    this.board = board;
  }

  private clearFieldsWithObstacles(move: number[], piece: string) {
    const row = move[0];
    const column = move[1];
    const hasPiecesAround = !(
      piece?.split('-')[0] === this.board[row][column]?.piece?.split('-')[0]
    );
    const isAllowedToMove =
      (this.currentPlayer == 'white' && piece?.split('-')[0] == 'W') ||
      (this.currentPlayer == 'black' && piece?.split('-')[0] == 'B');
    return hasPiecesAround && isAllowedToMove;
  }

  static movePiece(
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

  pawn(field: ChessField, getOnlyCaptureFields?: boolean) {
    const { column, row, piece, hasBeenMoved } = field;

    const defaultMoves = [
      [row - 1, column - 1],
      [row - 1, column],
      [row - 2, column],
      [row - 1, column + 1],
      [row + 1, column - 1],
      [row + 1, column],
      [row + 2, column],
      [row + 1, column + 1],
    ];
    const clearInvalidFields = (move: number[]) => {
      const tempRow = move[0];
      const tempColumn = move[1];
      const whitePlays = this.currentPlayer === 'white';
      const isFirstMove = !hasBeenMoved;
      const sameColumn = tempColumn === column;
      const hasPiece = this.board?.[tempRow]?.[tempColumn]?.piece;
      const hasPieceInTheSameColumn = hasPiece && sameColumn;

      //hasn't moved a piece or can only jump one
      const hasPieceInBetween =
        this.board?.[row + (whitePlays ? -1 : 1)]?.[tempColumn]?.piece &&
        sameColumn;
      const canOnlyJumpOne = tempRow > row - 2 && tempRow < row + 2;
      const allowJumpTwo =
        (isFirstMove && !hasPieceInBetween) || canOnlyJumpOne;
      const isMovingForward = whitePlays ? tempRow < row : tempRow > row;
      const isRowInBoard = tempRow >= 0 && tempRow <= this.board.length - 1;

      if (getOnlyCaptureFields) {
        const isRowValid = isRowInBoard && isMovingForward && canOnlyJumpOne;
        const isColumnInBoard = tempColumn >= 0 && tempColumn <= this.board[0].length - 1;
        const isColumnValid = !sameColumn && isColumnInBoard;
        return isRowValid && isColumnValid && !!piece;
      } else {
        const isRowValid =
          !hasPieceInTheSameColumn &&
          isRowInBoard &&
          isMovingForward &&
          allowJumpTwo;
        const isColumnValid = hasPiece || sameColumn;
        return isRowValid && isColumnValid && !!piece;
      }
    };

    const validMoves = defaultMoves
      .filter(clearInvalidFields)
      .filter((move) => this.clearFieldsWithObstacles(move, piece as string));
    return validMoves;
  }

  king(field: ChessField) {
    const { column, row, piece, hasBeenMoved } = field;

    const defaultMoves = [
      [row - 1, column - 1],
      [row - 1, column],
      [row - 1, column + 1],
      [row, column - 2],
      [row, column - 1],
      [row, column + 1],
      [row, column + 2],
      [row + 1, column - 1],
      [row + 1, column],
      [row + 1, column + 1],
    ];
    const clearInvalidFields = (move: number[]) => {
      const tempRow = move[0];
      const tempColumn = move[1];
      const isRowValid = tempRow >= 0 && tempRow <= this.board.length - 1;
      const isColumnValid =
        tempColumn >= 0 && tempColumn <= this.board[0].length - 1;
      return isRowValid && isColumnValid && piece;
    };

    const firstRook = this.board[row]?.[0];
    const secondRook = this.board[row]?.[this.board[0].length - 1];

    const filterCastleMoves = (move: number[]) => {
      const isFirstMove = !hasBeenMoved;
      const tempColumn = move[1];
      const isFirstCastleAllowed =
        (isFirstMove && firstRook?.piece && !firstRook?.hasBeenMoved) ||
        tempColumn > column - 2;
      const isSecondCastleAllowed =
        (isFirstMove && secondRook?.piece && !secondRook?.hasBeenMoved) ||
        tempColumn < column + 2;
      const isCastleAllowed = isFirstCastleAllowed && isSecondCastleAllowed;
      return isCastleAllowed;
    };

    const validMoves = defaultMoves
      .filter(clearInvalidFields)
      .filter(filterCastleMoves)
      .filter((move) => this.clearFieldsWithObstacles(move, piece as string));
    return validMoves;
  }
  rook(field: ChessField) {
    const { column, row, piece } = field;

    const defaultMoves = Utils.getStraightMoves(this.board, row, column);

    const clearInvalidFields = (move: number[]) => {
      const row = move[0];
      const column = move[1];
      const isRowValid = row >= 0 && row <= this.board.length - 1;
      const isColumnValid = column >= 0 && column <= this.board[0].length - 1;
      return isRowValid && isColumnValid && piece;
    };

    const validMoves = defaultMoves
      .filter(clearInvalidFields)
      .filter((move) => this.clearFieldsWithObstacles(move, piece as string));

    return validMoves;
  }

  bishop(field: ChessField) {
    const { column, row, piece } = field;

    const defaultMoves = Utils.getDiagonalMoves(this.board, row, column);

    const clearInvalidFields = (move: number[]) => {
      const row = move[0];
      const column = move[1];
      const isRowValid = row >= 0 && row <= this.board.length - 1;
      const isColumnValid = column >= 0 && column <= this.board[0].length - 1;
      return isRowValid && isColumnValid && piece;
    };

    const validMoves = defaultMoves
      .filter(clearInvalidFields)
      .filter((move) => this.clearFieldsWithObstacles(move, piece as string));

    return validMoves;
  }

  queen(field: ChessField) {
    const { column, row, piece } = field;

    const defaultMoves = [
      ...Utils.getStraightMoves(this.board, row, column),
      ...Utils.getDiagonalMoves(this.board, row, column),
    ];

    const clearInvalidFields = (move: number[]) => {
      const row = move[0];
      const column = move[1];
      const isRowValid = row >= 0 && row <= this.board.length - 1;
      const isColumnValid = column >= 0 && column <= this.board[0].length - 1;
      return isRowValid && isColumnValid && piece;
    };

    const validMoves = defaultMoves
      .filter(clearInvalidFields)
      .filter((move) => this.clearFieldsWithObstacles(move, piece as string));

    return validMoves;
  }

  knight(field: ChessField) {
    const { column, row, piece } = field;

    const defaultMoves = [
      [row - 2, column - 1],
      [row - 2, column + 1],
      [row + 2, column - 1],
      [row + 2, column + 1],
      [row - 1, column - 2],
      [row + 1, column - 2],
      [row - 1, column + 2],
      [row + 1, column + 2],
    ];

    const clearInvalidFields = (move: number[]) => {
      const row = move[0];
      const column = move[1];
      const isRowValid = row >= 0 && row <= this.board.length - 1;
      const isColumnValid = column >= 0 && column <= this.board[0].length - 1;
      return isRowValid && isColumnValid && piece;
    };

    const validMoves = defaultMoves
      .filter(clearInvalidFields)
      .filter((move) => this.clearFieldsWithObstacles(move, piece as string));

    return validMoves;
  }

  getMovesByPiece(field: ChessField, getOnlyCaptureFields?: boolean) {
    const pieceType = field.piece?.split('-')[1];
    switch (pieceType) {
      case 'P':
        return this.pawn(field, getOnlyCaptureFields);
      case 'K':
        return this.king(field);
      case 'R':
        return this.rook(field);
      case 'B':
        return this.bishop(field);
      case 'Q':
        return this.queen(field);
      case 'N':
        return this.knight(field);

      default:
        return this.pawn(field);
    }
  }
  getMoves() {
    return this.getMovesByPiece(this.currentField);
  }

  getDominatedFieldsByCurrentPlayer() {
    const pieces = this.board
      .reduce((allFields, row) => [...allFields, ...row], [])
      .filter((field) => {
        const pieceColor = field.piece?.split('-')[0];
        return pieceColor === EColor[this.currentPlayer];
      });

    const fieldsDominatedByCurrentPlayer = pieces.reduce(
      (allPositions, field) => {
        const moves = this.getMovesByPiece(field, true);

        const positionsToAdd = moves.filter((move) => {
          return !allPositions
            .map((move) => move.join(','))
            .includes(move.join(','));
        });
        return [...allPositions, ...positionsToAdd];
      },
      [] as number[][]
    );

    return fieldsDominatedByCurrentPlayer;
  }

  moveTo(targetField: ChessField) {
    let updatedBoard = PieceMovement.movePiece(
      this.board,
      this.currentField,
      targetField
    );

    const pieceType = this.currentField.piece?.split('-')[1];
    if (pieceType === 'K') {
      const columnFrom = this.currentField.column;
      const columnTo = targetField.column;

      if (columnTo - columnFrom == 2) {
        const rook =
          this.board[this.currentField.row]?.[this.board[0].length - 1];
        const rookTargetField = { ...targetField, column: columnFrom + 1 };
        updatedBoard = PieceMovement.movePiece(
          updatedBoard,
          rook,
          rookTargetField
        );
      } else if (columnTo - columnFrom == -2) {
        const rook = this.board[this.currentField.row]?.[0];
        const rookTargetField = { ...targetField, column: columnFrom - 1 };
        updatedBoard = PieceMovement.movePiece(
          updatedBoard,
          rook,
          rookTargetField
        );
      }
    }
    return updatedBoard;
  }
}
