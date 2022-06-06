import { ChessField } from '../common/chess-field';

export default class Utils {
  static getStraightMoves(
    board: ChessField[][],
    currentField: ChessField,
    row: number,
    column: number,
    previousMoves?: number[][]
  ): number[][] {
    let moves: number[][] = previousMoves || [];

    function getFieldUtilHasPiece(
      tempRow: number,
      tempColumn: number,
      tempMoves: number[][]
    ) {
      const newMoves = [...tempMoves, [tempRow, tempColumn]];
      const updatedMoves = [
        ...newMoves,
        ...(board?.[tempRow]?.[tempColumn].piece !== null
          ? []
          : Utils.getStraightMoves(
              board,
              currentField,
              tempRow,
              tempColumn,
              newMoves
            )),
      ];
      return updatedMoves;
    }
    const mappedPreviousMoves =
      previousMoves?.map((move) => move[0] + ',' + move[1]) || [];

    if (
      currentField.column === column &&
      !mappedPreviousMoves.includes(row - 1 + ',' + column) &&
      board?.[row - 1]?.[column]
    )
      moves = getFieldUtilHasPiece(row - 1, column, moves);
    if (
      currentField.column === column &&
      !mappedPreviousMoves.includes(row + 1 + ',' + column) &&
      board?.[row + 1]?.[column]
    )
      moves = getFieldUtilHasPiece(row + 1, column, moves);
    if (
      currentField.row === row &&
      !mappedPreviousMoves.includes(row + ',' + (column - 1)) &&
      board?.[row]?.[column - 1]
    )
      moves = getFieldUtilHasPiece(row, column - 1, moves);
    if (
      currentField.row === row &&
      !mappedPreviousMoves.includes(row + ',' + (column + 1)) &&
      board?.[row]?.[column + 1]
    )
      moves = getFieldUtilHasPiece(row, column + 1, moves);

    return moves;
  }

  static getDiagonalMoves(
    board: ChessField[][],
    currentRow: number,
    currentColumn: number
  ): number[][] {
    let moves: number[][] = [];

    function getDiagonal(
      rowDirection: 'top' | 'bottom',
      columnDirection: 'left' | 'right',
      board: ChessField[][],
      row: number,
      column: number
    ) {
      const field = board[row]?.[column];
      if (!field) return;

      const isCurrentField = row === currentRow && column === currentColumn
      if(!isCurrentField) moves = [...moves, [row, column]];

      const hasPiece = Boolean(field.piece);
      if (!isCurrentField && hasPiece) return;

      const nextRow = row + (rowDirection === 'top' ? -1 : 1);
      const nextColumn = column + (columnDirection === 'left' ? -1 : 1);

      getDiagonal(rowDirection, columnDirection, board, nextRow, nextColumn);
    }

    getDiagonal('top', 'left', board, currentRow, currentColumn);
    getDiagonal('top', 'right', board, currentRow, currentColumn);
    getDiagonal('bottom', 'left', board, currentRow, currentColumn);
    getDiagonal('bottom', 'right', board, currentRow, currentColumn);

    console.log('diag moves', moves);

    return moves;
  }
}
