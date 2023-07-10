import { createApp } from 'vue'
import App from './App.vue'
import {Game} from "@/engine/Game";

createApp(App).mount('#app')

declare global {
  interface Window {
    bestMove: (game: Game) => number
    Game: typeof Game
  }
}
