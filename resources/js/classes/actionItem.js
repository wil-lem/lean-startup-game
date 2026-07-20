import { Ticks, scales } from "chart.js";

export default class ActionItem {
  constructor(id, price, name) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.multiple = true;
    this.quantity = 1;
    this.icon = null;

    this.actionName = null;

    this.boughtInRound = null;

    this.dataValues = [];

    this.dataCallbacks = [];

    this.dataLabels = [];

    this.colors = [];

    this.chartType = 'line';

    this.showInHistory = true;
  }

  clone() {
    const clone = new ActionItem(this.id, this.price, this.name);
    clone.setQuantity(this.quantity);
    clone.setIcon(this.icon);
    clone.setMultiple(this.multiple);
    clone.setChartType(this.chartType);
    clone.dataCallbacks = this.dataCallbacks.slice(0);
    clone.dataLabels = this.dataLabels.slice(0);
    clone.colors = this.colors.slice(0);
    clone.showInHistory = this.showInHistory;
    
    return clone;
  }

  equals(otherItem) {
    return this.id === otherItem.id;
  }

  getName() {
    return this.name;
  }

  getChartType() {
    return this.chartType;
  }

  setChartType(chartType) {
    this.chartType = chartType;
  }

  getDataLabel(index) { 
    if(this.dataLabels[index] === undefined) {
      return this.getName() + ' ' + (index + 1);
    }
    return this.dataLabels[index];
  }

  getColor(index) {
    if(this.colors[index] === undefined) {
      return '#000000';
    }
    return this.colors[index];
  }

  addColor(color) {
    this.colors.push(color);
  }

  addChartLabel(label) {
    this.dataLabels.push(label);
  }

  getPrice() {
    return this.price;
  }

  getQuantity() {
    return this.quantity;
  }

  addQuantity() {
    this.quantity++;
  }

  removeQuantity() {
    this.quantity--;
  }

  setQuantity(quantity) {
    this.quantity = quantity;
  }

  setIcon(icon) {
    this.icon = icon;
  }

  getIcon() {
    return this.icon;
  }

  setMultiple(multiple) {
    this.multiple = multiple;
  }

  isMultiple() {
    return this.multiple;
  }

  getActionName() {
    if (this.actionName === null) {
      return this.name;
    }
    return this.actionName;
  }

  setActionName(actionName) {
    this.actionName = actionName;
  }

  hideInHistory() {
    this.showInHistory = false;
  }

  getShowInHistory() {
    return this.showInHistory;
  }
    

  isDashboardItem() {
    return this.id.startsWith('D');
  }

  isClicksItem() {
    return this.id.startsWith('C');
  }

  isFeatureItem() {
    return this.id.startsWith('F');
  }

  isTalkItem() {
    return this.id.startsWith('T');
  }

  addDashboardDataCallback(callback) {
    this.dataCallbacks.push(callback);
  }

  getDashboardId() {
    return this.id.substring(2);
  }

  nextRound(round) {
    if (this.boughtInRound === null) {
      this.boughtInRound = round;
    }
  }

  computeValues(round) {
    if (!this.isDashboardItem()) {
      return;
    }

    if(this.dataCallbacks[0] == 'getDevelopedFeatures') {
      
      const vals = [0,0,0];
      const labels = ['A', 'B', 'C'];

      while(round) {
        for(let i = 0; i < labels.length; i++) {
          vals[i] += round.getDevelopedFeatures()[labels[i]];
        }
        round = round.previousRound;
      }
      this.dataValues[0] = vals;
      
      return;
    }
    
    // We can have multiple datasets for a single dashboard item
    // each dataset has a different callback
    for (let i = 0; i < this.dataCallbacks.length; i++) {

      // If the data value array is not yet initialized, initialize it
      if(this.dataValues[i] === undefined) {
        this.dataValues.push([]);
      }

      // Walk through all rounds and calculate the data value
      for(let j = 0; j < round.roundNumber; j++) {
        if(this.dataValues[i][j] === undefined) {
          let actualRound = round;
          while(j > actualRound.roundNumber) {
            actualRound = actualRound.previousRound;
          }
          this.dataValues[i].push(actualRound[this.dataCallbacks[i]]());
        }
      }

    }
  }

  getDataValues() {
    let data = [];
    for(let i = 0; i < this.dataValues.length; i++) {
      data.push({
        values: this.dataValues[i].slice(0),
        label: this.getDataLabel(i),
      });
    }
    return data;
  }

  getChartOptions() {
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          }
        }
      }
    };
    if(this.dataCallbacks[0] == 'getDevelopedFeatures') {
      options.indexAxis = 'y';
      options.scales.x = {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        }
      };
    }
    

    return options;
  }

  setBoughtInRound(round) {
    this.boughtInRound = round;
  }

  calculateDataValue(roundNumber,round) {
    
    while(roundNumber > round.roundNumber) {
      round = round.previousRound;
    }
    
    switch (this.id) {
      case 'D1':
        return round.getReferralSale();
      case 'D2':
        return round.getLoggedIn();
      case 'D3':
        return round.getNewPayingCustomers();
      case 'D4':
        return round.getRetention();
        // return [round.getRetention(), round.getTotalCustomer();
    }
    return 0;
  }

  getLabels() {
    // return [1,2,3,4]
    if(this.dataCallbacks[0] == 'getDevelopedFeatures') {
      return ['Feature A', 'Feature B', 'Feature C']
    }

    return this.dataValues[0].map((value, index) => index + 1);
  }

  describe() {
    let roundNumber = '?';
    if(this.boughtInRound !== null) {
      roundNumber = this.boughtInRound.roundNumber;
    }
    if(this.isDashboardItem()) {
      return 'Bought dashboard: ' + this.name;
    } else if(this.isClicksItem()) {
      return 'Bought ' + this.name;
    } else if(this.isFeatureItem()) {
      return 'Developed feature ' + this.id.substring(1);
    }
    return 'Talked to 2 customers';
  }

}

