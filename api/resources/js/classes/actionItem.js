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
  }

  clone() {
    const clone = new ActionItem(this.id, this.price, this.name);
    clone.setQuantity(this.quantity);
    clone.setIcon(this.icon);
    clone.setMultiple(this.multiple);
    clone.dataCallbacks = this.dataCallbacks.slice(0);
    clone.dataLabels = this.dataLabels.slice(0);
    clone.colors = this.colors.slice(0);
    return clone;
  }

  equals(otherItem) {
    return this.id === otherItem.id;
  }

  getName() {
    return this.name;
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

  isDashboardItem() {
    return this.id.startsWith('D');
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
    return this.dataValues[0].map((value, index) => index + 1);
  }


}

