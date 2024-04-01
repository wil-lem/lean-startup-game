<template>
  <div class="container">
    <div class="charts-container" v-if="dashboards.length > 0">
      
      <!-- Render each dashboard component -->
      <dashboard :style="getChartStye()" v-for="dashboard in dashboards" :key="dashboard.id" :dashboard="dashboard" />
    </div>
    <div v-else class="empty-message">
      <!-- Display a message if no dashboards found -->
      No dashboards yet
    </div>
  </div>
</template>

<script>
import Dashboard from './Dashboard.vue'; // Import the Dashboard component
import ActionItem from '../classes/actionItem';

export default {
  name: 'GameInfo',
  props: {
    inventory: {
      type: Array,
      default: () => []
    }
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
    }
  },

};
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
}

.charts-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}

.chart-wrapper {
  /* flex: 1 0 20%; */
  width:100px;
  height: 48%;
}

.empty-message {
  text-align: center;
  font-weight: bold;
  font-size: 3em;
  color: var(--light-grey);
  font-style: italic;
  
}

</style>