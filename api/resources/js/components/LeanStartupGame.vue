<!-- resources/js/components/PixelCanvas.vue -->

<template>
  <div>
   <div class="header" ref="header">
      <h1>Lean agile startup game</h1>
      <small>{{ playLocation }} edition</small>
    </div>
    <div id="wrapper" ref="wrapper">
      <div class='game-actions'>
        <game-actions v-if="gameUid && round && round.getNumber() < 9" 
          :inventory="inventory" 
          :budget="budget"
          :roundNumber="round.getNumber()"
          @buyItems="updateInventory"
          @addToInventory="addToInventory"
          />
        <div v-else-if="round && round.getNumber() >= 9">
          <h2>Game over</h2>
          <h3>Thanks for playing</h3>
            <strong>Final score: $ {{ round.getIncome().toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</strong>
          <ol>        
            <li>Wat was het effect van het ontwikkelen van optie A?</li>
            <li>Wat was het effect van het ontwikkelen van optie B?</li>
            <li>Wat was het effect van het ontwikkelen van optie C?</li>
            <li>Welk middel (talk to customer of dashboard) geeft een betrouwbaarder inzicht in de klantwens?</li>
            <li>En waarom is dit middel betrouwbaarder?</li>
          </ol>
        </div>
        <div class="join-actions" v-else>
          Join game <input type="text" v-model="gameUid" />
          <button @click="joinGame">Join</button>
          <button @click="newGame">New Game</button>
        </div>
      </div>
      <div class="seperator"></div>
      <div class="game-info" v-if="round">
        <game-info :inventory="inventory" :opinions="opionCards" :round="round" />
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
      budget: 3000,
      opinions: [8,5,3],
      inventory: [],
      opionCards: [],
      featuresMap: [],
      locations: {
        'ABC': 'Rotterdam',
        'ACB': 'New Yord',
        'BAC': 'Tokyo',
        'BCA': 'Berlin',
        'CAB': 'London',
        'CBA': 'Paris',
      },
      
    };
  },

  mounted() {
    // const round = ;
    // this.inventory.push(round);

    let features = ['A', 'B', 'C'];
    this.featuresMap = [];
    while(features.length > 0) {
      const randomIndex = Math.floor(Math.random() * features.length);
      const randomFeature = features.splice(randomIndex, 1)[0];
      this.featuresMap.push(randomFeature);
    }
    
    this.round = new GameRound(this.featuresMap);
    this.round.developFeature('A');
    this.round.developFeature('B');
    this.round.developFeature('C');

    let opionCards = [];
    for(let i = 0; i < this.opinions.length; i++) {
      for(let j = 0; j < this.opinions[i]; j++) {
        opionCards.push({ letter: this.featuresMap[i], opened: false });
      }
    }

    // let opionCards = Object.keys(this.opinions).flatMap(letter => {
    //   const count = this.opinions[letter];
    //   return Array.from({ length: count }, () => ({ letter, opened: false }));
    // });

    while(opionCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * opionCards.length);
      const randomCard = opionCards.splice(randomIndex, 1)[0];
      this.opionCards.push(randomCard);
    }

  },

  computed: {
    playLocation() {
      return this.locations[this.featuresMap.join('')];
    }
  },

  methods: {
    async joinGame() {
      const response = await this.$axios.post('/api/game/join', {
        gameUid: this.gameUid,
      });

    },

    async newGame() {
      const response = await this.$axios.post('/api/game/new');
    },

    addToInventory(item) {
      item.setBoughtInRound(this.round);
      this.inventory.push(item);
      this.round.parseInventory([item]);
      item.computeValues(this.round);
    },

    updateInventory(items) {
      for(let i = 0; i < items.length; i++) {
        const item = items[i].clone();
        item.setBoughtInRound(this.round);

        this.budget -= item.getPrice();

        if(item.isTalkItem()) {
          const closedItems = this.opionCards.filter(card => !card.opened);
          const openedCards = [];
          const maxOpenCards = Math.min(closedItems.length, 2);
          for (let i = 0; i < maxOpenCards; i++) {
            const randomIndex = Math.floor(Math.random() * closedItems.length);
            const randomCard = closedItems.splice(randomIndex, 1)[0];
            randomCard.opened = true;
            openedCards.push(randomCard);
          }

        }

        this.inventory.push(item);
      }

      this.round = this.round.nextRound()
      this.round.parseInventory(items);

      for(let i = 0; i < this.inventory.length; i++) {
        this.inventory[i].computeValues(this.round);
      }

      
    }
  },
};
</script>

<style scoped>

#wrapper {
  width: 100%;
  padding: 0px;
  display: flex;
  flex-wrap: nowrap;
  font-family: Arial, sans-serif;
}

.header {
  padding: 10px 10px;
  background: var(--extra-light-grey);
}

.game-actions {
  width: 250px;
  flex: 0 0 250px;
  margin-top: 20px;
  margin-bottom: 40px;
  padding: 20px;
  background-color: var(--extra-light-grey);
}

.game-info {
  margin-top: 20px; 
  margin-bottom: 40px;
  background-color: var(--extra-light-grey);
  flex-grow: 1;
  margin-left: 20px;
  padding: 20px;
}
</style>
