import { TestBed } from '@angular/core/testing';
import { BoardService } from '../services/board.service';
import { ChessField } from './chess-field';
import { PieceMovement } from './piece-movement';

describe('PieceMovement', () => {
  let boardService: BoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    boardService = TestBed.inject(BoardService);
  });

  it('should create an instance', () => {
    const board: ChessField[][] = boardService.createBoard(8,8)
    const currentField: ChessField = { column: 0, row: 0, piece: null, hasBeenMoved: false };
    const currentPlayer: 'black' | 'white' = 'white';
    const dominatedFields = {
      black: [],
      white: [],
    }

    expect(new PieceMovement(board,currentField, currentPlayer, dominatedFields)).toBeTruthy();
  });
});
