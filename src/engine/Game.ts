export enum Player {
  X = 'X',
  O = 'O'
}

export enum Status {
  Playing = "Playing",
  Won = "Won",
  Draw = "Draw"
}

export interface GameOptions {
  board?: string[];
  player?: Player;
  pgn?: string;
}

export class Game {
  internalBoard!: string[];
  player!: Player;
  pgn!: string;
  whoWon: Player | undefined = undefined;
  status: Status;

  constructor({
                board = [
                  '', '', '',
                  '', '', '',
                  '', '', ''
                ],
                pgn = '',
                player = Player.X
              }: GameOptions = {}) {
    this.internalBoard = board;
    this.player = player;
    this.pgn = pgn;
    this.status = Status.Playing;
    this.validate();
  }

  get board() {
    return this.internalBoard;
  }

  play(pos: number, print = false): number {
    if (this.internalBoard[pos] !== '' || this.status !== Status.Playing) {
      return -1;
    }
    this.internalBoard[pos] = this.player;
    this.player = this.player === Player.X ? Player.O : Player.X;
    this.pgn += pos;
    this.validate();
    print && this.ascii();
    return pos;
  }

  possibleMoves(): { board: string[], pos?: number }[] {
    const possibleMoves: { board: string[], pos?: number }[] = [];
    if (this.status !== Status.Playing) {
      return possibleMoves;
    }
    for (let i = 0; i < this.internalBoard.length; i++) {
      const stateCopy = this.internalBoard.slice();
      if (stateCopy[i] === '') {
        stateCopy[i] = this.player;
        possibleMoves.push({board: stateCopy, pos: i});
      }
    }
    return possibleMoves;
  }

  get fen() {
    return this.internalBoard.map(c => c === '' ? '-' : c).join('');
  }

  get otherPlayer(): Player {
    return this.player === Player.X ? Player.O : Player.X;
  }

  ascii(game?: Game) {
    let formattedString = '';
    (game?.board || this.board).forEach((cell, index) => {
      formattedString += cell ? ` ${cell} |` : '   |';
      if ((index + 1) % 3 == 0) {
        formattedString = formattedString.slice(0, -1);
        if (index < 8) formattedString += '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
      }
    });
    console.log(formattedString);
  }

  validate(): { status: Status, whoWon?: Player } {
    if (this.status !== Status.Playing) {
      return {
        status: this.status,
        whoWon: this.status !== Status.Draw ? this.otherPlayer : undefined
      }
    }
    // [
    //   0 | 1 | 2
    //   ---------
    //   3 | 4 | 5
    //   ---------
    //   6 | 7 | 8
    // ]
    if (
      //Horizontal
      (this.internalBoard[0] === this.internalBoard[1] && this.internalBoard[0] === this.internalBoard[2] && this.internalBoard[0] !== '')
      || (this.internalBoard[3] === this.internalBoard[4] && this.internalBoard[4] === this.internalBoard[5] && this.internalBoard[3] !== '')
      || (this.internalBoard[6] === this.internalBoard[7] && this.internalBoard[6] === this.internalBoard[8] && this.internalBoard[6] !== '')
      //Vertical
      || (this.internalBoard[0] === this.internalBoard[3] && this.internalBoard[0] === this.internalBoard[6] && this.internalBoard[0] !== '')
      || (this.internalBoard[1] === this.internalBoard[4] && this.internalBoard[1] === this.internalBoard[7] && this.internalBoard[1] !== '')
      || (this.internalBoard[2] === this.internalBoard[5] && this.internalBoard[2] === this.internalBoard[8] && this.internalBoard[2] !== '')
      //Diagonal
      || (this.internalBoard[0] === this.internalBoard[4] && this.internalBoard[0] === this.internalBoard[8] && this.internalBoard[0] !== '')
      || (this.internalBoard[2] === this.internalBoard[4] && this.internalBoard[2] === this.internalBoard[6] && this.internalBoard[2] !== '')
    ) {
      this.status = Status.Won;
      this.whoWon = this.otherPlayer;
    } else if (this.internalBoard.some(cell => cell === '')) {
      this.status = Status.Playing;
    } else {
      this.status = Status.Draw;
    }
    return {
      status: this.status,
      whoWon: this.whoWon
    }
  }
}

window.Game = Game;
