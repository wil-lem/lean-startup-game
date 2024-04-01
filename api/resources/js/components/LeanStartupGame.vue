<!-- resources/js/components/PixelCanvas.vue -->

<template>
  <div>
   <div class="header" ref="header">
      <h1>Lean agile startup game</h1>
    </div>
    <div id="wrapper" ref="wrapper">
      <div class='game-actions'>
        <game-actions v-if="gameUid" :inventory="inventory" @buyItems="updateInventory"/>
        <div class="join-actions" v-else>
          Join game <input type="text" v-model="gameUid" />
          <button @click="joinGame">Join</button>
          <button @click="newGame">New Game</button>
        </div>
      </div>
      <div class="game-info">
        <game-info :inventory="inventory" />
      </div>
    </div>
  </div>
 
</template>

<script>
import GameRound from '../classes/gameRound.js';
import GameActions from './GameActions.vue';
import GameInfo from './GameInfo.vue';
import '../../css/palette.css'

// import BlockSelect from './BlockSelect.vue';
// import PopupForm from './PopupForm.vue';
// import GeneralHeader from './pageElements/generalHeader.vue'
// import Vector from '../classes/VectorClass.js';

export default {
  components: { 
    GameActions, 
    GameInfo 
  },
//   components: {
//     GeneralHeader,

//     PopupForm,
//     BlockSelect,
//   },

  data() {
    return {
      round: null,
      gameUid: '13',
      gameData: {
        budget: 1000,
        
      },
      inventory: [],
    };
  },

  mounted() {
    // const round = ;
    // this.inventory.push(round);

    this.round = new GameRound();
    this.round.developFeature('A');
    this.round.developFeature('B');
    this.round.developFeature('C');
  },

  methods: {
    async joinGame() {
      const response = await this.$axios.post('/api/game/join', {
        gameUid: this.gameUid,
      });

    },

    async newGame() {
      const response = await this.$axios.post('/api/game/new');

      console.log(response.data);
    },

    updateInventory(items) {
      for(let i = 0; i < items.length; i++) {
        this.inventory.push(items[i].clone());
      }

      this.round = this.round.nextRound()
      this.round.parseInventory(items);


      // for(let i = 0; i < this.inventory.length; i++) {
      //   this.inventory[i].nextRound(this.round);
      // }

      for(let i = 0; i < this.inventory.length; i++) {
        this.inventory[i].computeValues(this.round);
      }

      // this.round++;

    }
  },
};
</script>

<style scoped>

#wrapper {
  position: fixed;
  height: calc(100% - 150px);
  width: 1200px;
  padding: 20px;
  top: 100px;
  left: 0px;
  display: flex;
  flex-wrap: nowrap;
  font-family: Arial, sans-serif;
}

.header {
  width: calc(100% - 60px);
  height: 100px;
  padding: 0px 10px;
  background: var(--extra-light-grey);
}

.game-actions {
  flex: 1 0 250px;
  margin-top: 20px;
  margin-right: 20px;
  margin-bottom: 40px;
  padding: 20px;
  background-color: var(--extra-light-grey);
}

.game-info {
  margin-top: 20px; 
  margin-bottom: 40px;
  background-color: var(--extra-light-grey);
  flex-grow: 1;
  margin-right: 40px;
  padding:20px;

  flex: 1 0 calc(100% - 300px);
  height: calc(100% - 60px);
}
</style>
