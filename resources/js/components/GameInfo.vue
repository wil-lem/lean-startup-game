<template>
  <div>
    
    <div class="container" v-if="dashboards.length > 0">  
      <div class="charts-container info-card" v-for="dashboard in dashboards" :key="dashboard.id">

        
        <!-- Render each dashboard component -->
        <dashboard :dashboard="dashboard" />
      </div>
    </div>
    
    <div class="container">
      <div class="info-card">
        <h2>User feedback:</h2>
        <div class="opinion-cards">
          <div class="opinion-card" v-for="(card, key) in opinions" :key="key" :class="{ closed: !card.opened }">
            <div v-if="card.opened">{{ card.letter }}</div> 
            <div v-else>?</div>   
          </div>
        </div>
      </div>
      <div class="info-card">
        <h2>History</h2>
        <div class="history-container">
          <div class="history-item" v-for="item in history" :key="item.id">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import Dashboard from './Dashboard.vue'; // Import the Dashboard component
import ActionItem from '../classes/actionItem';
import GameRound from '../classes/gameRound.js';

export default {
  name: 'GameInfo',
  props: {
    inventory: {
      type: Array,
      default: () => []
    },
    opinions: {
      type: Object,
      default: () => {}
    },
    round: {
      type: GameRound,
      required: true
    }
  },
  data() {
    return {
      opionCards: [],
    };
  },
  mounted() {
    

  },
  components: {
    Dashboard // Register the Dashboard component
  },
  
  methods: {
    getChartStye() {
      let width = 100;
      let height = 100;
      let l = this.dashboards.length;

      if(l > 3) {
        height = 50;
      }

      if(l > 1) {
        width = 50;
      }
      if(l > 2) {
        width = 33;
      }
      
      return {
    
        width: `${width}%`,
        height: `${height}%`
      };
    }
  },

  computed: {
    dashboards() {
      return this.inventory.filter(item => item.isDashboardItem());
    },

    history() {

      let history = this.inventory.filter(item => item.getShowInHistory());
      let lastRound = null;
      let complete = [];

      for(let i = 0; i < history.length; i++) {
        let item = history[i];
        if(item.boughtInRound !== lastRound) {
          complete.push(' - ')
          complete.push('Round ' + item.boughtInRound.roundNumber);
          lastRound = item.boughtInRound;
        }
        complete.push(item.describe());
      } 
      return complete;
    }
  },

};
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;

}
.info-card {
  width: calc(50% - 40px);
  margin-right: 20px;
  background: white;
  padding: 10px;
  margin-bottom: 20px;
  /* min-height: 200px; */
}

.info-card:nth-child(even) {
  margin-right: 0px;
}

.empty-message {
  text-align: center;
  font-weight: bold;
  font-size: 3em;
  color: var(--light-grey);
  font-style: italic;
  
}

.opinion-cards {

  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.opinion-cards .opinion-card {
  width: 40px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  font-weight: bold;
  background-color: var(--light-grey);
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
}

.opinion-cards .opinion-card.closed {
  background-color: var(--extra-light-grey);
}

</style>