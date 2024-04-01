<template>
  <div class="chart-dscwds">
    <Line :data="getChartData()" :options="getChartOptions()" />
  </div>
</template>

<script>

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import ActionItem from '../classes/actionItem'
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)


export default {
  components: {
    Line
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
      return {
        responsive: true
      };
    },


  }
}
</script>
