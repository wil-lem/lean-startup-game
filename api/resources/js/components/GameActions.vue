<template>
  <div class="game-actions-inner">
    <div class="shopping-cart">
      <h2>Selected Items:</h2>  
      <game-action-item v-for="item in selectedItems" :key="item.id" :actionItem="item" @onClickItem="deselectItem(item)" />
    
    </div>
    <div class="total" v-if="selectedItems.length > 0">
      <span>${{ cartTotal.toFixed(2) }} </span><br />
      <span>Remaining actions: {{ maxActions - selectedItems.length }}</span>
    
      <div>
        <button-component :onClick="buyItems" primary="true">Buy</button-component>
        <button-component :onClick="resetCart" secondary="true">Reset</button-component>
      </div>
    </div>
    <div>
      <h2>Actions:</h2>
      <game-action-item v-for="item in selectableItemsFiltered" :key="item.id" :actionItem="item" @onClickItem="selectItem(item)" />
    </div>

  </div>
</template>

<script>
import actionItem from '../classes/actionItem';
import ButtonComponent from './buttonComponent.vue';
import GameActionItem from './GameActionItem.vue';

export default {
  components: {
    GameActionItem,
    ButtonComponent,
  },
  props: {
    inventory: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedItems: [], // Array to store selected items
      selectableItems: [], // Array to store selectable items
      total: 0, // Variable to store total price
      remainingBudget: 0, // Variable to store remaining budget
      maxActions: 4,
    };
  },
  mounted() {
    // Set the selectable items
    let item = new actionItem('FA', 0, 'Develop Feature A');
    item.setIcon('cellphone-text');
    this.selectableItems.push(item);
    
    item = new actionItem('FB', 0, 'Develop Feature B');
    item.setIcon('watch-variant');
    this.selectableItems.push(item);

    item = new actionItem('FC', 0, 'Develop Feature C');
    item.setIcon('betamax');
    this.selectableItems.push(item);

    item = new actionItem('TU', 100, 'Talk to Customers');
    item.setIcon('account');
    this.selectableItems.push(item);

    item = new actionItem('C1', 100, '1.000 new clicks');
    item.setActionName('Buy 1000 new clicks');
    item.setIcon('cursor-default-click-outline');
    item.setMultiple(true);
    this.selectableItems.push(item);

    item = new actionItem('C2', 400, '5.000 new clicks');
    item.setActionName('Buy 5.000 new clicks');
    item.setIcon('cursor-default-click-outline');
    item.setMultiple(true);
    this.selectableItems.push(item);

    item = new actionItem('C3', 750, '10.000 new clicks');
    item.setActionName('Buy 10.000 new clicks');
    item.setIcon('cursor-default-click-outline');
    item.setMultiple(true);
    this.selectableItems.push(item);

    item = new actionItem('D1', 100, 'Referral sales');
    item.setActionName('Buy Referral Sales Dashboard');
    item.setIcon('chart-line');
    item.setMultiple(false);
    item.addDashboardDataCallback('getReferralSale');
    item.addColor('green');
    item.addChartLabel('Referral Sales');
    this.selectableItems.push(item);

    item = new actionItem('D2', 100, 'Logged in');
    item.setActionName('Buy Logged In Dashboard');
    item.setIcon('chart-line');
    item.setMultiple(false);
    item.addDashboardDataCallback('getLoggedIn');
    item.addColor('yellow');
    item.addChartLabel('Logged In');
    this.selectableItems.push(item);
    

    item = new actionItem('D3', 100, 'New paying customers');
    item.setActionName('Buy New Paying Customers Dashboard');
    item.setIcon('chart-line');
    item.setMultiple(false);
    item.addDashboardDataCallback('getNewPayingCustomers');
    item.addColor('blue');
    item.addChartLabel('New Paying Customers')
    this.selectableItems.push(item);

    item = new actionItem('D4', 100, 'Customer retention');
    item.setActionName('Buy Customer Retention Dashboard');
    item.setIcon('chart-bar');
    item.setMultiple(false);
    item.addDashboardDataCallback('getRetention');
    item.addDashboardDataCallback('getTotalCustomer');
    item.addColor('blue');
    item.addColor('brown');
    item.addChartLabel('Retention');
    item.addChartLabel('Total Customers');
    this.selectableItems.push(item);

    // Set the initial budget
    this.remainingBudget = 1000;
  },

  computed: {
    cartTotal() {
      return this.selectedItems.reduce((ctotal, item) => ctotal + item.getPrice(), 0);
    },
    selectableItemsFiltered() {
      return this.selectableItems.filter((item) => {
        if(item.isMultiple()) {
          return true;
        } else {
          return (this.selectedItems.find((selectedItem) => selectedItem.equals(item)) === undefined &&
            this.inventory.find((inventoryItem) => inventoryItem.equals(item)) === undefined);
        }
      });
    },
  },

  methods: {
    isSelected(item) {
      return this.selectedItems.find((selectedItem) => selectedItem.equals(item)) !== undefined;
    },

    selectItem(item) {
      if(this.selectedItems.length >= this.maxActions) {
        return;
      }

      if(! item.isMultiple() && this.isSelected(item)) {
        return;
      }
      this.selectedItems.push(item.clone());
    },
    deselectItem(item) {
      const key = this.selectedItems.indexOf(item);
      if (key > -1) {
        this.selectedItems.splice(key, 1);
      }
    },
    buyItems() {
      this.$emit('buyItems', this.selectedItems);
      this.selectedItems = [];
  
    },
    resetCart() {
      this.selectedItems = [];
      this.remainingBudget += this.total;
    },


  },


};
</script>

<style scoped>

.game-actions-inner {
  font-family: "Arial", sans-serif;
  font-size: 13px;
  line-height: 1.5;
  /* max-width: 100%; */

}


.selected-item {
  background-color: #f2f2f2;
  padding: 10px;
  margin-bottom: 5px;
}

</style>
    
