import { ChessField } from "../common/chess-field";

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
          : Utils.getStraightMoves(board, currentField, tempRow, tempColumn, newMoves)),
      ];
      return updatedMoves;
    }
    const mappedPreviousMoves =
      previousMoves?.map((move) => move[0] + ',' + move[1]) || [];

    if (currentField.column === column && !mappedPreviousMoves.includes((row - 1) + ',' + column) && board?.[row - 1]?.[column]) moves = getFieldUtilHasPiece(row - 1, column, moves);
    if (currentField.column === column && !mappedPreviousMoves.includes((row + 1) + ',' + column) && board?.[row + 1]?.[column]) moves = getFieldUtilHasPiece(row + 1, column, moves);
    if (currentField.row === row &&!mappedPreviousMoves.includes(row+ ',' + (column - 1)) && board?.[row]?.[column-1]) moves = getFieldUtilHasPiece(row, column-1, moves);
    if (currentField.row === row && !mappedPreviousMoves.includes(row+ ',' + (column + 1)) && board?.[row]?.[column+1]) moves = getFieldUtilHasPiece(row, column+1, moves);

    return moves;
  }

  static getDiagonalMoves(
    board: ChessField[][],
    currentField: ChessField,
    row: number,
    column: number,
    previousMoves?: number[][],
    prevRow?: number,
    prevColumn?: number,
  ): number[][] {
    let moves: number[][] = previousMoves || [];

    function getFieldUtilHasPiece(
      tempRow: number,
      tempColumn: number,
      tempMoves: number[][],
      tempPrevRow: number,
      tempPrevColumn: number
    ) {
      const newMoves = [...tempMoves, [tempRow, tempColumn]];
      const updatedMoves = [
        ...newMoves,
        ...(board?.[tempRow]?.[tempColumn].piece !== null
          ? []
          : Utils.getDiagonalMoves(board, currentField, tempRow, tempColumn, newMoves, tempPrevRow, tempPrevColumn)),
      ];
      return updatedMoves;
    }
    const mappedPreviousMoves =
      previousMoves?.map((move) => move[0] + ',' + move[1]) || [];

    const isTopLeftDiagonal = (!prevRow|| prevRow === row+1) && (!prevColumn || prevColumn === column+1)
    if (isTopLeftDiagonal && !mappedPreviousMoves.includes((row - 1) + ',' + (column-1)) && board?.[row - 1]?.[column-1]) moves = getFieldUtilHasPiece(row - 1, column-1, moves, row, column);
    const isTopRightDiagonal = (!prevRow|| prevRow === row-1) && (!prevColumn || prevColumn === column+1)
    if (isTopRightDiagonal && !mappedPreviousMoves.includes((row - 1) + ',' + (column-1)) && board?.[row + 1]?.[column-1]) moves = getFieldUtilHasPiece(row + 1, column-1, moves, row, column);

    const isBottomRightDiagonal = (!prevRow|| prevRow === row-1) && (!prevColumn || prevColumn === column-1)
    if (isBottomRightDiagonal && !mappedPreviousMoves.includes((row + 1) + ',' + (column+1)) && board?.[row + 1]?.[column+1]) moves = getFieldUtilHasPiece(row + 1, column+1, moves, row, column);

    const isBottomLeftDiagonal = (!prevRow|| prevRow === row+1) && (!prevColumn || prevColumn === column-1)
    if (isBottomLeftDiagonal && !mappedPreviousMoves.includes((row - 1) + ',' + (column+1)) && board?.[row - 1]?.[column+1]) moves = getFieldUtilHasPiece(row - 1, column+1, moves, row, column);

    return moves;
  }
}
