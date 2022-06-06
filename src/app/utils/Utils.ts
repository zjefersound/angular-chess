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
    row: number,
    column: number,
    previousMoves?: number[][],
    prevRow?: number,
    prevColumn?: number
  ): number[][] {
    let moves: number[][] = previousMoves || [];
    const mappedPreviousMoves =
      previousMoves?.map((move) => move[0] + ',' + move[1]) || [];
    console.log('mappedPreviousMoves', mappedPreviousMoves);

    function getFieldUtilHasPiece(
      tempRow: number,
      tempColumn: number,
      tempMoves: number[][],
      tempPrevRow: number,
      tempPrevColumn: number
    ) {
      const isAddedToPreviousMoves = mappedPreviousMoves.includes(
        tempRow + ',' + tempColumn
      );
      if (isAddedToPreviousMoves) return tempMoves;
      const newMoves = [...tempMoves, [tempRow, tempColumn]];
      const updatedMoves = [
        ...newMoves,
        ...(board?.[tempRow]?.[tempColumn].piece !== null
          ? []
          : Utils.getDiagonalMoves(
              board,
              tempRow,
              tempColumn,
              newMoves,
              tempPrevRow,
              tempPrevColumn
            )),
      ];
      return updatedMoves;
    }

    function getDiagonalByDirection(addToRow: number, addToColumn: number) {
      const rowAdded = row + Number(addToRow);
      const rowSubtracted = row + Number(addToRow * -1);
      const columnAdded = column + Number(addToColumn);
      const columnSubtracted = column + Number(addToColumn * -1);

      const goingToRightDirection =
        (!prevRow || prevRow === rowSubtracted) &&
        (!prevColumn || prevColumn === columnSubtracted);

      if (!goingToRightDirection) return;

      const isAddedToPreviousMoves = mappedPreviousMoves.includes(
        rowAdded + ',' + columnAdded
      );
      if(isAddedToPreviousMoves) return;

      const doesNextFieldExist = Boolean(board?.[rowAdded]?.[columnAdded]);
      if(!doesNextFieldExist) return;
      console.log('*==========================================');
      console.log('*Debug for: ' + row + ',' + column);
      console.log('*Came from: ' + prevRow + ',' + prevColumn);
      console.log('*rowAdded', rowAdded);
      console.log('*columnAdded', columnAdded);
      console.log('*isTopLeftDiagonal', goingToRightDirection);
      console.log('*isAddedToPreviousMoves', isAddedToPreviousMoves);
      console.log('*doesNextFieldExist', doesNextFieldExist);

      moves = getFieldUtilHasPiece(rowAdded, columnAdded, moves, row, column);
    }
    getDiagonalByDirection(-1, -1); //goes to top left
    getDiagonalByDirection(-1, 1); //goes to top right
    getDiagonalByDirection(1, -1); //goes to bottom left
    getDiagonalByDirection(1, 1); //goes to bottom right
    console.log('diag moves', moves);

    return moves;
  }
}
