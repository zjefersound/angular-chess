import { TestBed } from '@angular/core/testing';
import { ChessField } from '../common/chess-field';

import { BoardService } from './board.service';

describe('BoardService', () => {
  let service: BoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a board', () => {
    expect(service.createBoard(4, 4)).toBeInstanceOf(Array);
  });

  it('should fill a board', () => {
    const board = service.createBoard(4, 4);
    const firstField: ChessField = { column: 0, row: 0, piece: 'B-P', hasBeenMoved: false }
    expect(service.fillBoard(board)).toContain(
      jasmine.arrayContaining([
        firstField,
      ] as ChessField[])
    );
  });
});
