<template>
  <div class="chart-dscwds">
    <Bar v-if="isBar" :data="getChartData()" :options="getChartOptions()" />
    <Line v-if="isLine" :data="getChartData()" :options="getChartOptions()" />
  </div>
</template>

<script>

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar } from 'vue-chartjs'
import ActionItem from '../classes/actionItem'
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)


export default {
  components: {
    Line, Bar
  },
  props: {
    dashboard: {
      type: ActionItem,
      default: () => ({})
    }
  },
  
  mounted() {
    // this.renderGraph();
  },

  computed: {
    isBar() {
      return this.dashboard.getChartType() === 'bar';
    },
    isLine() {
      return this.dashboard.getChartType() === 'line';
    }
  },

  methods: {
    getChartData() {
      const datasets = [];
      let datavalues = this.dashboard.getDataValues();
      
      for (let i in datavalues) {
        datasets.push({
          label: this.dashboard.getDataLabel(i),
          backgroundColor: this.dashboard.getColor(i),
          borderColor: this.dashboard.getColor(i),
          data: datavalues[i].values
        });
      }

      return {
        labels: this.dashboard.getLabels(),
        datasets: datasets
      };
    },


    getChartOptions() {
      const options = this.dashboard.getChartOptions();
      options.responsive = true;
      return options;
    },


  }
}
</script>
