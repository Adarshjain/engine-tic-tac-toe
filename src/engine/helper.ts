import {Status, Game} from "@/engine/Game";


export function bestMove(topGame: Game): number {
  let count = 0;
  const memoize: Record<string, number> = {}
  function minMax(game: Game, isMaximizing = true, depth = 0): number {
    if(memoize.hasOwnProperty(game.fen)) {
      return memoize[game.fen];
    }
    count++;
    if (game.status !== Status.Playing) {
      if (game.status === Status.Draw)
        return 0
      return game.whoWon === topGame.player && !isMaximizing ? 10 - depth : depth - 10;
    }
    let bestSoFar = isMaximizing ? -Infinity : Infinity;
    let bestPos = -1;
    for (const {board, pos} of game.possibleMoves()) {
      const value = minMax(
        new Game({board, player: game.otherPlayer, pgn: game.pgn + pos}),
        !isMaximizing,
        depth + 1
      );
      if (isMaximizing) {
        if (value > bestSoFar) {
          bestSoFar = value;
          bestPos = pos as number;
        }
      } else {
        if (value < bestSoFar) {
          bestSoFar = value;
          bestPos = pos as number;
        }
      }
    }
    if(depth === 0) {
      console.log(count)
      return bestPos
    }
    memoize[game.fen] = bestSoFar;
    return bestSoFar;
  }
  return minMax(topGame);
}

window.bestMove = bestMove;


//Ai plays X - No alpha beta pruning
// 549946
// 7332
// 198
// 14
// 2
//Memoized - No alpha beta pruning
// 7382
// 825
// 95
// 14
// 2


//Ai plays O - No alpha beta pruning
// 59705
// 935
// 47
// 5
//Memoized - No alpha beta pruning
// 2458
// 253
// 35
// 5
