<template>
  <div>Tic-Tac-Toe</div>
  <div v-if="!chosen">
    <div @click="choose('X')">X</div>
    <div @click="choose('O')">O</div>
  </div>
  <div v-else>
    <div>To Play: {{ game.player }}</div>
    <div>Status: {{ game.status }}</div>
    <div>Winner: {{ game.whoWon }}</div>
    <div class="ttt">
      <div
          v-for="cell in game.board.length"
          :key="cell" class="ttt-cell"
          @click="() => play(cell - 1)"
          :class="{'ttt-cell--disable': game.board[cell - 1] !== '' || game.status !== 'Playing'}"
      >
        {{ game.board[cell - 1] }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Game, Player} from "@/engine/Game";
import {bestMove} from "@/engine/helper";

@Options({})
export default class App extends Vue {
  game: Game = new Game();
  chosen = false;

  choose(player: Player) {
    this.chosen = true
    if (player === Player.O) {
      this.game.play(bestMove(this.game));
    }
  }

  play(at: number) {
    this.game.play(at);
    this.game.play(bestMove(this.game));
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  border: 0;
  vertical-align: baseline;
}

/*body {*/
/*  line-height: 1;*/
/*}*/
</style>

<style>
* {
  font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;;
}

.ttt {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 1px;
}

.ttt-cell {
  outline: 1px solid #212121;
  cursor: pointer;
  font-size: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ttt-cell--disable {
  pointer-events: none;
}
</style>
